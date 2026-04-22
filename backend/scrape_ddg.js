const https = require('https');

function fetchImages(query, limit) {
  return new Promise((resolve, reject) => {
    // 1. Get VQD token
    https.get(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, res => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const vqdMatch = html.match(/vqd=([\d-]+)/);
        if(!vqdMatch) return resolve([]); // Failed to get token
        const vqd = vqdMatch[1];
        
        // 2. Fetch images
        https.get(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&vqd=${vqd}`, imgRes => {
          let jsonStr = '';
          imgRes.on('data', chunk => jsonStr += chunk);
          imgRes.on('end', () => {
            try {
              const data = JSON.parse(jsonStr);
              if (data.results) {
                resolve(data.results.slice(0, limit).map(r => r.image));
              } else {
                resolve([]);
              }
            } catch(e) { resolve([]); }
          });
        }).on('error', () => resolve([]));
      });
    }).on('error', () => resolve([]));
  });
}

async function run() {
  const casuals = await fetchImages("casual everyday streetwear fashion model woman pinterest", 20);
  const trads = await fetchImages("traditional saree ethnic fashion model woman pinterest", 20);
  const party = await fetchImages("party wear evening gown fashion model woman pinterest", 20);

  console.log(casuals[0]);
  console.log("Casuals:", casuals.length);
  console.log("Trads:", trads.length);
  console.log("Party:", party.length);
}

run();
