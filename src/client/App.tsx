import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Home from "./home/Home";
import Mensa from "./mensa/Mensa";
import Register from "./register/Register";
import { useState, useEffect } from "react";

async function fetchMensaStaticInfos() {
  try {
    const response = await fetch(`/mensa-info`);
    if (!response.ok) {
      throw new Error("Failed to fetch mensa static infos");
    }
    const mensaInfo = await response.json();
    return mensaInfo;
  } catch (error) {
    console.error(error);
  }
}

function App() {
  const [mensaRoutes, setMensaRoutes] = useState<any>([]);

  useEffect(() => {
    async function fetchMeals() {
      try {
        const mensaInfos = await fetchMensaStaticInfos();
        const mensaArray = mensaInfos.mensas;
        const namesArray: string[] = mensaArray.map((mensa: any) => mensa.name);
        setMensaRoutes(namesArray);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMeals();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        {mensaRoutes.map((mensa: string) => (
          <Route key={mensa} path={`/${mensa}`} element={<Mensa />} />
        ))}
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </>
  );
}

export default App;
