import express from "express";
import routes from "./routes/index";
import bodyParser from "body-parser";
import { Client } from "pg";
const connectionString =
  "postgresql://postgres:a3La4Va2a5@127.0.0.1:5432/parcel";

const app = express();
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(express.static(__dirname + "/front"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
  connectionString: connectionString
});

global.client = client;

client
  .connect()
  .then(() => {
    console.log("database connected!");

    client.query(
      `CREATE TABLE IF NOT EXISTS users(
    id serial PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    phone_no VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    role VARCHAR DEFAULT 'member'
   )`,
      (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("users table created");
          client.query(
            `CREATE TABLE IF NOT EXISTS parcels(
        id serial PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        pickup_location VARCHAR NOT NULL,
        destination VARCHAR NOT NULL, 
        recipient_name VARCHAR NOT NULL,
        recipient_phone_no VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'in transit'
       )`,
            (err, res) => {
              if (err) {
                console.log(err);
              } else {
                console.log("parcels table created successfully");
              }
            }
          );
        }
      }
    );
  })
  .catch(err => {
    console.log("error connecting to Database", err);
  });

app.use("/api/v1", routes);

app.all("*", (req, res) => {
  res.send("endpoint does not exist!");
});

app.listen(8080, () => {
  console.log("running on port 8080");
});

//for unit testing
export default app;
