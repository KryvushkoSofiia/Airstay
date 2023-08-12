const express = require("express");
const router = express.Router();

const { ReviewImage, Review } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");

router.delete("/:imageId", requireAuth, async (req, res) => {
    const image = await ReviewImage.findByPk(req.params.imageId);
    const userId = req.user.id;
  
    if (!image) {
      res.status(404);
      return res.json({
        message: "Review Image couldn't be found",
      });
    }
  
    const review = await Review.findOne({
      where: { id: image.reviewId, userId },
    });
  
    if (!review || review.userId !== userId) {
      res.status(403);
      return res.json({
        message: "Review must belong to the current user",
      });
    }
  
    await image.destroy();
  
    res.json({ message: "Successfully deleted" });
  });
  


module.exports = router;
