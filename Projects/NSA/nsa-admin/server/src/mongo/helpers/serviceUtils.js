/**
 * Created by senthil on 09/02/18.
 */
var _ = require('lodash')
var moment = require('moment')

exports.removeUndefinedAndNull = function(object) {
    // _(object).omit(_.isUndefined).omit(_.isNull).value()
    return object ? _(object).omit(_.isUndefined).omit(_.isNull).value() : object;
};

exports.parseDbObjectAsJSON = function(object) {
    return object ? JSON.parse(JSON.stringify(object)) : object;
};

exports.generateCode = function(codeType, no) {
    var s = '' + no;
    while(s.length<7) s = '0' + s;
    var capital = codeType.charCodeAt(0);
    s = String.fromCharCode(capital-32) + s;
    return s;
};

exports.getClientIP = function(req) {
    //console.log('req.headers = ',req.headers);
    //console.log('req.socket = ',req.socket);
    //console.log('req.connection = ',req.connection);
    //var reg = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return ip;
    //return ip.match(reg);
};

exports.formatIpPattern = function(givenPattern){
    if(!givenPattern) return null;
    var pattern = givenPattern.replace(/\./g, '\\.');
    pattern = pattern.replace(/\*/g, '(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])');
    return '(^|\\D)' + pattern + '$';
};

exports.getDateFilter = function(req) {
    var filter = null;

    if(req.query.filter) {
        if(req.query.filter.date){
            var reqFilter = req.query.filter.date.value;
            if(moment(reqFilter[0], "YYYY-MM-DD").isValid()) {
                filter =  {
                    $gte: new Date(reqFilter[0]),
                    $lte: new Date(reqFilter[1]),
                }
            }
        }
    }

    return filter
}