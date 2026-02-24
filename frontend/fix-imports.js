const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('c:/picture/rate-my-spot/frontend/src');
let changedCount = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('import request, { Result }')) {
        content = content.replace(/import request, \{ Result \}/g, "import request, { type Result }");
        fs.writeFileSync(f, content);
        changedCount++;
        console.log('Fixed', f);
    }
});
console.log(`Total files fixed: ${changedCount}`);
