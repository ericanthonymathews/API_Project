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

    res.json({
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
  // let owner = ownerInstance.toJSON();
  // let ownerInfo = {};
  // ownerInfo.id = spot.Users.id;
  // ownerInfo.firstName = spot.Users.firstName;
  // ownerInfo.lastName = spot.Users.lastName;
  // spot.Owner = ownerInfo;

  // delete model.Users;


  res.json(spot);
});


module.exports = router;
