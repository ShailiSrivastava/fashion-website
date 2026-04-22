const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  imagePath: String,
});

const Product = mongoose.model('Product', productSchema);

async function getUrls() {
  const MONGO_URI = 'mongodb+srv://shailisrivastava0905_db_user:samayra123@cluster0.rdb6ggx.mongodb.net/samayraDB?retryWrites=true&w=majority';
  await mongoose.connect(MONGO_URI);
  const products = await Product.find({});
  products.forEach(p => console.log(`${p._id}|${p.imagePath}|${p.name}`));
  await mongoose.disconnect();
}

getUrls();
