const mongoose = require("mongoose");
const https = require('https');
const fs = require('fs');
const path = require('path');
require("dotenv").config();
const Product = require("./models/Product");

// ENSURE LOCAL DIR EXISTS
const ASSET_DIR = path.join(__dirname, '..', 'frontend', 'assets', 'products');
if (!fs.existsSync(ASSET_DIR)) {
  fs.mkdirSync(ASSET_DIR, { recursive: true });
}

// Download image helper
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With Status Code: ${res.statusCode}`));
      }
    });
  });
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

// Small delay to avoid rate limiting
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

// ========== PRODUCT DEFINITIONS ==========
const productDefs = [
  // ===== CASUALS (20 items) =====
  { query: "woman white linen shirt casual outfit pinterest", name: "White Linen Blouse", cat: "casual" },
  { query: "woman denim jacket outfit streetwear pinterest", name: "Classic Denim Jacket", cat: "casual" },
  { query: "woman floral sundress summer pinterest", name: "Floral Sundress", cat: "casual" },
  { query: "woman high waist jeans crop top outfit pinterest", name: "High-Waist Jeans & Crop Top", cat: "casual" },
  { query: "woman oversized blazer outfit chic pinterest", name: "Oversized Blazer Look", cat: "casual" },
  { query: "woman maxi skirt outfit elegant casual pinterest", name: "Flowing Maxi Skirt", cat: "casual" },
  { query: "woman striped t-shirt outfit casual pinterest", name: "Striped Tee Ensemble", cat: "casual" },
  { query: "woman palazzo pants outfit elegant pinterest", name: "Wide-Leg Palazzo Set", cat: "casual" },
  { query: "woman co-ord set fashion casual pinterest", name: "Modern Co-Ord Set", cat: "casual" },
  { query: "woman cardigan cozy outfit fall fashion pinterest", name: "Cozy Knit Cardigan", cat: "casual" },
  { query: "woman midi dress casual elegant pinterest", name: "Casual Midi Dress", cat: "casual" },
  { query: "woman leather jacket fashion outfit pinterest", name: "Leather Jacket Style", cat: "casual" },
  { query: "woman wrap top outfit chic casual pinterest", name: "Satin Wrap Top", cat: "casual" },
  { query: "woman jumpsuit casual fashion pinterest", name: "Everyday Jumpsuit", cat: "casual" },
  { query: "woman trench coat outfit spring pinterest", name: "Classic Trench Coat", cat: "casual" },
  { query: "woman summer romper outfit pinterest", name: "Summer Romper", cat: "casual" },
  { query: "woman turtleneck outfit winter fashion pinterest", name: "Ribbed Turtleneck", cat: "casual" },
  { query: "woman pleated skirt outfit fashion pinterest", name: "Pleated Mini Skirt", cat: "casual" },
  { query: "woman off shoulder top outfit casual pinterest", name: "Off-Shoulder Blouse", cat: "casual" },
  { query: "woman linen pants outfit minimalist pinterest", name: "Linen Wide-Leg Pants", cat: "casual" },

  // ===== TRADITIONALS (20 items) =====
  { query: "woman red silk saree elegant pinterest", name: "Red Silk Saree", cat: "traditional" },
  { query: "woman bridal lehenga gold embroidered pinterest", name: "Bridal Gold Lehenga", cat: "traditional" },
  { query: "woman anarkali suit elegant pink pinterest", name: "Pink Anarkali Suit", cat: "traditional" },
  { query: "woman banarasi saree traditional pinterest", name: "Banarasi Silk Saree", cat: "traditional" },
  { query: "woman green georgette saree pinterest", name: "Georgette Drape Saree", cat: "traditional" },
  { query: "woman velvet salwar suit elegant pinterest", name: "Velvet Embroidered Suit", cat: "traditional" },
  { query: "woman kanchipuram saree traditional south indian pinterest", name: "Kanchipuram Heritage Saree", cat: "traditional" },
  { query: "woman organza saree pastel pinterest", name: "Organza Ruffle Saree", cat: "traditional" },
  { query: "woman chanderi silk kurta elegant pinterest", name: "Chanderi Silk Kurta", cat: "traditional" },
  { query: "woman ivory white saree elegant pinterest", name: "Ivory Drape Saree", cat: "traditional" },
  { query: "woman blue lehenga choli wedding pinterest", name: "Royal Blue Lehenga", cat: "traditional" },
  { query: "woman sharara suit fashion indian pinterest", name: "Festive Sharara Suit", cat: "traditional" },
  { query: "woman maroon saree elegant pinterest", name: "Maroon Silk Drape", cat: "traditional" },
  { query: "woman palazzo kurta set elegant pinterest", name: "Palazzo Kurta Set", cat: "traditional" },
  { query: "woman golden saree glamorous pinterest", name: "Golden Tissue Saree", cat: "traditional" },
  { query: "woman floral lehenga colorful wedding pinterest", name: "Floral Print Lehenga", cat: "traditional" },
  { query: "woman embroidered dupatta outfit pinterest", name: "Embroidered Dupatta Set", cat: "traditional" },
  { query: "woman chikankari kurta elegant white pinterest", name: "Chikankari Kurta", cat: "traditional" },
  { query: "woman zardozi work dress indian fashion pinterest", name: "Zardozi Work Gown", cat: "traditional" },
  { query: "woman pastel lehenga wedding guest outfit pinterest", name: "Pastel Wedding Lehenga", cat: "traditional" },

  // ===== PARTY WEAR (20 items) =====
  { query: "woman red evening gown elegant pinterest", name: "Scarlet Evening Gown", cat: "party" },
  { query: "woman black cocktail dress fashion pinterest", name: "Black Cocktail Dress", cat: "party" },
  { query: "woman sequin dress party glamorous pinterest", name: "Sequin Bodycon Dress", cat: "party" },
  { query: "woman satin slip dress elegant night pinterest", name: "Satin Slip Dress", cat: "party" },
  { query: "woman off shoulder gown formal pinterest", name: "Off-Shoulder Ball Gown", cat: "party" },
  { query: "woman metallic dress party fashion pinterest", name: "Metallic Shimmer Dress", cat: "party" },
  { query: "woman velvet dress wine color elegant pinterest", name: "Velvet Wine Dress", cat: "party" },
  { query: "woman backless dress party elegant pinterest", name: "Backless Statement Dress", cat: "party" },
  { query: "woman emerald green gown formal pinterest", name: "Emerald Satin Gown", cat: "party" },
  { query: "woman mini dress heels party outfit pinterest", name: "Chic Party Mini", cat: "party" },
  { query: "woman lace dress elegant evening pinterest", name: "Lace Evening Dress", cat: "party" },
  { query: "woman one shoulder dress formal pinterest", name: "One-Shoulder Statement", cat: "party" },
  { query: "woman pink blush gown prom elegant pinterest", name: "Blush Pink Gown", cat: "party" },
  { query: "woman halter neck dress elegant party pinterest", name: "Halter Neck Design", cat: "party" },
  { query: "woman feather dress glam party pinterest", name: "Feather-Trim Midi", cat: "party" },
  { query: "woman strapless dress elegant formal pinterest", name: "Strapless Corset Dress", cat: "party" },
  { query: "woman glitter dress new year party pinterest", name: "Glitter Night Dress", cat: "party" },
  { query: "woman cape gown dramatic elegant pinterest", name: "Dramatic Cape Gown", cat: "party" },
  { query: "woman thigh slit dress elegant formal pinterest", name: "Thigh-Slit Maxi Gown", cat: "party" },
  { query: "woman navy blue formal dress elegant pinterest", name: "Navy Formal Dress", cat: "party" },
];

const shapes = ["Hourglass", "Pear", "Inverted Triangle", "Straight"];

async function seedDatabase() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected.");
  console.log("Fetching images and downloading locally (this will take a while)...\n");

  const products = [];

  for (let i = 0; i < productDefs.length; i++) {
    const def = productDefs[i];
    console.log(`[${i+1}/60] Processing: "${def.name}"...`);
    
    try {
      const images = await fetchImages(def.query, 1);
      const imageUrl = images[0] || "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800";
      
      const fileExt = path.extname(imageUrl).split('?')[0] || '.jpg';
      const fileName = `${def.cat}_${i}_${def.name.replace(/\s+/g, '_').toLowerCase()}${fileExt}`;
      const localPath = path.join(ASSET_DIR, fileName);
      
      console.log(`       Downloading to: ${fileName}`);
      await downloadImage(imageUrl, localPath);
      await delay(500);

      let price;
      if (def.cat === 'casual') price = Math.floor(Math.random() * (350 - 120 + 1)) + 120;
      else if (def.cat === 'traditional') price = Math.floor(Math.random() * (900 - 300 + 1)) + 300;
      else price = Math.floor(Math.random() * (650 - 200 + 1)) + 200;

      products.push({
        name: def.name,
        imagePath: `assets/products/${fileName}`,
        category: def.cat,
        idealShape: shapes[i % shapes.length],
        price: price
      });
    } catch (err) {
      console.error(`       Error processing ${def.name}:`, err.message);
    }
  }

  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`\n✅ Successfully seeded ${products.length} items with LOCAL photos!`);
  process.exit();
}

seedDatabase().catch(err => {
  console.error(err);
  process.exit(1);
});
