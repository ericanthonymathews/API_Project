const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, ReviewImage, Review, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete(
  '/:imageId',
  requireAuth,
  async (req, res) => {
    const { id } = req.user;
    const { imageId } = req.params;

    const imageToDelete = await ReviewImage.findByPk(imageId, {
      include: [
        {
          model: Review
        }
      ]
    });
    if (!imageToDelete) {
      res.status(404);
      return res.json({
        message: "Review Image couldn't be found",
        statusCode: 404
      });
    }
    if (Number(imageToDelete.Review.userId) === Number(id)) {
      await imageToDelete.destroy();
      return res.json({
        message: "Successfully deleted",
        statusCode: 200
      });
    } else {
      res.status(404);
      return res.json({
        message: "Review Image couldn't be found",
        statusCode: 404
      });
    }
  }
);


module.exports = router;
