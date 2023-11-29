import { useNavigate } from "react-router-dom";
import "./LoginBody.css";

function LoginBody() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/home");
  };

  return (
    <main className="login-body-container">
      <div>This is the login page!</div>
      <button onClick={handleClick}>
        This is a dummy login button to go to home.
      </button>
    </main>
  );
}

export default LoginBody;
