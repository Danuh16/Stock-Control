const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const mongoose = require("mongoose");
require("dotenv/config");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*", // Replace with allowed origin
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/", router);

mongoose.set("strictQuery", true);

const mongoURI = process.env.MONGODB_URI;

// Connect to MongoDB using Mongoose
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with an error code
  });

const host = process.env.HOST || "localhost";
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port http://${host}:${port}`);
});
