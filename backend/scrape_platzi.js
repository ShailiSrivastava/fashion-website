async function test() {
  const res = await fetch('https://api.escuelajs.co/api/v1/categories/1/products');
  const data = await res.json();
  console.log("Got items:", data.length);
  if(data.length > 0) {
    console.log("Sample image:", data[0].images[0]);
  }
}
test();
