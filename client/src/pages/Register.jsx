import { useState } from "react";
import axios from "axios";

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
    <div style={{ padding: "20px" }}>

      <h1>Register</h1>

      <form onSubmit={handleRegister}>

        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <br /><br />

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button type="submit">
          Register
        </button>

      </form>

      <br />

      <a href="/">
        Already have an account? Login
      </a>

    </div>
  );
}

export default Register;