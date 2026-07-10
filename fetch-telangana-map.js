const fs = require('fs');
const https = require('https');

console.log("Fetching real Telangana district SVG map...");

https.get('https://raw.githubusercontent.com/arav-ind/svgmaps-india/master/packages/telangana/src/constants/telangana.ts', (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        try {
            console.log("Downloaded map data. Parsing...");
            
            // Strip TypeScript types to make it pure JS
            data = data.replace(/export const /g, 'const ');
            data = data.replace(/: \{ \[code: string\]: string \}/g, '');
            data = data.replace(/: string\[\]/g, '');

            const evalCode = `
                ${data}
                
                const locations = Object.keys(drawPath).map(code => {
                    return {
                        id: code.toLowerCase(),
                        name: districtNames[code],
                        path: drawPath[code]
                    };
                });
                
                const tsData = \`export const TelanganaMapData = {\\n  viewBox: "0 0 1000 1000",\\n  locations: \${JSON.stringify(locations, null, 4)}\\n};\`;
                require('fs').writeFileSync('./maps/TelanganaMapData.ts', tsData);
                
                let coordsData = \`export const telanganaCoordinates: Record<string, { x: number; y: number }> = {\\n\`;
                locations.forEach(loc => {
                    coordsData += \`  "\${loc.name}": { x: 50, y: 50 },\\n\`;
                });
                coordsData += \`};\\n\`;
                require('fs').writeFileSync('./utils/coordinates/districtCoordinates/telangana.ts', coordsData);
                console.log("✅ Successfully generated maps/TelanganaMapData.ts and utils/coordinates/districtCoordinates/telangana.ts!");
            `;
            
            // Execute the stripped JS
            const Script = require('vm').Script;
            const script = new Script(evalCode);
            script.runInThisContext();
            
        } catch (e) {
            console.error("Error parsing the map data:", e);
        }
    });
}).on('error', (e) => {
    console.error("Failed to fetch map data:", e);
});
