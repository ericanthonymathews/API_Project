const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, User } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.delete(
  '/:imageId',
  requireAuth,
  async (req, res) => {
    const { imageId } = req.params;
    const { id } = req.user;


    const spotImage = await SpotImage.findByPk(imageId, {
      include: [
        {
          model: Spot
        }
      ]
    });

    if (!spotImage) {
      res.status(404);
      res.json({
        message: "Spot Image couldn't be found",
        statusCode: 404
      });
    }

    if (Number(spotImage.Spot.ownerId) === Number(id)) {
      await spotImage.destroy();
      return res.json({
        message: "Successfully deleted",
        statusCode: 200
      });
    }

    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found",
      statusCode: 404
    });
  }
);


module.exports = router;
