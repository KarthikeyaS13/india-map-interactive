const fs = require('fs');
const https = require('https');
const path = require('path');
const vm = require('vm');

const states = [
  { key: 'Karnataka', pkg: 'karnataka', file: 'karnataka', viewBox: '0 0 2000 2000' },
  { key: 'Maharashtra', pkg: 'maharashtra', file: 'maharashtra', viewBox: '0 0 2000 2000' },
  { key: 'Tamil Nadu', pkg: 'tamilnadu', file: 'tamilnadu', viewBox: '0 0 2000 2000' }
];

function fetchState(state) {
  return new Promise((resolve, reject) => {
    const url = `https://raw.githubusercontent.com/arav-ind/svgmaps-india/master/packages/${state.pkg}/src/constants/${state.file}.ts`;
    console.log(`Fetching ${state.key} from ${url}...`);
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          // Strip TypeScript types
          let jsData = data
            .replace(/export const /g, 'const ')
            .replace(/: \{ \[code: string\]: string \}/g, '')
            .replace(/: string\[\]/g, '');
          
          const evalCode = `
            ${jsData}
            const locations = Object.keys(drawPath).map(code => {
              return {
                id: code.toLowerCase(),
                name: districtNames[code],
                path: drawPath[code]
              };
            });
            ({ locations });
          `;
          
          const result = vm.runInNewContext(evalCode);
          const locations = result.locations;
          
          // Write Map Data File
          const mapDataContent = `export const ${state.key.replace(/\s+/g, '')}MapData = {\n  viewBox: "${state.viewBox}",\n  locations: ${JSON.stringify(locations, null, 2)}\n};\n`;
          const mapPath = path.join(__dirname, 'maps', `${state.key.replace(/\s+/g, '')}MapData.ts`);
          fs.writeFileSync(mapPath, mapDataContent);
          console.log(`✅ Wrote map data to ${mapPath}`);
          
          // Write Coordinates File
          // We provide approximate center coordinates for known active districts, and 50,50 for others
          let coords = {};
          locations.forEach(loc => {
            coords[loc.name] = { x: 50, y: 50 };
          });
          
          // Adjust specific active districts for nicer visual rendering
          if (state.key === 'Karnataka') {
            coords['Bengaluru Urban'] = { x: 62, y: 73 };
            coords['Mysuru'] = { x: 55, y: 76 };
            coords['Belgavi'] = { x: 30, y: 35 };
          } else if (state.key === 'Maharashtra') {
            coords['Mumbai City'] = { x: 12, y: 55 };
            coords['Pune'] = { x: 20, y: 62 };
            coords['Nagpur'] = { x: 80, y: 30 };
          } else if (state.key === 'Tamil Nadu') {
            coords['Chennai'] = { x: 78, y: 15 };
            coords['Coimbatore'] = { x: 25, y: 65 };
            coords['Madurai'] = { x: 45, y: 75 };
          }
          
          const coordContent = `export const ${state.key.replace(/\s+/g, '').toLowerCase()}Coordinates: Record<string, { x: number; y: number }> = ${JSON.stringify(coords, null, 2)};\n`;
          const coordPath = path.join(__dirname, 'utils', 'coordinates', 'districtCoordinates', `${state.key.replace(/\s+/g, '').toLowerCase()}.ts`);
          fs.writeFileSync(coordPath, coordContent);
          console.log(`✅ Wrote coordinates to ${coordPath}`);
          
          resolve();
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  // Ensure directories exist
  fs.mkdirSync(path.join(__dirname, 'maps'), { recursive: true });
  fs.mkdirSync(path.join(__dirname, 'utils', 'coordinates', 'districtCoordinates'), { recursive: true });
  
  for (const state of states) {
    try {
      await fetchState(state);
    } catch (e) {
      console.error(`Failed to generate for ${state.key}:`, e);
    }
  }
}

run();
