# Gallery photographs

Drop the ten site photographs here using the exact filenames below. The gallery
reads them by path from `GALLERY_PROJECTS` in `src/components/data/mockData.ts`,
so no code change is needed once a file is in place — refresh and it appears.

A missing or misnamed file silently falls back to its hand-drawn vector scene
rather than showing a broken frame. That keeps the page presentable while the
set is incomplete, but it also means a typo looks like "nothing happened".
If a photo does not show up, check the filename against this list first.

| # | Filename                    | Subject                                      | Crop  |
|---|-----------------------------|----------------------------------------------|-------|
| 01| `01-raised-house.jpg`       | 2-storey house raised above flood level, Kochi| 16:9 |
| 02| `02-jack-array.jpg`         | Jack array under foundation beams, Babain     | 4:3  |
| 03| `03-commercial-block.jpg`   | Commercial complex elevation, Patna           | 16:9 |
| 04| `04-heritage.jpg`           | Heritage haveli lift, Amritsar                | 4:3  |
| 05| `05-jack-closeup.jpg`       | 100-ton jack cylinder mid-stroke              | 4:3  |
| 06| `06-before-after.jpg`       | Before/after road-height comparison, Chennai  | 16:9 |
| 07| `07-rcc-pillar.jpg`         | RCC pillar casting under lifted building      | 4:3  |
| 08| `08-temple.jpg`             | Temple relocation, Ludhiana                   | 16:9 |
| 09| `09-villa-flood.jpg`        | Villa in waterlogged zone, Thrissur           | 4:3  |
| 10| `10-control-panel.jpg`      | Master hydraulic control panel, Kurukshetra   | 16:9 |

## Preparing the files

- Crop roughly to the listed aspect. The plate uses `object-cover`, so an
  off-ratio image crops from the centre rather than distorting — but the
  subject should survive that crop.
- About 1600 px on the long edge is plenty; Next's image optimizer generates
  the smaller sizes. Larger originals just slow the first build.
- `.jpg` is what the data file expects. To use `.png` or `.webp` instead,
  update the matching `photo:` path in `mockData.ts`.
- Captions, locations and the spec tables already exist per project in
  `mockData.ts`. Edit them there if the real photograph shows a different
  job than the placeholder text describes.
