var express = require('express');

var userCtrl = require('./routes/userCtrl');

var jwtUtils = require('./utils/jwt.utils');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/users/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false);

    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});


function validateToken(req, res, next) {
    var headerAuth = req.headers['authorization'];
    var user = jwtUtils.getUser(headerAuth);

    // console.log("user---------->",user);
    if (user) {
        if (user.id < 0) {
            return res.status(401).json({
                'error': 'wrong token'
            });
        } else {

            req.userId = user.id;
            req.userName = user.firstname + " " + user.lastname;
    
            next();
        }
    } else {
        return res.status(401).json({
            'error': 'wrong token'
        });
    }

}

exports.router = (function () {
    var apiRouter = express.Router();


    /******************************************** User *****************************************************/

    /**
     * @swagger
     * /inscription:
     *   post:
     *     tags:
     *       - Users
     *     description: Inscription User
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: ObjectInscription
     *         description: user's object inscription
     *         in: body
     *         required: true
     *         schema: 
     *          required:
     *              - email
     *              - password
     *          properties:
     *              email: 
     *                  type: string
     *                  format: email
     *              password:
     *                  type: string
     *                  format: password
     *            
     *              username: 
     *                  type: string
     *              nom:
     *                  type: string
     *              prenom:
     *                  type: string
     *              
     *     responses:
     *       200:
     *         description: Inscription user
     *       400:
     *         description: parameter not found
     *       500:
     *         description: error server
     */
    apiRouter.route('/inscription').post(userCtrl.inscription);

    /**
     * @swagger
     * /login:
     *   post:
     *     tags:
     *       - Users
     *     description: login User
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: ObjectLogin
     *         description: user's object login
     *         in: body
     *         required: true
     *         schema: 
     *          required:
     *              - email
     *              - password
     *          properties:
     *              email: 
     *                  type: string
     *                  format: email
     *              password:
     *                  type: string
     *                  format: password
     *              locale:
     *                  type: string
     *                  default: 'fr'
     *     responses:
     *       200:
     *         description: success login with user's token
     *       400:
     *         description: parameter not found
     *       500:
     *         description: error server
     */
    apiRouter.route('/login').post(userCtrl.login);


    return apiRouter;

})();