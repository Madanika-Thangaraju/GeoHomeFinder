
const dns = require('dns');

async function testFetch(url) {
    console.log(`Testing fetch to ${url}...`);
    try {
        const response = await fetch(url);
        console.log(`Response to ${url}: ${response.status}`);
        // console.log(await response.text().then(t => t.substring(0, 100)));
    } catch (error) {
        console.error(`Fetch to ${url} failed:`, error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

async function testDns(hostname) {
    console.log(`Resolving DNS for ${hostname}...`);
    return new Promise((resolve) => {
        dns.lookup(hostname, { all: true }, (err, addresses) => {
            if (err) {
                console.error('DNS lookup failed:', err);
            } else {
                console.log('Addresses:', addresses);
            }
            resolve();
        });
    });
}

(async () => {
    await testDns('exp.host');

    console.log('\n--- Test: exp.host root ---');
    await testFetch('https://exp.host');

    console.log('\n--- Test: exp.host status ---');
    await testFetch('https://exp.host/status');
})();
