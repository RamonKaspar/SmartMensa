import Layout from "../Layout";
import Header from "../Header";
import FavMenusBody from "./FavMenusBody";
import Settings from "../Settings";

function FavMenus({
  showFilter,
  setShowFilter,
  showSettings,
  setShowSettings,
  appliedSettings,
  setAppliedSettings,
}: any) {
  return (
    <>
      <Layout>
        <Header
          onFilterClick={() => setShowFilter(!showFilter)}
          onSettingsClick={() => setShowSettings(!showSettings)}
        />
        <FavMenusBody
          appliedSettings={appliedSettings}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
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

export default FavMenus;
