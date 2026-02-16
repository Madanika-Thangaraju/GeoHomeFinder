const dns = require('dns');

// Force IPv4 ordering
if (dns.setDefaultResultOrder) {
    try {
        dns.setDefaultResultOrder('ipv4first');
        console.log('DNS result order set to ipv4first');
    } catch (e) {
        console.warn('Failed to set DNS result order:', e);
    }
} else {
    console.warn('dns.setDefaultResultOrder is not available in this Node version');
}

// Emulate CLI execution
// Determine path to expo-doctor
const path = require('path');
const doctorPath = path.resolve(__dirname, '../node_modules/expo-doctor/build/index.js');

console.log('Running expo-doctor from:', doctorPath);
require(doctorPath);
