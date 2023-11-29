import React from "react";

const Layout = (props: { children: React.ReactNode }) => {
  return (
    <>
      <div id="main-container">{props.children}</div>
    </>
  );
};

export default Layout;
