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
import { use } from "react";

import Input from '@mui/material/Input';





const server_url = "http://localhost:5000"; // put after into the env

// legacy code
// creating connection and the Stun server establishment

// connections = {
//   socketB: RTCPeerConnection,
//   socketC: RTCPeerConnection
// }

const connections = {};
const peerConfigConnections = {
    iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
    ]
};

export default function Video() {

    // commonly used 
    // let connections =useRef();
    // connections.
    //The Socket.IO connection object
    const socketRef = useRef();  // FIX: socket instance lives here


    const socketId = useRef();           // FIX: only socket id string
    const localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvilabale] = useState(true);

    // media enable flags (boolean)
    let [video, setVideo] = useState(false);
    let [audio, setAudio] = useState(false);
    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState(true);
    let [screenAvailable, setScreenAvailabale] = useState(false);
    let [messsages, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(4);

    let [askForusername, setAskForUserName] = useState(true);
    let [username, setUsername] = useState("");

    let [videos, setVideos] = useState([]); // remote videos list

    // ToDo Chrome check
    // if(isChrome()===false){}

    useEffect(() => {
        getPermissions();
    }, []);

    // Camera = water tap 🚰
    // Stream = flowing water 💧
    // Video tag = bucket 🪣

    let getUserMediaSuccess = (stream) => {

        try {
            window.localStream?.getTracks().forEach(track => track.stop());
        } catch (e) {
            console.log(e);
        }

        window.localStream = stream;
        localVideoref.current.srcObject = stream;

        // send stream to already connected peers
        for (let id in connections) {
            if (id === socketId.current) continue;

            connections[id].addStream(stream);
            connections[id].createOffer().then(description => {
                connections[id].setLocalDescription(description).then(() => {

                    // FIX: emit using socketRef, NOT socketId
                    socketRef.current.emit(
                        "signal",
                        id,
                        JSON.stringify({ sdp: connections[id].localDescription })
                    );
                });
            });
        }

        // stop media if user ends track
        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false);
            setAudio(false);
            try {
                localVideoref.current.srcObject.getTracks().forEach(t => t.stop());
            } catch (e) {
                console.log(e);
            }
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
            try {
                localVideoref.current.srcObject.getTracks().forEach(track => track.stop());
            } catch (e) {
                console.log(e);
            }
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [audio, video]);

    // signaling handler
    let gotMessageFromServer = (fromId, message) => {
        let signal = JSON.parse(message);

        if (fromId !== socketId.current) {

            if (signal.sdp) {
                connections[fromId]
                    .setRemoteDescription(new RTCSessionDescription(signal.sdp))
                    .then(() => {
                        if (signal.sdp.type === "offer") {
                            connections[fromId].createAnswer().then(description => {
                                connections[fromId].setLocalDescription(description).then(() => {

                                    // FIX: socketRef instead of socketId
                                    socketRef.current.emit(
                                        "signal",
                                        fromId,
                                        JSON.stringify({ sdp: connections[fromId].localDescription })
                                    );
                                });
                            });
                        }
                    });
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(
                    new RTCIceCandidate(signal.ice)
                ).catch(e => console.log(e));
            }
        }
    };

    // TODO chat
    let addMessage = () => { };

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: false });

        socketRef.current.on("signal", gotMessageFromServer);

        socketRef.current.on("connect", () => {

            socketRef.current.emit("join-call", window.location.href);
            socketId.current = socketRef.current.id;

            socketRef.current.on("chat-message", addMessage);

            socketRef.current.on("user-left", id => {
                setVideos(videos => videos.filter(v => v.socketId !== id));
                delete connections[id];
            });

            socketRef.current.on("user-joined", (id, clients) => {

                clients.forEach(socketListId => {

                    if (connections[socketListId]) return;

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

                    connections[socketListId].onaddstream = event => {
                        setVideos(prev => {
                            if (prev.find(v => v.socketId === socketListId)) return prev;
                            return [...prev, { socketId: socketListId, stream: event.stream }];
                        });
                    };

                    if (window.localStream) {
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                // create offers if I am the joiner
                if (id === socketId.current) {
                    for (let id2 in connections) {
                        if (id2 === socketId.current) continue;

                        if (connections[id].signalingState === "stable") {
                            connections[id].createOffer().then(description => {
                                connections[id].setLocalDescription(description).then(() => {
                                    socketRef.current.emit(
                                        "signal",
                                        id,
                                        JSON.stringify({ sdp: connections[id].localDescription })
                                    );
                                });
                            });
                        }

                    }
                }
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
        };
    }, []);





    // video handel 

    let handelVideo = () => {
        setVideo(!video);
    }

    // audio handel

    let handelAudio = () => {
        setAudio(!audio)
    }
    const createBlackVideoTrack = () => {
        const canvas = Object.assign(document.createElement("canvas"), {
            width: 640,
            height: 480
        });

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const stream = canvas.captureStream();
        return stream.getVideoTracks()[0];
    };



    // Screen shareing



    let getDislayMediaSuccess = (stream) => {
        console.log("HERE")
        try {
            window.localStream.getTracks().forEach(track => track.stop())
        } catch (e) { console.log(e) }

        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketId.current) continue

            connections[id].addStream(window.localStream)

            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => {
                        socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }))
                    })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)

            try {
                let tracks = localVideoref.current.srcObject.getTracks()
                tracks.forEach(track => track.stop())
            } catch (e) { console.log(e) }

            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream

            getUserMedia()

        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start()
        ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }
    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }





    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }




    useEffect(() => {
        if (screen !== undefined) {
            getDislayMedia();
        }
    }, [screen])



    let sendMessage=()=>{
        
    }






    let handleScreen = () => {
        setScreen(!screen);
    }

    return (
        <div>
            {askForusername ? (
                <div>
                    <h2>Enter into lobby</h2>
                    <p>{username}</p>

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

                    {showModal ? <div className="ChatRoom">

                       
                            
                                <div className="chatContainer">
                                    <h1>Chat</h1>

                                    <div className="chattingArea">
                                        <TextField
                                            id="outlined-basic"
                                            label="Enter Message"
                                            variant="outlined"
                                            fullWidth
                                        />

                                        <Button variant="contained" onClick={sendMessage}>
                                            Send
                                        </Button>
                                    </div>
                                </div>
                               
                        
                    </div> : <></>}




                    <div className="buttonContainer">

                        <IconButton style={{ color: "white" }} onClick={handelVideo}>
                            {video ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>

                        <IconButton
                            style={{ color: 'red' }}

                        >
                            <CallEndIcon />
                        </IconButton>

                        <IconButton style={{ color: "white" }} onClick={handelAudio}>
                            {audio ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleScreen} style={{ color: "white" }}>
                            {screenAvailable ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                        </IconButton>
                        <IconButton onClick={() => {
                            setModal(!showModal)
                        }} style={{ color: "white" }}>
                            <Badge
                                badgeContent={newMessages}
                                color="error"
                                invisible={newMessages === 0}
                            >
                                <ChatIcon />
                            </Badge>
                        </IconButton>







                    </div>

                    {/* useRef() ───► empty box 📦
                    JSX ref ────► React puts DOM node into the box
                    .current ───► always points to same box */}

                    <video className="meetUserVideo" ref={localVideoref} autoPlay muted />

                    <div className="confView">
                        {videos.map(video => (
                            <div >
                                <video
                                    key={video.socketId}
                                    autoPlay
                                    playsInline
                                    ref={el => {
                                        if (el) el.srcObject = video.stream;
                                    }}
                                />

                            </div>

                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
