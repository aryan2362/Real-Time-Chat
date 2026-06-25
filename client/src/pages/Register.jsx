import { useState } from "react";
import axios from "axios";
import "./Register.css";

function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password
        }
      );

      alert(res.data.message);

      window.location.href = "/";

    } catch (error) {

  console.log("FULL ERROR =>", error);

  console.log("RESPONSE =>", error.response);

  console.log("DATA =>", error.response?.data);

  alert(
    error.response?.data?.message || error.message
  );
}
  };

 return (
  <div className="register-container">
    <div className="register-card">

      <h1>Create Account 🚀</h1>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />

        <button
          type="submit"
          className="register-btn"
        >
          Register
        </button>

      </form>

      <br />

      <a href="/" className="login-link">
        Already have an account? Login
      </a>

    </div>
  </div>
);
}

export default Register;