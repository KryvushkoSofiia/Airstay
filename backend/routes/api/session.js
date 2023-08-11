// backend/routes/api/session.js
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

// backend/routes/api/session.js
// ...
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
// ...

const router = express.Router();

<<<<<<< HEAD
// backend/routes/api/session.js
// ...
=======
<<<<<<< HEAD
// backend/routes/api/session.js
// ...
=======
router.use(restoreUser);
>>>>>>> 73aff261035d0a369628ec78e6803747970fc554
>>>>>>> dev

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> dev
// backend/routes/api/session.js
// ...

// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;
<<<<<<< HEAD
=======
=======

router.post(
  '/', validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;
>>>>>>> 73aff261035d0a369628ec78e6803747970fc554
>>>>>>> dev

  const user = await User.unscoped().findOne({
    where: {
      [Op.or]: {
        username: credential,
        email: credential,
      },
    },
  });

  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = { credential: "The provided credentials were invalid." };
    return next(err);
  }

  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

// backend/routes/api/session.js
// ...

// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

// ...

// backend/routes/api/session.js
// ...

// Restore session user
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    return res.json({
      user: safeUser,

    });
<<<<<<< HEAD
  }});
  
=======

  }
}
);

// Restore session user

router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);
>>>>>>> dev

// Restore session user

router.get(
  '/',
  (req, res) => {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser
      });
    } else return res.json({ user: null });
  }
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// ...

// backend/routes/api/session.js
// ...

module.exports = router;
