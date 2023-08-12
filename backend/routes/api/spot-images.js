const express = require("express");
const router = express.Router();

const { SpotImage, Spot } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

router.delete("/:imageId", requireAuth, async (req, res) => {
    const image = await SpotImage.findByPk(req.params.imageId);
    const userId = req.user.id;
  
    if (!image) {
      res.status(404);
      return res.json({
        message: "Spot Image couldn't be found",
      });
    }
  
    const spot = await Spot.findOne({
      where: { id: image.spotId, ownerId: userId },
    });
  
    if (!spot || spot.ownerId !== userId) {
      res.status(403);
      return res.json({
        message: "Spot must belong to the current user",
      });
    }
  
    await image.destroy();
  
    res.json({ message: "Successfully deleted" });
  });
  
  module.exports = router;
