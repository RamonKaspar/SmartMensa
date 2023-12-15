import { useNavigate } from "react-router-dom";
import "./LoginBody.css";
import { useState } from "react";

function LoginBody() {
  const [username, setUsername] = useState("");
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const navigate = useNavigate();
  const handleLogInClick = async () => {
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
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Login failed");
    }
  };
  const handleRegisterClick = () => {
    navigate("/register");
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
      <button onClick={handleLogInClick}>Log in</button>
      <button
        className="without-login-button"
        onClick={() => navigate("/home")}
      >
        Use without login
      </button>
      <div className="register">Are you the first time visiting this page?</div>
      <button onClick={handleRegisterClick}>Go Register</button>

      <img src="./logo.png" alt="SmartMensa" className="logo" />
    </main>
  );
}

export default LoginBody;
