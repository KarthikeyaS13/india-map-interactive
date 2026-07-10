import * as fs from 'fs';
import { drawPath, districtNames } from './telanganaData';

const locations = Object.keys(drawPath).map(code => {
    return {
        id: code.toLowerCase(),
        name: districtNames[code],
        path: drawPath[code]
    };
});

const tsData = `export const TelanganaMapData = {\n  viewBox: "0 0 1000 1000",\n  locations: ${JSON.stringify(locations, null, 4)}\n};`;
fs.writeFileSync('/home/surendra/india-map/maps/TelanganaMapData.ts', tsData);

let coordsData = `export const telanganaCoordinates: Record<string, { x: number; y: number }> = {\n`;
locations.forEach(loc => {
    coordsData += `  "${loc.name}": { x: 50, y: 50 },\n`;
});
coordsData += `};\n`;
fs.writeFileSync('/home/surendra/india-map/utils/coordinates/districtCoordinates/telangana.ts', coordsData);
console.log("Success");
