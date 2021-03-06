const express = require("express");
const app = require("./app");
const dotenv = require("dotenv");
const { connectDatabase } = require("./config/database");

dotenv.config({
  path: "./config/config.env",
});

app.listen(process.env.PORT || 3000, () => {
  console.log(
    `Server is working on http://localhost:${process.env.PORT || 3000}`
  );
});

connectDatabase();
