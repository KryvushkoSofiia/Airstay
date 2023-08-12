const express = require("express");
const router = express.Router();

const { Spot, SpotImage, User, Review, Booking, ReviewImage} = require("../../db/models");
const { requireAuth } = require("../../utils/auth");
const { handleValidationErrors } = require("../../utils/validation");
const { check } = require("express-validator");
const { Op } = require("sequelize");

const validateSpot = [
  check("address").notEmpty().withMessage("Street address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("country").notEmpty().withMessage("Country is required"),
  check("state").notEmpty().withMessage("State is required"),
  check("lat").notEmpty().withMessage("Latitude is not valid"),
  check("lng").notEmpty().withMessage("Longitude is not valid"),
  check("name")
    .notEmpty().withMessage("Name must not be empty")
    .isLength({ max: 50 }).withMessage("Name must be less than 50 characters"),
  check("description").notEmpty().withMessage("Description is required"),
  check("price").notEmpty().withMessage("Price per day is required"),
  handleValidationErrors,
];

const validateNewReview = [
  check("stars")
    .notEmpty().withMessage("Stars must be provided")
    .isInt({ min: 1, max: 5 }).withMessage("Stars must be an integer from 1 to 5"),
  check("review").notEmpty().withMessage("Review text is required"),
  handleValidationErrors,
];



router.get("/", async (req, res) => {
  const spots = await Spot.findAll({
    include: [{ model: Review }, { model: SpotImage }],
  });

  const spotsList = [];

  for (let i = 0; i < spots.length; i++) {
    const spotData = spots[i].toJSON();

    spotData.previewImage = "no preview image found";
    for (let j = 0; j < spotData.SpotImages.length; j++) {
      if (spotData.SpotImages[j].preview === true) {
        spotData.previewImage = spotData.SpotImages[j].url;
        break;
      }
    }

    let sumStars = 0;
    let countReviews = 0;
    for (let j = 0; j < spotData.Reviews.length; j++) {
      sumStars += spotData.Reviews[j].stars;
      countReviews++;
    }
    spotData.avgRating = countReviews > 0 ? sumStars / countReviews : 0;

    delete spotData.SpotImages;
    delete spotData.Reviews;

    spotsList.push(spotData);
  }

  const listRes = { Spots: spotsList };
  res.json(listRes);
});

router.post("/", requireAuth, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;

  const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.status(201);
  return res.json(spot);
});



router.post("/:spotId/images", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = await User.findByPk(req.user.id);

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== user.id) {
    res.status(403);
    return res.json({
      message: "Spot must belong to the current user",
    });
  }

  const { url, preview } = req.body;

  const spotImage = await SpotImage.create({
    spotId: req.params.spotId,
    url,
    preview,
  });

  res.json({
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview,
  });
});



router.get("/current", requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  if (user) {
    const spots = await Spot.findAll({
      raw: true,
      where: {
        ownerId: user.id,
      },
    });

    for (const spot of spots) {
      const reviewInfo = await getReviewInfo(spot.id);
      const image = await getSpotImage(spot.id);

      spot.avgRating = reviewInfo.avgRating;
      spot.previewImage = image ? image.url : "none";
    }

    res.json({ Spots: spots });
  }
});

async function getReviewInfo(spotId) {
  const reviewCount = await Review.count({
    where: {
      spotId: spotId,
    },
  });

  const starSum = await Review.sum("stars", {
    where: {
      spotId: spotId,
    },
  });

  const avgRating = starSum !== null ? starSum / reviewCount : 0;

  return { avgRating };
}

async function getSpotImage(spotId) {
  return await SpotImage.findOne({
    raw: true,
    where: {
      spotId: spotId,
    },
  });
}

router.get("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId, {
    include: [
      { model: Review },
      { model: SpotImage, attributes: ["id", "url", "preview"] },
      { model: User, as: "Owner", attributes: ["id", "firstName", "lastName"] },
    ],
  });

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  const reviewCounter = spot.Reviews.length;
  const totalStars = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);

  spot.dataValues.numReviews = reviewCounter;
  spot.dataValues.avgRating = reviewCounter > 0 ? totalStars / reviewCounter : 0;

  delete spot.dataValues.Reviews;

  res.json(spot);
});


