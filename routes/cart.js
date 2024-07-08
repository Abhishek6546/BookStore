const router = require("express").Router();
const User = require("../models/user");
const { authenticationToken } = require("./userAuth");

//put book to cart
router.put("/add-to-cart", authenticationToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isbookinCart = userData.cart.includes(bookid);
        if (isbookinCart) {
            return res.status(200).json({ message: "book is already in cart" })
        }
        await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
        return res.status(200).json({ message: "book added to cart" })
    } catch (error) {
        res.status(500).json({ message: "internal server error", error });
    }
})


//remove book from cart
router.put("/remove-book-from-cart/:bookid", authenticationToken, async (req, res) => {
    try {
        const { bookid } = req.params;
        const {id}=req.headers;
        const userData = await User.findById(id);
        const isbookinCart = userData.cart.includes(bookid);
        if (isbookinCart) {
            await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
            return res.status(200).json({ message: "book removed from  cart" })
        }
        return res.status(200).json({ message: " cart is empty" })
    } catch (error) {
        res.status(500).json({ message: "internal server error", error });
    }
})


//get the cart of particular user
router.get("/get-user-cart", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");
        const cart = userData.cart.reverse();
        return res.status(200).json({ message: "success", data: cart })
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
})
module.exports =router;