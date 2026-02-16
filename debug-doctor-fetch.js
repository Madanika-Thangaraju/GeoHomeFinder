
const { Env } = require('./node_modules/expo-doctor/build/utils/env');
const { fetch } = require('./node_modules/expo-doctor/build/utils/fetch');

// Mock Env to see if it changes anything
// process.env.EXPO_OFFLINE = '0';

(async () => {
    console.log('Testing expo-doctor internal fetch...');
    try {
        // Try to import the actual function used for schema check if possible
        // Based on previous grep, it might be in a different file, but let's try basic fetch first
        // If 'fetch' is not exported directly, we might need to rely on what we found in index.js

        // Let's try to mimic the call
        const url = 'https://exp.host/--/api/v2/project/configuration/schema/50.0.0';
        console.log(`Fetching ${url}...`);

        // Note: I am guessing the path based on typical expo schema urls
        // If this fails with the same error, we know it's the environment/fetcher

        const res = await fetch(url);
        console.log('Status:', res.status);
    } catch (e) {
        console.error('Internal fetch failed:', e);
        if (e.cause) console.error('Cause:', e.cause);
    }
})();
