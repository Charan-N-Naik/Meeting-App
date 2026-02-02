import React, { use, useRef, useState } from "react";

import '../styles/videomeet.css';

const server_url = "http://localhost:5000";// put after into the env

// legacy code
// creating connection and the Stun server establishment
const connections = {};
const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" }

    ]
}

export default function Video() {
    // commonly used 
    // let connections =useRef();
    // connections.
    var socketRef = useRef();
    let socketId = useRef();
    let localVideoref = useRef();
    let [VideoAvailabale, setVideoAvailable] = useState(true);
    let [audioAvailabale, setAudioAvilabale] = useState(true);



    let [video, setVideo] = useState();
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();

    let [showModal, setModal] = useState();
    let [screenAvailable, setScreenAvailabale] = useState([]);
    let [messsages, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);

    let [askForusername, setAskForUserName] = useState(true);


    let [username, setUsername] = useState("");

    const videoRef = useRef([])

    let [videos, setVideos] = useState([]);



    // ToDo Chromeam check

    // if(isChrome()===false){

    // }






    return (
        <div>
            {/* {window.href} */}
            {/* <p>{window.location.href}</p> */}

            {askForusername === true ?
                <div>


                </div>
                : <>
                </>}

        </div>





    );
}