const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

// Config
dotenv.config({ path: "./config.env" });

// Connecting database
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Database Connected.`);
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is working on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.log({ err }));
