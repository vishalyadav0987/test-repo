const { test, expect } = require('@playwright/test');

test('Environment should be alive and return 200', async ({ request }) => {
    // Because the test runs INSIDE the container, it just checks its own localhost:3000
    const response = await request.get('http://localhost:3000');
    expect(response.ok()).toBeTruthy();
    console.log("✅ Playwright verified the server is running!");
});