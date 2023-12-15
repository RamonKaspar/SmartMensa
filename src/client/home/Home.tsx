import Layout from "../Layout";
import Header from "../Header";
import HomeBody from "./HomeBody";
import Filter from "./Filter";
import Settings from "../Settings";

function Home({
  appliedSettings,
  setAppliedSettings,
  appliedFilters,
  setAppliedFilters,
  showFilter,
  setShowFilter,
  showSettings,
  setShowSettings,
}: any) {
  return (
    <>
      <Layout>
        <Header
          onFilterClick={() => setShowFilter(!showFilter)}
          onSettingsClick={() => setShowSettings(!showSettings)}
        />
        <HomeBody
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          appliedFilters={appliedFilters}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
          appliedSettings={appliedSettings}
          setAppliedSettings={setAppliedSettings}
        />
        <div>
          {showFilter && (
            <Filter
              appliedFilters={appliedFilters}
              setAppliedFilters={setAppliedFilters}
            />
          )}
        </div>
        <div>
          {showSettings && (
            <Settings
              appliedSettings={appliedSettings}
              setAppliedSettings={setAppliedSettings}
            />
          )}
        </div>
      </Layout>
    </>
  );
}

export default Home;
