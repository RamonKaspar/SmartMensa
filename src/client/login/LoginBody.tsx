import { useNavigate } from "react-router-dom";
import "./LoginBody.css";
import { useState } from "react";

function LoginBody() {
  const navigate = useNavigate();
  const handleSubmitClick = async () => {
    try {
      const response = await fetch("/api/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        navigate("/home");
        // Optionally, handle the user data received from server
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      alert("Error handling login");
    }
  };
  const handleRegisterClick = () => {
    navigate("/register");
  };

  const [username, setUsername] = useState("");
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <main className="login-body-container">
      <input
        className="username-input"
        type="text"
        name="username"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
        autoComplete="given-name"
      />
      <input
        className="password-input"
        type="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        autoComplete="current-password"
      />
      <button onClick={handleSubmitClick}>Submit</button>
      <div className="register">
        Are you the first time visiting this page?{" "}
        {/* <a href="https://ethz.ch/de.html">here</a> */}
        <button onClick={handleRegisterClick}>Go Register</button>
      </div>
      <img src="./logo.png" alt="SmartMensa" className="logo" />
    </main>
  );
}

export default LoginBody;
