const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

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

router.put(
  '/:bookingId',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const { bookingId } = req.params;
    const { startDate, endDate } = req.body;

    const bookingToEdit = await Booking.findOne({
      where: {
        userId: id
      }
    });

    if (!bookingToEdit) {
      res.status(404);
      const err = {
        message: "Booking couldn't be found",
        statusCode: 404
      };
      return res.json(err);
    }

    const startString = new Date(startDate).toDateString();
    const endString = new Date(endDate).toDateString();
    const start = new Date(startString).getTime();
    const end = new Date(endString).getTime();
    const presentString = new Date().toDateString();
    const present = new Date(presentString).getTime();
    if (end < start) {
      res.status(400);
      const err = {
        message: 'Validation Error',
        statusCode: 400,
        errors: {
          endDate: "endDate cannot come before startDate"
        }
      };
      return res.json(err);
    }
    if (end < present) {
      res.status(403);
      const err = {
        message: 'Past bookings cannot be modified',
        statusCode: 403
      };
      return res.json(err);
    }

    const allBookings = await Booking.findAll({ where: { id: bookingId, userId: { [Op.ne]: id } } });
    if (!allBookings) {
      bookingToEdit.startDate = new Date(startString);
      bookingToEdit.endDate = new Date(endString);
      await bookingToEdit.save();
      return res.json(bookingToEdit);
    } else {
      let bookings = [];
      const err = {
        message: "Sorry, this spot is already booked for the specified dates",
        statusCode: 403,
        errors: {}
      };
      allBookings.forEach(booking => {
        bookings.push(booking.toJSON());
      });
      for (let i = 0; i < bookings.length; i++) {
        const instanceStartString = new Date(bookings[i].startDate).toDateString();
        const instanceEndString = new Date(bookings[i].endDate).toDateString();
        const instanceStart = new Date(instanceStartString).getTime();
        const instanceEnd = new Date(instanceEndString).getTime();

        if (start < instanceStart && end < instanceEnd) {
          err.errors.endDate = 'End date conflicts with existing booking'
          res.status(403);
          return res.json(err);
        }
        if (start > instanceStart && end < instanceEnd) {
          err.errors.startDate = 'Start date conflicts with existing booking';
          err.errors.endDate = 'End date conflicts with existing booking';
          res.status(403);
          return res.json(err);
        }
        if (start > instanceStart && end > instanceEnd) {
          err.errors.startDate = 'Start date conflicts with existing booking';
          res.status(403);
          return res.json(err);
        }
      }
      bookingToEdit.startDate = new Date(startString);
      bookingToEdit.endDate = new Date(endString);
      await bookingToEdit.save();
      return res.json(bookingToEdit);
    }
  }
);

module.exports = router;
