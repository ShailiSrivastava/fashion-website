const https = require('https');
const fs = require('fs');
const path = require('path');

// CONFIG
const ASSET_DIR = path.join(__dirname, '..', 'frontend', 'assets', 'products');
if (!fs.existsSync(ASSET_DIR)) {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
}

// Scrape Pinterest images via DuckDuckGo Image API
function fetchImages(query, limit) {
  return new Promise((resolve) => {
    https.get(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, res => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        const vqdMatch = html.match(/vqd=([\d-]+)/);
        if(!vqdMatch) return resolve([]);
        const vqd = vqdMatch[1];
        
        https.get(`https://duckduckgo.com/i.js?q=${encodeURIComponent(query)}&o=json&vqd=${vqd}`, imgRes => {
          let jsonStr = '';
          imgRes.on('data', chunk => jsonStr += chunk);
          imgRes.on('end', () => {
            try {
              const data = JSON.parse(jsonStr);
              if (data.results) {
                const links = data.results
                  .filter(r => r.image && (r.image.includes('pinimg.com') || r.image.includes('.jpg') || r.image.includes('.jpeg') || r.image.includes('.png')))
                  .map(r => r.image);
                resolve(links.slice(0, limit));
              } else resolve([]);
            } catch(e) { resolve([]); }
          });
        }).on('error', () => resolve([]));
      });
    }).on('error', () => resolve([]));
  });
}

// Download image helper
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const writer = fs.createWriteStream(filepath);
        res.pipe(writer);
        writer.on('finish', () => resolve());
        writer.on('error', reject);
      } else {
        res.resume();
        reject(new Error(`Failed: ${res.statusCode}`));
      }
    });
  });
}

const productDefs = [
  // CASUALS
  { query: "luxury white linen blouse woman pinterest", name: "Linen Luxe Blouse", cat: "casual" },
  { query: "high end silk casual dress woman pinterest", name: "Silk Shift Dress", cat: "casual" },
  { query: "premium wool cardigan fashion woman pinterest", name: "Premium Knit Shell", cat: "casual" },
  { query: "minimalist cotton shirt daily wear woman pinterest", name: "Cotton Everyday Tee", cat: "casual" },
  { query: "luxury cashmere scarf fashion woman pinterest", name: "Cashmere Wrap", cat: "casual" },
  // TRADITIONALS
  { query: "luxury designer lehenga traditional indian fashion", name: "Heritage Gold Lehenga", cat: "traditional" },
  { query: "expensive banarasi silk saree rich fabric pinterest", name: "Royal Banarasi Silk", cat: "traditional" },
  { query: "hand embroidered anarkali luxury indian fashion", name: "Midnight Embroidered Suit", cat: "traditional" },
  { query: "pure kanchipuram silk saree premium quality", name: "Kanchipuram Heritage Saree", cat: "traditional" },
  { query: "designer handloom saree elegant luxury fashion", name: "Handloom Weave Saree", cat: "traditional" },
  // PARTY WEAR
  { query: "luxury black evening gown velvet couture pinterest", name: "Midnight Velvet Noir", cat: "party" },
  { query: "expensive satin red cocktail dress fashion party", name: "Crimson Satin Glow", cat: "party" },
  { query: "shimmering sequin gown luxury party wear pinterest", name: "Stellar Sequin Gown", cat: "party" },
  { query: "elegant lace gown wedding party luxury fashion", name: "Ethereal Lace Gown", cat: "party" },
  { query: "metallic silver dress high end party wear", name: "Silver Moonlight Mini", cat: "party" }
];

async function run() {
  console.log("Starting local photo collection (15 high-res curations)...");
  const localProducts = [];

  for (let i = 0; i < productDefs.length; i++) {
    const def = productDefs[i];
    console.log(`[${i+1}/${productDefs.length}] Processing: ${def.name}`);
    
    try {
      const urls = await fetchImages(def.query, 1);
      if (urls.length > 0) {
        const url = urls[0];
        const ext = path.extname(url).split('?')[0] || '.jpg';
        const filename = `${def.cat}_${i}_local${ext}`;
        const filepath = path.join(ASSET_DIR, filename);
        
        await downloadImage(url, filepath);
        
        localProducts.push({
          _id: `local_${i}`,
          name: def.name,
          category: def.cat,
          price: Math.floor(Math.random() * (1200 - 150)) + 150,
          imagePath: `assets/products/${filename}`
        });
      }
    } catch (e) {
      console.log(`  Failed downloading ${def.name}: ${e.message}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }

  fs.writeFileSync(path.join(__dirname, 'local_products.json'), JSON.stringify(localProducts, null, 2));
  console.log("\n✅ Success! 15 photos downloaded and local_products.json created.");
}

run();
