const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
// const { nanoid } = require("nanoid");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../../model");
const { authenticate, upload } = require("../../middlewares");
const { sendEmail } = require("../../helpers");
// const req = require("express/lib/request");

const { SITE_NAME } = process.env;

const router = express.Router();

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.get("/logout", authenticate, async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send();
});

router.get("/current", authenticate, async (req, res, next) => {
  const { name, email } = req.user;
  res.json({
    user: {
      name,
      email,
    },
  });
});

router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split(".").reverse();
    const newFileName = `${req.user._id}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);

    const updatedImage = await Jimp.read(tempUpload);
    updatedImage.resize(250, 250).write(tempUpload);

    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join("avatars", newFileName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  }
);

router.post("/verify", async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw new BadRequest("missing required field email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new NotFound("User not found");
    }
    if (user.verify) {
      throw new BadRequest("Verification has already been passed");
    }
    // const verificationToken = nanoid();
    // await User.findByIdAndUpdate(user._id, { verificationToken });
    const { verificationToken } = user;
    const data = {
      to: "email",
      subject: "Confirm your email",
      html: `<a target="_blank" href="${SITE_NAME}/users/verify/${verificationToken}"">Please confirm your email</a>`,
    };

    await sendEmail(data);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
});

router.get("/verify/verificationToken", async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
      throw new NotFound("User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
