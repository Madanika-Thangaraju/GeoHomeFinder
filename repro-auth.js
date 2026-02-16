
// BASE_URL from src/services/service.ts
const BASE_URL = "https://testapi.geohomefinder.com";

const TEST_USER = {
    name: "Test User",
    email: `test${Date.now()}@example.com`,
    password: "password123",
    phone: `123456${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    role: "tenant"
};

async function testAuth() {
    console.log(`Testing Auth API at ${BASE_URL}`);

    // 1. Register
    console.log('\n1. Testing Registration...');
    try {
        const registerRes = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });

        console.log('Register Status:', registerRes.status);
        const registerData = await registerRes.json();
        console.log('Register Response:', registerData);

        if (!registerRes.ok && registerRes.status !== 409) {
            console.error('Registration failed');
        }
    } catch (e) {
        console.error('Registration Error:', e);
    }

    // 2. Login
    console.log('\n2. Testing Login...');
    try {
        const loginRes = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: TEST_USER.email,
                password: TEST_USER.password
            })
        });

        console.log('Login Status:', loginRes.status);
        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);
    } catch (e) {
        console.error('Login Error:', e);
    }
}

testAuth();
