import { shorturlModel } from "../Model/shorturlModel.js";
import isAuthenticated from "../Authentication/Auth.js";
import express from "express";
import { nanoid } from "nanoid";
import { userModel } from "../Model/userModel.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/shorten", isAuthenticated, async (req, res) => {
  try {
    const { longurl, userid } = req.body;
    const userIdObj = new mongoose.Types.ObjectId(userid);
    const find_User = await userModel.findById(userIdObj);
    if (!find_User) {
      return res.status(400).json({ message: "User Not Found" });
    }
    const shortidCode = nanoid(5);
    const new_url = await shorturlModel({
      shorturl: `https://shorturl-backend-9cv8.onrender.com/${shortidCode}`,
      longurl,
      shortCode: shortidCode,
      userid,
      count: 0,
    });
    await new_url.save();
    res.status(200).json({ message: "Url Saved" });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/user/:userid", isAuthenticated, async (req, res) => {
  try {
    const { userid } = req.params;
    const data = await shorturlModel.find({ userid });
    res.json({ data });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/dashboard/:userid", isAuthenticated, async (req, res) => {
  try {
    const { userid } = req.params;
    const data = await shorturlModel.find({ userid });
    const userIdObj = new mongoose.Types.ObjectId(userid);
    const user = await userModel.findById(userIdObj);
    function gettotalclicks(shorturldata) {
      let total_clicks = 0;
      shorturldata.forEach((element) => {
        total_clicks += element.count;
      });
      return total_clicks;
    }
    const totalClicks = gettotalclicks(data);
    res
      .status(200)
      .json({
        totalClicks,
        totalurls: data.length,
        firstName: user.firstName,
        lastName: user.lastName,
      });
  } catch (error) {
    console.log(error.message);
  }
});

router.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;
    const result = await shorturlModel.findOne({ shortCode });
    await shorturlModel.findOneAndUpdate({ shortCode }, { $inc: { count: 1 } });
    res.redirect(result.longurl);
  } catch (error) {
    console.log(error.message);
  }
});

export { router as shorturlRouter };
