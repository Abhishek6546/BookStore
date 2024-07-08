const router = require("express").Router();
const User = require("../models/user");
const { authenticationToken } = require("./userAuth");
const Order = require("../models/order");
const Book = require("../models/book");
//place order
router.post("/place-order", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { order } = req.body;
        for (const orderData of order) {
            const newOrder = new Order({ user: id, book: orderData._id });
            const orderdatafromDb = await newOrder.save();

            //saving order in user model
            await User.findByIdAndUpdate(id, { $push: { orders: orderdatafromDb._id } });

            // clearing cart
            await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
        }
            return res.json({ status: "success", message: "Order placed Successfully" })
        
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
})

//get order history of particular user
router.get("/get-order-history", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate({
            path: "orders",
            populate: { path: "book" },
        });
        const orderData = userData.orders.reverse();
        return res.json({ status: "success", data: orderData });
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).json({ message: "An error occured" });
    }
});


//get all orders --admin
router.get("/get-all-orders", authenticationToken, async (req, res) => {
    try {
       
        const userData =await Order.find()
        .populate({
            path:"book",
        })
        .populate({
            path:"user",
        })
        return res.json({ status: "success", data: userData });
    } catch (error) {
        res.status(500).json({ message: "An error occuredd" });
    }
});


//update order --admin

router.put("/update-status/:id", authenticationToken, async (req, res) => {
    try {
        const {id}=req.params;
        const user =await User.findById(req.headers.id);
        if(user.role !== "admin"){
            res.status(300).json({ message: "Access denied. Admin only" });
        }
        await Order.findByIdAndUpdate(id,{status:req.body.status});
        return res.json({ status: "success", message:"status updated successfully"});
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
});


module.exports = router;