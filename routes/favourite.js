const router = require("express").Router();
const User = require("../models/user");
const { authenticationToken } = require("./userAuth");

//add book to favourite
router.put("/add-book-to-favourite", authenticationToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isbookFavourite = userData.favourites.includes(bookid);
        if (isbookFavourite) {
            return res.status(200).json({ message: "book is already in favourites" })
        }
        await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
        return res.status(200).json({ message: "book added to favourites" })
    } catch (error) {
        res.status(500).json({ message: "internal server error", error });
    }
})


//delete book to favourite
router.put("/remove-book-to-favourite", authenticationToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isbookFavourite = userData.favourites.includes(bookid);
        if (isbookFavourite) {
            await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
        }
        return res.status(200).json({ message: "book removed from favourites" })
    } catch (error) {
        res.status(500).json({ message: "internal server error", error });
    }
})


//get   books favourite  of particular user 
router.get("/get-favourite-books", authenticationToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouritebooks = userData.favourites;
        return res.status(200).json({ message: "success", data: favouritebooks })
    } catch (error) {
        res.status(500).json({ message: "An error occured" });
    }
})

module.exports = router;