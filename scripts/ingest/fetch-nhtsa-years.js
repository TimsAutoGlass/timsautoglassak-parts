#!/usr/bin/env node
/**
 * NHTSA YEARS INGEST
 * Pulls model year data for each make/model from NHTSA.
 * Uses GetModelsForMakeYear to determine valid year ranges.
 * 
 * Usage: node scripts/ingest/fetch-nhtsa-years.js [--make FORD] [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const MODELS_DIR = path.join(__dirname, '..', '..', 'data', 'vehicles-index', 'models');
const YEARS_DIR = path.join(__dirname, '..', '..', 'data', 'vehicles-index', 'years');

const CURRENT_YEAR = new Date().getFullYear() + 1; // Include next model year
const START_YEAR = 2000;
const DELAY_MS = 300;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkModelYear(make, year) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.Results.map(r => r.Model_Name.toUpperCase().trim());
  } catch {
    return [];
  }
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const singleMake = process.argv.find((a, i) => process.argv[i-1] === '--make');
  
  // Get all model files
  let modelFiles = fs.readdirSync(MODELS_DIR).filter(f => f.endsWith('.json'));
  
  if (singleMake) {
    const slug = slugify(singleMake);
    modelFiles = modelFiles.filter(f => f === `${slug}.json`);
  }

  console.log(`🔄 Processing ${modelFiles.length} makes for year data...`);
  console.log(`📅 Year range: ${START_YEAR} - ${CURRENT_YEAR}\n`);

  for (const file of modelFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(MODELS_DIR, file), 'utf8'));
    const makeSlug = slugify(data.make);
    const makeYearsDir = path.join(YEARS_DIR, makeSlug);
    
    fs.mkdirSync(makeYearsDir, { recursive: true });
    console.log(`\n📂 ${data.make} (${data.models.length} models)`);

    // Sample years to determine range (check every 3rd year for speed)
    for (const model of data.models.slice(0, 20)) { // Limit to top 20 models per make
      const modelSlug = slugify(model);
      const yearFile = path.join(makeYearsDir, `${modelSlug}.json`);
      
      // Skip if already exists
      if (fs.existsSync(yearFile) && !process.argv.includes('--force')) {
        continue;
      }

      const validYears = [];
      
      // Check sample years to find range
      for (let y = START_YEAR; y <= CURRENT_YEAR; y += 2) {
        const models = await checkModelYear(data.make, y);
        if (models.includes(model)) {
          validYears.push(y);
          // Also check the year before and after
          if (y > START_YEAR) {
            const prevModels = await checkModelYear(data.make, y - 1);
            if (prevModels.includes(model)) validYears.push(y - 1);
          }
        }
        await sleep(DELAY_MS);
      }

      if (validYears.length > 0) {
        const sorted = [...new Set(validYears)].sort((a, b) => a - b);
        const output = {
          make: data.make,
          model: model,
          production_start: sorted[0],
          production_end: sorted[sorted.length - 1],
          total_years: sorted[sorted.length - 1] - sorted[0] + 1,
          source: 'NHTSA vPIC API',
          last_updated: new Date().toISOString().split('T')[0],
          years: Array.from(
            { length: sorted[sorted.length - 1] - sorted[0] + 1 },
            (_, i) => ({ year: sorted[0] + i, body_class: "UNKNOWN", doors: 4 })
          )
        };

        if (!isDryRun) {
          fs.writeFileSync(yearFile, JSON.stringify(output, null, 2));
        }
        console.log(`  ✅ ${model}: ${sorted[0]}–${sorted[sorted.length - 1]}`);
      }
    }
  }
}

main();
