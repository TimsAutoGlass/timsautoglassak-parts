#!/usr/bin/env node
/**
 * NHTSA MODELS INGEST
 * Pulls models for each make from the NHTSA vPIC API.
 * 
 * API: https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/{make}?format=json
 * 
 * Usage: node scripts/ingest/fetch-nhtsa-models.js [--make FORD] [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const MAKES_FILE = path.join(__dirname, '..', '..', 'data', 'vehicles-index', 'makes.json');
const MODELS_DIR = path.join(__dirname, '..', '..', 'data', 'vehicles-index', 'models');

// Rate limiting — NHTSA asks for polite usage
const DELAY_MS = 500;

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchModelsForMake(make) {
  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(make)}?format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${make}`);
  
  const data = await response.json();
  return data.Results
    .map(r => r.Model_Name.toUpperCase().trim())
    .filter(m => m.length > 0)
    .sort();
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  const singleMake = process.argv.find((a, i) => process.argv[i-1] === '--make');
  
  // Load makes
  const makesData = JSON.parse(fs.readFileSync(MAKES_FILE, 'utf8'));
  let makes = makesData.makes || [];
  
  if (singleMake) {
    makes = makes.filter(m => m === singleMake.toUpperCase());
    if (makes.length === 0) {
      console.error(`❌ Make "${singleMake}" not found in makes.json`);
      process.exit(1);
    }
  }

  console.log(`🔄 Fetching models for ${makes.length} makes...`);
  fs.mkdirSync(MODELS_DIR, { recursive: true });

  let totalModels = 0;

  for (const make of makes) {
    try {
      const models = await fetchModelsForMake(make);
      const slug = slugify(make);
      
      const output = {
        make: make,
        total_models: models.length,
        source: 'NHTSA vPIC API',
        last_updated: new Date().toISOString().split('T')[0],
        models: models
      };

      if (isDryRun) {
        console.log(`  ${make}: ${models.length} models`);
      } else {
        const filePath = path.join(MODELS_DIR, `${slug}.json`);
        fs.writeFileSync(filePath, JSON.stringify(output, null, 2));
        console.log(`✅ ${make}: ${models.length} models → ${slug}.json`);
      }
      
      totalModels += models.length;
      await sleep(DELAY_MS);
    } catch (err) {
      console.error(`❌ ${make}: ${err.message}`);
    }
  }

  console.log(`\n🚗 Total: ${totalModels} models across ${makes.length} makes`);
}

main();
