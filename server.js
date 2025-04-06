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

app.get('/api/sites', (request, result) => {
    fs.readdir('api/sites', (error, files) => {
        if (error) {
            result.status(500).send('Error reading directory of sites.');
            return;
        }

        const probes = [];
        let filesProcessed = 0;

        files.forEach((file) => {
            const filePath = `api/sites/${file}`;
            fs.readFile(filePath, 'utf8', (err, data) => {
                filesProcessed++;
                if (!err) {
                    try {
                        probes.push(JSON.parse(data));
                    } catch (parseError) {
                        console.error(`Error parsing JSON from file ${file}:`, parseError);
                    }
                }

                if (filesProcessed === files.length) {
                    result.status(200).json(probes);
                }
            });
        });

        if (files.length === 0) {
            result.status(200).json(probes);
        }
    });
});

app.get('/api/sites/:id', (request, result) => {
    const siteID = request.params.id;
    const file = `api/sites/${siteID}.json`;
    
    fs.readFile(file, 'utf8', (error, data) => {
        if (error) {
            result.status(404).send(`FN Site ${siteID} not found.`);
        } else {
            result.status(200).send(JSON.parse(data));
        }
    });
});