const fs = require('fs');
const path = require('path');

const svgPath = '/home/surendra/india-map/public/Telangana_districts.svg';
const content = fs.readFileSync(svgPath, 'utf8');

// Parse paths in Map_1_
// <g id="Map_1_"> ... </g>
const map1Start = content.indexOf('<g id="Map_1_">');
const map1End = content.indexOf('</g>', map1Start);
const map1Content = content.substring(map1Start, map1End);

const pathRegex = /<path\s+([^>]+)>/g;
let match;
const districtPaths = [];

while ((match = pathRegex.exec(map1Content)) !== null) {
  const attrsStr = match[1];
  const attrs = {};
  const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
    attrs[attrMatch[1]] = attrMatch[2];
  }
  districtPaths.push(attrs);
}

// Parse groups in Names
const namesStart = content.indexOf('<g id="Names">');
const namesEnd = content.lastIndexOf('</g>'); // Names goes to the end
const namesContent = content.substring(namesStart, namesEnd);

// Find all <g> directly under Names
// E.g., <g>\n\t\t<path fill="#565656" d="..."/> ... \n\t</g>
const gRegex = /<g>([\s\S]*?)<\/g>/g;
const labelGroups = [];
let gMatch;
let labelIdx = 0;

while ((gMatch = gRegex.exec(namesContent)) !== null) {
  const innerContent = gMatch[1];
  // Find first path or all paths in this group
  const pathsInG = [];
  let pMatch;
  const pRegex = /<path\s+([^>]+)>/g;
  while ((pMatch = pRegex.exec(innerContent)) !== null) {
    const attrsStr = pMatch[1];
    const attrs = {};
    const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      attrs[attrMatch[1]] = attrMatch[2];
    }
    pathsInG.push(attrs);
  }
  
  if (pathsInG.length > 0) {
    // Calculate bounding box or reference point
    // Let's get the first path's start point
    const firstD = pathsInG[0].d || '';
    const mMatch = /M\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(firstD);
    let startPoint = null;
    if (mMatch) {
      startPoint = { x: parseFloat(mMatch[1]), y: parseFloat(mMatch[2]) };
    }
    labelGroups.push({
      index: labelIdx++,
      pathsCount: pathsInG.length,
      startPoint,
      firstD: firstD.substring(0, 50)
    });
  }
}

const output = {
  totalDistricts: districtPaths.length,
  districts: districtPaths.map(d => ({ id: d.id })),
  totalLabels: labelGroups.length,
  labels: labelGroups
};

fs.writeFileSync('/home/surendra/india-map/scratch/labels_info.json', JSON.stringify(output, null, 2));
console.log('Done!');
