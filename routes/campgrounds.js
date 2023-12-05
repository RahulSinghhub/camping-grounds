const express = require('express')
const router = express.Router()
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const {campgroundSchema}= require('../Schemas.js');
const campground = require('../models/campground');
const Campground  = require('../models/campground');
const {isLoggedIn , validateCampground } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})


router.route('/')
 .get(catchAsync(campgrounds.index))
 .post( isLoggedIn , upload.array('image'), validateCampground, catchAsync(campgrounds.createNew))
//to get webpage on screen
router.get("/new",isLoggedIn ,campgrounds.renderNew)



router.get("/:id",catchAsync(campgrounds.showPage))

router.get("/:id/edit",isLoggedIn,catchAsync(campgrounds.editForm))

router.put('/:id',isLoggedIn,upload.array('image') ,validateCampground, catchAsync(campgrounds.updateCampground))
router.delete('/:id',isLoggedIn,catchAsync(campgrounds.deleteForm))

module.exports = router;
