import React from "react";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";

const Posts = () => {
  return (
    <Fragment>
      <div>Posts</div>
      <Outlet />
    </Fragment>
  );
};

export default Posts;
