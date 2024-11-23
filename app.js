const express = require("express");
const app = express();
const mongoose = require("mongoose");
const product = require("./models/product");
const path = require("path");
const ejsMate = require("ejs-mate");

const port = 8080;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/product");
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.get("/products", async (req, res) => {
    const allProducts = await product.find({});
    res.render("product/product", { allProducts }); 
});

app.get("/home", (req, res) => {
    res.render("product/home");
})


app.listen(port, () => {
  console.log("app is listening to the port 8080");
});
