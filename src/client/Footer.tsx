import "./Footer.css";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");

  return (
    <>
      <footer>Here goes all the hardcoded info about {mensaName}!</footer>
    </>
  );
}

export default Footer;
