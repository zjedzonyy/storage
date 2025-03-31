const db = require("../db/queries");

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

    console.log(folderId);
    console.log(folder);
    console.log(files);

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
    console.log("uruchamiam kontroler");
    console.log(req.body.parentId);
    const parentId = req.body.parentId;
    const folder = await db.getFolderById(parentId);
    console.log(folder);
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
