import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only.
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [['list'], ['html']],
  
  use: {
    // Collect trace when retrying the failed test.
    trace: 'on-first-retry',
    // Use local test server
    baseURL: 'http://localhost:5173',
  },
  
  // Start test server before running tests
  webServer: {
    command: 'pnpm --filter=@a11y-visualizer/test-site dev --port 5173',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
  
  // Configure projects for major browsers.
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});