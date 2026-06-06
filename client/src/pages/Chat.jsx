import { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function Chat() {

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [typingUser, setTypingUser] = useState("");
  const messagesEndRef = useRef(null);

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    { name: "Guest" };

  // Route Protection
  useEffect(() => {

    const savedUser =
      localStorage.getItem("user");

    if (!savedUser) {

      window.location.href = "/";

    }

  }, []);

  // Load Messages + Socket Events
  useEffect(() => {

    loadMessages();

    socket.on(
      "receiveMessage",
      (data) => {

        setMessages((prev) => [
          ...prev,
          data
        ]);

      }
    );

    socket.on(
      "onlineUsers",
      (count) => {

        setOnlineUsers(count);

      }
    );
socket.on(
  "typing",
  (name) => {

    console.log("TYPING EVENT:", name);

    setTypingUser(name);

    setTimeout(() => {

      setTypingUser("");

    }, 1000);

  }
);

    return () => {

      socket.off("receiveMessage");
      socket.off("onlineUsers");
      socket.off("typing");

    };

  }, []);

  // Auto Scroll
  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);

  // Load Old Messages
  const loadMessages = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/messages"
      );

      setMessages(res.data);

    } catch (error) {

      console.log(error);

    }

  };

  // Send Message
  const sendMessage = () => {

    if (!message.trim()) return;

    const data = {

      user: user.name,
      text: message

    };

    socket.emit(
      "sendMessage",
      data
    );

    setMessage("");

  };

  // Logout
  const logout = () => {

    localStorage.clear();

    window.location.href = "/";

  };

  return (

    <div
      style={{
        padding: "20px",
        maxWidth: "1000px",
        margin: "auto"
      }}
    >

      <h1>
        Welcome To Chat App 🚀
      </h1>

      <h3>
        Logged In As: {user.name}
      </h3>

      <h4>
        Online Users: {onlineUsers}
      </h4>
      {typingUser && typingUser !== user.name && (

  <p
    style={{
      color: "gray",
      fontStyle: "italic"
    }}
  >
    {typingUser} is typing...
  </p>

)}

      <button
        onClick={logout}
        style={{
          padding: "10px 15px",
          marginBottom: "15px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

      <div
        style={{
          border: "1px solid #ccc",
          height: "400px",
          overflowY: "auto",
          padding: "15px",
          borderRadius: "10px",
          backgroundColor: "#fafafa"
        }}
      >

        {messages.map((msg, index) => (

          <div
            key={index}
            style={{
              marginBottom: "10px",
              padding: "10px",
              borderRadius: "10px",

              backgroundColor:
                (msg.sender || msg.user) === user.name
                  ? "#DCF8C6"
                  : "#F1F0F0",

              width: "fit-content",

              maxWidth: "300px",

              marginLeft:
                (msg.sender || msg.user) === user.name
                  ? "auto"
                  : "0"
            }}
          >

            <strong>
              {msg.sender || msg.user}
            </strong>

            <br />

            {msg.text}
<br />

<small
  style={{
    color: "gray",
    fontSize: "12px"
  }}
>
  {msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : ""}
</small>
          </div>

        ))}

        <div ref={messagesEndRef}></div>

      </div>

      <br />

      <div
        style={{
          display: "flex",
          gap: "10px"
        }}
      >

        <input
          type="text"
          placeholder="Type Message..."
          value={message}
          onChange={(e) => {

            console.log("EMITTING TYPING", user.name);
  setMessage(e.target.value);

  socket.emit(
    "typing",
    user.name
  );

}}
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              sendMessage();

            }

          }}
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Send
        </button>

      </div>

    </div>

  );

}

export default Chat;