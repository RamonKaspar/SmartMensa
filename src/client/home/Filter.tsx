import "./Filter.css";
import { useState, useEffect } from "react";

type appliedFiltersType = {
  Zentrum_ETH: boolean;
  Zentrum_UZH: boolean;
  Irchel: boolean;
  Höngg: boolean;
  Oerlikon: boolean;
  Currently_Open: boolean;
  Favorites: boolean;
};

function Filter({ appliedFilters, setAppliedFilters, showFilter }: any) {
  const [slideOut, setSlideOut] = useState(0);
  const toggleFilter = (filterKey: keyof appliedFiltersType) => {
    setAppliedFilters((prevFilters: appliedFiltersType) => ({
      ...prevFilters,
      [filterKey]: !prevFilters[filterKey],
    }));
  };

  // If showFilter changes from true to false, set slideOut to true
  useEffect(() => {
    if (document.getElementsByClassName("hidden-filter").length === 0) {
      setSlideOut(1);
    }
  }, [showFilter]);

  return (
    <>
      <div
        className={`filter-component ${
          showFilter ? "slideIn" : slideOut > 0 ? "slideOut" : "hidden-filter"
        }`}
      >
        <h2>Filter</h2>
        <h3>Location:</h3>
        <div className="filter-container">
          <button
            className={`filter-button ${
              appliedFilters.Zentrum_ETH ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Zentrum_ETH")}
          >
            Zentrum (ETH)
          </button>
          <button
            className={`filter-button ${
              appliedFilters.Zentrum_UZH ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Zentrum_UZH")}
          >
            Zentrum (UZH)
          </button>
          <button
            className={`filter-button ${
              appliedFilters.Irchel ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Irchel")}
          >
            Irchel
          </button>
          <button
            className={`filter-button ${appliedFilters.Höngg ? "applied" : ""}`}
            onClick={() => toggleFilter("Höngg")}
          >
            Höngg
          </button>
          <button
            className={`filter-button ${
              appliedFilters.Oerlikon ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Oerlikon")}
          >
            Oerlikon
          </button>
        </div>
        <h3>Other:</h3>
        <div className="filter-container">
          <button
            className={`filter-button ${
              appliedFilters.Currently_Open ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Currently_Open")}
          >
            Currently Open
          </button>
          <button
            className={`filter-button ${
              appliedFilters.Favorite ? "applied" : ""
            }`}
            onClick={() => toggleFilter("Favorites")}
          >
            Favourite Mensas
          </button>
        </div>
      </div>
    </>
  );
}

export default Filter;
