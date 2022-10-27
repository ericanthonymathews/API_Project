const express = require('express')
const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();

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
    const result = newSpot.toJSON()

    res.json({
      ...result
    });
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
  }
);


module.exports = router;
