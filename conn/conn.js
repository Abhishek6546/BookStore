const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const conn =async()=>{
    try {
        await mongoose.connect(`${process.env.URI}`)
        console.log("connected db");
        
    } catch (error) {
        console.log(error); 
    }
}
conn();