const express = require("express");
const router = express.Router();
const menuItems = require("../models/Menu");
const MenuItem = require("../models/Menu");

router.post("/", async (req, res) => {
  try {
    const newMenu = new MenuItem(req.body);

    const response = await newMenu.save();
    //res.send(response)
    console.log("data saved");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal  server error" });
  }
});



router.get("/",async (req, res) => {
  try {
    const data = await MenuItem.find();
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal  server error" });
  }
});
router.get("/:testtype", async (req, res) => {
  try {
    const testtype = req.params.testtyp;
    if (testtype == "sweet" || testtype == "sour" || testtype == "spicy") {
      const response = await MenuItem.find({ taste:testtype });
      res.status(200).json(response);
    } else {
      res.status(400).json({ error: "invalid" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal  server error" });
  }
});
module.exports = router;
