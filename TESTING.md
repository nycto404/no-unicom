# Testing Guide - no-unicom

This document provides comprehensive information about testing the no-unicom application using Playwright.

## Why Playwright?

After evaluating testing frameworks for this project, **Playwright** was chosen because:

- ✅ **Modern & Fast**: Built from the ground up for modern web applications
- ✅ **Cross-browser**: Test on Chromium, Firefox, and WebKit with a single API
- ✅ **Great for Interactive UIs**: Perfect for testing map interactions, menu toggles, and real-time updates
- ✅ **Easy to Use**: Simple selectors and readable test syntax
- ✅ **Superior Debugging**: Built-in inspector, trace viewer, and video recording
- ✅ **Active Development**: Constantly updated with new features

### Comparison

| Feature | Playwright | Selenium | Robot Framework |
|---------|-----------|----------|-----------------|
| Speed | ⚡⚡⚡ Fast | ⚡ Slow | ⚡⚡ Medium |
| Setup | Easy | Complex | Medium |
| Learning Curve | Low | Medium | High |
| Best For | Modern UIs | Enterprise | BDD/Non-tech stakeholders |
| Browser Support | Chrome, Firefox, Safari | All | All |

## Installation

Dependencies are already installed via `npm install`. To install just Playwright:

```bash
npm install --save-dev @playwright/test
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in UI mode (visual debugging)
```bash
npm run test:ui
```

### Debug mode with step-by-step execution
```bash
npm run test:debug
```

### Run specific test file
```bash
npx playwright test tests/e2e/app.spec.js
```

### Run tests with specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Generate test report
```bash
npx playwright test --reporter=html
```
The HTML report will be generated at `playwright-report/index.html`

## Test Structure

Tests are organized in `/tests/e2e/`:

- **app.spec.js** - Core app functionality (loading, display, info updates)
- **map.spec.js** - Map-specific features (zooming, controls, layers)
- **ui.spec.js** - User interface behavior (theme toggle, menu, responsiveness)

## Test Examples

### Basic Test
```javascript
test('should load the app', async ({ page }) => {
  await page.goto('/')
  const container = page.locator('.msfs-link-main-container')
  await expect(container).toBeVisible()
})
```

### Interaction Test
```javascript
test('should toggle menu', async ({ page }) => {
  await page.goto('/')
  const button = page.locator('.menu-button .burger-button')
  await button.click()
  const menu = page.locator('.user-menu')
  await expect(menu).toBeVisible()
})
```

### State Test
```javascript
test('should persist theme', async ({ page, context }) => {
  // Set theme
  await page.goto('/')
  await page.locator('.theme-button').click()
  
  // Verify in localStorage
  const theme = await page.evaluate(() => localStorage.getItem('theme'))
  expect(theme).toBe('dark')
})
```

## Writing New Tests

### Test Template
```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Setup
    await page.goto('/')
    
    // Action
    const button = page.locator('button')
    await button.click()
    
    // Assert
    const result = page.locator('.result')
    await expect(result).toBeVisible()
  })
})
```

### Common Locators
```javascript
// By CSS class
page.locator('.class-name')

// By ID
page.locator('#element-id')

// By attribute
page.locator('[data-testid="value"]')

// By role
page.locator('role=button')

// By text
page.locator('text=Click me')

// Combinations
page.locator('.container .item')
page.locator(':has(> button)')
```

### Common Actions
```javascript
// Navigation
await page.goto('/')

// Interaction
await element.click()
await element.type('text')
await element.check()
await element.uncheck()

// Waiting
await page.waitForSelector('.loaded')
await expect(element).toBeVisible()

// Checking state
const isVisible = await element.isVisible()
const text = await element.textContent()
const value = await element.getAttribute('href')
```

## Configuration

Playwright config is in `/playwright.config.js`:

```javascript
{
  testDir: './tests/e2e',           // Test location
  fullyParallel: true,              // Run tests in parallel
  retries: 0,                       // No retries locally
  workers: undefined,               // Auto-detect workers
  reporter: 'html',                 // Generate HTML report
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',        // Record trace on failure
    screenshot: 'only-on-failure'
  },
  webServer: {                      // Auto-start dev server
    command: 'npm run dev',
    url: 'http://localhost:5173'
  }
}
```

## CI/CD Integration

For GitHub Actions, add to `.github/workflows/test.yml`:

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Debugging

### View detailed traces
```bash
npx playwright show-trace trace.zip
```

### Record video of test
Update `playwright.config.js`:
```javascript
use: {
  video: 'retain-on-failure'
}
```

### Inspect elements during test
```javascript
test('with inspector', async ({ page }) => {
  await page.goto('/')
  await page.pause() // Pauses test, opens inspector
})
```

## Common Issues

### Tests timeout
- Increase timeout: `test.setTimeout(60000)`
- Check if element exists: `await page.waitForSelector()`

### Element not found
- Use `page.pause()` to inspect element
- Check CSS selectors with devtools
- Use `await page.screenshot()` for debugging

### CORS/Network issues
- Mock API responses using `route()`
- Use `--headed` flag to see browser

### Headless vs Headed
```bash
npx playwright test --headed         # See browser
npx playwright test --headed --debug # Debug mode with UI
```

## Performance Considerations

- Tests run in parallel by default for speed
- Use `test.describe.serial()` for tests that must run sequentially
- Mock expensive API calls to speed up tests
- Use `waitForTimeout()` sparingly

## Next Steps

1. **Add more specific tests** for VATSIM data updates
2. **Mock API responses** for consistent test results
3. **Set up GitHub Actions** for CI/CD
4. **Add accessibility tests** with `@axe-core/playwright`
5. **Performance testing** with Lighthouse integration

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Community](https://github.com/microsoft/playwright)

## Questions?

For issues or questions about testing setup, check the [Playwright GitHub issues](https://github.com/microsoft/playwright/issues).
