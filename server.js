/**
 * @file server.js
 * @description Simple Express server to serve as the starting point for this API.
 * @author Ringo Origo
 * @date 2025.04.05
 */

// Import the required modules
const express = require('express');

const app = express();

// Use the host-provided port, default to 3000.
const port = process.eventNames.PORT || 3000;
// And log current port to the console.
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

// Define basic API endpoint with constant return.
app.get('/', (request, result) => {
    result.send('Hello, world!');
});