#!/usr/bin/env node
/**
 * GENERATE TOP 50 VEHICLE PROFILES
 * Creates fully-modeled vehicle profiles with glass data for the
 * most common vehicles in Alaska.
 * 
 * Usage: node scripts/generate-top-vehicles.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'data', 'vehicles');

// ============================================================
// TOP 50 ALASKA VEHICLES — FULLY MODELED
// ============================================================
const TOP_VEHICLES = [
  // === PICKUPS (Alaska #1 segment) ===
  { make: "CHEVROLET", model: "SILVERADO 1500", year: 2022, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [350, 550] },
      back_glass: { type: "tempered", features: [], price: [350, 700] },
      front_left_door: { type: "tempered", features: [], price: [120, 250] },
      front_right_door: { type: "tempered", features: [], price: [120, 250] },
      rear_left_door: { type: "tempered", features: [], price: [120, 250] },
      rear_right_door: { type: "tempered", features: [], price: [120, 250] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "CHEVROLET", model: "SILVERADO 1500", year: 2020, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [320, 520] },
      back_glass: { type: "tempered", features: [], price: [300, 650] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "CHEVROLET", model: "SILVERADO 1500", year: 2018, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: false, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: [], price: [220, 380] },
      back_glass: { type: "tempered", features: [], price: [280, 600] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.85, sources: ["derived"] },

  { make: "FORD", model: "F-150", year: 2023, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: true, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor", "heated"], price: [400, 650] },
      back_glass: { type: "tempered", features: [], price: [350, 700] },
      front_left_door: { type: "tempered", features: [], price: [130, 260] },
      front_right_door: { type: "tempered", features: [], price: [130, 260] },
      rear_left_door: { type: "tempered", features: [], price: [130, 260] },
      rear_right_door: { type: "tempered", features: [], price: [130, 260] }
    }, confidence: 0.92, sources: ["derived", "market_data"] },

  { make: "FORD", model: "F-150", year: 2021, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: true, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor", "heated"], price: [380, 600] },
      back_glass: { type: "tempered", features: [], price: [320, 680] },
      front_left_door: { type: "tempered", features: [], price: [120, 250] },
      front_right_door: { type: "tempered", features: [], price: [120, 250] },
      rear_left_door: { type: "tempered", features: [], price: [120, 250] },
      rear_right_door: { type: "tempered", features: [], price: [120, 250] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "FORD", model: "F-150", year: 2018, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: false, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: [], price: [230, 400] },
      back_glass: { type: "tempered", features: [], price: [280, 600] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.88, sources: ["derived"] },

  { make: "FORD", model: "F-250", year: 2022, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: true, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor", "heated"], price: [420, 680] },
      back_glass: { type: "tempered", features: [], price: [380, 750] },
      front_left_door: { type: "tempered", features: [], price: [140, 280] },
      front_right_door: { type: "tempered", features: [], price: [140, 280] },
      rear_left_door: { type: "tempered", features: [], price: [140, 280] },
      rear_right_door: { type: "tempered", features: [], price: [140, 280] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "RAM", model: "1500", year: 2022, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [350, 560] },
      back_glass: { type: "tempered", features: [], price: [340, 700] },
      front_left_door: { type: "tempered", features: [], price: [120, 250] },
      front_right_door: { type: "tempered", features: [], price: [120, 250] },
      rear_left_door: { type: "tempered", features: [], price: [120, 250] },
      rear_right_door: { type: "tempered", features: [], price: [120, 250] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "RAM", model: "1500", year: 2019, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [310, 500] },
      back_glass: { type: "tempered", features: [], price: [300, 650] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.85, sources: ["derived"] },

  { make: "GMC", model: "SIERRA 1500", year: 2022, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [350, 560] },
      back_glass: { type: "tempered", features: [], price: [350, 700] },
      front_left_door: { type: "tempered", features: [], price: [120, 250] },
      front_right_door: { type: "tempered", features: [], price: [120, 250] },
      rear_left_door: { type: "tempered", features: [], price: [120, 250] },
      rear_right_door: { type: "tempered", features: [], price: [120, 250] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "TOYOTA", model: "TACOMA", year: 2022, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [280, 550] },
      front_left_door: { type: "tempered", features: [], price: [110, 220] },
      front_right_door: { type: "tempered", features: [], price: [110, 220] },
      rear_left_door: { type: "tempered", features: [], price: [110, 220] },
      rear_right_door: { type: "tempered", features: [], price: [110, 220] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "TOYOTA", model: "TUNDRA", year: 2023, body: "PICKUP", layout: "pickup", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [380, 600] },
      back_glass: { type: "tempered", features: [], price: [380, 750] },
      front_left_door: { type: "tempered", features: [], price: [130, 260] },
      front_right_door: { type: "tempered", features: [], price: [130, 260] },
      rear_left_door: { type: "tempered", features: [], price: [130, 260] },
      rear_right_door: { type: "tempered", features: [], price: [130, 260] }
    }, confidence: 0.87, sources: ["derived", "market_data"] },

  // === SUVs (Alaska #2 segment) ===
  { make: "TOYOTA", model: "RAV4", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [320, 500] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.92, sources: ["derived", "market_data"] },

  { make: "TOYOTA", model: "4RUNNER", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [320, 650] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "TOYOTA", model: "HIGHLANDER", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [330, 520] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "SUBARU", model: "OUTBACK", year: 2022, body: "WAGON", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [350, 560] },
      back_glass: { type: "tempered", features: [], price: [280, 550] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.92, sources: ["derived", "market_data"] },

  { make: "SUBARU", model: "OUTBACK", year: 2020, body: "WAGON", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [330, 530] },
      back_glass: { type: "tempered", features: [], price: [260, 520] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "SUBARU", model: "FORESTER", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [340, 540] },
      back_glass: { type: "tempered", features: [], price: [270, 530] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.92, sources: ["derived", "market_data"] },

  { make: "SUBARU", model: "CROSSTREK", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [330, 520] },
      back_glass: { type: "tempered", features: [], price: [260, 500] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "SUBARU", model: "ASCENT", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [360, 570] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "HONDA", model: "CR-V", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [310, 490] },
      back_glass: { type: "tempered", features: [], price: [280, 550] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "HONDA", model: "PILOT", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [330, 520] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "CHEVROLET", model: "TAHOE", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [380, 600] },
      back_glass: { type: "tempered", features: [], price: [380, 750] },
      front_left_door: { type: "tempered", features: [], price: [130, 260] },
      front_right_door: { type: "tempered", features: [], price: [130, 260] },
      rear_left_door: { type: "tempered", features: [], price: [130, 260] },
      rear_right_door: { type: "tempered", features: [], price: [130, 260] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "CHEVROLET", model: "EQUINOX", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [280, 450] },
      back_glass: { type: "tempered", features: [], price: [260, 500] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "FORD", model: "EXPLORER", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [340, 540] },
      back_glass: { type: "tempered", features: [], price: [320, 650] },
      front_left_door: { type: "tempered", features: [], price: [120, 240] },
      front_right_door: { type: "tempered", features: [], price: [120, 240] },
      rear_left_door: { type: "tempered", features: [], price: [120, 240] },
      rear_right_door: { type: "tempered", features: [], price: [120, 240] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "FORD", model: "ESCAPE", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [260, 500] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "FORD", model: "EXPEDITION", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: true, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor", "heated"], price: [420, 700] },
      back_glass: { type: "tempered", features: [], price: [400, 800] },
      front_left_door: { type: "tempered", features: [], price: [140, 280] },
      front_right_door: { type: "tempered", features: [], price: [140, 280] },
      rear_left_door: { type: "tempered", features: [], price: [140, 280] },
      rear_right_door: { type: "tempered", features: [], price: [140, 280] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  { make: "FORD", model: "BRONCO", year: 2023, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [320, 500] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [120, 240] },
      front_right_door: { type: "tempered", features: [], price: [120, 240] },
      rear_left_door: { type: "tempered", features: [], price: [120, 240] },
      rear_right_door: { type: "tempered", features: [], price: [120, 240] }
    }, confidence: 0.82, sources: ["derived"] },

  { make: "JEEP", model: "GRAND CHEROKEE", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [350, 550] },
      back_glass: { type: "tempered", features: [], price: [320, 650] },
      front_left_door: { type: "tempered", features: [], price: [120, 240] },
      front_right_door: { type: "tempered", features: [], price: [120, 240] },
      rear_left_door: { type: "tempered", features: [], price: [120, 240] },
      rear_right_door: { type: "tempered", features: [], price: [120, 240] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "JEEP", model: "WRANGLER", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [280, 450] },
      back_glass: { type: "tempered", features: [], price: [250, 500] },
      front_left_door: { type: "tempered", features: [], price: [100, 200] },
      front_right_door: { type: "tempered", features: [], price: [100, 200] },
      rear_left_door: { type: "tempered", features: [], price: [100, 200] },
      rear_right_door: { type: "tempered", features: [], price: [100, 200] }
    }, confidence: 0.85, sources: ["derived"] },

  { make: "GMC", model: "YUKON", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [380, 600] },
      back_glass: { type: "tempered", features: [], price: [380, 750] },
      front_left_door: { type: "tempered", features: [], price: [130, 260] },
      front_right_door: { type: "tempered", features: [], price: [130, 260] },
      rear_left_door: { type: "tempered", features: [], price: [130, 260] },
      rear_right_door: { type: "tempered", features: [], price: [130, 260] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "DODGE", model: "DURANGO", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [310, 490] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.85, sources: ["derived"] },

  { make: "HYUNDAI", model: "TUCSON", year: 2023, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [260, 520] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "HYUNDAI", model: "SANTA FE", year: 2023, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [310, 500] },
      back_glass: { type: "tempered", features: [], price: [280, 560] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "KIA", model: "SORENTO", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [320, 520] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [100, 220] },
      front_right_door: { type: "tempered", features: [], price: [100, 220] },
      rear_left_door: { type: "tempered", features: [], price: [100, 220] },
      rear_right_door: { type: "tempered", features: [], price: [100, 220] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "KIA", model: "TELLURIDE", year: 2023, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [340, 540] },
      back_glass: { type: "tempered", features: [], price: [320, 640] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  { make: "KIA", model: "SPORTAGE", year: 2023, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [260, 520] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  { make: "NISSAN", model: "ROGUE", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [280, 450] },
      back_glass: { type: "tempered", features: [], price: [260, 500] },
      front_left_door: { type: "tempered", features: [], price: [100, 210] },
      front_right_door: { type: "tempered", features: [], price: [100, 210] },
      rear_left_door: { type: "tempered", features: [], price: [100, 210] },
      rear_right_door: { type: "tempered", features: [], price: [100, 210] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  { make: "NISSAN", model: "PATHFINDER", year: 2022, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [320, 510] },
      back_glass: { type: "tempered", features: [], price: [300, 600] },
      front_left_door: { type: "tempered", features: [], price: [110, 230] },
      front_right_door: { type: "tempered", features: [], price: [110, 230] },
      rear_left_door: { type: "tempered", features: [], price: [110, 230] },
      rear_right_door: { type: "tempered", features: [], price: [110, 230] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  // === SEDANS ===
  { make: "TOYOTA", model: "CAMRY", year: 2022, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [280, 450] },
      back_glass: { type: "tempered", features: [], price: [250, 480] },
      front_left_door: { type: "tempered", features: [], price: [100, 200] },
      front_right_door: { type: "tempered", features: [], price: [100, 200] },
      rear_left_door: { type: "tempered", features: [], price: [100, 200] },
      rear_right_door: { type: "tempered", features: [], price: [100, 200] }
    }, confidence: 0.92, sources: ["derived", "market_data"] },

  { make: "TOYOTA", model: "COROLLA", year: 2022, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [250, 400] },
      back_glass: { type: "tempered", features: [], price: [220, 420] },
      front_left_door: { type: "tempered", features: [], price: [90, 190] },
      front_right_door: { type: "tempered", features: [], price: [90, 190] },
      rear_left_door: { type: "tempered", features: [], price: [90, 190] },
      rear_right_door: { type: "tempered", features: [], price: [90, 190] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "HONDA", model: "CIVIC", year: 2022, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [260, 420] },
      back_glass: { type: "tempered", features: [], price: [230, 440] },
      front_left_door: { type: "tempered", features: [], price: [90, 190] },
      front_right_door: { type: "tempered", features: [], price: [90, 190] },
      rear_left_door: { type: "tempered", features: [], price: [90, 190] },
      rear_right_door: { type: "tempered", features: [], price: [90, 190] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "HONDA", model: "ACCORD", year: 2022, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [290, 460] },
      back_glass: { type: "tempered", features: [], price: [250, 480] },
      front_left_door: { type: "tempered", features: [], price: [100, 200] },
      front_right_door: { type: "tempered", features: [], price: [100, 200] },
      rear_left_door: { type: "tempered", features: [], price: [100, 200] },
      rear_right_door: { type: "tempered", features: [], price: [100, 200] }
    }, confidence: 0.90, sources: ["derived", "market_data"] },

  { make: "HYUNDAI", model: "ELANTRA", year: 2023, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [250, 400] },
      back_glass: { type: "tempered", features: [], price: [220, 420] },
      front_left_door: { type: "tempered", features: [], price: [90, 190] },
      front_right_door: { type: "tempered", features: [], price: [90, 190] },
      rear_left_door: { type: "tempered", features: [], price: [90, 190] },
      rear_right_door: { type: "tempered", features: [], price: [90, 190] }
    }, confidence: 0.85, sources: ["derived"] },

  { make: "HYUNDAI", model: "SONATA", year: 2023, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [280, 450] },
      back_glass: { type: "tempered", features: [], price: [250, 480] },
      front_left_door: { type: "tempered", features: [], price: [100, 200] },
      front_right_door: { type: "tempered", features: [], price: [100, 200] },
      rear_left_door: { type: "tempered", features: [], price: [100, 200] },
      rear_right_door: { type: "tempered", features: [], price: [100, 200] }
    }, confidence: 0.85, sources: ["derived"] },

  { make: "NISSAN", model: "ALTIMA", year: 2022, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: false, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas"], price: [260, 420] },
      back_glass: { type: "tempered", features: [], price: [230, 440] },
      front_left_door: { type: "tempered", features: [], price: [100, 200] },
      front_right_door: { type: "tempered", features: [], price: [100, 200] },
      rear_left_door: { type: "tempered", features: [], price: [100, 200] },
      rear_right_door: { type: "tempered", features: [], price: [100, 200] }
    }, confidence: 0.88, sources: ["derived", "market_data"] },

  // === EVs ===
  { make: "TESLA", model: "MODEL Y", year: 2023, body: "SUV", layout: "suv", doors: 4,
    features: { adas: true, rain_sensor: true, heated: true, acoustic: true },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor", "heated", "acoustic"], price: [450, 750] },
      back_glass: { type: "tempered", features: [], price: [400, 800] },
      front_left_door: { type: "tempered", features: [], price: [150, 300] },
      front_right_door: { type: "tempered", features: [], price: [150, 300] },
      rear_left_door: { type: "tempered", features: [], price: [150, 300] },
      rear_right_door: { type: "tempered", features: [], price: [150, 300] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  { make: "TESLA", model: "MODEL 3", year: 2023, body: "SEDAN", layout: "sedan", doors: 4,
    features: { adas: true, rain_sensor: true, heated: true, acoustic: true },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor", "heated", "acoustic"], price: [420, 700] },
      back_glass: { type: "tempered", features: [], price: [380, 750] },
      front_left_door: { type: "tempered", features: [], price: [140, 280] },
      front_right_door: { type: "tempered", features: [], price: [140, 280] },
      rear_left_door: { type: "tempered", features: [], price: [140, 280] },
      rear_right_door: { type: "tempered", features: [], price: [140, 280] }
    }, confidence: 0.82, sources: ["derived"] },

  // === VANS ===
  { make: "HONDA", model: "ODYSSEY", year: 2022, body: "VAN", layout: "van", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [280, 550] },
      front_left_door: { type: "tempered", features: [], price: [110, 220] },
      front_right_door: { type: "tempered", features: [], price: [110, 220] },
      sliding_left_door: { type: "tempered", features: [], price: [150, 320] },
      sliding_right_door: { type: "tempered", features: [], price: [150, 320] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  { make: "TOYOTA", model: "SIENNA", year: 2022, body: "VAN", layout: "van", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [310, 500] },
      back_glass: { type: "tempered", features: [], price: [280, 550] },
      front_left_door: { type: "tempered", features: [], price: [110, 220] },
      front_right_door: { type: "tempered", features: [], price: [110, 220] },
      sliding_left_door: { type: "tempered", features: [], price: [160, 330] },
      sliding_right_door: { type: "tempered", features: [], price: [160, 330] }
    }, confidence: 0.85, sources: ["derived", "market_data"] },

  { make: "CHRYSLER", model: "PACIFICA", year: 2022, body: "VAN", layout: "van", doors: 4,
    features: { adas: true, rain_sensor: true, heated: false, acoustic: false },
    glass: {
      windshield: { type: "laminated", features: ["adas", "rain_sensor"], price: [300, 480] },
      back_glass: { type: "tempered", features: [], price: [280, 550] },
      front_left_door: { type: "tempered", features: [], price: [110, 220] },
      front_right_door: { type: "tempered", features: [], price: [110, 220] },
      sliding_left_door: { type: "tempered", features: [], price: [150, 320] },
      sliding_right_door: { type: "tempered", features: [], price: [150, 320] }
    }, confidence: 0.85, sources: ["derived"] }
];

// ============================================================
// GENERATOR
// ============================================================
function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function main() {
  let count = 0;

  for (const v of TOP_VEHICLES) {
    const makeSlug = slugify(v.make);
    const modelSlug = slugify(v.model);
    const dir = path.join(BASE, makeSlug, modelSlug);
    
    fs.mkdirSync(dir, { recursive: true });

    const profile = {
      year: v.year,
      make: v.make,
      model: v.model,
      body_class: v.body,
      glass_layout: v.layout,
      doors: v.doors,
      features: v.features,
      glass: v.glass,
      confidence: v.confidence,
      last_updated: "2026-04-17",
      sources: v.sources
    };

    const filePath = path.join(dir, `${v.year}.json`);
    fs.writeFileSync(filePath, JSON.stringify(profile, null, 2));
    count++;
    console.log(`✅ ${v.make} ${v.model} ${v.year}`);
  }

  console.log(`\n🚗 Generated ${count} vehicle profiles`);
}

main();
