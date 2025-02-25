// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express');
const session = require('express-session');
const { auth, requiresAuth } = require('express-openid-connect');

// Create the Express application
const app = express();

// Auth0 configuration using express-openid-connect
const config = {
  authRequired: false,         // Only routes with 'requiresAuth()' will be protected
  auth0Logout: true,           // Allows logging out both from the app and Auth0
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  clientSecret: process.env.AUTH0_CLIENT_SECRET, // Required for Regular Web Application
};

// Apply the authentication middleware
app.use(auth(config));

// Public route: Home
app.get('/', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send(`
      <h1>Home (Logged In)</h1>
      <p>Welcome, ${req.oidc.user.name}!</p>
      <a href="/profile">View Profile</a> | 
      <a href="/logout">Logout</a>
    `);
  } else {
    res.send(`
      <h1>Home (Logged Out)</h1>
      <p><a href="/login">Login</a></p>
    `);
  }
});

// Protected route: Profile (accessible only to authenticated users)
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(`
    <h1>User Profile</h1>
    <pre>${JSON.stringify(req.oidc.user, null, 2)}</pre>
    <p><a href="/">Go Back</a></p>
  `);
});

// Start the server on the defined port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at ${process.env.AUTH0_BASE_URL}`);
});