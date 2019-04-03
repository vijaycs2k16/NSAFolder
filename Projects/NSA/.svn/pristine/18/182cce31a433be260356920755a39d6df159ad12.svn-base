var mongoose = require('mongoose');
var profile = mongoose.Schemas.Profile;
var user = mongoose.Schemas.Users;

var Permission = function (event, models) {
    'use strict';
    var err;
    var getAccess = function (req, uId, mid, isTab, callback) {
        var matchQuery = { 'profileAccess.module': mid}

        if(isTab) {
            var $or = [];
            _.forEach(mid, function (val) {
                $or.push({'profileAccess.module': +val})
            })
            matchQuery = {$or:  $or}
        }

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
                        $match: matchQuery
                    }], callback);
            } else {
                err = new Error('access.js users.findById error');
                err.status = 400;

                callback(err);
            }
        });
    };

    this.getPermissionByMod = function (req, res, next) {
        var query = req.query;

        getAccess(req, req.session.uId, query.module, true, function (err, result) {
            if (err) {
                return next(err);
            }

            var data = {};
            var tabData = {}
            data.read = false;
            data.update = false;
            data.delete = false;
            data.create = false;
            data.tab = false;
            _.forEach(query.module, function (val) {
                var datFound = _.filter(result, function(o) { return o.profileAccess.module == +val; });
                if(!_.isEmpty(datFound)) {
                    if(datFound[0].profileAccess.access.read) {
                        tabData.id = val;
                        tabData.value = true;
                        return false;
                    }
                }
            })

            if(tabData && tabData.id == query.moduleId) {
                data.tab = true;
            }

            if (result.length) {
                var datFound = _.filter(result, function(o) { return o.profileAccess.module == +query.moduleId; });
                if(!_.isEmpty(datFound)) {
                    data.read = datFound[0].profileAccess.access.read;
                    data.update = datFound[0].profileAccess.access.editWrite;
                    data.create = datFound[0].profileAccess.access.editWrite;
                    data.delete = datFound[0].profileAccess.access.del;
                }
            }

            res.status(201).send({sucess: true, data: data})

        });
    };

    this.getPermission = function (req, res, next) {
        var query = req.query;


        getAccess(req, req.session.uId, +query.moduleId, false,  function (err, result) {
            if (err) {
                return next(err);
            }

            var data = {};
            data.read = false;
            data.update = false;
            data.delete = false;
            data.create = false;

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

module.exports =  Permission;
