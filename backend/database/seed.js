const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

require('../models/UserModel');
require('../models/JobModel');
require('../models/MessageModel');
require('../models/MilestoneModel');
require('../models/PaymentModel');
require('../models/PortfolioModel');
require('../models/ReviewModel');
require('../models/ShardSchema');
require('../models/SkillModel');
require('../models/EarningModel');


const MONGO_URI = process.env.MONGO_URI ;
console.log(MONGO_URI);

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('📦 Connected to MongoDB');

  const collections = mongoose.connection.collections;

  await Promise.all(Object.keys(collections).map(async (col) => {
    if (!collections[col]) {
      await mongoose.connection.createCollection(col);
    }
  }));

  console.log('✅ Collections registered');
  process.exit(0);
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});
