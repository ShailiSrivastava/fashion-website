async function test() {
  try {
    const res = await fetch('https://unsplash.com/napi/search/photos?query=fashion%20model%20woman&per_page=3&page=1', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const data = await res.json();
    console.log("Got total:", data.total);
    if (data.results && data.results.length > 0) {
      console.log(data.results[0].urls.regular);
    }
  } catch (err) {
    console.log("Error:", err.message);
  }
}
test();
