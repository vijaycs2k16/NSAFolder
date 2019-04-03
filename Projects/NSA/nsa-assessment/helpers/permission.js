var mongoose = require('mongoose');
var profile = mongoose.Schemas.Profile;
var user = mongoose.Schemas.Users;

module.exports = function (event, models) {
    'use strict';
    var err;

    var getAccess = function (req, uId, mid, callback) {
        models.get(req.session.lastDb, 'Users', user).findById(uId, function (err, user) {
            if (err) {
                return callback(err);
            }

            if (user) {
                models.get(req.session.lastDb, 'Profile', profile).aggregate([
                    {
                        $project: {
                            profileAccess: 1
                        }
                    },
                    {
                        $match: {
                            _id: user.profile
                        }
                    },
                    {
                        $unwind: '$profileAccess'
                    },

                    {
                        $match: {
                            'profileAccess.module': mid
                        }
                    }], callback);
            } else {
                err = new Error('access.js users.findById error');
                err.status = 400;

                callback(err);
            }
        });
    };

    this.getPermission = function (req, res, next) {
        var query = req.query;

        getAccess(req, req.session.uId, query.moduleId, function (err, result) {
            if (err) {
                return next(err);
            }

            var data = {};
            data.read = true;
            data.update = true;
            data.delete = true;
            data.create = true;

            if (result.length) {
                data.read = result[0].profileAccess.access.read;
                data.update = result[0].profileAccess.access.editWrite;
                data.create = result[0].profileAccess.access.editWrite;
                data.delete = result[0].profileAccess.access.del;
            }

            res.status(201).send({sucess: true, data: data})

        });
    };

};
