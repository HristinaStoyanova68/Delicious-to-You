const router = require('express').Router();

const userController = require('../controllers/userController');
const { loginValidation, registerValidation } = require('../middlewares/userValidator');
const loginLimiter = require('../middlewares/loginLimiter');
const verifyJWT = require('../middlewares/verifyJWT');
const cacheControl = require('../middlewares/cacheControl');

router.post('/login', cacheControl, loginValidation, loginLimiter, userController.login);
router.post('/register', registerValidation, userController.register);
router.post('/logout', cacheControl, verifyJWT, userController.logout);
router.get('/get-user', userController.getUserData);

module.exports = router;