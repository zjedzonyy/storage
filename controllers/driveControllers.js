const db = require("../db/queries");
const supabase = require("../db/supabase");

async function showUsersDrive(req, res, next) {
  try {
    const [rootFolder] = await db.getUsersRootFolder(
      req.user.id,
      req.user.email
    );
    await loadSubFolders(rootFolder);
    res.render("drive", {
      title: "Drive",
      user: req.user,
      folder: rootFolder,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function loadSubFolders(folder) {
  const subFolders = await db.getSubfolder(folder.id);
  folder.subFolders = subFolders;

  for (const subFolder of subFolders) {
    await loadSubFolders(subFolder);
  }
}

async function addFolder(req, res, next) {
  try {
    const parentId = req.body.parentId;
    const userId = req.body.userId;
    await db.createFolder(parentId, userId);

    res.redirect("drive");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const id = req.body.parentId;
    await db.deleteFolder(id);
    res.redirect("/drive");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function updateFolder(req, res, next) {
  try {
    const id = req.body.parentId;
    const name = req.body.name;
    await db.updateFolder(id, name);
    res.redirect("/drive");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getUploadForm(req, res, next) {
  try {
    const folderId = req.url.split(":")[1];
    const folder = await db.getFolderById(folderId);
    const files = await db.getFiles(folderId);

    res.render("upload", {
      title: "Upload",
      user: req.user,
      folderId,
      folder,
      files,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function postUploadForm(req, res, next) {
  try {
    const file = req.file;
    const filePath = `${Date.now()}-${file.originalname}`;
    console.log("taki file: ", file);
    const { datas, error } = await supabase.supabase.storage
      .from("upload")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    // ADD LINK TO A FILE IN LOCAL DB
    // TODO: SIZE && MIMETYPE
    const src = `${supabase.supabaseUrl}/storage/v1/object/public/upload/${filePath}`;
    const title = file.originalname;
    const localPath = filePath;
    const folderId = req.body.parentId;
    const userId = req.body.userId;
    const size = file.size;
    const mimetype = file.mimetype;

    await db.createFile(
      src,
      title,
      folderId,
      userId,
      size,
      mimetype,
      localPath
    );
    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  showUsersDrive,
  addFolder,
  deleteFolder,
  updateFolder,
  getUploadForm,
  postUploadForm,
};
