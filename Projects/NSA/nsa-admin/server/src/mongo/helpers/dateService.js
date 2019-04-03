var dateFormat = require('dateformat');
    _ = require('lodash')
moment = require('moment')
async = require('async')

var basicDateFormat = {
    type1: "mmm d yyyy",
    type2: "mmm d yyyy hh:mm"
}

function getDateFormatted(inputDate, format) {
    if(inputDate && format) {
        var formattedDate = dateFormat(inputDate, format);
        return formattedDate;
    } else {
        return inputDate;
    }
};
exports.getDateFormatted = getDateFormatted

exports.formatObjectsDates = function(objects, keys, type, next) {
    async.each(objects, function(object, callback) {
        formatObject(object, keys, type)
        callback();
    }, function(err) {
        next(err, objects)
    });
}

exports.formatObjectDates = function(objects, keys, type, next) {
    next(null, formatObject(objects, keys, type))
}

function formatObject(object, keys, type) {

    for(var key in keys) {
        var findKey = keys[key]
        var checkChildren = function (obj) {
            _.each(obj, function (value, k) {
                //console.log(obj)
                if((typeof value === 'object')) {
                    checkChildren(value)
                } else {
                    if(k === findKey) {
                        checkCreateDate(findKey, obj, k, type);
                    }
                }
            });
        }
        _.each(object, function (value, k) {
            if((typeof value === 'object')) {
                checkChildren(value)
            } else {
                if(k === findKey) {
                    checkCreateDate(findKey, object, k, type);
                }
            }
        });
    }

    return object;
}


function checkCreateDate(findKey, object, k, type) {
    if(findKey == 'createDate') {
        var dateObj = object[k] ? object[k].split('/') : null;
        if(dateObj && dateObj.length > 1) {
            dateObj = moment(object[k], moment.HTML5_FMT.DATETIME_LOCAL_SECONDS);
        }
        object[k] = getDateFormatted(dateObj, basicDateFormat[type])
    }  else {
        object[k] = getDateFormatted(object[k], basicDateFormat[type])
    }
}