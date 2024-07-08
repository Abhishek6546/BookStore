const router =require("express").Router();
const User =require("../models/user");
const jwt= require("jsonwebtoken");
const Book = require("../models/book");
const {authenticationToken} =require("./userAuth")

//add book --admin

router.post("/add-book",authenticationToken,async(req,res)=>{
    try {
        const {id}=req.headers;
        const user= await User.findById(id);
        if(user.role !== "admin"){
            res.status(500).json({message:"internal server error",error});
        }

        const book =new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc :req.body.desc,
            language: req.body.language,
        });
        await book.save();
        res.status(200).json({message:"book added successfully"});
    } catch (error) {
        res.status(500).json({message:"internal server error",error});
    }
})


//update book
router.put("/update-book",authenticationToken,async(req,res)=>{
    try {
        const {bookid}=req.headers;
        await  Book.findByIdAndUpdate(bookid,{
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc :req.body.desc,
            language: req.body.language,
        });

        res.status(200).json({message:"book updated successfully"});
    } catch (error) {
        res.status(500).json({message:"internal server error",error});
    }
});

//delete book
router.delete("/delete-book",authenticationToken,async(req,res)=>{
    try {
        const {bookid}=req.headers;
        await Book.findByIdAndDelete(bookid);
        res.status(200).json({message:"book deleted successfully"});
    } catch (error) {
        res.status(500).json({message:"internal server error",error});
    }
});


// user Apis
//get all books
router.get("/get-all-books",async(req,res)=>{
    try {
       const books = await Book.find().sort({createdAT: -1});
        res.status(200).json({message:"success",data:books});
    } catch (error) {
        res.status(500).json({message:"internal server error",error});
    }
});

//get recently added books limit 4
router.get("/get-recent-books",async(req,res)=>{
    try {
       const books =await Book.find().sort({createdAT: -1}).limit(4);
        res.status(200).json({message:"success",data:books});
    } catch (error) {
        res.status(500).json({message:"internal server error",error});
    }
});

//get book by id
router.get("/get-book-id/:id",async(req,res)=>{
    try {
        const {id} =req.params;
        const book =await Book.findById(id);
        res.status(200).json({message:"success",data:book});
    } catch (error) {
        res.status(500).json({message:"internal server error",error});
    }
});
module.exports=router;