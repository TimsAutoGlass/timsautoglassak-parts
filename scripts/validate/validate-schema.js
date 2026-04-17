#!/usr/bin/env node
/**
 * SCHEMA VALIDATOR
 * Validates all JSON data files against their respective schemas.
 * 
 * Usage: node scripts/validate/validate-schema.js
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const SCHEMA_DIR = path.join(__dirname, '..', '..', 'schema');

// Simple JSON structure validation (no ajv dependency required for basic checks)
function validateVehicleFile(data, filePath) {
  const errors = [];
  const rel = path.relative(DATA_DIR, filePath);

  if (!data.make || typeof data.make !== 'string') errors.push(`${rel}: missing or invalid "make"`);
  if (!data.model || typeof data.model !== 'string') errors.push(`${rel}: missing or invalid "model"`);
  if (data.year && (typeof data.year !== 'number' || data.year < 1990 || data.year > 2030)) {
    errors.push(`${rel}: invalid "year" (${data.year})`);
  }
  if (data.make && data.make !== data.make.toUpperCase()) {
    errors.push(`${rel}: make "${data.make}" is not ALL CAPS`);
  }
  if (data.body_class && !['SEDAN','SUV','PICKUP','COUPE','HATCHBACK','VAN','WAGON','CONVERTIBLE','CROSSOVER'].includes(data.body_class)) {
    errors.push(`${rel}: invalid body_class "${data.body_class}"`);
  }
  if (data.confidence !== undefined && (data.confidence < 0 || data.confidence > 1)) {
    errors.push(`${rel}: confidence must be 0-1, got ${data.confidence}`);
  }
  if (data.glass) {
    for (const [panel, info] of Object.entries(data.glass)) {
      if (info.estimated_price || info.price) {
        const price = info.estimated_price || info.price;
        if (!Array.isArray(price) || price.length !== 2) {
          errors.push(`${rel}: glass.${panel} price must be [min, max] array`);
        } else if (price[0] > price[1]) {
          errors.push(`${rel}: glass.${panel} price min (${price[0]}) > max (${price[1]})`);
        }
      }
    }
  }

  return errors;
}

function validateMakesFile(data, filePath) {
  const errors = [];
  if (!data.makes || !Array.isArray(data.makes)) {
    errors.push('makes.json: missing or invalid "makes" array');
    return errors;
  }
  for (const make of data.makes) {
    if (make !== make.toUpperCase()) {
      errors.push(`makes.json: "${make}" is not ALL CAPS`);
    }
  }
  const dupes = data.makes.filter((m, i) => data.makes.indexOf(m) !== i);
  if (dupes.length > 0) {
    errors.push(`makes.json: duplicate makes: ${dupes.join(', ')}`);
  }
  return errors;
}

function validateModelFile(data, filePath) {
  const errors = [];
  const rel = path.relative(DATA_DIR, filePath);
  if (!data.make) errors.push(`${rel}: missing "make"`);
  if (!data.models || !Array.isArray(data.models)) errors.push(`${rel}: missing "models" array`);
  if (data.models) {
    const dupes = data.models.filter((m, i) => data.models.indexOf(m) !== i);
    if (dupes.length > 0) errors.push(`${rel}: duplicate models: ${dupes.join(', ')}`);
  }
  return errors;
}

function validateGlassLayout(data, filePath) {
  const errors = [];
  const rel = path.relative(DATA_DIR, filePath);
  if (!data.type) errors.push(`${rel}: missing "type"`);
  if (!data.panels || !Array.isArray(data.panels)) errors.push(`${rel}: missing "panels" array`);
  return errors;
}

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (entry.name.endsWith('.json')) {
      callback(fullPath);
    }
  }
}

function main() {
  console.log('🔍 Validating all data files...\n');
  
  let totalFiles = 0;
  let totalErrors = 0;
  const allErrors = [];

  // Validate makes.json
  const makesPath = path.join(DATA_DIR, 'vehicles-index', 'makes.json');
  if (fs.existsSync(makesPath)) {
    totalFiles++;
    const data = JSON.parse(fs.readFileSync(makesPath, 'utf8'));
    const errors = validateMakesFile(data, makesPath);
    if (errors.length > 0) {
      allErrors.push(...errors);
      totalErrors += errors.length;
    }
    console.log(`  ${errors.length === 0 ? '✅' : '❌'} makes.json (${data.makes?.length || 0} makes)`);
  }

  // Validate model files
  const modelsDir = path.join(DATA_DIR, 'vehicles-index', 'models');
  let modelCount = 0;
  walkDir(modelsDir, (filePath) => {
    totalFiles++;
    modelCount++;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const errors = validateModelFile(data, filePath);
      allErrors.push(...errors);
      totalErrors += errors.length;
    } catch (e) {
      allErrors.push(`${path.relative(DATA_DIR, filePath)}: invalid JSON`);
      totalErrors++;
    }
  });
  console.log(`  ✅ Model files: ${modelCount}`);

  // Validate year files
  const yearsDir = path.join(DATA_DIR, 'vehicles-index', 'years');
  let yearCount = 0;
  walkDir(yearsDir, (filePath) => {
    totalFiles++;
    yearCount++;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (data.make && data.make !== data.make.toUpperCase()) {
        allErrors.push(`${path.relative(DATA_DIR, filePath)}: make not ALL CAPS`);
        totalErrors++;
      }
    } catch (e) {
      allErrors.push(`${path.relative(DATA_DIR, filePath)}: invalid JSON`);
      totalErrors++;
    }
  });
  console.log(`  ✅ Year files: ${yearCount}`);

  // Validate vehicle profiles
  const vehiclesDir = path.join(DATA_DIR, 'vehicles');
  let vehicleCount = 0;
  walkDir(vehiclesDir, (filePath) => {
    totalFiles++;
    vehicleCount++;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const errors = validateVehicleFile(data, filePath);
      allErrors.push(...errors);
      totalErrors += errors.length;
    } catch (e) {
      allErrors.push(`${path.relative(DATA_DIR, filePath)}: invalid JSON`);
      totalErrors++;
    }
  });
  console.log(`  ✅ Vehicle profiles: ${vehicleCount}`);

  // Validate glass layouts
  const layoutsDir = path.join(DATA_DIR, 'glass', 'layouts');
  let layoutCount = 0;
  walkDir(layoutsDir, (filePath) => {
    totalFiles++;
    layoutCount++;
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const errors = validateGlassLayout(data, filePath);
      allErrors.push(...errors);
      totalErrors += errors.length;
    } catch (e) {
      allErrors.push(`${path.relative(DATA_DIR, filePath)}: invalid JSON`);
      totalErrors++;
    }
  });
  console.log(`  ✅ Glass layouts: ${layoutCount}`);

  // Summary
  console.log(`\n========================================`);
  console.log(`📊 VALIDATION SUMMARY`);
  console.log(`========================================`);
  console.log(`Total files:  ${totalFiles}`);
  console.log(`Errors:       ${totalErrors}`);
  console.log(`Status:       ${totalErrors === 0 ? '✅ ALL PASS' : '❌ ERRORS FOUND'}`);
  console.log(`========================================`);

  if (allErrors.length > 0) {
    console.log('\n❌ Errors:');
    allErrors.forEach(e => console.log(`  - ${e}`));
    process.exit(1);
  }
}

main();
