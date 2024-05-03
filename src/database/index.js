import mongoose from "mongoose";

// Removed the configOptions object since it contains deprecated options
// mongodb+srv://scottwang1013:wangshihaoW7219@shihao.stvktna.mongodb.net/?retryWrites=true&w=majority&appName=Shihao

const dbConnections = {
  db1: "mongodb://localhost:27017/test",
  db2: "mongodb://localhost:27017/test1"
};

function hashIPToDB(ipAddress) {
  if(!ipAddress) {
    return dbConnections["db1"];
  }
  const hash = require('crypto').createHash('sha256').update(ipAddress).digest('hex');
  const hashValue = parseInt(hash.substring(0, 8), 16); // Use a portion of the hash to get an integer
  // Use modulo to decide the database index based on the number of databases
  const dbIndex = hashValue % Object.keys(dbConnections).length;
  return Object.values(dbConnections)[dbIndex];
}

export const connectToDBWithIP = async (ipAddress) => {
     //ipAddress = "192.123.12.123";
      ipAddress = "203.203.203.203"
  // Use the hash function to get the right database URL
  const connectionUrl = hashIPToDB(ipAddress);
  console.log("connection to url:", connectionUrl);
  mongoose
    .connect(connectionUrl)
    .then(() => console.log(`Connected successfully to database at ${connectionUrl}`))
    .catch((err) =>
      console.log(`Error connecting to DB at ${connectionUrl}: ${err.message}`)
    );
};

const connectToDB = async () => {
  //const connectionUrl = "mongodb+srv://scottwang1013:wangshihaoW7219@shihao.stvktna.mongodb.net/?retryWrites=true&w=majority&appName=Shihao"; // Ensure this is correctly set
  const connectionUrl = "mongodb://localhost:27017/test"; 

  mongoose
    .connect(connectionUrl) // Removed the second argument as the options were deprecated
    .then(() => console.log("Ecommerce database connected successfully!"))
    .catch((err) =>
      console.log(`Getting Error from DB connection ${err.message}`)
    );
};

export default connectToDB;