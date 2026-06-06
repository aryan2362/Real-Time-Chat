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
  <>
    <style>{`
      *{
        box-sizing:border-box;
        font-family:'Segoe UI',sans-serif;
      }

      .chat-page{
        min-height:100vh;
        padding:20px;

        background:linear-gradient(
          135deg,
          #0f172a,
          #1e3a8a,
          #7c3aed
        );

        color:white;
      }

      .chat-wrapper{
        max-width:1100px;
        margin:auto;
      }

      .header{
        background:rgba(255,255,255,0.1);
        backdrop-filter:blur(15px);
        border-radius:20px;
        padding:20px;
        margin-bottom:20px;

        display:flex;
        justify-content:space-between;
        align-items:center;

        box-shadow:
        0 8px 32px rgba(0,0,0,0.3);
      }

      .logout-btn{
        border:none;
        padding:12px 20px;
        border-radius:12px;

        background:linear-gradient(
          135deg,
          #ef4444,
          #dc2626
        );

        color:white;
        cursor:pointer;
        font-weight:bold;
      }

      .chat-box{
        height:550px;

        overflow-y:auto;

        padding:20px;

        border-radius:25px;

        background:rgba(255,255,255,0.1);

        backdrop-filter:blur(20px);

        border:1px solid rgba(255,255,255,0.15);

        box-shadow:
        0 8px 32px rgba(0,0,0,0.3);
      }

      .message{
        margin-bottom:15px;
        padding:14px 18px;
        border-radius:18px;

        max-width:350px;

        word-wrap:break-word;

        animation:fadeIn .3s ease;
      }

      .my-message{
        margin-left:auto;

        background:linear-gradient(
          135deg,
          #3b82f6,
          #8b5cf6
        );
      }

      .other-message{
        background:rgba(255,255,255,0.15);
      }

      .input-area{
        display:flex;
        gap:10px;
        margin-top:20px;
      }

      .message-input{
        flex:1;

        padding:16px;

        border:none;
        outline:none;

        border-radius:15px;

        background:rgba(255,255,255,0.12);

        color:white;

        backdrop-filter:blur(10px);

        font-size:16px;
      }

      .message-input::placeholder{
        color:#ddd;
      }

      .send-btn{
        border:none;

        padding:16px 25px;

        border-radius:15px;

        background:linear-gradient(
          135deg,
          #3b82f6,
          #8b5cf6
        );

        color:white;

        font-weight:bold;

        cursor:pointer;
      }

      .typing{
        color:#facc15;
        margin:10px 0;
        font-style:italic;
      }

      .online{
        color:#4ade80;
      }

      @keyframes fadeIn{
        from{
          opacity:0;
          transform:translateY(10px);
        }

        to{
          opacity:1;
          transform:translateY(0);
        }
      }
    `}</style>

    <div className="chat-page">
      <div className="chat-wrapper">

        <div className="header">

          <div>
            <h1>💬 Real Time Chat</h1>

            <h3>
              Welcome, {user.name}
            </h3>

            <h4 className="online">
              🟢 Online Users: {onlineUsers}
            </h4>
          </div>

          <button
            onClick={logout}
            className="logout-btn"
          >
            Logout
          </button>

        </div>

        {typingUser &&
          typingUser !== user.name && (
            <p className="typing">
              ✍️ {typingUser} is typing...
            </p>
          )}

        <div className="chat-box">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`message ${
                (msg.sender || msg.user) === user.name
                  ? "my-message"
                  : "other-message"
              }`}
            >

              <strong>
                {msg.sender || msg.user}
              </strong>

              <br />

              {msg.text}

              <br />

              <small
                style={{
                  opacity: 0.8
                }}
              >
                {msg.createdAt
                  ? new Date(
                      msg.createdAt
                    ).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit"
                      }
                    )
                  : ""}
              </small>

            </div>

          ))}

          <div ref={messagesEndRef}></div>

        </div>

        <div className="input-area">

          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {

              console.log(
                "EMITTING TYPING",
                user.name
              );

              setMessage(
                e.target.value
              );

              socket.emit(
                "typing",
                user.name
              );

            }}
            onKeyDown={(e) => {

              if (
                e.key === "Enter"
              ) {

                sendMessage();

              }

            }}
            className="message-input"
          />

          <button
            onClick={sendMessage}
            className="send-btn"
          >
            🚀 Send
          </button>

        </div>

      </div>
    </div>
  </>
);

}

export default Chat;