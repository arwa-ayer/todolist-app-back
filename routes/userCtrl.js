const models = require('../models');
const asyncLib = require('async');
const bcrypt = require('bcrypt');
const jwtUtils = require('../utils/jwt.utils.js');
const crypto = require('crypto');




module.exports = {
    inscription: function (req, res) {

        console.log("adeadmaedd")

        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var nom = req.body.nom;
        var prenom = req.body.prenom;
       
        var token = crypto.randomBytes(12).toString('hex');
        

      


        if (username == null || email == null || password == null || nom == null || prenom == null ) {

            return res.status(400).json({
                'error': dictionnaireJson['formulaire_champ_manquant']
            });

        }

       


        asyncLib.waterfall([
            function (done) {
                models.User.findOne({
                    attributes: ['email', 'username'],
                    where: {
                        $or: [{
                            email: {
                                $eq: email
                            }
                        },
                        {
                            username: {
                                $eq: username
                            }
                        }
                        ]
                    }
                })
                    .then(function (userFound) {

                        if (userFound) {

                            return res.status(400).json({
                                'error': 'eror',
                                'data': null
                            })

                        } else {

                            done(null, userFound);
                        }
                    })
                    .catch(function (err) {

                        console.log('userCtl: inscription: search user', err)

                        return res.status(500).json({
                            'error': err,
                            'data': null
                        })
                    });
            },
            function (userFound, done) {

                bcrypt.hash(password, 5, function (err, bcryptedPassword) {
                    models.User.create({
                        username: username,
                        email: email,
                        password: bcryptedPassword,
                        lastname: nom,
                        firstname: prenom,
                        token: token
                       
                    })
                        .then(function (newUser) {
                            done(null, newUser);
                        });
                });

            },
           
        ], 
        );
    },

    login: function (req, res) {



        var email = req.body.email;
        var password = req.body.password;

        
        if (email == null || password == null) {
            return res.status(400).json({
                'error': "error"
            });
        }

        models.User.findOne({
            where: {
                $or: [{
                    email: {
                        $eq: email
                    }
                },
                {
                    username: {
                        $eq: email
                    }
                }
                ]
            }
        })
            .then(function (userFound) {
                if (userFound) {
               

                            bcrypt.compare(password, userFound.password, function (errBycrypt, resBycrypt) {

                                if (resBycrypt) {
                                    return res.status(200).json({
                                        'userId': userFound.id,
                                        'token': jwtUtils.generateTokenForUser(userFound),
                                        
                                    })
                                } else {
                                    bcrypt.compare(password, userFound.randPassword, function (errBycrypt, resBycrypt) {

                                        if (resBycrypt) {
                                            return res.status(200).json({
                                                'userId': userFound.id,
                                                'token': jwtUtils.generateTokenForUser(userFound),
                                                
                                            })
                                        } else {
                                            return res.status(400).json({
                                                'error': "login error"
                                            })
                                        }
                                    })
                                }
                            })
                        
                   
                } else {
                    return res.status(400).json({
                        'error': "login error"
                    })
                }
            })
            .catch(function (err) {

                console.log('userCtl: login: search user', err)
                return res.status(500).json({
                    'error': err
                });
            });
    },

  
  


}