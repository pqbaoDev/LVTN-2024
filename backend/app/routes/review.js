const express = require("express");
const reviewController = require("../controllers/review.controller");
const { authenticate, restrict } = require("../../auth/verifyToken");
const router = express.Router();



router.get('/filterReview', reviewController.getReviewsForProduct); 
router.get('/:productId', reviewController.getReviews); 
router.post('/:productId',authenticate, restrict(['user']), reviewController.submitReview);
router.patch('/:reviewId', reviewController.updateStatus); 
router.put('/:reviewId', reviewController.updateReview); 
router.delete('/:reviewId', reviewController.deleteReview);


module.exports = router;
