const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


router.get(
  '/current',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const reviews = await Review.findAll({
      where: { userId: id },
      include: [
        {
          model: User
        },
        {
          model: Spot
        },
        {
          model: ReviewImage
        }
      ]
    });

    let allReviews = [];

    reviews.forEach(review => {
      allReviews.push(review.toJSON());
    });

    const user = await User.scope('currentUser').findByPk(id);
    const userInfo = user.toJSON();

    for (let i = 0; i < allReviews.length; i++) {
      const replacement = {
        id: userInfo.id,
        firstName: userInfo.firstName,
        lastName: userInfo.lastName
      };
      allReviews[i].User = replacement;

      delete allReviews[i].Spot.description;
      delete allReviews[i].Spot.createdAt;
      delete allReviews[i].Spot.updatedAt;
      const previewImage = await SpotImage.findOne({
        where: {
          spotId: allReviews[i].spotId,
          preview: true,
        }
      });
      const preview = previewImage.toJSON();
      allReviews[i].Spot.previewImage = preview.url;

      for (let j = 0; j < allReviews[i].ReviewImages.length; j++) {
        delete allReviews[i].ReviewImages[j].reviewId;
        delete allReviews[i].ReviewImages[j].createdAt;
        delete allReviews[i].ReviewImages[j].updatedAt;
      }

    }
    return res.json({ "Reviews": allReviews });
  }
);

module.exports = router;
