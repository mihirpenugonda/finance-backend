const mongoose = require("mongoose");

let DB_URI =
  "mongodb+srv://admin:admin@cluster0.bnxlf.mongodb.net/finance?retryWrites=true&w=majority";

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    });
};
