const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const path = require("node:path");
const signUpControllers = require("./controllers/signUpControllers");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up" });
});

app.post(
  "/sign-up",
  signUpControllers.validationEmail,
  signUpControllers.registerUser
);

app.listen("3000", () =>
  console.log("Server started listening at port 3000...")
);
