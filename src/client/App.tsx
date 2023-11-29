import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Home from "./home/Home";
import Mensa from "./mensa/Mensa";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/:mensa" element={<Mensa />} />
      </Routes>
    </>
  );
}

export default App;
