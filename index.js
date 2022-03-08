const express = require("express");
const app = require("./app");
const dotenv = require("dotenv");
const { connectDatabase } = require("./config/database");

const port = process.env.PORT || "5000";

app.listen(port, () => {
  console.log(`Server is working on http://localhost:${port}`);
});

connectDatabase();
