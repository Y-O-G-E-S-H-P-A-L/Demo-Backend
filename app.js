const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
app.use(express.json());
app.use(cookieParser());

// Routers imports here
const userRoute = require("./routes/userRoutes");

app.use("/user", userRoute);

module.exports = app;
