/**
 * Projects a GeoJSON feature collection to an SVG-compatible format linearly.
 * Best used for relatively small geographic areas like a single state.
 */
export const projectGeoJSONToSVG = (geojson: any, width: number = 800, height: number = 800) => {
  let minLng = Infinity, maxLng = -Infinity;
  let minLat = Infinity, maxLat = -Infinity;

  const traverseCoordinates = (coords: any[]) => {
    if (typeof coords[0] === 'number') {
      minLng = Math.min(minLng, coords[0]);
      maxLng = Math.max(maxLng, coords[0]);
      minLat = Math.min(minLat, coords[1]);
      maxLat = Math.max(maxLat, coords[1]);
    } else {
      coords.forEach(traverseCoordinates);
    }
  };

  geojson.features.forEach((feature: any) => {
    traverseCoordinates(feature.geometry.coordinates);
  });

  // Calculate the aspect ratio to maintain the map's correct proportions
  const lngRange = maxLng - minLng;
  const latRange = maxLat - minLat;
  // Approximate cosine factor for latitude distortion
  const midLat = (minLat + maxLat) / 2;
  const aspect = (lngRange * Math.cos(midLat * Math.PI / 180)) / latRange;

  let scaledWidth = width;
  let scaledHeight = height;

  if (aspect > 1) {
    scaledHeight = width / aspect;
  } else {
    scaledWidth = height * aspect;
  }

  // Linear projection function
  const project = (lng: number, lat: number) => {
    const x = ((lng - minLng) / lngRange) * scaledWidth;
    const y = ((maxLat - lat) / latRange) * scaledHeight;
    return { x, y };
  };

  const featureToPath = (geometry: any) => {
    let d = "";
    const processPolygon = (ring: any[]) => {
      ring.forEach(([lng, lat], i) => {
        const { x, y } = project(lng, lat);
        if (i === 0) d += `M${x.toFixed(2)},${y.toFixed(2)} `;
        else d += `L${x.toFixed(2)},${y.toFixed(2)} `;
      });
      d += "Z ";
    };

    if (geometry.type === "Polygon") {
      geometry.coordinates.forEach(processPolygon);
    } else if (geometry.type === "MultiPolygon") {
      geometry.coordinates.forEach((polygon: any[]) => {
        polygon.forEach(processPolygon);
      });
    }
    return d;
  };

  const locations = geojson.features.map((feature: any) => {
    return {
      id: feature.properties.D_N.toLowerCase().replace(/\s+/g, '-'),
      name: feature.properties.D_N,
      path: featureToPath(feature.geometry)
    };
  });

  return {
    viewBox: `0 0 ${scaledWidth.toFixed(2)} ${scaledHeight.toFixed(2)}`,
    locations 
  };
};
  