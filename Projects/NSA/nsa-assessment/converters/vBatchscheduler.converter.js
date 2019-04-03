var _  = require('lodash')

exports.scheduleObjs = function (data) {
    var datObj = []
    if(!_.isEmpty(data)) {
        try {
            data = JSON.parse(JSON.stringify(data));
            _.forEach(data, function (value, key) {
                if(!_.isEmpty(value.topic)){
                    value.topicData = {};
                    var topics = _.filter(value.topic.topics, {'_id': value.topics})
                    if(topics.length > 0) {
                        value.topicData = topics[0];
                    }
                }

            });

            return data;
        }
        catch (err) {
            console.log("err", err)
        }
    } else {
        return datObj;
    }

};


exports.scheduleObjects = function (data) {
    var datObj = [];
    if(!_.isEmpty(data)) {
        try {

            data = JSON.parse(JSON.stringify(data));
            _.forEach(data, function (value, key) {
                var obj = {};
                if(!_.isEmpty(value.topic)){
                    obj.subject = value.subject;
                    obj.topics = value.topic.topics;
                    datObj.push(obj)
                }
            });

        }
        catch (err) {
            console.log("err", err)
        }
    }

    return datObj;

};

exports.scheduleSObjects = function (data) {
   /* var datObj = [];
    if(!_.isEmpty(data)) {
        try {
console.log("ssssssssssssssssssss", data)
            data = JSON.parse(JSON.stringify(data));
            _.forEach(data, function (value, key) {
                var obj = {};
                if(!_.isEmpty(value.topics)){
                    console.log("wujduwehudged", value.topics)
                    _.forEach(value.topics, function (val, key) {
                        val.subject = value.subject;
                    });
                    obj.subject = value.subject;
                    obj.topics = value.topics;
                    datObj.push(obj)
                }
            });

        }
        catch (err) {
            console.log("err", err)
        }
    }
*/
    return data;

};