import React, { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.0.107:3333";

export default function ClientComponent() {
  const [response, setResponse] = useState("");

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT)

    socket.on('connection-success', data => {
      setResponse(data)
    })

    socket.on('offerOrAnswer', sdp => {
      
    })
    
    /*const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      setResponse(data);
    });*/

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();

  }, []);

  return (
    <p>
      It's {JSON.stringify(response)}
    </p>
  );
}