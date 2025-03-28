const expresss = require("express");
const auth = require("../controllers/authControllers");
const db = require("../db/queries");

const router = expresss.Router();

router.get("/", auth.isAuthenticate, async (req, res) => {
  const folders = await db.getUsersFolders(req.user.id);

  res.render("drive", { title: "Drive", user: req.user, folders });
});

module.exports = router;
