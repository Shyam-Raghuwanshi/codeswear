const mongoose = require('mongoose')
const connectDb = async () => {
    // console.log(process.env.MONGO_URL, 'this is url');
    // mongoose.connect(process.env.MONGO_URL)
    // Example connection URL using IPv4
    mongoose.connect('mongodb://127.0.0.1:27017/ROOTCHOICE', { useNewUrlParser: true, useUnifiedTopology: true });

}

export default connectDb;