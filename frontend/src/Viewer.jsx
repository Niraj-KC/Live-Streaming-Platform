// src/Viewer.jsx
import React, { useState, useRef, useEffect } from 'react';
import './style.css';
import { useParams } from 'react-router';

const CONFIG = import.meta.env.VITE_SIGNALING_SERVER_URL;

const Viewer = () => {
  const { publisherId } = useParams();
  const remoteVideoRef = useRef(null);
  const [logMessages, setLogMessages] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const peerConnectionRef = useRef(null);
  const signalingRef = useRef(null);
  const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMsg = `${timestamp} - ${message}`;
    console.log(logMsg);
    setLogMessages(prev => [...prev, logMsg]);
  };

  const handleOffer = async (offer) => {
    addLog('Handling offer from publisher...');
    peerConnectionRef.current = new RTCPeerConnection(configuration);
    const pc = peerConnectionRef.current;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateStr = JSON.stringify(event.candidate);
        signalingRef.current.send(JSON.stringify({
          type: 'candidate',
          role: 'viewer',
          target: publisherId,
          payload: event.candidate,
        }));
        addLog('Sent ICE candidate to publisher: ' + candidateStr);
      } else {
        addLog('ICE candidate gathering complete.');
      }
    };

    pc.onconnectionstatechange = () => {
      addLog('Peer connection state changed: ' + pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      addLog('ICE connection state changed: ' + pc.iceConnectionState);
    };

    pc.onsignalingstatechange = () => {
      addLog('Signaling state changed: ' + pc.signalingState);
    };

    // Consolidated ontrack handler using onloadedmetadata to trigger playback once metadata is loaded.
    pc.ontrack = (event) => {
      addLog('ontrack event fired, track kind: ' + event.track.kind);
      if (remoteVideoRef.current) {
        let stream = remoteVideoRef.current.srcObject;
        if (!stream) {
          stream = new MediaStream();
          remoteVideoRef.current.srcObject = stream;
          // Listen for loaded metadata to trigger playback once
          remoteVideoRef.current.onloadedmetadata = () => {
            remoteVideoRef.current.play()
              .then(() => addLog('Remote video is playing.'))
              .catch(err => addLog('Error playing remote stream: ' + err));
          };
        }
        stream.addTrack(event.track);
      }
    };

    try {
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      addLog('Remote description set successfully.');
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      signalingRef.current.send(JSON.stringify({
        type: 'answer',
        role: 'viewer',
        target: publisherId,
        payload: answer,
      }));
      addLog('Sent answer to publisher.');
    } catch (err) {
      addLog('Error handling offer: ' + err);
    }
  };

  const initializeSignaling = (viewerName) => {
    addLog('Initializing WebSocket connection...');
    signalingRef.current = new WebSocket(CONFIG);

    signalingRef.current.onopen = () => {
      addLog('Connected to signaling server as viewer.');
      const joinMessage = { type: 'join', role: 'viewer', name: viewerName };
      if (publisherId !== 'unknown') joinMessage.target = publisherId;
      signalingRef.current.send(JSON.stringify(joinMessage));
    };

    signalingRef.current.onmessage = async (messageEvent) => {
      addLog('Raw signaling message: ' + messageEvent.data);
      const data = JSON.parse(messageEvent.data);
      addLog('Parsed signaling message: ' + data.type);
      if (data.type === 'offer') {
        addLog('Received offer from publisher. Processing...');
        await handleOffer(data.payload);
      } else if (data.type === 'candidate') {
        if (peerConnectionRef.current) {
          try {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.payload));
            addLog('Added ICE candidate from publisher: ' + JSON.stringify(data.payload));
          } catch (err) {
            addLog('Error adding ICE candidate: ' + err);
          }
        }
      }
    };

    signalingRef.current.onerror = (error) => {
      addLog('WebSocket error: ' + error);
    };

    signalingRef.current.onclose = () => {
      addLog('WebSocket connection closed.');
    };
  };

  const joinStream = () => {
    const viewerName = prompt('Please enter your name:', 'Viewer');
    if (viewerName) {
      setIsJoined(true);
      initializeSignaling(viewerName);
    }
  };

  useEffect(() => {
    return () => {
      if (signalingRef.current) signalingRef.current.close();
      if (peerConnectionRef.current) peerConnectionRef.current.close();
    };
  }, [publisherId]);

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="#">RTMP Viewer</a>
      </nav>
      <div className="container mt-4">
        <h1>Viewing Stream from {publisherId}</h1>
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <div className="card mb-3">
              <div className="card-header">Live Stream</div>
              <div className="video-container">
                <video id="remoteVideo" ref={remoteVideoRef} autoPlay playsInline controls />
              </div>
            </div>
            <div className="text-center mb-3">
              <button
                id="joinStreamBtn"
                className="btn btn-primary"
                onClick={joinStream}
                disabled={isJoined}
              >
                Join Stream
              </button>
            </div>
            <div className="card">
              <div className="card-header">Status Log</div>
              <div id="log" className="card-body" style={{ height: '200px', overflowY: 'auto' }}>
                {logMessages.map((msg, index) => (
                  <div key={index}>{msg}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewer;
