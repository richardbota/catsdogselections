const mongoose = require('mongoose');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose
    .connect
    ('mongodb://rich:qwertyui1@ds223015.mlab.com:23015/catsdogselection')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));