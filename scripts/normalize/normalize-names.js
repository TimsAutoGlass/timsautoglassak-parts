#!/usr/bin/env node
/**
 * NAME NORMALIZER
 * Enforces consistent naming conventions across all vehicle data files.
 * 
 * Rules:
 * - All makes: UPPERCASE
 * - All models: UPPERCASE
 * - Known aliases normalized (F150 → F-150, Chevy → CHEVROLET, etc.)
 * 
 * Usage: node scripts/normalize/normalize-names.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// NORMALIZATION RULES
// ============================================================
const MAKE_ALIASES = {
  'CHEVY': 'CHEVROLET',
  'MERCEDES': 'MERCEDES-BENZ',
  'MERC': 'MERCEDES-BENZ',
  'MB': 'MERCEDES-BENZ',
  'VW': 'VOLKSWAGEN',
  'LANDROVER': 'LAND ROVER',
  'LAND-ROVER': 'LAND ROVER',
  'ALFA': 'ALFA ROMEO',
  'ALFAROMEO': 'ALFA ROMEO',
};

const MODEL_ALIASES = {
  'F150': 'F-150',
  'F250': 'F-250',
  'F350': 'F-350',
  'SILVERADO1500': 'SILVERADO 1500',
  'SILVERADO2500': 'SILVERADO 2500HD',
  'SIERRA1500': 'SIERRA 1500',
  'SIERRA2500': 'SIERRA 2500HD',
  'CRV': 'CR-V',
  'HRV': 'HR-V',
  'RAV-4': 'RAV4',
  'GRAND CHEROKEE L': 'GRAND CHEROKEE',
  '4-RUNNER': '4RUNNER',
  'FOURRUNNER': '4RUNNER',
  'CROSSTREK': 'CROSSTREK',  // Already correct
  'X-TRAIL': 'ROGUE',
  'WRANGLER JK': 'WRANGLER',
  'WRANGLER JL': 'WRANGLER',
  'WRANGLER UNLIMITED': 'WRANGLER',
};

function normalizeMake(make) {
  const upper = make.toUpperCase().trim();
  return MAKE_ALIASES[upper] || upper;
}

function normalizeModel(model) {
  const upper = model.toUpperCase().trim();
  return MODEL_ALIASES[upper] || upper;
}

// ============================================================
// FILE PROCESSOR
// ============================================================
function processJsonFile(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let changed = false;

  // Normalize make
  if (content.make) {
    const normalized = normalizeMake(content.make);
    if (normalized !== content.make) {
      console.log(`  🔧 make: "${content.make}" → "${normalized}"`);
      content.make = normalized;
      changed = true;
    }
  }

  // Normalize model
  if (content.model) {
    const normalized = normalizeModel(content.model);
    if (normalized !== content.model) {
      console.log(`  🔧 model: "${content.model}" → "${normalized}"`);
      content.model = normalized;
      changed = true;
    }
  }

  // Normalize models array
  if (content.models && Array.isArray(content.models)) {
    content.models = content.models.map(m => {
      const normalized = normalizeModel(m);
      if (normalized !== m) {
        console.log(`  🔧 model: "${m}" → "${normalized}"`);
        changed = true;
      }
      return normalized;
    });
    // Deduplicate
    const deduped = [...new Set(content.models)].sort();
    if (deduped.length !== content.models.length) {
      console.log(`  🗑️  Removed ${content.models.length - deduped.length} duplicates`);
      content.models = deduped;
      changed = true;
    }
  }

  return { content, changed };
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
  const isDryRun = process.argv.includes('--dry-run');
  const dataDir = path.join(__dirname, '..', '..', 'data');
  
  let filesProcessed = 0;
  let filesChanged = 0;

  console.log('🔄 Normalizing vehicle data names...\n');

  walkDir(dataDir, (filePath) => {
    filesProcessed++;
    const relPath = path.relative(dataDir, filePath);
    
    try {
      const { content, changed } = processJsonFile(filePath);
      
      if (changed) {
        filesChanged++;
        if (!isDryRun) {
          fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
          console.log(`  ✅ Updated: ${relPath}`);
        } else {
          console.log(`  🏁 Would update: ${relPath}`);
        }
      }
    } catch (err) {
      // Skip non-vehicle JSON files
    }
  });

  console.log(`\n========================================`);
  console.log(`Files processed: ${filesProcessed}`);
  console.log(`Files changed:   ${filesChanged}`);
  console.log(`========================================`);
}

main();
