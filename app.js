//Import Express
import express from "express";
import colors from "colors";

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

const pizzaOrders = [];

//Define a "default" route for our home page
app.get("/", (req, res) => {
  // Send our home page as a response to the client
  res.render(`home`);
});

app.get("/admin", (req, res) => {
  res.render(`admin`, { pizzaOrders });
});

//Define a "thank you" route
app.post("/thankyou", (req, res) => {
  // Send our thank you page
  const orders = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    method: req.body.method,
    toppings: req.body.toppings,
    size: req.body.size,
  };
  pizzaOrders.push(orders);
  res.render(`thankyou`, { orders: orders });
});

//Tell the server to listen on our specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`.bgYellow);
});
