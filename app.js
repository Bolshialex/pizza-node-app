//Import Express
import express from "express";
import colors from "colors";
import mariadb from "mariadb";
import { validateForm } from "./services/validation.js";
//require("dotenv").config();

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "123123",
  database: "pizza",
});

async function connect() {
  try {
    const conn = await pool.getConnection();
    console.log("Connected to the Database".bgGreen);
    return conn;
  } catch (error) {
    console.log(error, "Failed to connect to the database");
  }
}

//Instantiate an Express application
const app = express();

//Serve static files from the 'public' directory
app.use(express.static("public"));

//Middleware to parse for data
app.use(express.urlencoded({ extended: true }));

//Set the view engine for app.js
app.set("view engine", "ejs");

//Define a port number for our server to listen on
const PORT = 3000;

//Define a "default" route for our home page
app.get("/", (req, res) => {
  // Send our home page as a response to the client
  res.render(`home`);
});

app.get("/admin", async (req, res) => {
  const conn = await connect();

  const pizzaOrders = await conn.query("SELECT * FROM orders");

  console.log(pizzaOrders);

  res.render(`admin`, { pizzaOrders });
});

//Define a "thank you" route
app.post("/thankyou", async (req, res) => {
  try {
    // Send our thank you page
    const orders = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      method: req.body.method,
      toppings: req.body.toppings,
      size: req.body.size,
    };

    const result = validateForm(orders);
    if (!result.isValid) {
      console.log(result.errors);
      res.send(result.errors);
      return;
    }
    const conn = await connect();

    if (orders.toppings) {
      if (Array.isArray(orders.toppings)) {
        orders.toppings = orders.toppings.join(",");
      }
    } else {
      orders.toppings = "";
    }

    const pizzaPost = await conn.query(
      `INSERT INTO orders (firstName, lastName, email, method, toppings, size) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orders.fname,
        orders.lname,
        orders.email,
        orders.method,
        orders.toppings,
        orders.size,
      ]
    );
    res.render(`thankyou`, { orders: orders });
  } catch (error) {
    console.log(error, "Error in insert");
  }
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`.bgMagenta);
});
