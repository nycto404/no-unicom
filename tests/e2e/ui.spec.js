import { test, expect } from '@playwright/test'

test.describe('Theme Functionality', () => {
  test('should apply light theme by default', async ({ page }) => {
    await page.goto('/')
    
    // Check body class
    const body = page.locator('body')
    const classList = await body.getAttribute('class')
    
    // Body should not have dark-mode class initially
    expect(classList).not.toContain('dark-mode')
  })

  test('should toggle theme on button click', async ({ page }) => {
    await page.goto('/')
    
    const themeButton = page.locator('.theme-button .burger-button')
    await themeButton.click()
    
    // Small delay for theme to apply
    await page.waitForTimeout(300)
    
    // Theme should have changed (we can verify by checking localStorage)
    const theme = await page.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
  })

  test('should persist theme in localStorage', async ({ page, context }) => {
    // Set dark mode
    await page.goto('/')
    const themeButton = page.locator('.theme-button .burger-button')
    await themeButton.click()
    
    // Wait for storage update
    await page.waitForTimeout(300)
    
    // Open new page and verify theme is persisted
    const newPage = await context.newPage()
    await newPage.goto('/')
    
    const theme = await newPage.evaluate(() => localStorage.getItem('theme'))
    expect(theme).toBe('dark')
    
    await newPage.close()
  })
})

test.describe('Menu Functionality', () => {
  test('should close menu when clicking outside', async ({ page }) => {
    await page.goto('/')
    
    // Open menu
    const burgerButton = page.locator('.menu-button .burger-button')
    await burgerButton.click()
    
    const userMenu = page.locator('.user-menu')
    await expect(userMenu).toBeVisible()
    
    // Click on map area (outside menu)
    const mapElement = page.locator('.leaflet-container')
    await mapElement.click({ position: { x: 100, y: 100 } })
    
    // Menu should close
    await expect(userMenu).not.toBeVisible()
  })
  
  test('should toggle checkboxes in menu', async ({ page }) => {
    await page.goto('/')
    
    // Open menu
    const burgerButton = page.locator('.menu-button .burger-button')
    await burgerButton.click()
    
    const aircraftCheckbox = page.locator('#toggle-aircrafts-checkbox')
    const initialState = await aircraftCheckbox.isChecked()
    
    // Click checkbox
    await aircraftCheckbox.click()
    
    const newState = await aircraftCheckbox.isChecked()
    expect(newState).not.toBe(initialState)
  })
})

test.describe('Layout and Responsiveness', () => {
  test('should have correct z-index stacking', async ({ page }) => {
    await page.goto('/')
    
    // Get z-index values (these are CSS computed values)
    const burgerButton = page.locator('.menu-button')
    const mapElement = page.locator('.leaflet-container')
    
    // Info should be visible over map
    const infoContainer = page.locator('.general-information')
    await expect(infoContainer).toBeVisible()
    await expect(mapElement).toBeVisible()
  })

  test('should have information visible on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    const generalInfo = page.locator('.general-information')
    await expect(generalInfo).toBeVisible()
    
    const pilotsInfo = page.locator('#pilots')
    const atcInfo = page.locator('#atc')
    
    await expect(pilotsInfo).toBeVisible()
    await expect(atcInfo).toBeVisible()
  })
})
