const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Booking, Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");
const validateEdit = [
  check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('City is required'),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage('State is required'),
  check('country')
    .exists({ checkFalsy: true })
    .withMessage('Country is required'),
  check('lat')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Latitude is not valid'),
  check('lng')
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Longitude is not valid'),
  check('name')
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .exists({ checkFalsy: true })
    .withMessage('Description is required'),
  check('price')
    .exists({ checkFalsy: true })
    .withMessage('Price per day is required'),
  handleValidationErrors
];
const validateNewReview = [
  check('review')
    .exists({ checkFalsy: true })
    .withMessage('Review text is required'),
  check('stars')
    .exists({ checkFalsy: true })
    .isInt({ min: 1, max: 5 })
    .withMessage('Stars must be an integer between 1 and 5'),
  handleValidationErrors
];
const validateQuery = [
  check('page')
    .optional()
    .exists({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Page must be greater than or equal to 1'),
  check('size')
    .optional()
    .exists({ checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Size must be greater than or equal to 1'),
  check('minLat')
    .optional()
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Minimum latitude is invalid'),
  check('maxLat')
    .optional()
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Maximum latitude is invalid'),
  check('minLng')
    .optional()
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Minimum longitude is invalid'),
  check('maxLng')
    .optional()
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Maximum longitude is invalid'),
  check('maxPrice')
    .optional()
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Maximum price must be greater than or equal to 0'),
  check('minPrice')
    .optional()
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage('Minimum price must be greater than or equal to 0'),
  handleValidationErrors
];

router.get(
  '/',
  validateQuery,
  async (req, res) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
    let noPageOrSizeSpecified = false;
    if (!page && !size) noPageOrSizeSpecified = true;
    if (!page) page = 1;
    if (!size) size = 20;

    const whereObject = {};

    if (minLat && maxLat) {
      whereObject.lat = {
        [Op.between]: [minLat, maxLat]
      };
    } else if (minLat && !maxLat) {
      whereObject.lat = {
        [Op.gte]: minLat
      };
    } else if (!minLat && maxLat) {
      whereObject.lat = {
        [Op.lte]: maxLat
      };
    }

    if (minLng && maxLng) {
      whereObject.lng = {
        [Op.between]: [minLng, maxLng]
      };
    } else if (minLng && !maxLng) {
      whereObject.lng = {
        [Op.gte]: minLng
      };
    } else if (!minLng && maxLng) {
      whereObject.lng = {
        [Op.lte]: maxLng
      };
    }

    if (minPrice && maxPrice) {
      whereObject.price = {
        [Op.between]: [minPrice, maxPrice]
      };
    } else if (minPrice && !maxPrice) {
      whereObject.price = {
        [Op.gte]: minPrice
      };
    } else if (!minPrice && maxPrice) {
      whereObject.price = {
        [Op.lte]: maxPrice
      };
    }

    const findAllObject = {
      limit: size,
      offset: size * (page - 1),
      where: { ...whereObject },
      include: [
        {
          model: SpotImage
        },
        {
          model: Review
        }
      ]
    };

    const spots = await Spot.findAll(findAllObject);

    let allSpots = [];

    spots.forEach(spot => {
      allSpots.push(spot.toJSON());
    });
    allSpots.forEach(spot => {
      let numberOfReviews = 0;
      let totalStars = 0;
      spot.Reviews.forEach(review => {
        numberOfReviews++;
        totalStars += review.stars;
      });
      if (totalStars) {
        spot.avgRating = numberOfReviews / totalStars;
      } else {
        spot.avgRating = 'N/A';
      }
      delete spot.Reviews;
    });
    allSpots.forEach(spot => {
      spot.SpotImages.forEach(image => {
        if (image.preview === true) {
          spot.previewImage = image.url;
        }
      });
      if (!spot.previewImage) {
        spot.previewImage = 'no preview image found'
      }
      delete spot.SpotImages;
    });
    const results = {
      'Spots': allSpots
    };
    if (!noPageOrSizeSpecified) {
      results.page = page;
      results.size = size;
    }
    res.json(results);
  }
);

router.post(
  '/',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    } = req.body;
    const currentUser = await User.findByPk(id);
    const newSpot = await currentUser.createSpot({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    });
    res.status(201);
    res.json(newSpot);
  }
);
router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const spots = await Spot.findAll({
      where: { ownerId: id },
      include: [
        {
          model: SpotImage
        },
        {
          model: Review
        }
      ]
    });

    let allSpots = [];

    spots.forEach(spot => {
      allSpots.push(spot.toJSON());
    });
    allSpots.forEach(spot => {
      let numberOfReviews = 0;
      let totalStars = 0;
      spot.Reviews.forEach(review => {
        numberOfReviews++;
        totalStars += review.stars;
      });
      if (numberOfReviews) {
        spot.avgRating = numberOfReviews / totalStars;
      } else {
        spot.avgRating = 'N/A';
      }
      delete spot.Reviews;
    });
    allSpots.forEach(spot => {
      spot.SpotImages.forEach(image => {
        if (image.preview === true) {
          spot.previewImage = image.url;
        }
      });
      if (!spot.previewImage) {
        spot.previewImage = 'no preview image found'
      }
      delete spot.SpotImages;
    });
    res.json({ 'Spots': allSpots });
  }
);
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  const spotInfo = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage
      },
      {
        model: Review
      },
      {
        model: User
      }
    ]
  });
  if (!spotInfo) {
    let results = {};
    results.message = 'Spot couldn\'t be found';
    results.statusCode = 404;
    res.status(404);
    return res.json(results);
  }
  let spot = spotInfo.toJSON();

  let numberOfReviews = 0;
  let totalStars = 0;
  spot.Reviews.forEach(review => {
    numberOfReviews++;
    totalStars += review.stars;
  });
  if (numberOfReviews) {
    spot.avgRating = numberOfReviews / totalStars;
    spot.numReviews = numberOfReviews;
  } else {
    spot.avgRating = 'N/A';
    spot.numReviews = numberOfReviews;
  }
  delete spot.Reviews;
  spot.SpotImages.forEach(spotImage => {
    delete spotImage.spotId;
    delete spotImage.createdAt;
    delete spotImage.updatedAt;
  });
  const ownerInstance = await User.scope('currentUser').findByPk(spot.User.id);
  const owner = ownerInstance.toJSON();
  spot.Owner = {};
  spot.Owner.id = owner.id;
  spot.Owner.firstName = owner.firstName;
  spot.Owner.lastName = owner.lastName;
  delete spot.User;



  return res.json(spot);
});

