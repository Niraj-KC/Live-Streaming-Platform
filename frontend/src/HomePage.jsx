// HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const HomePage = () => {
    const [streams, setStreams] = useState([]);
    const navigate = useNavigate();

    const startStream = () => {
        const streamId = `stream-${Date.now()}`; // Generate unique stream ID
        navigate(`/publisher/${streamId}`);
    };

    useEffect(() => {
        // Fetch the list of active streams from the server
        const fetchStreams = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/streams`);
                console.log("live streams: ", response.data);
                console.log("live streams length: ", response.data.length);
                setStreams(response.data["streams"]);
            } catch (error) {
                console.error('Error fetching streams:', error);
            }
        };

        fetchStreams();
    }, []);

    const handleJoinStream = (streamId) => {
        // Navigate to the viewer component with the selected streamId
        navigate(`/viewer/${streamId}`);
    };


    return (
        <div className="container">
            <h1>Live Streams</h1>
            <button onClick={startStream}>Start a New Stream</button>
            <ul>
                {streams.length > 0 ? (
                    streams.map((stream) => (
                        <li key={stream.publisherId}>
                            <button onClick={() => handleJoinStream(stream.publisherId)}>
                                Join Stream {stream.publisherId}
                            </button>
                        </li>
                    ))
                ) : (
                    <p>No active streams</p>
                )}
            </ul>
        </div>
    );
};

export default HomePage;
