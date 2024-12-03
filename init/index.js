const mongoose = require('mongoose');
const product = require ("../models/product");
const initData = require("./data.js");

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/product');
}

const initDB = async () => {
    try {
        await product.deleteMany({});
        await product.insertMany(initData.data);
        console.log("data was initialized");
    } catch(e) {
        console.log("failed to initialzed data" , e);
    }
   
};

initDB();
