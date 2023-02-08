const router = require("express").Router();
const rateLimit = require("express-rate-limit");

const placesController = require("../controller/placesController");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3000, // Limit each IP to 3000 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.route("/placesAutoComplete").get(apiLimiter, placesController.placesAutoComplete);
router.route("/placesDetailsSource").get(apiLimiter, placesController.placesDetailsSource);
router.route("/placesDetailsDestination").get(apiLimiter, placesController.placesDetailsDestination);
router.route("/placeTimezone").get(apiLimiter, placesController.placeTimezone);
router.route("/checkDistance").get(apiLimiter, placesController.checkDistance);

module.exports = router;
