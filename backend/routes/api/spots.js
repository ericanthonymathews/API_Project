const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
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

router.get('/', async (req, res) => {
  const spots = await Spot.findAll({
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

  res.json({ 'Spots': allSpots });
});

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
