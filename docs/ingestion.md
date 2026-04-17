# Ingestion Pipeline

## Overview

The ingestion pipeline pulls vehicle data from public sources, normalizes it, and writes structured JSON files.

## Data Sources

### 1. NHTSA vPIC API (Primary)
- **URL**: https://vpic.nhtsa.dot.gov/api/
- **Free**: Yes, no API key required
- **Rate Limit**: Be polite — 500ms delay between requests
- **Provides**: Makes, models, years, body class, VIN decoding

### 2. Manual Curation (Secondary)
- Internal shop knowledge
- Known glass features per vehicle
- Alaska-specific availability data

### 3. Future: Market Data
- RockAuto category scraping
- eBay price sampling

## Pipeline Steps

### Step 1: Pull Makes
```bash
npm run ingest:makes
```
- Calls `GET /vehicles/GetAllMakes`
- Filters to priority makes (50+)
- Normalizes to ALL CAPS
- Writes `data/vehicles-index/makes.json`

### Step 2: Pull Models
```bash
npm run ingest:models
```
- For each make, calls `GET /vehicles/GetModelsForMake/{make}`
- Normalizes model names
- Writes `data/vehicles-index/models/{make}.json`

### Step 3: Pull Year Ranges
```bash
npm run ingest:years
```
- For each make, samples years (2000-2027)
- Calls `GET /vehicles/GetModelsForMakeYear/make/{make}/modelyear/{year}`
- Determines production ranges
- Writes `data/vehicles-index/years/{make}/{model}.json`

### Step 4: Normalize
```bash
npm run normalize
```
- Applies name rules: F150 → F-150, Chevy → CHEVROLET
- Deduplicates
- Ensures ALL CAPS

### Step 5: Validate
```bash
npm run validate
```
- Checks all JSON against schemas
- Verifies no broken references
- Reports errors

## Running the Full Pipeline
```bash
npm run build
```
Runs: ingest:makes → ingest:models → normalize → validate

## Adding New Vehicles Manually

1. Create the model file if it doesn't exist:
   ```
   data/vehicles-index/models/{make}.json
   ```

2. Add the year file:
   ```
   data/vehicles-index/years/{make}/{model}.json
   ```

3. Create the full vehicle profile:
   ```
   data/vehicles/{make}/{model}/{year}.json
   ```

4. Run validation:
   ```bash
   npm run validate
   ```

## Normalization Rules

| Input | Output |
|---|---|
| F150 | F-150 |
| Chevy | CHEVROLET |
| Mercedes | MERCEDES-BENZ |
| VW | VOLKSWAGEN |
| CRV | CR-V |
| 4-Runner | 4RUNNER |
| Land-Rover | LAND ROVER |
