import { useNavigate } from "react-router-dom";
import "./LoginBody.css";
import { useState } from "react";

function LoginBody() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/home");
  };

  // TAKE USERNAME FROM HERE WHEN WE HAVE USER MANAGEMENT
  const [username, setUsername] = useState("");
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  // TAKE PASSWORD FROM HERE WHEN WE HAVE USER MANAGEMENT
  const [password, setPassword] = useState("");
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <main className="login-body-container">
      <input
        className="username-input"
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
      />
      <input
        className="password-input"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
      />
      <button onClick={handleClick}>Submit</button>
      <div className="register">
        Are you the first time visiting this page? Please register{" "}
        <a href="https://ethz.ch/de.html">here</a>
      </div>
      <img src="./logo.png" alt="SmartMensa" className="logo" />
    </main>
  );
}

export default LoginBody;
