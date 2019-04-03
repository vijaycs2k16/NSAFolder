var express = require('express')
    , router = express.Router()
    , validator = require('@nsa/nsa-commons').validator
    , notifications = require('../../services/notifications/notification.service')
    , notification = require('../../../services/sms/notifications/notification.service.js');



//Web Api
router.get('/logs/update', notification.updateDeactiveStatus); //for updating deactivated field for the implementation of delete

router.get('/notifications', notification.getAllNotifications);
router.post('/notifications', validator.notification.sendNotification, notification.sendNotification);
router.get('/notification/:id', notification.notificationById);

//Draft
router.post('/notification/draft', notification.saveDraftNotification);
router.post('/notification/sent', notification.saveNotificationWithoutMedia);
router.get('/notification/draft/:id', notification.draftNotificationById);
router.delete('/notification/draft/:id', notification.deleteDraftNotificationById);
router.put('/notification/draft/:id', validator.notification.updateNotification, notification.updateDraftNotificationById);

router.get('/notification/logs/:id', notification.getNotificationlogsById);
router.get('/media/:id', notification.getMediaUsedCount);
router.get('/object/:id', notification.getMediaLogByObjectId);
router.get('/status/:id', notification.checkStatus);
router.get('/notification/user/:id', notification.getNotificationByUser);
router.put('/notification/attachments/:id', notification.updateAttachmentsById);
router.put('/notification/send/:id', notification.sendOnlyNotifications);
router.delete('/notification/attachments/:id', notification.deleteAttachments);




//Mobile Api
router.get('/log/:id', notifications.getAllUserNotificationLogs);
router.put('/:id',  notifications.updateNotificationLogs);
//For IOS Start
router.put('/read/:id',  notifications.updateUserReadStatus);  //for updating is_read field for the implementation of read and unread
router.get('/overview/:id',  notifications.getNotificationOverview); //for notification list with today and total and subject count
router.get('/unread/:id', notifications.getUserUnReadNotifications);
//For IOS End






module.exports = router;