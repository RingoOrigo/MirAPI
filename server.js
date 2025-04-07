/**
 * @file server.js
 * @description Simple Express server to serve as the starting point for this API.
 * @author Ringo Origo
 * @date 2025.04.05
 */

// Import the required modules
const express = require('express');
const fs = require('node:fs');

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

app.get('/api/sites', async (request, result) => {
    const directory = 'api/sites';

    try {
        // Read the directory and get all files.
        // Specifically fs.promises.readdir() gets them in order of filename.
        const files = await fs.promises.readdir(directory);
        const sites = [];

        // For each file, read it and parse the JSON data.
        // Then push the parsed data into the sites array.
        for (const file of files.sort()) {
            const data = await fs.promises.readFile(`${directory}/${file}`, 'utf8');
            sites.push(JSON.parse(data));
        }

        // Return the sites array as JSON. 
        result.status(200).json(sites);
    } catch (error) {
        // Return error code 500 if an error was encountered.
        result.status(500).json({error: 'Error reading all FN sites.'});
    }
});

app.get('/api/sites/:id', (request, result) => {
    const siteID = request.params.id;
    const file = `api/sites/${siteID}.json`;
    
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
            result.status(404).json({error: `FN Site ${siteID} not found.`});
        } else {
            result.status(200).send(JSON.parse(data));
        }
    });
});