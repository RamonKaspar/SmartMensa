import "./MensaBody.css";
import { useLocation } from "react-router-dom";

function MensaBody() {
  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");

  return (
    <>
      <main className="mensa-body-container">
        <div>Here goes the meals of {mensaName}!</div>
      </main>
    </>
  );
}

export default MensaBody;
