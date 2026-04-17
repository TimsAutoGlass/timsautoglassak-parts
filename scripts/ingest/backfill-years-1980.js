#!/usr/bin/env node
/**
 * FAST BACKFILL 1980-1999
 * Queries NHTSA by Make+Year (much faster) to extend existing model files backwards.
 * 
 * Usage: node scripts/ingest/backfill-years-1980.js
 */

const fs = require('fs');
const path = require('path');

const YEARS_DIR = path.join(__dirname, '..', '..', 'data', 'vehicles-index', 'years');

const START_YEAR = 1980;
const END_YEAR = 1999;
const DELAY_MS = 250;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchModelsForMakeYear(make, year) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.Results.map(r => r.Model_Name.toUpperCase().trim());
  } catch (e) {
    return [];
  }
}

async function main() {
  console.log(`🔄 Backfilling 1980-1999 data using fast per-make queries...`);
  
  // Read all existing year files to know what we have
  const makeDirs = fs.readdirSync(YEARS_DIR).filter(d => fs.statSync(path.join(YEARS_DIR, d)).isDirectory());
  
  let totalUpdated = 0;

  for (const makeSlug of makeDirs) {
    const makeDir = path.join(YEARS_DIR, makeSlug);
    const modelFiles = fs.readdirSync(makeDir).filter(f => f.endsWith('.json'));
    if (modelFiles.length === 0) continue;

    // Read finding actual make name from the first file
    const sampleData = JSON.parse(fs.readFileSync(path.join(makeDir, modelFiles[0]), 'utf8'));
    const make = sampleData.make;

    console.log(`\n📂 ${make}`);
    
    // Track discovered models per year
    const modelsByYear = {};

    for (let y = START_YEAR; y <= END_YEAR; y++) {
      const models = await fetchModelsForMakeYear(make, y);
      if (models.length > 0) {
        modelsByYear[y] = models;
      }
      await sleep(DELAY_MS);
    }

    // Now update the files
    for (const file of modelFiles) {
      const filePath = path.join(makeDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const model = data.model;

      // Check modelsByYear to find the earliest year this model appeared
      let earliestYear = data.production_start;
      for (let y = START_YEAR; y <= END_YEAR; y++) {
        if (modelsByYear[y] && modelsByYear[y].includes(model)) {
          if (y < earliestYear) earliestYear = y;
        }
      }

      if (earliestYear < data.production_start) {
        console.log(`  🔧 ${model}: Expanded start year from ${data.production_start} down to ${earliestYear}`);
        data.production_start = earliestYear;
        // Total years based on the new range
        data.total_years = data.production_end - data.production_start + 1;
        // Rebuild years array
        data.years = Array.from(
          { length: data.total_years },
          (_, i) => ({ year: data.production_start + i, body_class: "UNKNOWN", doors: 4 })
        );
        data.last_updated = new Date().toISOString().split('T')[0];
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        totalUpdated++;
      }
    }
  }

  console.log(`\n🎉 Backfill complete! Updated ${totalUpdated} model configurations.`);
}

main();
