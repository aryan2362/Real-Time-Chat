import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      window.location.href = "/chat";
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <>
      <style>{`
        *{
          margin:0;
          padding:0;
          box-sizing:border-box;
          font-family:'Segoe UI',sans-serif;
        }

        .login-container{
          min-height:100vh;
          display:flex;
          justify-content:center;
          align-items:center;
          flex-direction:column;

          background: linear-gradient(
            -45deg,
            #0f172a,
            #1e3a8a,
            #7c3aed,
            #2563eb
          );

          background-size:400% 400%;
          animation:gradientMove 10s ease infinite;
        }

        @keyframes gradientMove{
          0%{
            background-position:0% 50%;
          }
          50%{
            background-position:100% 50%;
          }
          100%{
            background-position:0% 50%;
          }
        }

        .login-title{
          color:white;
          font-size:3rem;
          margin-bottom:25px;
          text-shadow:0 0 25px rgba(255,255,255,0.4);
        }

        .login-card{
          width:420px;
          padding:40px;

          background:rgba(255,255,255,0.12);

          backdrop-filter:blur(18px);
          -webkit-backdrop-filter:blur(18px);

          border:1px solid rgba(255,255,255,0.2);

          border-radius:25px;

          box-shadow:
          0 8px 32px rgba(0,0,0,0.35);

          animation:fadeIn 0.8s ease;
        }

        @keyframes fadeIn{
          from{
            opacity:0;
            transform:translateY(30px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .login-card input{
          width:100%;
          padding:15px 18px;

          border:none;
          outline:none;

          border-radius:12px;

          background:rgba(255,255,255,0.15);

          color:white;
          font-size:16px;

          transition:0.3s;
        }

        .login-card input::placeholder{
          color:rgba(255,255,255,0.75);
        }

        .login-card input:focus{
          background:rgba(255,255,255,0.22);

          box-shadow:
          0 0 20px rgba(96,165,250,0.8);

          transform:translateY(-2px);
        }

        .login-card button{
          width:100%;
          padding:15px;

          border:none;
          border-radius:12px;

          background:linear-gradient(
            135deg,
            #3b82f6,
            #8b5cf6
          );

          color:white;
          font-size:17px;
          font-weight:bold;

          cursor:pointer;

          transition:0.3s;
        }

        .login-card button:hover{
          transform:translateY(-3px);

          box-shadow:
          0 10px 25px rgba(59,130,246,0.6);
        }

        .login-card button:active{
          transform:scale(0.98);
        }

        .register-link{
          display:block;
          text-align:center;
          margin-top:20px;

          color:white;
          text-decoration:none;

          transition:0.3s;
        }

        .register-link:hover{
          color:#facc15;
        }

        @media(max-width:500px){
          .login-card{
            width:90%;
            padding:30px;
          }

          .login-title{
            font-size:2rem;
          }
        }
      `}</style>

      <div className="login-container">
        <h1 className="login-title">💬 Chat App</h1>

        <div className="login-card">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <br />
            <br />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <br />
            <br />

            <button type="submit">
              Login
            </button>
          </form>

          <a
            href="/register"
            className="register-link"
          >
            Don't have an account? Register
          </a>
        </div>
      </div>
    </>
  );
}

export default Login;