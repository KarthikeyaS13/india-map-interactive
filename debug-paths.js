const m = require('@svg-maps/india');
const states = ['hr', 'hp', 'pb', 'jk', 'rj', 'up', 'ut'];
console.log('viewBox:', m.default.viewBox);
console.log('');
states.forEach(id => {
  const loc = m.default.locations.find(l => l.id === id);
  const path = loc.path;
  const coords = path.match(/-?[\d.]+/g).map(Number);
  const xs = [], ys = [];
  for(let i=0; i<coords.length-1; i+=2) {
    xs.push(coords[i]);
    ys.push(coords[i+1]);
  }
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const cx = ((minX+maxX)/2).toFixed(1);
  const cy = ((minY+maxY)/2).toFixed(1);
  console.log(id + ' (' + loc.name + ') => bbox center: (' + cx + ', ' + cy + ')   bbox: (' + minX.toFixed(0) + ',' + minY.toFixed(0) + ') to (' + maxX.toFixed(0) + ',' + maxY.toFixed(0) + ')');
});
