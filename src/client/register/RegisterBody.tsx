import { useNavigate } from "react-router-dom";
import "./RegisterBody.css";
import { useState } from "react";
import type { appliedSettingsType } from "../Settings";

function RegisterBody() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [appliedSettings, setAppliedSettings] = useState<appliedSettingsType>({
    price_class: "students",
    gluten: false,
    krebstiere: false,
    ei: false,
    fisch: false,
    erdnüsse: false,
    soja: false,
    milch_laktose: false,
    schalenfrüchte: false,
    sellerie: false,
    senf: false,
    sesam: false,
    sulfite: false,
    lupinen: false,
    weichtiere: false,
    hartschalenobst: false,
  });

  const PasswordRequirements = [
    {
      key: "length",
      text: "At least 8 characters long",
      valid: password.length >= 8,
    },
    {
      key: "uppercase",
      text: "At least one upper case character (A-Z)",
      valid: /[A-Z]/.test(password),
    },
    {
      key: "lowercase",
      text: "At least one lower case character (a-z)",
      valid: /[a-z]/.test(password),
    },
    {
      key: "numbers",
      text: "At least one number (0-9)",
      valid: /[0-9]/.test(password),
    },
    {
      key: "specialCharacter",
      text: "At least one special character (!, #, $, etc.)",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const toggleAllergies = (filterKey: keyof appliedSettingsType) => {
    setAppliedSettings((prevFilters: appliedSettingsType) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  const setPriceClass = (
    newPriceClass: "students" | "external" | "internal"
  ) => {
    setAppliedSettings((prevFilters: appliedSettingsType) => ({
      ...prevFilters,
      ["price_class"]: newPriceClass,
    }));
  };

  const navigate = useNavigate();
  const handleRegisterClick = async () => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          email,
          password,
          appliedSettings,
        }),
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

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
    setIsEmailValid(emailValue.length === 0 ? false : isValidEmail(emailValue));
  };

  const handleEmailBlur = () => {
    if (email !== "" && !isEmailValid) {
      setEmailError("Invalid Email");
    } else {
      setEmailError("");
    }
  };

  const handleEmailFocus = () => {
    setEmailError("");
  };

  function isValidEmail(email: string) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
    setIsPasswordValid(isValidPassword(passwordValue));
  };

  function isValidPassword(password: string): boolean {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    return hasUpperCase && hasLowerCase && hasSpecialChar && isLongEnough;
  }

  // Check if all fields are filled
  const isFormValid =
    name !== "" && username !== "" && isEmailValid && isPasswordValid;

  return (
    <main className="register-body-container">
      <h2 className="register-title">Create New Account</h2>
      <div className="user-input-container">
        <input
          className="name-input"
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Full Name"
          autoComplete="name"
          required
        />
        <input
          className="username-input"
          type="text"
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
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
          onBlur={handleEmailBlur}
          onFocus={handleEmailFocus}
          placeholder="Email"
          autoComplete="email"
          required
        />
        {emailError && <span className="email-invalid">{emailError}</span>}
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
      </div>
      {isPasswordValid === false && password !== "" && (
        <>
          <div className="password-requirements">
            <ul>
              {PasswordRequirements.map(
                ({ key, text, valid }) =>
                  !valid && (
                    <li key={key} className="red">
                      {text}
                    </li>
                  )
              )}
            </ul>
          </div>
        </>
      )}

      <div className="register-settings-container">
        <div>
          <h3>Choose your price category:</h3>
        </div>
        <div className="mini-info">(Can be changed later in settings)</div>
        <div className="register-price-container">
          <button
            className={`register-settings-button ${
              appliedSettings.price_class === "students" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("students")}
          >
            Student
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.price_class === "internal" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("internal")}
          >
            Intern
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.price_class === "external" ? "applied" : ""
            }`}
            onClick={() => setPriceClass("external")}
          >
            Extern
          </button>
        </div>
        <h3>Please select all your allergies:</h3>
        <div className="mini-info">(Can be changed later in settings)</div>
        <div className="register-allergies-container">
          <button
            className={`register-settings-button ${
              appliedSettings.gluten ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("gluten")}
          >
            Gluten
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.krebstiere ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("krebstiere")}
          >
            Krebstiere
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.ei ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("ei")}
          >
            Ei
          </button>
          {/* Add the rest of the allergy buttons here */}
          <button
            className={`register-settings-button ${
              appliedSettings.fisch ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("fisch")}
          >
            Fisch
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.erdnüsse ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("erdnüsse")}
          >
            Erdnüsse
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.soja ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("soja")}
          >
            Soja
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.milch_laktose ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("milch_laktose")}
          >
            Milch / Laktose
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.schalenfrüchte ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("schalenfrüchte")}
          >
            Schalenfrüchte
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.sellerie ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sellerie")}
          >
            Sellerie
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.senf ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("senf")}
          >
            Senf
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.sesam ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sesam")}
          >
            Sesam
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.sulfite ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("sulfite")}
          >
            Sulfite
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.lupinen ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("lupinen")}
          >
            Lupinen
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.weichtiere ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("weichtiere")}
          >
            Weichtiere
          </button>
          <button
            className={`register-settings-button ${
              appliedSettings.hartschalenobst ? "applied" : ""
            }`}
            onClick={() => toggleAllergies("hartschalenobst")}
          >
            Hartschalenobst (Nüsse)
          </button>
        </div>
      </div>
      <button
        onClick={handleRegisterClick}
        disabled={!isFormValid}
        className={isFormValid ? "register-button" : "register-button-disabled"}
      >
        Register
      </button>
    </main>
  );
}

export default RegisterBody;
