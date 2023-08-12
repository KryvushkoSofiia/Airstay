"use strict";

const express = require("express");
const router = express.Router();
const { Review, ReviewImage, User, Spot, SpotImage } = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");

const validateReview = [
  check("review")
    .exists({ checkFalsy: true })
    .withMessage("Review text is required"),
  check("stars")
    .isInt({ min: 1, max: 5 })
    .withMessage("Stars must be an integer from 1 to 5"),
  handleValidationErrors,
];

// Get all Reviews of the Current User
router.get("/current", requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  const reviews = await Review.findAll({
    where: {
      userId: user.id,
    },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            attributes: ["url", "preview"],
          },
        ],
        attributes: [
          "id",
          "ownerId",
          "address",
          "city",
          "state",
          "country",
          "lat",
          "lng",
          "name",
          "price",
        ],
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  const reviewsList = [];

  for (let i = 0; i < reviews.length; i++) {
    const reviewData = reviews[i].toJSON();

    reviewData.Spot.previewImage = "no preview image found";
    for (let j = 0; j < reviewData.Spot.SpotImages.length; j++) {
      if (reviewData.Spot.SpotImages[j].preview === true) {
        reviewData.Spot.previewImage = reviewData.Spot.SpotImages[j].url;
        break;
      }
    }

    delete reviewData.Spot.SpotImages;
    reviewsList.push(reviewData);
  }

  res.json({ Reviews: reviewsList });
});



router.post("/:reviewId/images", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  const user = await User.findByPk(req.user.id);

  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Review must belong to the current user",
    });
  }

  const { url, preview } = req.body;

  const reviewImage = await ReviewImage.create({
    reviewId: req.params.reviewId,
    url,
    preview,
  });

  res.json({
    id: reviewImage.id,
    url: reviewImage.url,
    preview: reviewImage.preview,
  });
});




// Edit a Review
router.put("/:reviewId", requireAuth, validateReview, async (req, res) => {
  const currentReview = await Review.findByPk(req.params.reviewId);
  const user = await User.findByPk(req.user.id);

  if (!currentReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }

  if (currentReview.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Review must belong to the current user",
    });
  }

  const { review, stars } = req.body;

  await currentReview.update({
    review,
    stars,
  });

  res.json(currentReview);
});


router.delete("/:reviewId", requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  const user = await User.findByPk(req.user.id);

  if (!review) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }

  if (review.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Review must belong to the current user",
    });
  }

  await review.destroy();

  res.json({ message: "Successfully deleted" });
});


module.exports = router;
