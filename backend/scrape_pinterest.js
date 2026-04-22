const axios = require('axios');
const cheerio = require('cheerio');

async function testPinterest() {
  try {
    const { data } = await axios.get('https://www.pinterest.com/search/pins/?q=casual%20everyday%20outfit%20women', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const $ = cheerio.load(data);
    const images = [];
    $('img').each((i, el) => {
      images.push($(el).attr('src'));
    });
    console.log("Found images:", images.length, images.slice(0, 5));
  } catch (err) {
    console.log("Error:", err.message);
  }
}
testPinterest();
