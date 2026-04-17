#!/usr/bin/env node
/**
 * BOOTSTRAP GENERATOR — Creates all model files and year files
 * for the Tim's Auto Glass Parts Intelligence Repository.
 * 
 * Run once to generate the full vehicle index.
 * Usage: node scripts/bootstrap-vehicle-index.js
 */

const fs = require('fs');
const path = require('path');

const BASE = path.join(__dirname, '..', 'data', 'vehicles-index');

// ============================================================
// MASTER VEHICLE DATABASE
// All makes → models → year ranges + body classes
// ============================================================
const VEHICLE_DB = {
  "CHEVROLET": {
    models: {
      "SILVERADO 1500":   { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "SILVERADO 2500HD": { years: [2001, 2026], body: "PICKUP", doors: 4 },
      "SILVERADO 3500HD": { years: [2001, 2026], body: "PICKUP", doors: 4 },
      "COLORADO":         { years: [2004, 2026], body: "PICKUP", doors: 4 },
      "TAHOE":            { years: [2000, 2026], body: "SUV", doors: 4 },
      "SUBURBAN":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "EQUINOX":          { years: [2005, 2026], body: "SUV", doors: 4 },
      "TRAVERSE":         { years: [2009, 2026], body: "SUV", doors: 4 },
      "TRAILBLAZER":      { years: [2002, 2009], body: "SUV", doors: 4 },
      "BLAZER":           { years: [2019, 2026], body: "SUV", doors: 4 },
      "TRAX":             { years: [2015, 2026], body: "SUV", doors: 4 },
      "MALIBU":           { years: [2000, 2024], body: "SEDAN", doors: 4 },
      "IMPALA":           { years: [2000, 2020], body: "SEDAN", doors: 4 },
      "CRUZE":            { years: [2011, 2019], body: "SEDAN", doors: 4 },
      "CAMARO":           { years: [2000, 2024], body: "COUPE", doors: 2 },
      "CORVETTE":         { years: [2000, 2026], body: "COUPE", doors: 2 },
      "SPARK":            { years: [2013, 2022], body: "HATCHBACK", doors: 4 },
      "BOLT EV":          { years: [2017, 2023], body: "HATCHBACK", doors: 4 },
      "BOLT EUV":         { years: [2022, 2023], body: "SUV", doors: 4 },
      "EXPRESS":          { years: [2000, 2025], body: "VAN", doors: 4 },
      "SONIC":            { years: [2012, 2020], body: "SEDAN", doors: 4 },
      "AVALANCHE":        { years: [2002, 2013], body: "PICKUP", doors: 4 },
      "COBALT":           { years: [2005, 2010], body: "SEDAN", doors: 4 },
      "HHR":              { years: [2006, 2011], body: "HATCHBACK", doors: 4 }
    }
  },
  "FORD": {
    models: {
      "F-150":          { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "F-250":          { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "F-350":          { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "RANGER":         { years: [2000, 2012], body: "PICKUP", doors: 4 },
      "MAVERICK":       { years: [2022, 2026], body: "PICKUP", doors: 4 },
      "ESCAPE":         { years: [2001, 2026], body: "SUV", doors: 4 },
      "EXPLORER":       { years: [2000, 2026], body: "SUV", doors: 4 },
      "EXPEDITION":     { years: [2000, 2026], body: "SUV", doors: 4 },
      "EDGE":           { years: [2007, 2024], body: "SUV", doors: 4 },
      "BRONCO":         { years: [2021, 2026], body: "SUV", doors: 4 },
      "BRONCO SPORT":   { years: [2021, 2026], body: "SUV", doors: 4 },
      "MUSTANG":        { years: [2000, 2026], body: "COUPE", doors: 2 },
      "MUSTANG MACH-E": { years: [2021, 2026], body: "SUV", doors: 4 },
      "FUSION":         { years: [2006, 2020], body: "SEDAN", doors: 4 },
      "FOCUS":          { years: [2000, 2018], body: "SEDAN", doors: 4 },
      "TAURUS":         { years: [2000, 2019], body: "SEDAN", doors: 4 },
      "FLEX":           { years: [2009, 2019], body: "SUV", doors: 4 },
      "TRANSIT":        { years: [2015, 2026], body: "VAN", doors: 4 },
      "TRANSIT CONNECT": { years: [2010, 2023], body: "VAN", doors: 4 },
      "E-SERIES":       { years: [2000, 2023], body: "VAN", doors: 4 },
      "LIGHTNING":      { years: [2022, 2026], body: "PICKUP", doors: 4 },
      "EXCURSION":      { years: [2000, 2005], body: "SUV", doors: 4 },
      "CROWN VICTORIA": { years: [2000, 2011], body: "SEDAN", doors: 4 },
      "FIESTA":         { years: [2011, 2019], body: "HATCHBACK", doors: 4 },
      "ECOSPORT":       { years: [2018, 2022], body: "SUV", doors: 4 }
    }
  },
  "RAM": {
    models: {
      "1500":         { years: [2011, 2026], body: "PICKUP", doors: 4 },
      "2500":         { years: [2011, 2026], body: "PICKUP", doors: 4 },
      "3500":         { years: [2011, 2026], body: "PICKUP", doors: 4 },
      "PROMASTER":    { years: [2014, 2026], body: "VAN", doors: 4 },
      "PROMASTER CITY": { years: [2015, 2022], body: "VAN", doors: 4 }
    }
  },
  "GMC": {
    models: {
      "SIERRA 1500":   { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "SIERRA 2500HD": { years: [2001, 2026], body: "PICKUP", doors: 4 },
      "SIERRA 3500HD": { years: [2001, 2026], body: "PICKUP", doors: 4 },
      "CANYON":        { years: [2004, 2026], body: "PICKUP", doors: 4 },
      "YUKON":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "YUKON XL":      { years: [2000, 2026], body: "SUV", doors: 4 },
      "TERRAIN":       { years: [2010, 2026], body: "SUV", doors: 4 },
      "ACADIA":        { years: [2007, 2026], body: "SUV", doors: 4 },
      "ENVOY":         { years: [2002, 2009], body: "SUV", doors: 4 },
      "SAVANA":        { years: [2000, 2025], body: "VAN", doors: 4 },
      "HUMMER EV":     { years: [2022, 2026], body: "PICKUP", doors: 4 }
    }
  },
  "TOYOTA": {
    models: {
      "CAMRY":       { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "COROLLA":     { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "RAV4":        { years: [2000, 2026], body: "SUV", doors: 4 },
      "TACOMA":      { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "TUNDRA":      { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "4RUNNER":     { years: [2000, 2026], body: "SUV", doors: 4 },
      "HIGHLANDER":  { years: [2001, 2026], body: "SUV", doors: 4 },
      "PRIUS":       { years: [2001, 2026], body: "HATCHBACK", doors: 4 },
      "SIENNA":      { years: [2000, 2026], body: "VAN", doors: 4 },
      "SEQUOIA":     { years: [2001, 2026], body: "SUV", doors: 4 },
      "VENZA":       { years: [2009, 2015], body: "SUV", doors: 4 },
      "AVALON":      { years: [2000, 2022], body: "SEDAN", doors: 4 },
      "YARIS":       { years: [2007, 2020], body: "HATCHBACK", doors: 4 },
      "C-HR":        { years: [2018, 2022], body: "SUV", doors: 4 },
      "LAND CRUISER": { years: [2000, 2026], body: "SUV", doors: 4 },
      "FJ CRUISER":  { years: [2007, 2014], body: "SUV", doors: 4 },
      "MATRIX":      { years: [2003, 2014], body: "HATCHBACK", doors: 4 },
      "SUPRA":       { years: [2020, 2026], body: "COUPE", doors: 2 },
      "GR86":        { years: [2022, 2026], body: "COUPE", doors: 2 },
      "BZ4X":        { years: [2023, 2026], body: "SUV", doors: 4 },
      "CROWN":       { years: [2023, 2026], body: "SEDAN", doors: 4 },
      "GRAND HIGHLANDER": { years: [2024, 2026], body: "SUV", doors: 4 }
    }
  },
  "SUBARU": {
    models: {
      "OUTBACK":    { years: [2000, 2026], body: "WAGON", doors: 4 },
      "FORESTER":   { years: [2000, 2026], body: "SUV", doors: 4 },
      "CROSSTREK":  { years: [2013, 2026], body: "SUV", doors: 4 },
      "IMPREZA":    { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "WRX":        { years: [2002, 2026], body: "SEDAN", doors: 4 },
      "ASCENT":     { years: [2019, 2026], body: "SUV", doors: 4 },
      "LEGACY":     { years: [2000, 2025], body: "SEDAN", doors: 4 },
      "BRZ":        { years: [2013, 2026], body: "COUPE", doors: 2 },
      "SOLTERRA":   { years: [2023, 2026], body: "SUV", doors: 4 },
      "TRIBECA":    { years: [2006, 2014], body: "SUV", doors: 4 },
      "BAJA":       { years: [2003, 2006], body: "PICKUP", doors: 4 },
      "XV CROSSTREK": { years: [2013, 2015], body: "SUV", doors: 4 }
    }
  },
  "HONDA": {
    models: {
      "CIVIC":      { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "ACCORD":     { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "CR-V":       { years: [2000, 2026], body: "SUV", doors: 4 },
      "PILOT":      { years: [2003, 2026], body: "SUV", doors: 4 },
      "ODYSSEY":    { years: [2000, 2026], body: "VAN", doors: 4 },
      "HR-V":       { years: [2016, 2026], body: "SUV", doors: 4 },
      "PASSPORT":   { years: [2019, 2026], body: "SUV", doors: 4 },
      "RIDGELINE":  { years: [2006, 2026], body: "PICKUP", doors: 4 },
      "FIT":        { years: [2007, 2020], body: "HATCHBACK", doors: 4 },
      "INSIGHT":    { years: [2019, 2022], body: "SEDAN", doors: 4 },
      "ELEMENT":    { years: [2003, 2011], body: "SUV", doors: 4 },
      "PROLOGUE":   { years: [2024, 2026], body: "SUV", doors: 4 },
      "CIVIC TYPE R": { years: [2017, 2026], body: "HATCHBACK", doors: 4 },
      "S2000":      { years: [2000, 2009], body: "CONVERTIBLE", doors: 2 }
    }
  },
  "DODGE": {
    models: {
      "RAM 1500":     { years: [2000, 2010], body: "PICKUP", doors: 4 },
      "RAM 2500":     { years: [2000, 2010], body: "PICKUP", doors: 4 },
      "RAM 3500":     { years: [2000, 2010], body: "PICKUP", doors: 4 },
      "DURANGO":      { years: [2000, 2026], body: "SUV", doors: 4 },
      "CHARGER":      { years: [2006, 2026], body: "SEDAN", doors: 4 },
      "CHALLENGER":   { years: [2008, 2023], body: "COUPE", doors: 2 },
      "GRAND CARAVAN": { years: [2000, 2020], body: "VAN", doors: 4 },
      "JOURNEY":      { years: [2009, 2020], body: "SUV", doors: 4 },
      "DART":         { years: [2013, 2016], body: "SEDAN", doors: 4 },
      "NITRO":        { years: [2007, 2011], body: "SUV", doors: 4 },
      "CALIBER":      { years: [2007, 2012], body: "HATCHBACK", doors: 4 },
      "AVENGER":      { years: [2008, 2014], body: "SEDAN", doors: 4 },
      "HORNET":       { years: [2023, 2026], body: "SUV", doors: 4 },
      "NEON":         { years: [2000, 2005], body: "SEDAN", doors: 4 },
      "DAKOTA":       { years: [2000, 2011], body: "PICKUP", doors: 4 },
      "STRATUS":      { years: [2000, 2006], body: "SEDAN", doors: 4 }
    }
  },
  "JEEP": {
    models: {
      "GRAND CHEROKEE":   { years: [2000, 2026], body: "SUV", doors: 4 },
      "WRANGLER":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "CHEROKEE":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "COMPASS":          { years: [2007, 2026], body: "SUV", doors: 4 },
      "RENEGADE":         { years: [2015, 2026], body: "SUV", doors: 4 },
      "GLADIATOR":        { years: [2020, 2026], body: "PICKUP", doors: 4 },
      "WAGONEER":         { years: [2022, 2026], body: "SUV", doors: 4 },
      "GRAND WAGONEER":   { years: [2022, 2026], body: "SUV", doors: 4 },
      "LIBERTY":          { years: [2002, 2012], body: "SUV", doors: 4 },
      "PATRIOT":          { years: [2007, 2017], body: "SUV", doors: 4 },
      "COMMANDER":        { years: [2006, 2010], body: "SUV", doors: 4 }
    }
  },
  "KIA": {
    models: {
      "SORENTO":      { years: [2003, 2026], body: "SUV", doors: 4 },
      "SPORTAGE":     { years: [2000, 2026], body: "SUV", doors: 4 },
      "TELLURIDE":    { years: [2020, 2026], body: "SUV", doors: 4 },
      "FORTE":        { years: [2010, 2026], body: "SEDAN", doors: 4 },
      "OPTIMA":       { years: [2001, 2020], body: "SEDAN", doors: 4 },
      "K5":           { years: [2021, 2026], body: "SEDAN", doors: 4 },
      "SOUL":         { years: [2010, 2026], body: "HATCHBACK", doors: 4 },
      "SELTOS":       { years: [2021, 2026], body: "SUV", doors: 4 },
      "CARNIVAL":     { years: [2022, 2026], body: "VAN", doors: 4 },
      "SEDONA":       { years: [2002, 2021], body: "VAN", doors: 4 },
      "RIO":          { years: [2001, 2023], body: "SEDAN", doors: 4 },
      "STINGER":      { years: [2018, 2024], body: "SEDAN", doors: 4 },
      "NIRO":         { years: [2017, 2026], body: "SUV", doors: 4 },
      "EV6":          { years: [2022, 2026], body: "SUV", doors: 4 },
      "EV9":          { years: [2024, 2026], body: "SUV", doors: 4 },
      "SPECTRA":      { years: [2000, 2009], body: "SEDAN", doors: 4 }
    }
  },
  "HYUNDAI": {
    models: {
      "TUCSON":       { years: [2005, 2026], body: "SUV", doors: 4 },
      "SANTA FE":     { years: [2001, 2026], body: "SUV", doors: 4 },
      "ELANTRA":      { years: [2001, 2026], body: "SEDAN", doors: 4 },
      "SONATA":       { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "PALISADE":     { years: [2020, 2026], body: "SUV", doors: 4 },
      "KONA":         { years: [2018, 2026], body: "SUV", doors: 4 },
      "VENUE":        { years: [2020, 2024], body: "SUV", doors: 4 },
      "ACCENT":       { years: [2000, 2023], body: "SEDAN", doors: 4 },
      "VELOSTER":     { years: [2012, 2022], body: "HATCHBACK", doors: 3 },
      "SANTA CRUZ":   { years: [2022, 2026], body: "PICKUP", doors: 4 },
      "IONIQ 5":      { years: [2022, 2026], body: "SUV", doors: 4 },
      "IONIQ 6":      { years: [2023, 2026], body: "SEDAN", doors: 4 },
      "GENESIS COUPE": { years: [2010, 2016], body: "COUPE", doors: 2 },
      "TIBURON":      { years: [2000, 2008], body: "COUPE", doors: 2 },
      "ENTOURAGE":    { years: [2007, 2009], body: "VAN", doors: 4 }
    }
  },
  "NISSAN": {
    models: {
      "ALTIMA":       { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "ROGUE":        { years: [2008, 2026], body: "SUV", doors: 4 },
      "SENTRA":       { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "PATHFINDER":   { years: [2000, 2026], body: "SUV", doors: 4 },
      "FRONTIER":     { years: [2000, 2026], body: "PICKUP", doors: 4 },
      "TITAN":        { years: [2004, 2026], body: "PICKUP", doors: 4 },
      "MURANO":       { years: [2003, 2026], body: "SUV", doors: 4 },
      "MAXIMA":       { years: [2000, 2023], body: "SEDAN", doors: 4 },
      "KICKS":        { years: [2018, 2026], body: "SUV", doors: 4 },
      "ARMADA":       { years: [2004, 2026], body: "SUV", doors: 4 },
      "VERSA":        { years: [2007, 2026], body: "SEDAN", doors: 4 },
      "XTERRA":       { years: [2000, 2015], body: "SUV", doors: 4 },
      "LEAF":         { years: [2011, 2024], body: "HATCHBACK", doors: 4 },
      "ARIYA":        { years: [2023, 2026], body: "SUV", doors: 4 },
      "JUKE":         { years: [2011, 2017], body: "SUV", doors: 4 },
      "370Z":         { years: [2009, 2020], body: "COUPE", doors: 2 },
      "Z":            { years: [2023, 2026], body: "COUPE", doors: 2 },
      "QUEST":        { years: [2004, 2017], body: "VAN", doors: 4 },
      "NV":           { years: [2012, 2021], body: "VAN", doors: 4 },
      "ROGUE SPORT":  { years: [2017, 2022], body: "SUV", doors: 4 }
    }
  },
  "MAZDA": {
    models: {
      "CX-5":        { years: [2013, 2026], body: "SUV", doors: 4 },
      "CX-9":        { years: [2007, 2023], body: "SUV", doors: 4 },
      "CX-30":       { years: [2020, 2026], body: "SUV", doors: 4 },
      "CX-50":       { years: [2023, 2026], body: "SUV", doors: 4 },
      "CX-70":       { years: [2025, 2026], body: "SUV", doors: 4 },
      "CX-90":       { years: [2024, 2026], body: "SUV", doors: 4 },
      "MAZDA3":      { years: [2004, 2026], body: "SEDAN", doors: 4 },
      "MAZDA6":      { years: [2003, 2021], body: "SEDAN", doors: 4 },
      "MX-5 MIATA":  { years: [2000, 2026], body: "CONVERTIBLE", doors: 2 },
      "TRIBUTE":     { years: [2001, 2011], body: "SUV", doors: 4 },
      "MX-30":       { years: [2022, 2024], body: "SUV", doors: 4 }
    }
  },
  "VOLKSWAGEN": {
    models: {
      "JETTA":        { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "TIGUAN":       { years: [2009, 2026], body: "SUV", doors: 4 },
      "ATLAS":        { years: [2018, 2026], body: "SUV", doors: 4 },
      "ATLAS CROSS SPORT": { years: [2020, 2026], body: "SUV", doors: 4 },
      "TAOS":         { years: [2022, 2026], body: "SUV", doors: 4 },
      "PASSAT":       { years: [2000, 2022], body: "SEDAN", doors: 4 },
      "GOLF":         { years: [2000, 2022], body: "HATCHBACK", doors: 4 },
      "GTI":          { years: [2000, 2026], body: "HATCHBACK", doors: 4 },
      "GOLF R":       { years: [2015, 2026], body: "HATCHBACK", doors: 4 },
      "TOUAREG":      { years: [2004, 2017], body: "SUV", doors: 4 },
      "BEETLE":       { years: [2000, 2019], body: "COUPE", doors: 2 },
      "CC":           { years: [2009, 2017], body: "SEDAN", doors: 4 },
      "ID.4":         { years: [2021, 2026], body: "SUV", doors: 4 },
      "ARTEON":       { years: [2019, 2024], body: "SEDAN", doors: 4 }
    }
  },
  "BMW": {
    models: {
      "3 SERIES":     { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "5 SERIES":     { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "X3":           { years: [2004, 2026], body: "SUV", doors: 4 },
      "X5":           { years: [2000, 2026], body: "SUV", doors: 4 },
      "X1":           { years: [2013, 2026], body: "SUV", doors: 4 },
      "X7":           { years: [2019, 2026], body: "SUV", doors: 4 },
      "4 SERIES":     { years: [2014, 2026], body: "COUPE", doors: 2 },
      "7 SERIES":     { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "2 SERIES":     { years: [2014, 2026], body: "COUPE", doors: 2 },
      "X2":           { years: [2018, 2026], body: "SUV", doors: 4 },
      "X4":           { years: [2015, 2026], body: "SUV", doors: 4 },
      "X6":           { years: [2008, 2026], body: "SUV", doors: 4 },
      "I4":           { years: [2022, 2026], body: "SEDAN", doors: 4 },
      "IX":           { years: [2022, 2026], body: "SUV", doors: 4 },
      "Z4":           { years: [2003, 2026], body: "CONVERTIBLE", doors: 2 },
      "8 SERIES":     { years: [2019, 2026], body: "COUPE", doors: 2 }
    }
  },
  "MERCEDES-BENZ": {
    models: {
      "C-CLASS":      { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "E-CLASS":      { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "GLE":          { years: [2016, 2026], body: "SUV", doors: 4 },
      "GLC":          { years: [2016, 2026], body: "SUV", doors: 4 },
      "S-CLASS":      { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "A-CLASS":      { years: [2019, 2023], body: "SEDAN", doors: 4 },
      "CLA":          { years: [2014, 2026], body: "SEDAN", doors: 4 },
      "GLA":          { years: [2015, 2026], body: "SUV", doors: 4 },
      "GLB":          { years: [2020, 2026], body: "SUV", doors: 4 },
      "GLS":          { years: [2017, 2026], body: "SUV", doors: 4 },
      "ML-CLASS":     { years: [2000, 2015], body: "SUV", doors: 4 },
      "GL-CLASS":     { years: [2007, 2016], body: "SUV", doors: 4 },
      "GLK-CLASS":    { years: [2010, 2015], body: "SUV", doors: 4 },
      "EQS":          { years: [2022, 2026], body: "SEDAN", doors: 4 },
      "EQE":          { years: [2023, 2026], body: "SEDAN", doors: 4 },
      "EQB":          { years: [2022, 2026], body: "SUV", doors: 4 },
      "AMG GT":       { years: [2016, 2026], body: "COUPE", doors: 2 },
      "SPRINTER":     { years: [2001, 2026], body: "VAN", doors: 4 },
      "METRIS":       { years: [2016, 2023], body: "VAN", doors: 4 }
    }
  },
  "AUDI": {
    models: {
      "A4":          { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "A6":          { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "Q5":          { years: [2009, 2026], body: "SUV", doors: 4 },
      "Q7":          { years: [2007, 2026], body: "SUV", doors: 4 },
      "Q3":          { years: [2015, 2026], body: "SUV", doors: 4 },
      "A3":          { years: [2006, 2026], body: "SEDAN", doors: 4 },
      "Q8":          { years: [2019, 2026], body: "SUV", doors: 4 },
      "A5":          { years: [2008, 2026], body: "COUPE", doors: 2 },
      "A7":          { years: [2012, 2026], body: "SEDAN", doors: 4 },
      "A8":          { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "E-TRON":      { years: [2019, 2026], body: "SUV", doors: 4 },
      "Q4 E-TRON":   { years: [2022, 2026], body: "SUV", doors: 4 },
      "TT":          { years: [2000, 2023], body: "COUPE", doors: 2 },
      "R8":          { years: [2008, 2024], body: "COUPE", doors: 2 },
      "RS5":         { years: [2013, 2026], body: "COUPE", doors: 2 },
      "S4":          { years: [2004, 2026], body: "SEDAN", doors: 4 }
    }
  },
  "LEXUS": {
    models: {
      "RX":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "ES":         { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "NX":         { years: [2015, 2026], body: "SUV", doors: 4 },
      "IS":         { years: [2001, 2026], body: "SEDAN", doors: 4 },
      "GX":         { years: [2003, 2026], body: "SUV", doors: 4 },
      "LX":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "UX":         { years: [2019, 2026], body: "SUV", doors: 4 },
      "LS":         { years: [2000, 2026], body: "SEDAN", doors: 4 },
      "RC":         { years: [2015, 2026], body: "COUPE", doors: 2 },
      "LC":         { years: [2018, 2026], body: "COUPE", doors: 2 },
      "TX":         { years: [2024, 2026], body: "SUV", doors: 4 },
      "RZ":         { years: [2023, 2026], body: "SUV", doors: 4 },
      "GS":         { years: [2000, 2020], body: "SEDAN", doors: 4 },
      "CT":         { years: [2011, 2017], body: "HATCHBACK", doors: 4 }
    }
  },
  "ACURA": {
    models: {
      "MDX":        { years: [2001, 2026], body: "SUV", doors: 4 },
      "RDX":        { years: [2007, 2026], body: "SUV", doors: 4 },
      "TLX":        { years: [2015, 2026], body: "SEDAN", doors: 4 },
      "INTEGRA":    { years: [2023, 2026], body: "HATCHBACK", doors: 4 },
      "ILX":        { years: [2013, 2022], body: "SEDAN", doors: 4 },
      "TL":         { years: [2000, 2014], body: "SEDAN", doors: 4 },
      "TSX":        { years: [2004, 2014], body: "SEDAN", doors: 4 },
      "RSX":        { years: [2002, 2006], body: "COUPE", doors: 2 },
      "ZDX":        { years: [2024, 2026], body: "SUV", doors: 4 },
      "NSX":        { years: [2016, 2022], body: "COUPE", doors: 2 }
    }
  },
  "INFINITI": {
    models: {
      "QX60":       { years: [2014, 2026], body: "SUV", doors: 4 },
      "QX80":       { years: [2014, 2026], body: "SUV", doors: 4 },
      "QX50":       { years: [2014, 2026], body: "SUV", doors: 4 },
      "QX55":       { years: [2022, 2026], body: "SUV", doors: 4 },
      "Q50":        { years: [2014, 2026], body: "SEDAN", doors: 4 },
      "Q60":        { years: [2017, 2023], body: "COUPE", doors: 2 },
      "G37":        { years: [2008, 2013], body: "SEDAN", doors: 4 },
      "FX35":       { years: [2003, 2013], body: "SUV", doors: 4 },
      "M37":        { years: [2011, 2013], body: "SEDAN", doors: 4 }
    }
  },
  "VOLVO": {
    models: {
      "XC90":       { years: [2003, 2026], body: "SUV", doors: 4 },
      "XC60":       { years: [2010, 2026], body: "SUV", doors: 4 },
      "XC40":       { years: [2019, 2026], body: "SUV", doors: 4 },
      "S60":        { years: [2001, 2026], body: "SEDAN", doors: 4 },
      "S90":        { years: [2017, 2026], body: "SEDAN", doors: 4 },
      "V60":        { years: [2015, 2026], body: "WAGON", doors: 4 },
      "V90":        { years: [2017, 2022], body: "WAGON", doors: 4 },
      "C40":        { years: [2022, 2026], body: "SUV", doors: 4 },
      "EX30":       { years: [2024, 2026], body: "SUV", doors: 4 },
      "EX90":       { years: [2024, 2026], body: "SUV", doors: 4 },
      "S40":        { years: [2004, 2011], body: "SEDAN", doors: 4 },
      "V50":        { years: [2005, 2011], body: "WAGON", doors: 4 },
      "XC70":       { years: [2001, 2016], body: "WAGON", doors: 4 }
    }
  },
  "BUICK": {
    models: {
      "ENCLAVE":    { years: [2008, 2026], body: "SUV", doors: 4 },
      "ENCORE":     { years: [2013, 2022], body: "SUV", doors: 4 },
      "ENCORE GX":  { years: [2020, 2026], body: "SUV", doors: 4 },
      "ENVISION":   { years: [2016, 2026], body: "SUV", doors: 4 },
      "LACROSSE":   { years: [2005, 2019], body: "SEDAN", doors: 4 },
      "REGAL":      { years: [2011, 2020], body: "SEDAN", doors: 4 },
      "VERANO":     { years: [2012, 2017], body: "SEDAN", doors: 4 },
      "CENTURY":    { years: [2000, 2005], body: "SEDAN", doors: 4 },
      "LESABRE":    { years: [2000, 2005], body: "SEDAN", doors: 4 },
      "RENDEZVOUS": { years: [2002, 2007], body: "SUV", doors: 4 },
      "LUCERNE":    { years: [2006, 2011], body: "SEDAN", doors: 4 }
    }
  },
  "CADILLAC": {
    models: {
      "ESCALADE":   { years: [2000, 2026], body: "SUV", doors: 4 },
      "XT5":        { years: [2017, 2026], body: "SUV", doors: 4 },
      "XT4":        { years: [2019, 2026], body: "SUV", doors: 4 },
      "XT6":        { years: [2020, 2026], body: "SUV", doors: 4 },
      "CT5":        { years: [2020, 2026], body: "SEDAN", doors: 4 },
      "CT4":        { years: [2020, 2026], body: "SEDAN", doors: 4 },
      "LYRIQ":      { years: [2023, 2026], body: "SUV", doors: 4 },
      "SRX":        { years: [2004, 2016], body: "SUV", doors: 4 },
      "CTS":        { years: [2003, 2019], body: "SEDAN", doors: 4 },
      "ATS":        { years: [2013, 2019], body: "SEDAN", doors: 4 },
      "XTS":        { years: [2013, 2019], body: "SEDAN", doors: 4 },
      "DEVILLE":    { years: [2000, 2005], body: "SEDAN", doors: 4 },
      "DTS":        { years: [2006, 2011], body: "SEDAN", doors: 4 }
    }
  },
  "CHRYSLER": {
    models: {
      "PACIFICA":       { years: [2017, 2026], body: "VAN", doors: 4 },
      "300":            { years: [2005, 2023], body: "SEDAN", doors: 4 },
      "TOWN & COUNTRY": { years: [2000, 2016], body: "VAN", doors: 4 },
      "200":            { years: [2011, 2017], body: "SEDAN", doors: 4 },
      "VOYAGER":        { years: [2020, 2022], body: "VAN", doors: 4 },
      "PT CRUISER":     { years: [2001, 2010], body: "HATCHBACK", doors: 4 },
      "SEBRING":        { years: [2001, 2010], body: "SEDAN", doors: 4 },
      "ASPEN":          { years: [2007, 2009], body: "SUV", doors: 4 }
    }
  },
  "LINCOLN": {
    models: {
      "NAVIGATOR":  { years: [2000, 2026], body: "SUV", doors: 4 },
      "AVIATOR":    { years: [2020, 2026], body: "SUV", doors: 4 },
      "CORSAIR":    { years: [2020, 2026], body: "SUV", doors: 4 },
      "NAUTILUS":   { years: [2019, 2026], body: "SUV", doors: 4 },
      "MKZ":        { years: [2013, 2020], body: "SEDAN", doors: 4 },
      "MKC":        { years: [2015, 2019], body: "SUV", doors: 4 },
      "MKX":        { years: [2007, 2018], body: "SUV", doors: 4 },
      "MKT":        { years: [2010, 2019], body: "SUV", doors: 4 },
      "TOWN CAR":   { years: [2000, 2011], body: "SEDAN", doors: 4 },
      "CONTINENTAL": { years: [2017, 2020], body: "SEDAN", doors: 4 }
    }
  },
  "MITSUBISHI": {
    models: {
      "OUTLANDER":      { years: [2003, 2026], body: "SUV", doors: 4 },
      "OUTLANDER SPORT": { years: [2011, 2024], body: "SUV", doors: 4 },
      "ECLIPSE CROSS":  { years: [2018, 2026], body: "SUV", doors: 4 },
      "MIRAGE":         { years: [2014, 2026], body: "HATCHBACK", doors: 4 },
      "LANCER":         { years: [2002, 2017], body: "SEDAN", doors: 4 },
      "GALANT":         { years: [2000, 2012], body: "SEDAN", doors: 4 },
      "ECLIPSE":        { years: [2000, 2012], body: "COUPE", doors: 2 },
      "MONTERO":        { years: [2001, 2006], body: "SUV", doors: 4 },
      "ENDEAVOR":       { years: [2004, 2011], body: "SUV", doors: 4 }
    }
  },
  "TESLA": {
    models: {
      "MODEL 3":   { years: [2017, 2026], body: "SEDAN", doors: 4 },
      "MODEL Y":   { years: [2020, 2026], body: "SUV", doors: 4 },
      "MODEL S":   { years: [2012, 2026], body: "SEDAN", doors: 4 },
      "MODEL X":   { years: [2016, 2026], body: "SUV", doors: 4 },
      "CYBERTRUCK": { years: [2024, 2026], body: "PICKUP", doors: 4 }
    }
  },
  "LAND ROVER": {
    models: {
      "RANGE ROVER":       { years: [2000, 2026], body: "SUV", doors: 4 },
      "RANGE ROVER SPORT": { years: [2006, 2026], body: "SUV", doors: 4 },
      "RANGE ROVER EVOQUE": { years: [2012, 2026], body: "SUV", doors: 4 },
      "RANGE ROVER VELAR": { years: [2018, 2026], body: "SUV", doors: 4 },
      "DISCOVERY":         { years: [2000, 2026], body: "SUV", doors: 4 },
      "DISCOVERY SPORT":   { years: [2015, 2026], body: "SUV", doors: 4 },
      "DEFENDER":          { years: [2020, 2026], body: "SUV", doors: 4 },
      "LR3":               { years: [2005, 2009], body: "SUV", doors: 4 },
      "LR4":               { years: [2010, 2016], body: "SUV", doors: 4 },
      "FREELANDER":        { years: [2002, 2005], body: "SUV", doors: 4 }
    }
  },
  "PORSCHE": {
    models: {
      "CAYENNE":   { years: [2003, 2026], body: "SUV", doors: 4 },
      "MACAN":     { years: [2015, 2026], body: "SUV", doors: 4 },
      "911":       { years: [2000, 2026], body: "COUPE", doors: 2 },
      "PANAMERA":  { years: [2010, 2026], body: "SEDAN", doors: 4 },
      "TAYCAN":    { years: [2020, 2026], body: "SEDAN", doors: 4 },
      "BOXSTER":   { years: [2000, 2026], body: "CONVERTIBLE", doors: 2 },
      "CAYMAN":    { years: [2006, 2026], body: "COUPE", doors: 2 },
      "718":       { years: [2017, 2026], body: "COUPE", doors: 2 }
    }
  },
  "MINI": {
    models: {
      "COOPER":      { years: [2002, 2026], body: "HATCHBACK", doors: 2 },
      "COUNTRYMAN":  { years: [2011, 2026], body: "SUV", doors: 4 },
      "CLUBMAN":     { years: [2008, 2024], body: "WAGON", doors: 4 },
      "PACEMAN":     { years: [2013, 2016], body: "COUPE", doors: 2 },
      "CONVERTIBLE": { years: [2005, 2026], body: "CONVERTIBLE", doors: 2 }
    }
  },
  "FIAT": {
    models: {
      "500":    { years: [2012, 2019], body: "HATCHBACK", doors: 2 },
      "500X":   { years: [2016, 2024], body: "SUV", doors: 4 },
      "500L":   { years: [2014, 2020], body: "HATCHBACK", doors: 4 },
      "124 SPIDER": { years: [2017, 2020], body: "CONVERTIBLE", doors: 2 }
    }
  },
  "JAGUAR": {
    models: {
      "F-PACE":   { years: [2017, 2026], body: "SUV", doors: 4 },
      "E-PACE":   { years: [2018, 2025], body: "SUV", doors: 4 },
      "I-PACE":   { years: [2019, 2025], body: "SUV", doors: 4 },
      "XF":       { years: [2009, 2025], body: "SEDAN", doors: 4 },
      "XE":       { years: [2017, 2024], body: "SEDAN", doors: 4 },
      "XJ":       { years: [2000, 2019], body: "SEDAN", doors: 4 },
      "F-TYPE":   { years: [2014, 2024], body: "COUPE", doors: 2 },
      "S-TYPE":   { years: [2000, 2008], body: "SEDAN", doors: 4 },
      "X-TYPE":   { years: [2002, 2008], body: "SEDAN", doors: 4 }
    }
  },
  "ALFA ROMEO": {
    models: {
      "GIULIA":     { years: [2017, 2026], body: "SEDAN", doors: 4 },
      "STELVIO":    { years: [2018, 2026], body: "SUV", doors: 4 },
      "TONALE":     { years: [2023, 2026], body: "SUV", doors: 4 },
      "4C":         { years: [2015, 2020], body: "COUPE", doors: 2 }
    }
  },
  "GENESIS": {
    models: {
      "G70":       { years: [2019, 2026], body: "SEDAN", doors: 4 },
      "G80":       { years: [2017, 2026], body: "SEDAN", doors: 4 },
      "G90":       { years: [2017, 2026], body: "SEDAN", doors: 4 },
      "GV70":      { years: [2022, 2026], body: "SUV", doors: 4 },
      "GV80":      { years: [2021, 2026], body: "SUV", doors: 4 },
      "ELECTRIFIED G80": { years: [2023, 2026], body: "SEDAN", doors: 4 },
      "GV60":      { years: [2023, 2026], body: "SUV", doors: 4 }
    }
  },
  "RIVIAN": {
    models: {
      "R1T":   { years: [2022, 2026], body: "PICKUP", doors: 4 },
      "R1S":   { years: [2022, 2026], body: "SUV", doors: 4 },
      "R2":    { years: [2026, 2026], body: "SUV", doors: 4 }
    }
  },
  "LUCID": {
    models: {
      "AIR":      { years: [2022, 2026], body: "SEDAN", doors: 4 },
      "GRAVITY":  { years: [2025, 2026], body: "SUV", doors: 4 }
    }
  },
  "POLESTAR": {
    models: {
      "2":   { years: [2021, 2026], body: "SEDAN", doors: 4 },
      "3":   { years: [2024, 2026], body: "SUV", doors: 4 },
      "4":   { years: [2025, 2026], body: "COUPE", doors: 4 }
    }
  },
  "SCION": {
    models: {
      "TC":       { years: [2005, 2016], body: "COUPE", doors: 2 },
      "XB":       { years: [2004, 2015], body: "HATCHBACK", doors: 4 },
      "XD":       { years: [2008, 2014], body: "HATCHBACK", doors: 4 },
      "FR-S":     { years: [2013, 2016], body: "COUPE", doors: 2 },
      "IA":       { years: [2016, 2016], body: "SEDAN", doors: 4 },
      "IM":       { years: [2016, 2016], body: "HATCHBACK", doors: 4 }
    }
  },
  "SATURN": {
    models: {
      "VUE":    { years: [2002, 2010], body: "SUV", doors: 4 },
      "OUTLOOK": { years: [2007, 2010], body: "SUV", doors: 4 },
      "AURA":   { years: [2007, 2009], body: "SEDAN", doors: 4 },
      "ION":    { years: [2003, 2007], body: "SEDAN", doors: 4 },
      "SKY":    { years: [2007, 2010], body: "CONVERTIBLE", doors: 2 },
      "S-SERIES": { years: [2000, 2002], body: "SEDAN", doors: 4 },
      "L-SERIES": { years: [2000, 2005], body: "SEDAN", doors: 4 }
    }
  },
  "PONTIAC": {
    models: {
      "G6":           { years: [2005, 2010], body: "SEDAN", doors: 4 },
      "GRAND PRIX":   { years: [2000, 2008], body: "SEDAN", doors: 4 },
      "GRAND AM":     { years: [2000, 2005], body: "SEDAN", doors: 4 },
      "VIBE":         { years: [2003, 2010], body: "HATCHBACK", doors: 4 },
      "G8":           { years: [2008, 2009], body: "SEDAN", doors: 4 },
      "SOLSTICE":     { years: [2006, 2010], body: "CONVERTIBLE", doors: 2 },
      "SUNFIRE":      { years: [2000, 2005], body: "COUPE", doors: 2 },
      "BONNEVILLE":   { years: [2000, 2005], body: "SEDAN", doors: 4 },
      "AZTEK":        { years: [2001, 2005], body: "SUV", doors: 4 },
      "MONTANA":      { years: [2000, 2005], body: "VAN", doors: 4 },
      "TORRENT":      { years: [2006, 2009], body: "SUV", doors: 4 },
      "FIREBIRD":     { years: [2000, 2002], body: "COUPE", doors: 2 }
    }
  },
  "MERCURY": {
    models: {
      "MARINER":      { years: [2005, 2011], body: "SUV", doors: 4 },
      "MOUNTAINEER":  { years: [2002, 2010], body: "SUV", doors: 4 },
      "MILAN":        { years: [2006, 2011], body: "SEDAN", doors: 4 },
      "GRAND MARQUIS": { years: [2000, 2011], body: "SEDAN", doors: 4 },
      "SABLE":        { years: [2000, 2009], body: "SEDAN", doors: 4 },
      "VILLAGER":     { years: [2000, 2002], body: "VAN", doors: 4 },
      "COUGAR":       { years: [2000, 2002], body: "COUPE", doors: 2 },
      "MONTEREY":     { years: [2004, 2007], body: "VAN", doors: 4 }
    }
  },
  "HUMMER": {
    models: {
      "H2":   { years: [2003, 2009], body: "SUV", doors: 4 },
      "H3":   { years: [2006, 2010], body: "SUV", doors: 4 },
      "H3T":  { years: [2009, 2010], body: "PICKUP", doors: 4 }
    }
  }
};

// ============================================================
// GENERATOR FUNCTIONS
// ============================================================

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateModelFile(make, models) {
  return JSON.stringify({
    make: make,
    total_models: Object.keys(models).length,
    models: Object.keys(models).sort()
  }, null, 2);
}

function generateYearFile(make, model, data) {
  const years = [];
  for (let y = data.years[0]; y <= data.years[1]; y++) {
    const entry = {
      year: y,
      body_class: data.body,
      doors: data.doors
    };
    years.push(entry);
  }
  
  return JSON.stringify({
    make: make,
    model: model,
    production_start: data.years[0],
    production_end: data.years[1],
    total_years: years.length,
    body_class: data.body,
    years: years
  }, null, 2);
}

// ============================================================
// MAIN GENERATOR
// ============================================================
function main() {
  let totalModels = 0;
  let totalYearFiles = 0;
  let totalYearEntries = 0;

  for (const [make, makeData] of Object.entries(VEHICLE_DB)) {
    const makeSlug = slugify(make);
    
    // Create models directory
    const modelsDir = path.join(BASE, 'models');
    fs.mkdirSync(modelsDir, { recursive: true });
    
    // Write model file
    const modelFile = path.join(modelsDir, `${makeSlug}.json`);
    fs.writeFileSync(modelFile, generateModelFile(make, makeData.models));
    console.log(`✅ ${modelFile}`);
    totalModels++;

    // Create years directory for this make
    const yearsDir = path.join(BASE, 'years', makeSlug);
    fs.mkdirSync(yearsDir, { recursive: true });

    // Write year files
    for (const [model, data] of Object.entries(makeData.models)) {
      const modelSlug = slugify(model);
      const yearFile = path.join(yearsDir, `${modelSlug}.json`);
      fs.writeFileSync(yearFile, generateYearFile(make, model, data));
      totalYearFiles++;
      totalYearEntries += (data.years[1] - data.years[0] + 1);
    }
  }

  console.log('\n========================================');
  console.log(`🚗 VEHICLE INDEX GENERATION COMPLETE`);
  console.log(`========================================`);
  console.log(`Makes:        ${totalModels}`);
  console.log(`Model files:  ${totalModels}`);
  console.log(`Year files:   ${totalYearFiles}`);
  console.log(`Year entries: ${totalYearEntries}`);
  console.log('========================================\n');
}

main();
