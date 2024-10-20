import 'dotenv/config';  // This is the modern way to import and configure dotenv
import app from './app.js';
import connectDB from './config/database.js';

const PORT = process.env.PORT || 5000;

await connectDB();  // Since we're in a module, we can use top-level await

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});