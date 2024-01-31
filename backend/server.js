const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const auth = require("./middleware/is-auth");
const { graphql } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema");
const graphResolver = require("./graphql/resolvers");

const app = express();
dotenv.config();
connectDB();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); //* represents that all the domains are allowed to access our server
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT,PATCH"); //by setting this we allow these origins to use specific methods
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  ); //headers that client can set on their requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  } //browser first sends an OPTIONS request before post,patch,delete,put..etc. requests
  //graphql declines anything  which is not a post or get request so the options request is declined
  next();
});

app.use(express.json());
app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphResolver,
    graphiql: true,
  })
);

// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/chat", chatRoutes);
// app.use("/api/message", messageRoutes);

const PORT = process.env.PORT;

app.listen(PORT, console.log(`Server started at PORT ${PORT}`));
