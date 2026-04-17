# Roadmap

## Phase 1: Foundation (✅ COMPLETE)
- [x] Repository structure
- [x] JSON schemas (vehicle, glass, pricing)
- [x] Master makes list (52 makes)
- [x] Model files (42 makes, 460+ models)
- [x] Year files (6,038 year entries)
- [x] Glass layout templates (6 body classes)
- [x] Glass feature data (ADAS, rain sensor, heated)
- [x] Pricing base + modifiers
- [x] Alaska pricing adjustments
- [x] Top 51 fully-modeled vehicle profiles
- [x] NHTSA ingest scripts
- [x] Validation scripts
- [x] Documentation

## Phase 2: Expanded Dataset (IN PROGRESS)
- [ ] Expand to 200 fully-modeled vehicle profiles
- [ ] Add 2018-2025 year coverage for top vehicles
- [ ] Add trim-level ADAS detection
- [ ] Integrate NHTSA VIN batch decode for feature validation
- [ ] Add more body class variants (CROSSOVER, WAGON)

## Phase 3: Cloudflare Integration
- [ ] Deploy data to Cloudflare R2
- [ ] Build Cloudflare Worker for VIN decode
- [ ] Build Cloudflare Worker for glass lookup
- [ ] Build Cloudflare Worker for price estimation
- [ ] Connect to Tim's Auto Glass website

## Phase 4: Automation + Intelligence
- [ ] Auto-ingest pipeline (NHTSA scheduled pulls)
- [ ] Price scraping from public sources
- [ ] Real job data feedback loop
- [ ] Confidence scoring refinement
- [ ] Regional pricing adjustments based on actual data

## Phase 5: ML + Optimization
- [ ] Feature prediction engine (VIN → features)
- [ ] Price optimization (market data + job history)
- [ ] ADAS calibration cost modeling
- [ ] Labor time estimates
- [ ] Installer availability modeling

## Phase 6: Platform
- [ ] Public API documentation site
- [ ] Contributor guidelines
- [ ] CI/CD pipeline for data validation
- [ ] Insurance integration layer
- [ ] Multi-region pricing support

## Future Additions
- ADAS calibration cost modeling by vehicle
- Labor time estimates per panel type
- Installer availability scheduling
- OEM vs aftermarket quality scoring
- Insurance carrier integration
- Mobile app API support
