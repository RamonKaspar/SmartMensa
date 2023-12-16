import Layout from "../Layout";
import Header from "../Header";
import MensaBody from "./MensaBody";
import Settings from "../Settings";

function Mensa({
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
        <MensaBody
          appliedSettings={appliedSettings}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
        <div>
          <Settings
            appliedSettings={appliedSettings}
            setAppliedSettings={setAppliedSettings}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
          />
        </div>
      </Layout>
    </>
  );
}

export default Mensa;
