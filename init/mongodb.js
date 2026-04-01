const { connection } = require("mongoose");
const connectionUrl = "mongodb://localhost:27017/todoDb";
const mongoose=require("mongoose");

const connectMongodb=async ()=>{
try
{
    await mongoose.connect(connectionUrl);
    console.log("Connected to MongoDB");
}
catch(err)
{
    console.error(err.message);
        process.exit(1);

}
module.exports=connectMongodb;}