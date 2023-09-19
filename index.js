// index.js
const express = require('express')
const app = express()
app.use(express.json());
const PORT = 4000

var AccessToken = require('twilio').jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;

app.get('/generate-token', (req, res) => {
  const identity = req.query.identity;
  const room = req.query.room;

  if (!identity) {
    return res.status(400).json({ error: 'Identity is required' });
  }

  // Substitute your Twilio AccountSid and ApiKey details
  const ACCOUNT_SID = process.env.ACCOUNT_SID
  const API_KEY_SID = process.env.API_KEY_SID
  const API_KEY_SECRET = process.env.API_KEY_SECRET

  // Create Video Grant
  let videoGrant = null;
  if (room) {
    videoGrant = new VideoGrant({ room });
  } else {
    videoGrant = new VideoGrant();
  }

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    ACCOUNT_SID,
    API_KEY_SID,
    API_KEY_SECRET,
    { identity }
  );
  token.addGrant(videoGrant);

  // Serialize the token as a JWT
  const jwt = token.toJwt();

  console.log(`jwt : ${jwt}`);

  res.status(200).json({ token: jwt });
})


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the Express API
module.exports = app
