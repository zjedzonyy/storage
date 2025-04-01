const expresss = require("express");
const auth = require("../controllers/authControllers");
const db = require("../db/queries");
const driveControllers = require("../controllers/driveControllers");
const multer = require("multer");
const supabase = require("../db/supabase");

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

router.get("/download/:filename", async (req, res, next) => {
  try {
    const filename = req.params.filename;

    const { data, error } = await supabase.supabase.storage
      .from("upload")
      .download(filename);

    if (error) throw error;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename.split("-").slice(1).join("-")}"`
    );
    res.setHeader("Content-Type", "application/octet-stream");

    res.send(data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
