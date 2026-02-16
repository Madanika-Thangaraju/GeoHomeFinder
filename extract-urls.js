
const fs = require('fs');

try {
    const content = fs.readFileSync('node_modules/expo-doctor/build/index.js', 'utf8');

    const searchTerms = ['configuration/schema', 'Check Expo config'];

    searchTerms.forEach(term => {
        console.log(`\n--- Searching for: "${term}" ---`);
        let index = content.indexOf(term);
        while (index !== -1) {
            const start = Math.max(0, index - 100);
            const end = Math.min(content.length, index + 200);
            console.log(`...${content.substring(start, end)}...`);
            index = content.indexOf(term, index + 1);
        }
    });

} catch (err) {
    console.error('Error reading file:', err);
}
