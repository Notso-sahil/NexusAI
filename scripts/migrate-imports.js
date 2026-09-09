const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (f === 'node_modules' || f === '.git' || f === '.output') continue;
    if (fs.statSync(p).isDirectory()) res = res.concat(walk(p));
    else if (/\.(ts|vue|js|json|md)$/.test(f)) res.push(p);
  }
  return res;
}

const files = [
  ...walk(path.join(__dirname, '..', 'packages', 'extension')),
  ...walk(path.join(__dirname, '..', 'packages', 'bridge')),
];
let updatedCount = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('chrome-mcp-shared')) {
    const updated = content
      .replaceAll("'chrome-mcp-shared'", "'@nexusai/shared'")
      .replaceAll('"chrome-mcp-shared"', '"@nexusai/shared"');
    fs.writeFileSync(file, updated, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.relative(path.join(__dirname, '..'), file)}`);
  }
}

console.log(`\nMigration complete. Updated ${updatedCount} files to @nexusai/shared.`);
