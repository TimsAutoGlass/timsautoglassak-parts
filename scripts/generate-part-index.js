const fs = require('fs');
const path = require('path');

const PARTS_DIR = path.join(__dirname, '..', 'data', 'parts');
const OUT_DIR = path.join(__dirname, '..', 'data', 'parts-index');

function generateReverseIndex() {
  console.log('🔄 Generating Part Number Reverse Index & Interchange Guide...');
  
  const index = {}; // { "FW04567": { features: [], fitment: [{make, model, year}] } }

  // Recursively traverse
  function traverseDirs(currentPath, makes, models, years) {
    if (!fs.existsSync(currentPath)) return;
    
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        if (!makes) traverseDirs(fullPath, item, null, null);
        else if (!models) traverseDirs(fullPath, makes, item, null);
        else if (!years) traverseDirs(fullPath, makes, models, item);
      } else if (item.endsWith('.json')) {
        const glassType = item.replace('.json', '');
        const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        
        if (data.parts && Array.isArray(data.parts)) {
          for (const p of data.parts) {
            if (!p.part_number) continue;
            const pid = p.part_number.toUpperCase().replace(/[^A-Z0-9]/g, '');
            
            if (!index[pid]) {
              index[pid] = {
                part_number: p.part_number.toUpperCase(),
                types: new Set(),
                features: new Set(),
                fitment: []
              };
            }
            
            index[pid].types.add(p.type);
            if (p.features) p.features.forEach(f => index[pid].features.add(f));
            
            // Add fitment map
            index[pid].fitment.push({
              make: makes.toUpperCase(),
              model: models.toUpperCase().replace(/-/g, ' '),
              year: years,
              glass_type: glassType.replace('_', ' ').toUpperCase()
            });
          }
        }
      }
    }
  }

  traverseDirs(PARTS_DIR, null, null, null);

  // Write out index
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const summary = [];
  let count = 0;

  Object.keys(index).forEach(pid => {
    const record = index[pid];
    // Convert sets to arrays
    record.types = Array.from(record.types);
    record.features = Array.from(record.features);
    
    // Sort fitment by year descending
    record.fitment.sort((a, b) => parseInt(b.year) - parseInt(a.year));
    
    // De-dupe fitment to compress size
    const uniqueFit = [];
    const seenMap = new Set();
    record.fitment.forEach(f => {
      const sig = `${f.make}|${f.model}|${f.year}|${f.glass_type}`;
      if (!seenMap.has(sig)) {
        seenMap.add(sig);
        uniqueFit.push(f);
      }
    });
    record.fitment = uniqueFit;

    fs.writeFileSync(path.join(OUT_DIR, `${pid.toLowerCase()}.json`), JSON.stringify(record, null, 2));
    summary.push({ pid, count: record.fitment.length });
    count++;
  });

  // Write a master index of ALL part numbers for search autocomplete
  fs.writeFileSync(
    path.join(OUT_DIR, '_master.json'), 
    JSON.stringify(summary.sort((a, b) => b.count - a.count), null, 2)
  );

  console.log(`✅ Generated ${count} unique part profiles in /data/parts-index/`);
}

generateReverseIndex();
