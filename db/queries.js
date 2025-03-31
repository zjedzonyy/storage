const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addUser(email, password) {
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });

  const rootFolder = await prisma.folder.create({
    data: {
      name: email,
      userId: newUser.id,
    },
  });

  return newUser;
}

async function getPassword(email) {
  const user = await prisma.user.findFirst({
    where: { email: email },
  });

  return user;
}

async function getUserById(id) {
  const user = await prisma.user.findFirst({
    where: { id: id },
  });

  return user;
}

// ALLOW USER TO CREATE FOLDER
async function createFolder(parentId, userId) {
  const folder = await prisma.folder.create({
    data: {
      name: "New Folder",
      parentId: parentId,
      userId: userId,
    },
  });

  return folder;
}

async function getUsersRootFolder(id, email) {
  const folders = await prisma.folder.findMany({
    where: { userId: id, name: email },
  });

  return folders;
}

async function getFolderById(id) {
  const folder = await prisma.folder.findFirst({
    where: { id: id },
  });

  return folder;
}

async function getSubfolder(parentId) {
  const subfolders = await prisma.folder.findMany({
    where: { parentId: parentId },
  });

  return subfolders;
}

async function getFiles(folderId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
    },
  });

  return files;
}

async function deleteFolder(id) {
  const folder = await prisma.folder.delete({
    where: {
      id: id,
    },
  });
}

async function updateFolder(id, name) {
  await prisma.folder.update({
    where: {
      id: id,
    },
    data: {
      name: name,
    },
  });
}

module.exports = {
  addUser,
  getPassword,
  getUserById,
  getUsersRootFolder,
  createFolder,
  getSubfolder,
  deleteFolder,
  updateFolder,
  getFolderById,
  getFiles,
};
