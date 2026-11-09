// Mengubah GeoJSON provinsi Indonesia menjadi path SVG ringan (src/data/indonesiaMap.json)
import { readFileSync, writeFileSync } from 'node:fs'
import { geoMercator, geoPath } from 'd3-geo'

const geo = JSON.parse(readFileSync(new URL('./indonesia-province.json', import.meta.url), 'utf8'))
const W = 760
const H = 300
const projection = geoMercator().fitExtent(
  [[8, 8], [W - 8, H - 8]],
  geo,
)
const path = geoPath(projection).digits(1)

const provinces = geo.features.map((f) => {
  const name = String(f.properties.Propinsi).trim()
  const [cx, cy] = path.centroid(f)
  return { name, d: path(f), cx: +cx.toFixed(1), cy: +cy.toFixed(1) }
})

writeFileSync(
  new URL('../src/data/indonesiaMap.json', import.meta.url),
  JSON.stringify({ width: W, height: H, provinces }),
)
console.log('provinsi:', provinces.length)
