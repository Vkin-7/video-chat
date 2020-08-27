import React, { useState, useRef, useEffect } from 'react';
import './App.css'
import socketIOClient from "socket.io-client";
const ENDPOINT = "https://server-socket-io.herokuapp.com";

function App() {
  const [cameraStatus, setCameraStatus] = useState({status: true, text: 'off'})
  const [localStream, setLocalStream] = useState()
  const [response, setResponse] = useState("");
  const [candidates, setCandidates] = useState([])

  const config = {
    iceServers: [
      {
        credential: "peerjsp",
        urls: "turn:0.peerjs.com:3478",
        username: "peerjs"
      },
    ],
  };

  const [pc, setPc] = useState(new RTCPeerConnection())
  const [socket, setSocket] = useState(null)


  const localVideoRef = useRef()
  const remoteVideoRef = useRef()
  const textRef = useRef()
  const yourSDP = useRef()
  const yourIC = useRef()

  const constraints = { video: true, audio: true }

  const sendToPeer = (messageType, payload) => {
    if(socket !== null){
      console.log(messageType, payload)
      socket.emit(messageType, {
        socketID: socket.id,
        payload
      })
    }
  }

  const createOffer = () => {
    console.log('Offer')
    
    pc.createOffer({offerToReceiveVideo: 1})
      .then(sdp => {
        //console.log(JSON.stringify(sdp))
        yourSDP.current.value = JSON.stringify(sdp)
        pc.setLocalDescription(sdp)
        sendToPeer('offerOrAnswer', sdp)
      }, e => {})
  }

  const setRemoteDescription = () => {
    const desc = JSON.parse(textRef.current.value)

    pc.setRemoteDescription(new RTCSessionDescription(desc))
  }

  const createAnswer = () => {
    console.log('Answer')
    pc.createAnswer({offerToReceiveVideo: 1})
      .then(sdp => {
        //console.log(JSON.stringify(sdp))
        yourSDP.current.value = JSON.stringify(sdp)
        pc.setLocalDescription(sdp)
        sendToPeer('offerOrAnswer', sdp)
      }, e => {})
  }

  const addCandidate = () => {
    // const candidate = JSON.parse(textRef.current.value)
    // console.log(`Adding candidate ${candidate}`)

    // pc.addIceCandidate(new RTCIceCandidate(candidate))
    console.log(candidates)
    candidates.map(candidate => {
      console.log(JSON.stringify(candidate))
      pc.addIceCandidate(new RTCIceCandidate(candidate))
    })
  }
  
  const success = (stream) => {
    setLocalStream(stream)
    localVideoRef.current.srcObject = stream
    stream.getTracks().map(track => pc.addTrack(track, stream))
  }

  const failure = (e) => {
    alert(e)
  }

  async function getMedia(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      success(stream)
    }catch(e){
      failure()
    }
  }

  pc.onicecandidate = (e) => {
    if(e.candidate) {
      yourIC.current.value += JSON.stringify(e.candidate)
      sendToPeer('candidate', e.candidate)
    }
  }

  pc.oniceconnectionstatechange = (e) => {
    console.log(e)
  }

  pc.ontrack = (e) => {
    remoteVideoRef.current.srcObject = e.streams[0]
  }

  useEffect(() => {

    setSocket(socketIOClient(ENDPOINT))
  


    getMedia()    
    
    //socket = socketIOClient(ENDPOINT)

  }, [])

  useEffect(() => {
    if(socket !== null){
      socket.on('connection-success', data => {
        setResponse(data)
      })

      socket.on('offerOrAnswer', sdp => {
        textRef.current.value = JSON.stringify(sdp)
      })

      socket.on('candidate', candidate => {
        setCandidates([...candidates, candidate])
      })

      // CLEAN UP THE EFFECT
      return () => socket.disconnect();
    }
  }, [socket])
  


  // useEffect(() => {

    
  //   /*var vid = document.getElementById("remoteVideo");
  //   vid.volume = 0.5;*/
  // }, [])

  function handleTurnCamera() {
    if(cameraStatus.status === true){
      setCameraStatus({status: false, text: 'on'})
      localStream.getTracks().map(stream => stream.stop())
    }else{
      setCameraStatus({status: true, text: 'off'})
      getMedia()
    }
  }

  
  return (
    <div className='container'>
      <div>
        <video 
          id="localVideo" 
          ref={localVideoRef} 
          autoPlay 
          muted
        />

        <video 
          id="remoteVideo" 
          ref={remoteVideoRef} 
          autoPlay 
        />
      </div>

      <div>
        <button onClick={createOffer}>Offer</button>
        <button onClick={createAnswer}>Answer</button>
        <br/>
        <textarea ref={textRef} />
        <br />
        <span>Your SDP</span>
        <br />
        <textarea ref={yourSDP} />
        <br />
        <span>Your IceCandidates</span>
        <br />
        <textarea ref={yourIC} />
        <br />
        <button onClick={setRemoteDescription}>Set Remote Desc</button>
        <button onClick={addCandidate}>Add Candidate</button>
        <button onClick={handleTurnCamera}>Turn {cameraStatus.text} Camera</button>
      </div>

    </div>
  );
}

export default App;
