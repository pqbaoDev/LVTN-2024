const express = require("express")
const {updateUser, deleteUser, getSingleUser, getAllUser,getUserProfile, saveVoucher, getVoucherOfUser} = require("../controllers/userController.js")

const { authenticate, restrict } =  require ("../../auth/verifyToken.js");

const router = express.Router();

router.get("/" ,getAllUser);
router.get("/:id" ,getSingleUser);
router.delete("/" ,deleteUser);
router.put("/:id" ,updateUser);
router.patch("/voucher/:userId",authenticate,restrict('user'),saveVoucher);
router.get("/voucher/:userId" ,authenticate,restrict('user'),getVoucherOfUser);
router.get("/profile/me" ,getUserProfile);
// router.get("/appointments/my-appointments" ,getMyAppointments);


module.exports = router;