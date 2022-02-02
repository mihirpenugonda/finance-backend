const express = require("express");

const errorMiddleware = require("./middleware/errorMiddleware");

const userRoutes = require("./routes/userRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const groupRoutes = require("./routes/groupRoutes");

const app = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/groups", groupRoutes);

app.use(errorMiddleware);
module.exports = app;
