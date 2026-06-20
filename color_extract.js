const fs = require('fs');

const html = fs.readFileSync('/home/tyr/.gemini/antigravity-ide/brain/a401b5f6-db13-44ff-8985-623f35137dd5/.system_generated/steps/218/content.md', 'utf-8');

// match typical hex colors in inline styles or css that are not just #fff or #000
const colors = html.match(/#[0-9a-fA-F]{6}/g) || [];
const freq = {};
colors.forEach(c => {
    const l = c.toLowerCase();
    if (l !== '#ffffff' && l !== '#000000' && l !== '#eeeeee' && l !== '#dddddd') {
        freq[l] = (freq[l] || 0) + 1;
    }
});

const sorted = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 10);
console.log("Dominant colors found in scraped HTML:", sorted);
