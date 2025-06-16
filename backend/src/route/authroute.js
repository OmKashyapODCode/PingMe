import express from "express";
import { loginHandler, logoutHandler, signupHandler , onboardHandler} from "../controller/authController.js";
import { protectRoute } from "../middleware/authmiddleware.js";


const router = express.Router();

router.post("/signup",signupHandler);
router.post("/login",loginHandler);
router.post("/logout",logoutHandler);
router.post("/onboarding", protectRoute, onboardHandler);

// check if user is logged in
router.get("/me", protectRoute, (req, res) => {
  res.status(200).json({ success: true, userx: req.user });
});


export default router;