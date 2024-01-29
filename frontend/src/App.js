import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navigation from "./routes/Navigation/navigation.component";
import Posts from "./routes/Posts/posts.component";
import Home from "./routes/Home/home.component";
import Chat from "./routes/Chat/chat.component";
import Authentication from "./routes/Authentication/authentication.component";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Authentication />} />
        <Route path="posts" element={<Posts />} />
        <Route path="chats" element={<Chat />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Route>
    </Routes>
  );
};

export default App;
