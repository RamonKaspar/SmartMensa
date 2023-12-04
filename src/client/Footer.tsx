import "./Footer.css";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();
  const mensaName = location.pathname.replace("/", "");

  // hardcode this later:
  const openingTimes = "11:00 - 1:00";
  const diningTimes = "11:00 - 14:30"

  if (mensaName == "uzh-untere-mensa-lunch") {
    return (
      <>
        <footer>
          <div>
            <h3> Opening Times</h3>
            <p> {openingTimes} </p>
            <h3> Dining Times</h3>
            <p>{diningTimes}</p>
          </div>
          <div>
            <h3> Location </h3>
            Künstlergasse 10 <br></br> 
            8001 Zürich <br></br>
            <a href="https://maps.app.goo.gl/1qFBdfGYNwKsZ87X8">Show in Google Maps</a>
          </div>
          
        </footer>
      </>
    );
  }
  return (
    <>
      <footer>
        Here goes all the hardcoded info about {mensaName}!
      </footer>
    </>
  );
}

export default Footer;
