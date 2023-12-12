import { useNavigate } from "react-router-dom";
import "./RegisterBody.css";
import { useState } from "react";

function RegisterBody() {
  const navigate = useNavigate();
  const handleRegisterClick = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (!isValidEmail(email)) {
        alert("Enter a valid email!");
        return;
      }

      if (!isValidPassword(password)) {
        alert("Enter a valid password!");
        return;
      }

      if (response.ok) {
        const resBody = await response.json();
        alert(resBody.message);
        if (resBody.message.includes("Successfully")) {
          navigate("/login");
        }
      } else {
        const resBody = await response.json();
        alert(resBody.message);
      }
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  const handleLoginClick = async () => {
    navigate("/login");
  };

  function isValidEmail(email: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  function isValidPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasSpecialChar && isLongEnough;
  }

  // TAKE USERNAME FROM HERE WHEN WE HAVE USER MANAGEMENT
  const [name, setName] = useState("");
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const [username, setUsername] = useState("");
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };
  // TAKE PASSWORD FROM HERE WHEN WE HAVE USER MANAGEMENT
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(emailValue.length === 0 ? null : isValidEmail(emailValue));
  };

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
    setIsPasswordValid(isValidPassword(passwordValue));
  };

  // Check if all fields are filled
  const isFormValid =
    name !== "" &&
    username !== "" &&
    email !== "" &&
    isEmailValid === true &&
    password !== "" &&
    isPasswordValid === true;

  return (
    <main className="register-body-container">
      <input
        className="name-input"
        type="text"
        name="name"
        value={name}
        onChange={handleNameChange}
        placeholder="Full Name"
        autoComplete="name"
        required
      />
      <input
        className="username-input"
        type="text"
        name="username"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Username"
        autoComplete="username"
        required
      />
      <input
        className="email-input"
        type="email"
        name="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Email"
        autoComplete="email"
        required
      />
      <div id="emailIndicator">
        {isEmailValid === false && (
          <span className="email-invalid">Invalid email</span>
        )}
      </div>
      <input
        className="password-input"
        type="password"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        autoComplete="new-password"
        required
      />
      <div id="passwordIndicator">
        {isPasswordValid === false && (
          <span className="password-invalid">
            Password must contain at least one uppercase letter, one lowercase
            letter, one special character, and be at least 8 characters long.
          </span>
        )}
      </div>
      <button
        onClick={handleRegisterClick}
        disabled={!isFormValid}
        className={isFormValid ? "register-button" : "register-button-disabled"}
      >
        Register
      </button>
      <button onClick={handleLoginClick}>Back to login</button>

      <img src="./logo.png" alt="SmartMensa" className="logo" />
    </main>
  );
}

export default RegisterBody;
