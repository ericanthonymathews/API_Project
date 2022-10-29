const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const allBookings = await Booking.findAll({
      where: {
        userId: 2
      },
      include: [
        {
          model: Spot,
          include: [
            {
              model: SpotImage,
              // where: {
              //   preview: true
              // },
              attributes: ['url', 'preview']
            },
          ],
        }
      ]
    });
    const arrayOfBookings = [];
    allBookings.forEach(booking => {
      arrayOfBookings.push(booking.toJSON());
    });
    for (let i = 0; i < arrayOfBookings.length; i++) {
      arrayOfBookings[i].Spot.preview = null;
      if (arrayOfBookings[i].Spot.SpotImages.length) {
        for (let j = 0; j < arrayOfBookings[i].Spot.SpotImages.length; j++) {
          if (arrayOfBookings[i].Spot.SpotImages[j].preview) {
            arrayOfBookings[i].Spot.preview = arrayOfBookings[i].Spot.SpotImages[j].url;
          }
        }
      }
      delete arrayOfBookings[i].Spot.SpotImages;

      // arrayOfBookings[i].Spot.preview = arrayOfBookings[i].Spot.SpotImages[0].url;
      // delete arrayOfBookings[i].Spot.SpotImages;
    }
    return res.json({ "Bookings": arrayOfBookings });
  }
);

module.exports = router;
