const express = require("express");
const product = require("./router/product");
const user = require("./router/user");
const cart = require("./router/cart");
const payment = require("./router/payment");
const cookies = require("cookie-parser");
const order = require("./router/order");
const errorhandl = require("./middleware/error");
const LocaleStrategy = require("passport-local").Strategy;
const passport = require("passport");
const expresssession = require("express-session");
const { userAuthitcation } = require("./passportjs/user");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookies());
app.use(
  expresssession({
    secret: "mahesh rathod",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 600000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocaleStrategy(userAuthitcation));
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", cart);
app.use("/api/v1", order);
app.use("/api/v1", payment);
app.use(errorhandl);
module.exports = app;
