const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Review, ReviewImage, Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const validateNewImage = [
  check('url')
    .exists({ checkFalsy: true })
    .withMessage('Image url is required'),
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

router.put(
  '/:reviewId',
  [
    requireAuth,
    validateNewReview
  ],
  async (req, res) => {
    const { reviewId } = req.params;
    const { id } = req.user;
    const { review, stars } = req.body;
    const reviewInstance = await Review.findByPk(reviewId);
    if (!reviewInstance) {
      res.status(404);
      const err = {
        message: 'Review couldn\'t be found',
        statusCode: 404
      };
      return res.json(err)
    }
    const rev = reviewInstance.toJSON();
    if (Number(rev.userId) === Number(id)) {
      reviewInstance.review = review;
      reviewInstance.stars = stars;

      await reviewInstance.save();
      return res.json(reviewInstance);
    }
  }
);

router.delete(
  '/:reviewId',
  requireAuth,
  async (req, res) => {
    const { reviewId } = req.params;
    const { id } = req.user;

    const reviewToDelete = await Review.findByPk(reviewId, {
      where: {
        userId: id
      }
    });

    if (!reviewToDelete) {
      res.status(404);
      const err = {
        message: "Review couldn't be found",
        statusCode: 404
      };
      return res.json(err);
    } else {
      await reviewToDelete.destroy();
      res.status(200);
      res.json({
        message: 'Successfully deleted',
        statusCode: 200
      });
    }
  }

);

router.post(
  '/:reviewId/images',
  [
    requireAuth,
    validateNewImage
  ],
  async (req, res) => {
    const { id } = req.user;
    const { url } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findByPk(reviewId, {
      include: [
        {
          model: ReviewImage
        }
      ]
    });
    if (!review) {
      res.status(404);
      const err = {
        message: 'Review couldn\'t be found',
        statusCode: 404
      };
      return res.json(err);
    }
    const reviewInfo = review.toJSON();
    if (reviewInfo.ReviewImages.length >= 10) {
      res.status(403);
      const err = {
        message: 'Maximum number of images for this resource was reached',
        statusCode: 403
      };
      return res.json(err);
    }
    const newReviewImage = await review.createReviewImage({ reviewId, url });
    const results = newReviewImage.toJSON();
    delete results.createdAt;
    delete results.updatedAt;
    delete results.reviewId;
    res.status(200);
    return res.json(results);
  }
);

module.exports = router;
