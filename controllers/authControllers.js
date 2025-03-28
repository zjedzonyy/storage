export async function isAuthenticate(req, res, next) {
  if (req.user) {
    console.log("You are allowed to enter this route");
    return next();
  }

  return res.status(401).json({
    error: "You have to log in to get access",
  });
}

export async function checkPermissions(req, role) {
  if (req.user.role !== role) {
    return true;
  }

  return false;
}
