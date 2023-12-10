import Layout from "../Layout";
import Header from "../Header";
import HomeBody from "./HomeBody";
import { useEffect, useState } from "react";
import Filter from "./Filter";

function Home() {
  const [showFilter, setShowFilter] = useState(false);

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

  /* Save to local storage */
  useEffect(() => {
    localStorage.setItem("appliedFilters", JSON.stringify(appliedFilters));
  }, [appliedFilters]);

  return (
    <>
      <Layout>
        <Header onFilterClick={() => setShowFilter(!showFilter)} />
        <HomeBody
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          appliedFilters={appliedFilters}
        />
        <div>
          {showFilter && (
            <Filter
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
            />
          )}
        </div>
      </Layout>
    </>
  );
}

export default Home;
