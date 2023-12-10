import Layout from "../Layout";
import Header from "../Header";
import HomeBody from "./HomeBody";
import { useState } from "react";
import Filter from "./Filter";

function Home() {
  const [showFilter, setShowFilter] = useState(false);

  /* State for handling the applied filters */
  const [appliedFilters, setAppliedFilters] = useState({
    Zentrum_ETH: false,
    Zentrum_UZH: false,
    Irchel: false,
    Höngg: false,
    Oerlikon: false,
    Currently_Open: false,
    Favorites: false,
  });

  return (
    <>
      <Layout>
        <Header onFilterClick={() => setShowFilter(!showFilter)} />
        <HomeBody showFilter={showFilter} appliedFilters={appliedFilters} />
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
