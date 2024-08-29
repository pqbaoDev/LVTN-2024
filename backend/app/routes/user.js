const express = require("express")
const {updateUser, deleteUser, getSingleUser, getAllUser,getUserProfile} = require("../controllers/userController.js")

// import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/" ,getAllUser);
router.get("/:id" ,getSingleUser);
router.delete("/:id" ,deleteUser);
router.put("/:id" ,updateUser);
router.get("/profile/me" ,getUserProfile);
// router.get("/appointments/my-appointments" ,getMyAppointments);


module.exports = router;