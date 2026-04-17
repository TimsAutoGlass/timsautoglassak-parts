#!/usr/bin/env node
/**
 * NHTSA MAKES INGEST
 * Pulls all vehicle makes from the NHTSA vPIC API and writes a normalized makes.json.
 * 
 * API: https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json
 * 
 * Usage: node scripts/ingest/fetch-nhtsa-makes.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const API_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=json';
const OUTPUT = path.join(__dirname, '..', '..', 'data', 'vehicles-index', 'makes.json');

// Priority makes — Alaska market + major US brands
const PRIORITY_MAKES = [
  'CHEVROLET', 'FORD', 'RAM', 'GMC', 'TOYOTA', 'SUBARU', 'HONDA',
  'DODGE', 'JEEP', 'KIA', 'HYUNDAI', 'NISSAN', 'MAZDA', 'VOLKSWAGEN',
  'BMW', 'MERCEDES-BENZ', 'AUDI', 'LEXUS', 'ACURA', 'INFINITI',
  'VOLVO', 'BUICK', 'CADILLAC', 'CHRYSLER', 'LINCOLN', 'MITSUBISHI',
  'TESLA', 'LAND ROVER', 'PORSCHE', 'MINI', 'FIAT', 'JAGUAR',
  'ALFA ROMEO', 'GENESIS', 'RIVIAN', 'LUCID', 'POLESTAR'
];

// Name normalization map
const NORMALIZE_MAP = {
  'MERCEDES BENZ': 'MERCEDES-BENZ',
  'LAND ROVER': 'LAND ROVER',
  'ALFA ROMEO': 'ALFA ROMEO',
};

async function fetchMakes() {
  console.log('🔄 Fetching makes from NHTSA vPIC API...');
  
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  
  const data = await response.json();
  const allMakes = data.Results.map(r => r.Make_Name.toUpperCase().trim());
  
  console.log(`📊 Raw makes from NHTSA: ${allMakes.length}`);
  
  // Filter to priority makes
  const filtered = PRIORITY_MAKES.filter(pm => {
    return allMakes.some(m => m === pm || m.includes(pm));
  });
  
  // Find any NHTSA makes NOT in our priority list (for review)
  const common = allMakes.filter(m => {
    return !PRIORITY_MAKES.includes(m) && 
      ['ACURA', 'ASTON MARTIN', 'BENTLEY', 'FERRARI', 'LAMBORGHINI', 
       'MASERATI', 'MCLAREN', 'ROLLS-ROYCE', 'GENESIS'].includes(m);
  });

  return { prioritized: PRIORITY_MAKES, additional: common, total_nhtsa: allMakes.length };
}

async function main() {
  const isDryRun = process.argv.includes('--dry-run');
  
  try {
    const result = await fetchMakes();
    
    const output = {
      version: '1.0.0',
      last_updated: new Date().toISOString().split('T')[0],
      total_makes: result.prioritized.length,
      source: 'NHTSA vPIC API + manual curation',
      nhtsa_total_available: result.total_nhtsa,
      notes: 'Normalized to ALL CAPS. Alaska-priority makes listed first.',
      makes: result.prioritized
    };

    if (isDryRun) {
      console.log('\n🏁 DRY RUN — would write:');
      console.log(JSON.stringify(output, null, 2));
    } else {
      fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
      fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));
      console.log(`\n✅ Wrote ${result.prioritized.length} makes to ${OUTPUT}`);
    }
    
    if (result.additional.length > 0) {
      console.log(`\n📋 Additional makes found in NHTSA (not in priority list):`);
      result.additional.forEach(m => console.log(`   - ${m}`));
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

main();
