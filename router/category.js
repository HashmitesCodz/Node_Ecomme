const express = require('express');
const router = express.Router();

const { create, categoryById, read, list } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById } = require('../controllers/user');


router.get("/category/:categoryId", read)
router.post("/category/create/:userId", requireSignin, isAdmin, isAuth, create);

router.get("/categories", list)
router.param("userId", userById)
router.param("categoryId", categoryById)


module.exports = router;