import React from "react";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";
const Home = () => {
  return (
    <Fragment>
      <Outlet />
      <div>Home</div>
    </Fragment>
  );
};

export default Home;
