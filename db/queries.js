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

// CREATE ROOT FOLDER
async function createRootFolder(email, name) {
  const folder = await prisma.folder.create({
    data: {
      name: name,
      user: email,
    },
  });
}

// ALLOW USER TO CREATE FOLDER
async function createFolder(name, user) {}

async function getUsersFolders(id) {
  const folders = await prisma.folder.findMany({
    where: { userId: id },
  });

  return folders;
}

module.exports = {
  addUser,
  getPassword,
  getUserById,
  getUsersFolders,
};
