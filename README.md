# 🚗 Tim's Auto Glass — Parts Intelligence Repository

> The first open, developer-friendly auto glass intelligence dataset.
> Edge-powered. Version-controlled. Alaska-born.

---

## 🎯 What Is This?

A **structured, scalable data repository** that maps:

```
VIN → Year / Make / Model → Glass Layout → Features → Estimated Pricing → Confidence
```

This repository serves as:

- **Source of truth** for all glass-related vehicle data
- **Backend dataset** for Cloudflare Workers APIs
- **Growing intelligence layer** that improves over time via real-world usage

This is NOT a static dataset. **This is a living system.**

---

## 📁 Repository Structure

```
timsautoglassak-parts/
│
├── README.md
├── package.json
│
├── schema/                        # JSON schemas for validation
│   ├── vehicle.schema.json
│   ├── glass.schema.json
│   └── pricing.schema.json
│
├── data/
│   ├── vehicles-index/            # Master vehicle index
│   │   ├── makes.json             # All normalized makes
│   │   ├── models/                # Models per make
│   │   │   ├── ford.json
│   │   │   ├── toyota.json
│   │   │   └── ...
│   │   └── years/                 # Year entries per model
│   │       ├── ford/
│   │       │   ├── f-150.json
│   │       │   └── ...
│   │       └── ...
│   │
│   ├── vehicles/                  # Full vehicle profiles (glass data)
│   │   ├── ford/
│   │   │   ├── f-150/
│   │   │   │   ├── 2020.json
│   │   │   │   └── ...
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── glass/
│   │   ├── layouts/               # Glass layout templates by body class
│   │   │   ├── pickup.json
│   │   │   ├── suv.json
│   │   │   └── ...
│   │   └── features/              # Feature definitions
│   │       ├── adas.json
│   │       ├── rain_sensor.json
│   │       └── heated.json
│   │
│   └── pricing/
│       ├── base.json              # Base price ranges
│       ├── modifiers.json         # Feature-based modifiers
│       └── alaska_adjustments.json
│
├── scripts/
│   ├── ingest/                    # NHTSA API data pull
│   ├── normalize/                 # Name normalization
│   └── validate/                  # Schema validation
│
├── api/
│   └── examples/                  # Cloudflare Worker request/response samples
│
└── docs/
    ├── data-model.md
    ├── ingestion.md
    └── roadmap.md
```

---

## 🧠 Core Principles

| Principle | Why |
|---|---|
| **Composable over monolithic** | Small files per make/model/year — no giant JSON blobs |
| **Deterministic + Derived** | Store base truths, derive pricing via logic |
| **Version everything** | Every change tracked, every dataset reproducible |
| **Human-readable first** | Clean JSON, easy to audit + edit |
| **Edge-ready** | Optimized for Cloudflare R2 + Workers |

---

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Validate All Data

```bash
npm run validate
```

### Pull Fresh Data from NHTSA

```bash
npm run ingest:makes
npm run ingest:models
npm run ingest:years
```

### Normalize Names

```bash
npm run normalize
```

---

## 🌐 Cloudflare Integration

### Worker Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/vin/decode` | VIN → vehicle info |
| `POST` | `/glass/lookup` | Vehicle → glass layout + features |
| `POST` | `/price/estimate` | Vehicle + features → price range |

### Data Flow

```
VIN → Worker → lookup repo JSON (R2)
    → apply pricing modifiers
    → return structured response
```

---

## 📊 Growth Strategy

| Phase | Scope | Status |
|---|---|---|
| **Phase 1** | Top 50 vehicles (Alaska-focused) | ✅ Complete |
| **Phase 2** | Expand to 300 vehicles | 🔄 In Progress |
| **Phase 3** | Full dataset (1000+ models) | 📋 Planned |
| **Phase 4** | Confidence scoring + ML refinement | 📋 Planned |

---

## ⚠️ Constraints

- **NO proprietary NAGS data** — only public sources, derived estimates, and internal data
- **NO VIN-level storage** — this is a vehicle index, not a VIN database
- **NO raw pricing data** — only normalized ranges and modifiers

---

## 📜 License

MIT — Open source. Built for the industry.

---

## 🏢 Built By

**Tim's Auto Glass** — Anchorage, Alaska
[timsautoglassak.com](https://timsautoglassak.com)

Powered by **Four Media Group**
