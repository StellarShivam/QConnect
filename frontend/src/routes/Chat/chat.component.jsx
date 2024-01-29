import React from "react";
import { Fragment } from "react";
import { Outlet } from "react-router-dom";
const Chat = () => {
  return (
    <Fragment>
      <Outlet />
      <div>Chats</div>
    </Fragment>
  );
};

export default Chat;
