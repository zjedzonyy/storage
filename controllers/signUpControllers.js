const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

// Specific error messages for email validation
const emailErr = {
  required: "Email is required.",
  invalid: "Please provide a valid email address.",
  length: "Email must be between 5 and 100 characters.",
};

// Email validation middleware
const validationEmail = [
  body("email")
    .trim() // Remove whitespace from both ends
    .notEmpty()
    .withMessage(emailErr.required)
    .isEmail()
    .withMessage(emailErr.invalid)
    .isLength({ min: 5, max: 100 })
    .withMessage(emailErr.length)
    // Optional: Additional custom validation
    .normalizeEmail({
      gmail_remove_dots: false, // Preserve email dots for Gmail
      gmail_remove_subaddress: false, // Preserve Gmail subaddresses
    }),
];

async function registerUser(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("nie pyklo");
    return res.status(400).render("sign-up", {
      errors: errors.array(),
      title: "Sign Up Invalid",
      formData: req.body,
    });
  }

  try {
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password, 10);
    const newUser = await db.addUser(email, password);
    res.status(201).redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function verifyLogIn(req, res, next) {
  try {
    const email = req.body.email;
    const givenPassword = req.body.password;
    const validPassword = await db.getPassword(email);
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  registerUser,
  validationEmail,
};
