const axios = require("axios");

exports.placesAutoComplete = async (req, res) => {
  console.log(req.body.input, "input");
  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${req.query.input}&language=en&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    headers: {},
  };

  try {
    const response = await axios(config);
    // console.log(response);
    result = JSON.stringify(response.data.predictions);

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
};

// Fetching Latitude And Longitude Based On Place Id (That We Can Get From The Above Api) For Source

exports.placesDetailsSource = async (req, res) => {
  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.query.place_id}&fields=geometry&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    headers: {},
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    result = JSON.stringify(response?.data?.result?.geometry?.location);

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
};

// Fetching Latitude And Longitude Based On Place Id (That We Can Get From The Above Api) For Destination

exports.placesDetailsDestination = async (req, res) => {
  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.query.place_id}&fields=geometry&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    headers: {},
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    result = JSON.stringify(response?.data?.result?.geometry?.location);

    res.status(200).send(result);
  } catch (err) {
    console.log(err);
  }
};

exports.placeTimezone = async (req, res) => {
  axios
    .get(
      `https://timezone.abstractapi.com/v1/current_time/?api_key=8c93b05fda584e79917be6ce914d6917&location=${req.query.location}`
    )
    .then((response) => {
      console.log(response.data, "timezone");
      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

exports.checkDistance = async (req, res) => {
  const config = {
    method: "get",
    url: `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${req.query.origin}&destinations=${req.query.destination}&mode=driving&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    headers: {},
  };

  try {
    const response = await axios(config);
    console.log(response.data);
    result = JSON.stringify(
      response?.data?.rows[0]?.elements[0]?.distance?.text
    );
    distanceInMiles = parseFloat(result?.replace(/\D/i, ""));

    // mi to km
    // result = result * 1.60934;
    distanceInKms = distanceInMiles * 1.60934;

    console.log(distanceInKms, "<----- distance in kms");

    res.status(200).json({
      km: distanceInKms,
      duration: response?.data?.rows[0]?.elements[0]?.duration?.text,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
