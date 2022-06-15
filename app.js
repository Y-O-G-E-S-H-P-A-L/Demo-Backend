const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routers imports here
const userRoute = require("./routes/userRoutes");

app.use("/user", userRoute);

module.exports = app;
