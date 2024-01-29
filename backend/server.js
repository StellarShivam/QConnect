const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
dotenv.config();
connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //* represents that all the domains are allowed to access our server
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT,PATCH"); //by setting this we allow these origins to use specific methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); //headers that client can set on their requests
  next();
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started at PORT ${PORT}`));
