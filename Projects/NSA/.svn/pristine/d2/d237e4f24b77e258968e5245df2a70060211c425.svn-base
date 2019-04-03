/**
 * Created by senthil on 24/02/18.
 */
exports.getBatch = function (req) {
    var userType = req.session.userType
    if(userType && userType === 'Student') {
        var user = req.session.user
        var loggedInUser = user ? user.student : null
        var batch = loggedInUser ? loggedInUser.batch : null

        return batch
    }

    return null
};


exports.getHeaders = function (req) {
    var isAcess = false;
    if(req.session.profileId && (req.session.profileId == '1387275598000' || req.session.profileId == '1527682829000' || req.session.profileId == '1519394545000' || req.session.profileId == '1526534717000' || req.session.profileId == '1524553140000')) {
        isAcess = true;
    }
    return {cid: req.session.cId, lid: req.session.lid, userType: req.session.userType, isAcess: isAcess, bId: req.session.bId, coId: req.session.courseId, student: req.session.user.student};
}