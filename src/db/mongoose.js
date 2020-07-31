const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();

mongoose.connect(process.env.MONGOOSE_CONFIG,{
   useNewUrlParser: true,
   useCreateIndex: true,
   useUnifiedTopology: true,
   useFindAndModify: false
});

