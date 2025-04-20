/**
 * @file server.js
 * @description Simple Express server to serve as the starting point for this API.
 * @author Ringo Origo
 * @date 2025.04.05
 */

// Import the required modules
const express = require('express');
const fs = require('node:fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

async function concatAllJSONFiles (directory) {
    try {
        let entries = await fs.promises.readdir(directory, { withFileTypes: true });
        const files = [];

        // Sort the list of entries by name. This will ensure they are returned in a consistent alphabetical order.
        entries = entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        // Loop through each entry in the directory
        for (const entry of entries) {

            const fullPath = `${directory}/${entry.name}`;
            
            // Check if the file is a subdirectory or a proper JSON file.
            if (entry.isDirectory()) {
                // Recursively process subdirectories
                const subdirFiles = await concatAllJSONFiles(fullPath);
                files.push(...subdirFiles);
            } else if (entry.isFile() && entry.name.endsWith('.json')) {
                // Process JSON files
                const data = await fs.promises.readFile(fullPath, 'utf8');
                files.push(JSON.parse(data));
            }
        }

        return files;
    } catch (e) {
        throw e;
    }
}

// Use the host-provided port, default to 3000.
const port = process.eventNames.PORT || 3000;
// And log current port to the console.
app.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});

// Define basic API endpoint with constant return.
app.get('/', (_, result) => {
    return result.sendFile(path.join(__dirname, 'docs/index.html'));
});

/**
 * API endpoint to get FN sites.
 *  - Usage: GET http://localhost:3000/api/sites?id=<id>
 * @param {string} id - The ID of the FN Site to get. Not required.
 * @returns - A JSON object with the requested FN Site data, if ID was specified.
 *            A JSON array with all available FN Site data, if ID was not specified.
 *            A 404 error if the FN Site was not found.
 *            A 500 error if there was an error reading the FN Site data.
 */
app.get('/api/sites', async (request, result) => {
    const directory = 'api/sites';
    const { id } = request.query;

    if (!id) {
        try {
            // Read all JSON files in the directory and concatenate them into a single array of JSON data.
            sites = await concatAllJSONFiles(directory);

            // Return the sites array as JSON. 
            return result.status(200).json(sites);
        } catch (e) {
            // Return error code 500 if an error was encountered.
            return result.status(500).json({error: 'Error reading all FN sites.'});
        }
    } else {
        const file = `${directory}/${id}.json`;
        
        // Read the specified file and parse the JSON data.
        // If the file does not exist, return a 404 error.
        fs.readFile(file, 'utf8', (error, data) => {
            if (error) {
                return result.status(404).json({error: `FN Site ${id} not found.`, code: 404});
            } else {
                return result.status(200).send(JSON.parse(data));
            }
        });
    }
});

/**
 * Api endpoint for missions.
 *  - Usage: GET http://localhost:3000/api/missions?type=<type>&name=<name>
 * @param {string} type - The type of mission to get. Not required. Must be "affinity", "basic", "side", or "story".
 * @param {string} name - The name of the mission to get. Not required.
 * @returns - A JSON array of all missions meeting the specified criteria. All missions if no criteria was specified.
 *          - A 404 error if no missions of the given criteria could be found.
 *          - A 500 error if there was an error reading the mission data.
 */
app.get('/api/missions', async (request, result) => {
    const directory = 'api/missions';
    const {type, name} = request.query;

    if (!type && !name) {
        // Neither mission type nor name have been specified, return all missions.
        try {
            const missions = await concatAllJSONFiles(directory);
            return result.status(200).json(missions);
        } catch (e) {
            return result.status(500).json({error: 'Error reading mission data.'});
        }

    } else if (type && !name) {
        // Only the type was specified, return all missions of that type.
        try {
            const missionDir = `${directory}/${type}`;
            const missions = await concatAllJSONFiles(missionDir);
            return result.status(200).json(missions);
        } catch (e) {
            return result.status(500).json({error: 'Error reading mission data.'});
        }
    } else if (!type && name) {
        try {
            // Read all files, including subdirectories.
            const subdirs = await fs.promises.readdir(directory, { withFileTypes: true });

            for (const subdir of subdirs) {
                // Read within each subdirectory
                const files = await fs.promises.readdir(`${directory}/${subdir.name}`, { withFileTypes: true });

                // For each file in the current subdirectory, check if it has the specified name.
                for (const file of files) {
                    if (file.name === `${name}.json`) {
                        // Return the JSON data of the specified file.
                        const data = await fs.promises.readFile(`${directory}/${subdir.name}/${file.name}`, 'utf8');
                        return result.status(200).json(JSON.parse(data));
                    }
                }
                return result.status(404).json({error: `Mission '${name}' not found.`, code: 404});
            }
        } catch(e) {
            return result.status(500).json({error: 'Error reading mission data.'});
        }
    } else {
        try {
            const files = await fs.promises.readdir(`${directory}/${type}`, { withFileTypes: true });

            for (const file of files) {
                if (file.name === `${name}.json`) {
                    // Return the JSON data of the specified file.
                    const data = await fs.promises.readFile(`${directory}/${type}/${file.name}`, 'utf8');
                    return result.status(200).json(JSON.parse(data));
                }
            }
            return result.status(404).json({error: `Could not find ${type} mission '${name}'`, code: 404});
        } catch (e) {
            return result.status(500).json({error: 'Error reading mission data.'});
        }
    }
});