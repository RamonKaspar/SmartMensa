import Layout from "../Layout";
import Header from "../Header";
import MensaBody from "./MensaBody";

function Mensa() {
  return (
    <>
      <Layout>
        <Header onFilterClick={() => {}} />
        <MensaBody />
        {/* <Footer /> */} {/* Inserted in MensaBody.tsx */}
      </Layout>
    </>
  );
}

export default Mensa;
