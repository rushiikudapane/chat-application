import React, { useState, useEffect } from "react";
import queryString from "query-string";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import "./chat.css";
import Input from "../Input/input";
import Messages from "../messages/Messages";
import InfoBar from "../InfoBar/InfoBar";
let socket;

const Chat = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const ENDPOINT = "localhost:5000";

  const location = useLocation();
  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT, { transports: ["websocket"] });
    setName(name);
    setRoom(room);

    console.log(socket);
    socket.emit("join", { name, room });

    return () => {
      socket.disconnect();

      socket.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
        {/* <input value={message} onChange={(event) => setMessage(event.target.value)}
        onKeyPress={event => event.key ==="Enter" ? sendMessage(event) : null} /> */}
      </div>
    </div>
  );
};

export default Chat;