router.put("/:spotId", requireAuth, validateSpot, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const userId = req.user.id;

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== userId) {
    res.status(403);
    return res.json({
      message: "Spot must belong to the current user",
    });
  }

  const {
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  } = req.body;

  await spot.update({
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });

  res.json(spot);
});

// Create a Review for a Spot based on the Spot's id
router.post(
  "/:spotId/reviews",
  requireAuth,
  validateNewReview,
  async (req, res) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const { review, stars } = req.body;

    if (!spot) {
      res.status(404);
      return res.json({ message: "Spot couldn't be found" });
    }

    const reviewCheck = await Review.findOne({
      where: {
        userId: req.user.id,
        spotId: spot.id,
      },
    });

    if (reviewCheck) {
      res.status(500);
      return res.json({ message: "User already has a review for this spot" });
    }

    const newReview = await Review.create({
      userId: req.user.id,
      spotId: spot.id,
      review,
      stars,
    });

    res.status(201);
    res.json(newReview);
  }
);

router.get("/:spotId/reviews", async (req, res) => {
  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId, {
    include: [
      {
        model: Review,
        include: [
          {
            model: User,
            attributes: ["id", "firstName", "lastName"],
          },
          ReviewImage, // Automatically includes all attributes
        ],
      },
    ],
  });

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  const reviews = spot.Reviews.map((review) => ({
    id: review.id,
    userId: review.userId,
    spotId: review.spotId,
    review: review.review,
    stars: review.stars,
    createdAt: review.createdAt,
    updatedAt: review.updatedAt,
    User: {
      id: review.User.id,
      firstName: review.User.firstName,
      lastName: review.User.lastName,
    },
    ReviewImages: review.ReviewImages,
  }));

  res.status(200).json({ Reviews: reviews });
});






router.delete("/:spotId", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const userId = req.user.id;

  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  if (spot.ownerId !== userId) {
    res.status(403);
    return res.json({
      message: "Spot must belong to the current user",
    });
  }

  await spot.destroy();

  res.json({ message: "Spot successfully deleted" });
});






// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot) {
    res.status(404);
    return res.json({ message: "Spot couldn't be found" });
  }

  const bookingAttributes = user.id === spot.ownerId
    ? ["spotId", "startDate", "endDate"]
    : ["spotId", "startDate", "endDate"];

  const bookings = await Booking.findAll({
    where: {
      spotId: spot.id,
    },
    attributes: bookingAttributes,
    include: user.id === spot.ownerId
      ? [{ model: User, attributes: ["id", "firstName", "lastName"] }]
      : [],
  });

  res.json({ Bookings: bookings });
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  const user = await User.findByPk(req.user.id);
  const { startDate, endDate } = req.body;

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);

  if (newEndDate <= newStartDate) {
    res.status(400);
    return res.json({
      message: "Bad Request",
      errors: { endDate: "endDate cannot be on or before startDate" },
    });
  }

  if (!spot) {
    res.status(404);
    return res.json({ message: "Spot couldn't be found" });
  }

  if (user.id === spot.ownerId) {
    res.status(403);
    return res.json({ message: "Spot must NOT belong to the current user" });
  }

  const existingBooking = await Booking.findOne({
    where: {
      spotId: spot.id,
      [Op.or]: [
        { startDate: { [Op.between]: [newStartDate, newEndDate] } },
        { endDate: { [Op.between]: [newStartDate, newEndDate] } },
      ],
    },
  });

  if (existingBooking) {
    res.status(403);
    return res.json({
      message: "Sorry, this spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  const newBooking = await Booking.create({
    spotId: spot.id,
    userId: user.id,
    startDate,
    endDate,
  });

  res.json(newBooking);
});

module.exports = router;
