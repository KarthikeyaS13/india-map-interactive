const fs = require('fs');

const svgPath = '/home/surendra/india-map/public/Telangana_districts.svg';
const content = fs.readFileSync(svgPath, 'utf8');

// Let's search for <g> tags and see if they have ids or if they contain <path> tags
// We can use a simpler regex or parsing.
// Let's find all occurrences of "<title>" or "<desc>"
const titleRegex = /<title>([^<]+)<\/title>/gi;
const titles = [];
let match;
while ((match = titleRegex.exec(content)) !== null) {
  titles.push(match[1]);
}
console.log('Titles found:', titles);

// Let's check if there are group tags like <g id="..."> or <g class="...">
const gRegex = /<g\s+([^>]+)>/g;
const groups = [];
while ((match = gRegex.exec(content)) !== null) {
  groups.push(match[1]);
}
console.log('Groups found:', groups.slice(0, 10));

// Let's inspect the elements around one of the path IDs, e.g. path1206
const pathIndex = content.indexOf('id="path1206"');
if (pathIndex !== -1) {
  console.log('Context around path1206:', content.substring(Math.max(0, pathIndex - 200), pathIndex + 200));
}

// Let's inspect context around path1208
const pathIndex2 = content.indexOf('id="path1208"');
if (pathIndex2 !== -1) {
  console.log('Context around path1208:', content.substring(Math.max(0, pathIndex2 - 200), pathIndex2 + 200));
}
