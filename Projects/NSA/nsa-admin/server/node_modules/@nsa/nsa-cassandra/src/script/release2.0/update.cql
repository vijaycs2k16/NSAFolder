​use nsa;
INSERT INTO nsa.feature (id,description,name,status) VALUES (6c6ec925-7738-45c0-bb77-b45237706525,'','Syllabus',true);
INSERT INTO nsa.school_feature(tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override, notify_hostelers,mobile_priority,screen,academic_year,help_text) VALUES (8eb846a0-4549-11e7-9543-276f818a8422,4e3d3bf5-e262-4e7a-9a02-ef542107f6e7,7ddf01ec-0c39-44c9-a6b9-d7cc17a3c1c9,7,'2017-09-03 16:23:50',NULL,'08103110-6b9d-4dd9-a0e2-976909313148/7ddf01ec-0c39-44c9-a6b9-d7cc17a3c1c9/',NULL,NULL,NULL,false,'2020-05-03 16:23:50', 6c6ec925-7738-45c0-bb77-b45237706525,'Syllabus','icon-envelop3',NULL,NULL,
'./syllabus',08103110-6b9d-4dd9-a0e2-976909313148,false,'NEXSCHOOLAPP',true,true,NULL,'Syllabus',['SchoolAdmin','Employee'],false,false,false,14,'Syllabus','2017-2018','Syllabus feature can be used to upload the syllabus files of classes. Syllabus can be added by clicking "Add Syllabus" and then providing the syllabus details and the class information. Then upload the syllabus attachment. The parents can view the syllabus on the mobile app.');

INSERT INTO nsa.school_feature_notification_templates
(feature_id, sub_feature_id, tenant_id, school_id, actions, email_template_message, email_template_title, push_template_message, push_template_title, sms_template_message, sms_template_title, status, user_type)
VALUES(08103110-6b9d-4dd9-a0e2-976909313148, 6c6ec925-7738-45c0-bb77-b45237706525, 8eb846a0-4549-11e7-9543-276f818a8422,4e3d3bf5-e262-4e7a-9a02-ef542107f6e7, 1, 'Dear Parent, the school syllabus has been updated for your ward on the school mobile app. Please check the app to view and download the syllabus.
', 'Syllabus Notification - Notification', 'Dear Parent, the school syllabus has been updated for your ward on the school mobile app. Please check the app to view and download the syllabus.
', 'Syllabus Notification - Notification', 'Dear Parent, the school syllabus has been updated for your ward on the school mobile app. Please check the app to view and download the syllabus.
', 'Syllabus Notification - Notification', true, 'Student');


//Holy Innocents
INSERT INTO nsa.school_feature(tenant_id,school_id,id,order_by,activated_date,additional_links,asset_url,content,description,doc_desc,email,expire_date,feature_id,feature_name,icon,images,keywords,link,parent_feature_id,push,school_name,sms,status,tags,title,user_types,is_channels,is_override, notify_hostelers,mobile_priority,screen,academic_year,help_text) VALUES (9feb8160-60a2-11e8-b0ab-238473771afb,e3f57f9d-e3dd-4da3-90b3-8e8956a9f477,7ddf01ec-0c39-44c9-a6b9-d7cc17a3c1c9,7,'2017-09-03 16:23:50',NULL,'08103110-6b9d-4dd9-a0e2-976909313148/7ddf01ec-0c39-44c9-a6b9-d7cc17a3c1c9/',NULL,NULL,NULL,false,'2020-05-03 16:23:50', 6c6ec925-7738-45c0-bb77-b45237706525,'Syllabus','icon-envelop3',NULL,NULL,
'./syllabus',08103110-6b9d-4dd9-a0e2-976909313148,false, 'Holy Innocents School & Junior College',true,true,NULL,'Syllabus',['SchoolAdmin','Employee'],false,false,false,11,'Syllabus','2018-2019','Syllabus feature can be used to upload the syllabus files of classes. Syllabus can be added by clicking "Add Syllabus" and then providing the syllabus details and the class information. Then upload the syllabus attachment. The parents can view the syllabus on the mobile app.');
​
UPDATE nsa.school_feature
SET mobile_priority=14 WHERE tenant_id=9feb8160-60a2-11e8-b0ab-238473771afb AND school_id=e3f57f9d-e3dd-4da3-90b3-8e8956a9f477 AND academic_year='2018-2019' AND id=2558fc82-27bb-40ea-aee4-b9c9ec6d1060;


INSERT INTO nsa.school_feature_notification_templates
(feature_id, sub_feature_id, tenant_id, school_id, actions, email_template_message, email_template_title, push_template_message, push_template_title, sms_template_message, sms_template_title, status, user_type)
VALUES(08103110-6b9d-4dd9-a0e2-976909313148, 6c6ec925-7738-45c0-bb77-b45237706525, 9feb8160-60a2-11e8-b0ab-238473771afb, e3f57f9d-e3dd-4da3-90b3-8e8956a9f477, 1, 'Dear Parent, the school syllabus has been updated for your ward on the school mobile app. Please check the app to view and download the syllabus.
', 'Syllabus Notification - Notification', 'Dear Parent, the school syllabus has been updated for your ward on the school mobile app. Please check the app to view and download the syllabus.
', 'Syllabus Notification - Notification', 'Dear Parent, the school syllabus has been updated for your ward on the school mobile app. Please check the app to view and download the syllabus.
', 'Syllabus Notification - Notification', true, 'Student');





