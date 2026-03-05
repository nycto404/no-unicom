import { test, expect } from '@playwright/test'

test.describe('no-unicom App', () => {
  test('should load the app', async ({ page }) => {
    await page.goto('/')
    
    // Check that the main container exists
    const container = page.locator('.msfs-link-main-container')
    await expect(container).toBeVisible()
  })

  test('should display map container', async ({ page }) => {
    await page.goto('/')
    
    // Check that the Leaflet map is rendered
    const mapElement = page.locator('.leaflet-container')
    await expect(mapElement).toBeVisible()
  })

  test('should display information containers', async ({ page }) => {
    await page.goto('/')
    
    // Check pilots info
    const pilotsInfo = page.locator('.info-container #pilots')
    await expect(pilotsInfo).toBeVisible()
    
    // Check ATC info
    const atcInfo = page.locator('.info-container #atc')
    await expect(atcInfo).toBeVisible()
    
    // Check time container
    const timeContainer = page.locator('#time-container')
    await expect(timeContainer).toBeVisible()
  })

  test('should toggle menu when clicking burger button', async ({ page }) => {
    await page.goto('/')
    
    // Menu should not be visible initially
    const userMenu = page.locator('.user-menu')
    await expect(userMenu).not.toBeVisible()
    
    // Click burger button
    const burgerButton = page.locator('.menu-button .burger-button')
    await burgerButton.click()
    
    // Menu should now be visible
    await expect(userMenu).toBeVisible()
    
    // Click again to close
    await burgerButton.click()
    await expect(userMenu).not.toBeVisible()
  })

  test('should have theme toggle button', async ({ page }) => {
    await page.goto('/')
    
    const themeButton = page.locator('.theme-button .burger-button')
    await expect(themeButton).toBeVisible()
    
    // Check for sun icon
    const sunIcon = themeButton.locator('i.fa-sun')
    await expect(sunIcon).toBeVisible()
  })

  test('should have airport and aircraft toggles in menu', async ({ page }) => {
    await page.goto('/')
    
    // Open menu
    const burgerButton = page.locator('.menu-button .burger-button')
    await burgerButton.click()
    
    // Check checkboxes
    const aircraftCheckbox = page.locator('#toggle-aircrafts-checkbox')
    const airportCheckbox = page.locator('#toggle-airports-checkbox')
    
    await expect(aircraftCheckbox).toBeVisible()
    await expect(airportCheckbox).toBeVisible()
    
    // Verify they are checkboxes
    await expect(aircraftCheckbox).toHaveAttribute('type', 'checkbox')
    await expect(airportCheckbox).toHaveAttribute('type', 'checkbox')
  })

  test('should have GitHub social link', async ({ page }) => {
    await page.goto('/')
    
    // Open menu
    const burgerButton = page.locator('.menu-button .burger-button')
    await burgerButton.click()
    
    // Check for GitHub link
    const githubLink = page.locator('a[href="https://github.com/nycto404"]')
    await expect(githubLink).toBeVisible()
    
    // Verify it opens in new tab
    await expect(githubLink).toHaveAttribute('target', '_blank')
  })

  test('should have responsive design', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Elements should still be visible
    const container = page.locator('.msfs-link-main-container')
    await expect(container).toBeVisible()
    
    const mapElement = page.locator('.leaflet-container')
    await expect(mapElement).toBeVisible()
    
    const burgerButton = page.locator('.menu-button .burger-button')
    await expect(burgerButton).toBeVisible()
  })

  test('should display current time', async ({ page }) => {
    await page.goto('/')
    
    const timeElement = page.locator('#time-container h4')
    
    // Wait for time to be displayed (it updates on mount)
    await expect(timeElement).toContainText(/\d{1,2}:\d{2}:\d{2}/)
  })

  test('should display pilot and controller count', async ({ page }) => {
    await page.goto('/')
    
    // Check that info containers have numbers (or at least are present)
    const pilotsSpan = page.locator('#pilots span')
    const atcSpan = page.locator('#atc span')
    
    await expect(pilotsSpan).toBeVisible()
    await expect(atcSpan).toBeVisible()
  })
})