router.put(
  '/:spotId',
  [
    requireAuth,
    validateEdit
  ],
  async (req, res) => {
    const { id } = req.user;
    const { spotId } = req.params;
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    const currentSpot = await Spot.findByPk(spotId);

    if (!currentSpot) {
      res.status(404);
      const err = {
        message: 'Spot couldn\'t be found',
        statusCode: 404
      }
      return res.json(err);
    }
    const spot = currentSpot.toJSON();
    if (Number(id) === Number(spot.ownerId)) {
      currentSpot.address = address;
      currentSpot.city = city;
      currentSpot.state = state;
      currentSpot.country = country;
      currentSpot.lat = lat;
      currentSpot.lng = lng;
      currentSpot.name = name;
      currentSpot.description = description;
      currentSpot.price = price;

      const result = await currentSpot.save();
      res.status(200);
      return res.json(result);
    }

  }
)

router.delete(
  '/:spotId',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const { spotId } = req.params;
    const spotToDelete = await Spot.findByPk(spotId);
    if (!spotToDelete) {
      res.status(404);
      const results = {
        message: 'Spot couldn\'t be found',
        statusCode: 404
      };
      return res.json(results);
    }
    const spot = spotToDelete.toJSON();
    if (spotToDelete.ownerId = id) {
      await spotToDelete.destroy();
      return res.json({
        message: 'Successfully deleted',
        statusCode: 200
      });
    }
  }
);

router.get(
  '/:spotId/bookings',
  requireAuth,
  async (req, res) => {
    const { spotId } = req.params;
    const { id } = req.user;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      res.status(404);
      const err = {
        message: "Spot couldn't be found",
        statusCode: 404
      };
      res.json(err);
    }
    if (Number(spot.OwnerId) === Number(id)) {
      const bookings = await Booking.findAll({
        where: {
          spotId: spot.id
        },
        include: [
          {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
          }
        ]
      });
      return res.json({ 'Bookings': bookings });
    }
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id
      },
      attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        }
      ]
    });
    return res.json({ 'Bookings': bookings });
  }
);

