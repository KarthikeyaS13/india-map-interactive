import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const mapping = await request.json();

    // 1. Generate maps/TelanganaMapData.ts
    const locations = Object.entries(mapping).map(([id, data]: [string, any]) => {
      return {
        id,
        name: data.name,
        path: data.path
      };
    });

    const mapDataContent = `export const TelanganaMapData = {
  viewBox: "0 0 3000 2911.4",
  locations: ${JSON.stringify(locations, null, 2)}
};
`;

    const mapDataPath = path.join(process.cwd(), "maps", "TelanganaMapData.ts");
    fs.writeFileSync(mapDataPath, mapDataContent, "utf-8");

    // 2. Generate utils/coordinates/districtCoordinates/telangana.ts
    const coordinates: Record<string, { x: number; y: number }> = {};
    Object.entries(mapping).forEach(([id, data]: [string, any]) => {
      coordinates[data.name] = {
        x: data.labelPercent.x,
        y: data.labelPercent.y
      };
    });

    const coordsContent = `export const telanganaCoordinates: Record<string, { x: number; y: number }> = ${JSON.stringify(coordinates, null, 2)};
`;

    const coordsPath = path.join(process.cwd(), "utils", "coordinates", "districtCoordinates", "telangana.ts");
    fs.writeFileSync(coordsPath, coordsContent, "utf-8");

    return NextResponse.json({ success: true, message: "Telangana map and coordinates updated successfully!" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
