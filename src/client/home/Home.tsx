import Layout from "../Layout";
import Header from "../Header";
import HomeBody from "./HomeBody";
import { useState } from "react";

function Home() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <>
      <Layout>
        <Header onFilterClick={() => setShowFilter(!showFilter)} />
        <HomeBody showFilter={showFilter} />
      </Layout>
    </>
  );
}

export default Home;
