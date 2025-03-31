const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const path = require("node:path");
const signUpControllers = require("./controllers/signUpControllers");
const passport = require("passport");
const db = require("./db/queries");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const driveRouter = require("./router/drive");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

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
//MUST HAVE AFTER SESSION DECLARATION!
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getPassword(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password!" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

//DRIVE ROUTES
app.use("/drive", driveRouter);

app.get("/", (req, res) => {
  res.render("index", { title: "Home", user: req.user });
});

app.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

app.get("/sign-up", (req, res) => {
  res.render("sign-up", { title: "Sign Up" });
});

app.post(
  "/sign-up",
  signUpControllers.validationEmail,
  signUpControllers.registerUser
);

app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen("3000", () =>
  console.log("Server started listening at port 3000...")
);
