const fs = require('fs');
const https = require('https');

https.get('https://raw.githubusercontent.com/arav-ind/svgmaps-india/master/packages/telangana/src/constants/telangana.ts', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        // Extract drawPath
        const drawPathMatch = data.match(/export const drawPath[\s\S]*?=\{([\s\S]*?)\n\}/);
        // Extract districtNames
        const namesMatch = data.match(/export const districtNames: \{ \[code: string\]: string \} = \{([\s\S]*?)\n\}/);

        if (!drawPathMatch || !namesMatch) {
            console.error("Could not parse");
            process.exit(1);
        }

        const drawPathStr = "{" + drawPathMatch[1] + "}";
        const namesStr = "{" + namesMatch[1] + "}";

        const drawPath = new Function("return " + drawPathStr)();
        const districtNames = new Function("return " + namesStr)();

        const locations = Object.keys(drawPath).map(code => {
            return {
                id: code.toLowerCase(),
                name: districtNames[code],
                path: drawPath[code]
            };
        });

        const tsData = `export const TelanganaMapData = {\n  viewBox: "0 0 1000 1000",\n  locations: ${JSON.stringify(locations, null, 4)}\n};`;
        fs.writeFileSync('/home/surendra/india-map/maps/TelanganaMapData.ts', tsData);

        // Generate coordinate template
        let coordsData = `export const telanganaCoordinates: Record<string, { x: number; y: number }> = {\n`;
        locations.forEach(loc => {
            coordsData += `  "${loc.name}": { x: 50, y: 50 },\n`;
        });
        coordsData += `};\n`;
        fs.writeFileSync('/home/surendra/india-map/utils/coordinates/districtCoordinates/telangana.ts', coordsData);

        console.log("Wrote TelanganaMapData.ts and coordinates");
    });
});