router.post(
  '/:spotId/bookings',
  requireAuth,
  async (req, res) => {
    const { spotId } = req.params;
    const { id } = req.user;
    const { startDate, endDate } = req.body;


    const startString = new Date(startDate).toDateString();
    const endString = new Date(endDate).toDateString();
    const start = new Date(startString).getTime();
    const end = new Date(endString).getTime();
    // console.log(startDate);
    // console.log(start);
    // console.log(endDate);
    // console.log(end);

    const spot = await Spot.findByPk(spotId, {
      where: {
        ownerId: {
          [Op.ne]: id
        }
      }
    });

    if (!spot) {
      res.status(404);
      const err = {
        message: 'Spot couldn\'t be found',
        statusCode: 404
      };
      return res.json(err);
    }

    if (end - start <= 0) {
      res.status(400);
      const err = {
        message: 'Validation Error',
        statusCode: 400,
        errors: {
          endDate: "endDate cannot be on or before startDate"
        }
      };
      return res.json(err);
    }

    const allBookings = await Booking.findAll({ where: { spotId } });
    if (!allBookings) {
      const newBooking = await spot.createBooking({ spotId, userId: id, startDate, endDate });
      return res.json(newBooking);
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
        // const bookingStart = new Date(bookings[i].startDate).toDateString();
        // const bookingEnd = new Date(bookings[i].endDate).toDateString();
        const instanceStartString = new Date(bookings[i].startDate).toDateString();
        const instanceEndString = new Date(bookings[i].endDate).toDateString();
        // console.log(instanceStartString);
        // console.log(instanceEndString);
        const instanceStart = new Date(instanceStartString).getTime();
        const instanceEnd = new Date(instanceEndString).getTime();
        // console.log(start, end, instanceStart, instanceEnd);
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
      const newBooking = await spot.createBooking({ spotId, userId: id, startDate, endDate });
      return res.json(newBooking);
    }
  }
);

router.get(
  '/:spotId/reviews',
  async (req, res) => {
    const { spotId } = req.params;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      res.status(404);
      const err = {
        message: 'Spot couldn\'t be found',
        statusCode: 404
      };
      return res.json(err);
    }
    const reviewsList = await Review.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: ReviewImage,
          attributes: ['id', 'url']
        }
      ]
    });

    return res.json({ "Reviews": reviewsList })
  }
);

router.post(
  '/:spotId/reviews',
  [
    requireAuth,
    validateNewReview
  ],
  async (req, res) => {
    const { id } = req.user;
    const { spotId } = req.params;
    const { review, stars } = req.body;
    const spotToReview = await Spot.findByPk(spotId);
    if (!spotToReview) {
      res.status(404);
      const err = {
        message: 'Spot couldn\'t be found',
        statusCode: 404
      };
      return res.json(err);
    }
    const oldReview = await Review.findOne({
      where: {
        spotId: spotId,
        userId: id
      }
    });
    if (oldReview) {
      res.status(403);
      const err = {
        message: 'User already has a review for this spot',
        statusCode: 403
      };
      return res.json(err);
    }
    const newReview = await spotToReview.createReview({
      spotId,
      userId: id,
      review,
      stars

    });
    res.status(201);
    return res.json(newReview);

  }
);

router.post(
  '/:spotId/images',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const { spotId } = req.params;
    const { url, preview } = req.body
    const currentSpot = await Spot.findByPk(spotId, {
      include: [
        {
          model: User
        }
      ]
    });
    if (currentSpot && Number(id) === Number(currentSpot.User.id)) {
      const spot = currentSpot.toJSON();
      const newImage = await currentSpot.createSpotImage({
        url,
        preview
      });
      const results = {};
      const resultImage = newImage.toJSON();
      results.id = resultImage.id;
      results.url = resultImage.url;
      results.preview = resultImage.preview;
      res.status(201);
      res.json(results);
    } else {
      res.status(404);
      const err = {
        message: 'Spot couldn\'t be found',
        statusCode: 404
      }
      return res.json(err);
    }
  }
);



module.exports = router;
