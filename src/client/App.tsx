import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Home from "./home/Home";
import Mensa from "./mensa/Mensa";
import Register from "./register/Register";
import FavMenus from "./favouritemenus/FavMenus";
import { useState, useEffect } from "react";
import { appliedSettingsType } from "./Settings";

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
  /* State to decide if settings or filter should be displayed */
  const [showFilter, setShowFilter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mensaRoutes, setMensaRoutes] = useState<any>([]);
  /* State for handling the applied filters */
  const [appliedFilters, setAppliedFilters] = useState(() => {
    const savedFilters = localStorage.getItem("appliedFilters");
    return savedFilters
      ? JSON.parse(savedFilters)
      : {
          Zentrum_ETH: false,
          Zentrum_UZH: false,
          Irchel: false,
          Höngg: false,
          Currently_Open: false,
          Favorites: false,
        };
  });
  /* State for handling the applied settings (initialized with default values) */
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

  /* Save to local storage */
  useEffect(() => {
    localStorage.setItem("appliedFilters", JSON.stringify(appliedFilters));
  }, [appliedFilters]);

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
        <Route
          path="/home"
          element={
            <Home
              appliedSettings={appliedSettings}
              setAppliedSettings={setAppliedSettings}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
            />
          }
        />
        {mensaRoutes.map((mensa: string) => (
          <Route
            key={mensa}
            path={`/${mensa}`}
            element={
              <Mensa
                showFilter={showFilter}
                setShowFilter={setShowFilter}
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                appliedSettings={appliedSettings}
                setAppliedSettings={setAppliedSettings}
              />
            }
          />
        ))}
        <Route
          path="/favourite-menus"
          element={
            <FavMenus
              appliedSettings={appliedSettings}
              setAppliedSettings={setAppliedSettings}
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              showSettings={showSettings}
              setShowSettings={setShowSettings}
            />
          }
        />
        {/* <Route path="*" element={<Navigate to="/login" />} /> */}
      </Routes>
    </>
  );
}

export default App;
