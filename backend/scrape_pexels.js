async function test() {
  const urls = [];
  try {
    const res = await fetch('https://www.pexels.com/search/casual%20everyday%20outfit%20women/', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const html = await res.text();
    // Pexels images look like: src="https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg?auto=compress..."
    const matches = html.match(/https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg/g);
    
    if (matches) {
      // Remove duplicates
      const unique = [...new Set(matches)];
      console.log("Found:", unique.length, "images");
      console.log(unique.slice(0, 5));
    } else {
      console.log("No images found");
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}
test();
