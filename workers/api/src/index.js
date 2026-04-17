import { AutoRouter } from 'itty-router';

// Helper to query R2 bucket and return JSON
async function fetchR2Json(bucket, path) {
  const object = await bucket.get(path);
  if (!object) return null;
  const json = await object.json();
  return json;
}

const router = AutoRouter();

/**
 * GET /api/v1/vehicles/:make/:model/:year
 * Returns the parts intelligence profile for a specific vehicle.
 */
router.get('/api/v1/vehicles/:make/:model/:year', async (request, env) => {
  const { make, model, year } = request.params;
  
  // Normalize parameters matching repo structure
  const makeSlug = make.toLowerCase();
  const modelSlug = model.toLowerCase();
  
  // Target multiple glass types, aggregate them
  const glassTypes = ['windshield', 'back_glass'];
  const results = {};

  for (const gType of glassTypes) {
    const r2Path = `data/parts/${makeSlug}/${modelSlug}/${year}/${gType}.json`;
    const data = await fetchR2Json(env.PARTS_BUCKET, r2Path);
    if (data) {
      results[gType] = data;
    }
  }

  if (Object.keys(results).length === 0) {
    return new Response(JSON.stringify({ error: "Vehicle data not found in R2" }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    success: true,
    vehicle: { make, model, year },
    glass_intelligence: results
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
});

/**
 * POST /api/v1/vin/decode
 * Mock/Stub for the VIN decoder route. Will require NHTSA vPIC lookup integration.
 */
router.post('/api/v1/vin/decode', async (request, env) => {
  const { vin } = await request.json();
  
  // 1. Hit NHTSA to decode VIN -> Year, Make, Model
  const nhtsaUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
  const nhtsaRes = await fetch(nhtsaUrl);
  const nhtsaData = await nhtsaRes.json();
  const result = nhtsaData.Results[0];

  if (!result || !result.Make) {
    return new Response(JSON.stringify({ error: "Invalid VIN" }), { status: 400 });
  }

  const { Make, Model, ModelYear } = result;
  
  // 2. Query our own R2 mapping for parts data
  const makeSlug = Make.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const modelSlug = Model.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const r2Path = `data/parts/${makeSlug}/${modelSlug}/${ModelYear}/windshield.json`; // Checking windshield baseline

  const partsData = await fetchR2Json(env.PARTS_BUCKET, r2Path);

  return new Response(JSON.stringify({
    success: true,
    vin: vin,
    vehicle: {
      make: Make,
      model: Model,
      year: ModelYear
    },
    has_custom_intelligence: !!partsData,
    intelligence: partsData || "Falling back to safe defaults"
  }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
});

/**
 * System Health
 */
router.get('/api/health', () => new Response(JSON.stringify({ status: "OK", version: "1.0.0" })));

// 404 Catcher
router.all('*', () => new Response(JSON.stringify({ error: "Not Found" }), { status: 404 }));

export default {
  fetch(request, env, ctx) {
    return router.fetch(request, env, ctx);
  }
};
