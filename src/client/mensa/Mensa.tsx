import Layout from "../Layout";
import Header from "../Header";
import MensaBody from "./MensaBody";

function Mensa() {
  return (
    <>
      <Layout>
        <Header onFilterClick={() => {}} />
        <MensaBody />
      </Layout>
    </>
  );
}

export default Mensa;
