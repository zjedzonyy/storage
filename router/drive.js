const expresss = require("express");
const auth = require("../controllers/authControllers");
const db = require("../db/queries");
const driveControllers = require("../controllers/driveControllers");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });

const router = expresss.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", auth.isAuthenticate, driveControllers.showUsersDrive);
router.post("/", auth.isAuthenticate, driveControllers.addFolder);

router.post("/delete", auth.isAuthenticate, driveControllers.deleteFolder);
router.post("/update", auth.isAuthenticate, driveControllers.updateFolder);
router.get(
  "/upload:folder",
  auth.isAuthenticate,
  driveControllers.getUploadForm
);

router.post(
  "/upload:folder",
  auth.isAuthenticate,
  upload.single("file"),
  driveControllers.postUploadForm
);
module.exports = router;
