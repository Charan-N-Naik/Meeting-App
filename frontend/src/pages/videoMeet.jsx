import React, { useEffect, useRef, useState } from "react";
import { TextField, IconButton } from '@mui/material';
import Button from '@mui/material/Button';

import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';

import '../styles/videomeet.css';
import { io } from "socket.io-client";

import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';

import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare';

import Badge from '@mui/material/Badge';
import ChatIcon from '@mui/icons-material/Chat';
import Input from '@mui/material/Input';
import { useNavigate } from "react-router-dom";
import Home from "./Home";
import server from "../environment";

const server_url = server;

// legacy code
// creating connection and the Stun server establishment

const connections = {};
// per-peer accumulated remote MediaStreams so audio+video tracks share one stream
const remoteStreams = {};
const peerConfigConnections = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" }
    ]
};

// Dedicated Remote Video Component with autoplay handling
const RemoteVideo = ({ stream }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const videoEl = videoRef.current;
        if (videoEl && stream) {
            videoEl.srcObject = stream;
            videoEl.play().catch(err => {
                console.log("Autoplay handled:", err);
            });
        }
    }, [stream]);

    return (
        <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{ width: "100%", height: "100%", borderRadius: "12px", objectFit: "cover" }}
        />
    );
};

export default function Video() {

    const socketRef = useRef();
    const socketId = useRef();
    const localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvilabale] = useState(true);

    let [video, setVideo] = useState(false);
    let [audio, setAudio] = useState(false);
    let [screen, setScreen] = useState();
    let [messages, setMessages] = useState([]);

    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailabale] = useState(false);
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);

    let [askForusername, setAskForUserName] = useState(true);
    let [username, setUsername] = useState("");

    let [videos, setVideos] = useState([]);

    const navigate = useNavigate();

    const goToHome = () => {
        navigate("/");
    };

    useEffect(() => {
        getPermissions();
    }, []);

    let getUserMediaSuccess = (stream) => {
        window.localStream = stream;
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketId.current) continue;

            const senders = connections[id].getSenders ? connections[id].getSenders() : [];

            // Replace active tracks with new ones
            stream.getTracks().forEach(track => {
                const existingSender = senders.find(s => s.track && s.track.kind === track.kind);
                if (existingSender) {
                    existingSender.replaceTrack(track).catch(e => console.log(e));
                } else {
                    try {
                        connections[id].addTrack(track, stream);
                    } catch (e) { console.log(e); }
                }
            });

            // Null-out senders for track kinds NOT in the new stream
            // e.g. when video turns off, null the video sender so UserB sees no video
            senders.forEach(sender => {
                if (sender.track) {
                    const stillExists = stream.getTracks().some(t => t.kind === sender.track.kind);
                    if (!stillExists) {
                        sender.replaceTrack(null).catch(e => console.log(e));
                    }
                }
            });

            connections[id].createOffer().then(description => {
                connections[id].setLocalDescription(description).then(() => {
                    socketRef.current.emit(
                        "signal",
                        id,
                        JSON.stringify({ sdp: connections[id].localDescription })
                    );
                });
            }).catch(e => console.log(e));
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);
        });
    };

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({
                video: video,
                audio: audio
            })
                .then(getUserMediaSuccess)
                .catch(e => console.log(e));
        } else {
            // Both video and audio are off — stop local tracks
            // and null out ALL senders so remote peers see/hear nothing
            try {
                localVideoref.current.srcObject?.getTracks().forEach(track => track.stop());
                localVideoref.current.srcObject = null;
            } catch (e) {}

            for (let id in connections) {
                if (id === socketId.current) continue;
                const senders = connections[id].getSenders ? connections[id].getSenders() : [];
                senders.forEach(sender => {
                    if (sender.track) {
                        sender.replaceTrack(null).catch(e => console.log(e));
                    }
                });
            }
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video]);

    let getDisplayMediaSuccess = (stream) => {
        window.localStream = stream;
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        for (let id in connections) {
            if (id === socketId.current) continue;

            const senders = connections[id].getSenders ? connections[id].getSenders() : [];
            stream.getTracks().forEach(track => {
                const existingSender = senders.find(s => s.track && s.track.kind === track.kind);
                if (existingSender) {
                    existingSender.replaceTrack(track).catch(e => console.log(e));
                } else {
                    try {
                        connections[id].addTrack(track, stream);
                    } catch (e) { console.log(e); }
                }
            });

            connections[id].createOffer().then(description => {
                connections[id].setLocalDescription(description).then(() => {
                    socketRef.current.emit(
                        "signal",
                        id,
                        JSON.stringify({ sdp: connections[id].localDescription })
                    );
                });
            }).catch(e => console.log(e));
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false);
            try {
                let tracks = localVideoref.current?.srcObject?.getTracks();
                tracks?.forEach(t => t.stop());
            } catch (e) {
                console.log(e);
            }
            getUserMedia();
        });
    };

    let getDisplayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDisplayMediaSuccess)
                    .catch(e => {
                        console.log(e);
                        setScreen(false);
                    });
            }
        } else {
            getUserMedia();
        }
    };

    useEffect(() => {
        if (screen !== undefined) {
            getDisplayMedia();
        }
    }, [screen]);

    let gotMessageFromServer = (fromId, message) => {
        let signal = JSON.parse(message);

        if (fromId !== socketId.current) {
            if (!connections[fromId]) {
                connections[fromId] = new RTCPeerConnection(peerConfigConnections);

                connections[fromId].onicecandidate = event => {
                    if (event.candidate) {
                        socketRef.current.emit(
                            "signal",
                            fromId,
                            JSON.stringify({ ice: event.candidate })
                        );
                    }
                };

                connections[fromId].ontrack = event => {
                    // Accumulate video + audio tracks into the SAME stream per peer
                    // so replacing the stream object on each track doesn't drop audio/video
                    if (!remoteStreams[fromId]) {
                        remoteStreams[fromId] = new MediaStream();
                    }
                    remoteStreams[fromId].addTrack(event.track);
                    const stream = remoteStreams[fromId];
                    setVideos(prev => {
                        const exists = prev.find(v => v.socketId === fromId);
                        if (exists) {
                            return prev.map(v => v.socketId === fromId ? { socketId: fromId, stream } : v);
                        }
                        return [...prev, { socketId: fromId, stream }];
                    });
                };

                if (window.localStream) {
                    window.localStream.getTracks().forEach(track => {
                        try {
                            connections[fromId].addTrack(track, window.localStream);
                        } catch (e) {
                            console.log(e);
                        }
                    });
                }
            }

            if (signal.sdp) {
                // Ensure local tracks are attached before generating SDP answer
                if (signal.sdp.type === "offer" && window.localStream) {
                    const senders = connections[fromId].getSenders ? connections[fromId].getSenders() : [];
                    window.localStream.getTracks().forEach(track => {
                        const hasTrack = senders.some(s => s.track && s.track.kind === track.kind);
                        if (!hasTrack) {
                            try {
                                connections[fromId].addTrack(track, window.localStream);
                            } catch (e) { console.log(e); }
                        }
                    });
                }

                connections[fromId]
                    .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer().then(description => {
                                connections[fromId].setLocalDescription(description).then(() => {
                                    socketRef.current.emit(
                                        "signal",
                                        fromId,
                                        JSON.stringify({ sdp: connections[fromId].localDescription })
                                    );
                                });
                            });
                        }
                    })
                    .catch(e => console.log(e));
            }

            if (signal.ice) {
                connections[fromId]
                    .addIceCandidate(new RTCIceCandidate(signal.ice))
                    .catch(e => console.log(e));
            }
        }
    };

    // ===== FIXED CHAT =====
    let addMessage = (data, sender, socketIdsender) => {

        if (typeof data === "object" && data !== null) {

            setMessages(prev => [
                ...prev,
                { sender: data.sender, data: data.data }
            ]);

            if (data.socketId !== socketId.current) {
                setNewMessages(prev => prev + 1);
            }

            return;
        }

        setMessages(prev => [
            ...prev,
            { sender: sender, data: data }
        ]);

        if (socketIdsender !== socketId.current) {
            setNewMessages(prev => prev + 1);
        }
    };

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {

            // Use full URL so backend room key matches what was previously saved
            socketRef.current.emit("join-call", window.location.href);
            socketId.current = socketRef.current.id;

            socketRef.current.on("chat-message", addMessage);

            socketRef.current.on("user-left", id => {
                setVideos(videos => videos.filter(v => v.socketId !== id));
                delete connections[id];
            });

            socketRef.current.on("user-joined", (id, clients) => {

                clients.forEach(socketListId => {

                    if (socketListId === socketId.current) return;

                    if (!connections[socketListId]) {
                        connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                        connections[socketListId].onicecandidate = event => {
                            if (event.candidate) {
                                socketRef.current.emit(
                                    "signal",
                                    socketListId,
                                    JSON.stringify({ ice: event.candidate })
                                );
                            }
                        };

                        connections[socketListId].ontrack = event => {
                            // Accumulate video + audio tracks into the SAME stream per peer
                            // so replacing the stream object on each track doesn't drop audio/video
                            if (!remoteStreams[socketListId]) {
                                remoteStreams[socketListId] = new MediaStream();
                            }
                            remoteStreams[socketListId].addTrack(event.track);
                            const stream = remoteStreams[socketListId];
                            setVideos(prev => {
                                const exists = prev.find(v => v.socketId === socketListId);
                                if (exists) {
                                    return prev.map(v => v.socketId === socketListId ? { socketId: socketListId, stream } : v);
                                }
                                return [...prev, { socketId: socketListId, stream }];
                            });
                        };

                        if (window.localStream) {
                            window.localStream.getTracks().forEach(track => {
                                try {
                                    connections[socketListId].addTrack(track, window.localStream);
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                        }
                    }

                    // Existing users send offer to the newly joined client (id = newcomer's socket)
                    // so they can see the newcomer's stream
                    connections[socketListId].createOffer().then(description => {
                        connections[socketListId].setLocalDescription(description).then(() => {
                            socketRef.current.emit(
                                "signal",
                                socketListId,
                                JSON.stringify({ sdp: connections[socketListId].localDescription })
                            );
                        });
                    }).catch(e => console.log(e));
                });
            });
        });
    };

    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);
        connectToSocketServer();
    };

    const getPermissions = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({ video: true });
            setVideoAvailable(true);
        } catch {
            setVideoAvailable(false);
        }

        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            setAudioAvilabale(true);
        } catch {
            setAudioAvilabale(false);
        }

        if (navigator.mediaDevices.getDisplayMedia) {
            setScreenAvailabale(true);
        }
    };

    let connect = () => {
        setAskForUserName(false);
        getMedia();
    };

    useEffect(() => {
        return () => {
            socketRef.current?.disconnect();
            window.localStream?.getTracks().forEach(t => t.stop());
            for (let key in connections) {
                delete connections[key];
            }
            for (let key in remoteStreams) {
                delete remoteStreams[key];
            }
        };
    }, []);

    let handelVideo = () => setVideo(!video);
    let handelAudio = () => setAudio(!audio);
    let handleScreen = () => setScreen(!screen);

    // ===== FIXED SEND MESSAGE =====
    let sendMessage = () => {
        const messageData = {
            sender: username,
            data: message,
            socketId: socketId.current
        };

        socketRef.current.emit("chat-message", messageData);

        setMessages(prev => [...prev, messageData]);
        setMessage("");
    };

    return (
        <div>
            {askForusername ? (
                <div>
                    <h2>Enter into lobby</h2>

                    <TextField
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        label="username"
                        variant="outlined"
                    />

                    <br /><br />

                    <Button variant="contained" onClick={connect}>
                        Connect
                    </Button>

                    <div>
                        <video ref={localVideoref} autoPlay muted />
                    </div>
                </div>
            ) : (
                <div className="meetVideocontainer">

                    {showModal && (
                        <div className="ChatRoom">
                            <div className="chatContainer">
                                <h1>Chat</h1>

                                <div className="chatingDisplay">
                                    {messages.length !== 0 ? messages.map((item, index) => (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                            <p>{item.data}</p>
                                        </div>
                                    )) : <p>No Messages Yet</p>}
                                </div>

                                <div className="chattingArea">
                                    <TextField
                                        label="Enter Message"
                                        variant="outlined"
                                        fullWidth
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                    />

                                    <Button variant="contained" onClick={sendMessage}>
                                        Send
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="buttonContainer">

                        <IconButton style={{ color: "white" }} onClick={handelVideo}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton onClick={() => navigate("/home")} style={{ color: 'red' }}>
                            <CallEndIcon />
                        </IconButton>

                        <IconButton style={{ color: "white" }} onClick={handelAudio}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>

                        <IconButton onClick={handleScreen} style={{ color: screen ? "#3B82F6" : "white" }}>
                            {screen ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                        </IconButton>

                        <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                            <Badge
                                badgeContent={newMessages}
                                color="error"
                                invisible={newMessages === 0}
                            >
                                <ChatIcon />
                            </Badge>
                        </IconButton>

                    </div>

                    <video className="meetUserVideo" ref={localVideoref} autoPlay muted />

                    <div className="confView">
                        {videos.map(v => (
                            <div key={v.socketId}>
                                <RemoteVideo stream={v.stream} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}