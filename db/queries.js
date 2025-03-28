const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addUser(email, password) {
  const newUser = await prisma.user.create({
    data: {
      email: email,
      password: password,
    },
  });

  return newUser;
}

module.exports = {
  addUser,
};
