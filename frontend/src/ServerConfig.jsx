const configuration = {
    iceServers: [
      { urls: import.meta.env.VITE_STUN_SERVER },
      {
        urls: import.meta.env.VITE_TURN_SERVER,
        username: import.meta.env.VITE_TURN_USERNAME,
        credential: import.meta.env.VITE_TURN_CREDENTIAL
      }
    ]
  };

  
export default configuration;