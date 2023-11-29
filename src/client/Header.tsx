import "./Header.css";
import { FaFilter } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";

function Header() {
  const handleFilterClick = () => {
    console.log("This click would trigger the filter menu!");
  };

  const handleSettingsClick = () => {
    console.log("This click would trigger the settings menu!");
  };

  return (
    <>
      <header>
        <div id="filter-button">
          <FaFilter size={30} onClick={() => handleFilterClick()} />
        </div>
        <div id="app-name">
          <span>SmartMensa</span>
        </div>
        <div id="settings-button">
          <FaGear size={30} onClick={() => handleSettingsClick()} />
        </div>
      </header>
    </>
  );
}

export default Header;
