const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes.js");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db/db.js");
const captainRoutes = require("./routes/captain.routes.js");
connectToDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRoutes);
app.use("/captains", captainRoutes);

app.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = app;
