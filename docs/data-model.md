# Data Model

## Entity Relationship

```
VIN
 └── Vehicle (year / make / model)
      ├── Body Class → Glass Layout
      ├── Features (ADAS, rain sensor, heated)
      └── Glass Panels
           ├── Panel Type (laminated / tempered)
           ├── Panel Features
           └── Price Range
                ├── Base Price
                ├── Feature Modifiers
                └── Regional Adjustments
```

## Vehicle Index (Pure Lookup Layer)

### makes.json
Top-level list of all normalized vehicle makes.

| Field | Type | Description |
|---|---|---|
| makes | string[] | ALL CAPS make names |
| total_makes | number | Count |

### models/{make}.json
Models per make.

| Field | Type | Description |
|---|---|---|
| make | string | Make name (ALL CAPS) |
| models | string[] | Sorted model names |

### years/{make}/{model}.json
Year range per model with body class.

| Field | Type | Description |
|---|---|---|
| make | string | Make name |
| model | string | Model name |
| production_start | number | First year |
| production_end | number | Last year |
| body_class | string | SEDAN / SUV / PICKUP / etc |
| years | object[] | Year entries with body_class + doors |

## Vehicle Profiles (Glass Data Layer)

### vehicles/{make}/{model}/{year}.json

| Field | Type | Required | Description |
|---|---|---|---|
| year | number | ✅ | Model year |
| make | string | ✅ | Normalized make |
| model | string | ✅ | Normalized model |
| body_class | string | ✅ | Body classification |
| glass_layout | string | ✅ | Layout template reference |
| doors | number | | Door count |
| features | object | | ADAS, rain_sensor, heated flags |
| glass | object | | Per-panel glass data |
| confidence | number | | 0-1 confidence score |
| last_updated | string | | ISO date |
| sources | string[] | | Data sources |

### Glass Panel Object

| Field | Type | Description |
|---|---|---|
| type | string | "laminated" or "tempered" |
| features | string[] | Feature tags |
| price / estimated_price | number[] | [min, max] USD range |

## Body Class Enum

| Value | Description | Typical Panels |
|---|---|---|
| SEDAN | 4-door passenger car | 6 |
| SUV | Sport utility vehicle | 8 |
| PICKUP | Truck | 8 |
| COUPE | 2-door | 4 |
| HATCHBACK | Compact hatch | 6 |
| VAN | Minivan / cargo | 8 |
| WAGON | Station wagon | 6-8 |
| CONVERTIBLE | Open top | 4 |

## Pricing Model

### Base Prices
Per-panel price ranges (aftermarket glass, no features).

### Modifiers
Additive costs for features:
- ADAS: +$150
- Rain sensor: +$75
- Heated: +$100
- Acoustic: +$50
- HUD: +$200
- ADAS recalibration: +$250

### Alaska Adjustments
- Shipping surcharge: +$75
- OEM availability markup: +15%
- Cold weather demand: 1.15x multiplier (Oct-Mar)
