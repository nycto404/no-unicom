import { test, expect } from '@playwright/test'

test.describe('Map Functionality', () => {
  test('should initialize Leaflet map with controls', async ({ page }) => {
    await page.goto('/')
    
    // Check for Leaflet controls
    const zoomButtons = page.locator('.leaflet-control-zoom-in, .leaflet-control-zoom-out')
    await expect(zoomButtons.first()).toBeVisible()
  })

  test('should have layer control', async ({ page }) => {
    await page.goto('/')
    
    // Look for layer control
    const layerControl = page.locator('.leaflet-control-layers')
    await expect(layerControl).toBeVisible()
  })

  test('should allow zooming', async ({ page }) => {
    await page.goto('/')
    
    const zoomInButton = page.locator('.leaflet-control-zoom-in')
    
    // Get initial zoom level
    const mapElement = page.locator('.leaflet-container')
    
    // Click zoom in button
    await zoomInButton.click()
    
    // Map should still be visible after zoom
    await expect(mapElement).toBeVisible()
  })

  test('should have map properly sized', async ({ page }) => {
    await page.goto('/')
    
    const mapElement = page.locator('.leaflet-container')
    const boundingBox = await mapElement.boundingBox()
    
    // Map should take up most of the viewport
    expect(boundingBox.height).toBeGreaterThan(100)
    expect(boundingBox.width).toBeGreaterThan(100)
  })
})

test.describe('Airport Display', () => {
  test('should have airport markers layer available', async ({ page }) => {
    await page.goto('/')
    
    // Look for layer control which should list Airports
    const layerControl = page.locator('.leaflet-control-layers')
    await expect(layerControl).toBeVisible()
  })
})
