const express = require("express");
const router = express.Router();

const { User, Booking, Spot, SpotImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");




router.get("/current", requireAuth, async (req, res) => {
  const user = await User.findByPk(req.user.id);

  const bookings = await Booking.findAll({
    where: {
      userId: user.id,
    },
    include: [
      {
        model: Spot,
        include: [
          {
            model: SpotImage,
            attributes: ["url", "preview"],
          },
        ],
        attributes: ["id", "ownerId", "address", "city", "state", "country", "lat", "lng", "name", "price"],
      },
    ],
  });

  const bookingsList = [];

  for (let i = 0; i < bookings.length; i++) {
    const bookingData = bookings[i].toJSON();

    bookingData.Spot.previewImage = "no preview image found";
    for (let j = 0; j < bookingData.Spot.SpotImages.length; j++) {
      if (bookingData.Spot.SpotImages[j].preview === true) {
        bookingData.Spot.previewImage = bookingData.Spot.SpotImages[j].url;
        break;
      }
    }

    delete bookingData.Spot.SpotImages;
    bookingsList.push(bookingData);
  }

  res.json({ Bookings: bookingsList });
});




// Delete a Booking
router.delete("/:bookingId", requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  const userId = req.user.id;

  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found",
    });
  }

  const spot = await Spot.findOne({
    where: {
      ownerId: userId,
    },
  });

  if (booking.userId === userId || (spot && spot.ownerId === userId)) {
    const currentDate = new Date();
    const newStartDate = new Date(booking.startDate);
    const newEndDate = new Date(booking.endDate);

    if (currentDate > newStartDate && currentDate < newEndDate) {
      res.status(403);
      return res.json({
        message: "Bookings that have been started can't be deleted",
      });
    }

    await booking.destroy();
  } else {
    res.status(403);
    return res.json({
      message:
        "Booking must belong to the current user or the Spot must belong to the current user",
    });
  }

  res.json({ message: "Successfully deleted" });
});





//Edit

router.put("/:bookingId", requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);
  const user = await User.findByPk(req.user.id);
  const { startDate, endDate } = req.body;

  const newStartDate = new Date(startDate);
  const newEndDate = new Date(endDate);
  const currentDate = new Date();

  if (newEndDate <= newStartDate) {
    res.status(400);
    return res.json({
      message: "Bad Request",
      errors: { endDate: "endDate cannot be on or before startDate" },
    });
  }

  if (!booking) {
    res.status(404);
    return res.json({
      message: "Booking couldn't be found",
    });
  }

  if (booking.userId !== user.id) {
    res.status(403);
    return res.json({
      message: "Booking must belong to the current user",
    });
  }

  if (booking.endDate < currentDate) {
    res.status(403);
    return res.json({ message: "Past bookings can't be modified" });
  }

  const conflictingBooking = await Booking.findOne({
    where: {
      id: { [Op.not]: booking.id },
      spotId: booking.spotId,
      [Op.or]: [
        { startDate: { [Op.between]: [newStartDate, newEndDate] } },
        { endDate: { [Op.between]: [newStartDate, newEndDate] } },
      ],
    },
  });

  if (conflictingBooking) {
    res.status(403);
    return res.json({
      message: "Spot is already booked for the specified dates",
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking",
      },
    });
  }

  await booking.update({
    startDate,
    endDate,
  });

  res.json(booking);
});



module.exports = router;
