INSERT INTO nsa.permissions (id,description,feature_id,name) VALUES (
3abf21fe-94d3-4371-aac9-86f36fa09258,'user_level_permission',849525dd-6813-4fd3-aa9d-1b721da04fa7,'user_level_permission');


/// NexApp 

DROP TABLE IF EXISTS nsa.titles;
CREATE TABLE nsa.titles (
title_id uuid PRIMARY KEY,
title_name text,
title_url text,
description text,
status boolean,
);
use nsa;
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Trails','/images/Nexrise/NEXRISE.jpg','Trails',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Rise up General Knowledge','/images/GK/GK.jpg','Rise up General Knowledge',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Go Green','/images/Gogreen/GoGreen.jpg','Go Green',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Nectar','/images/Nectar/NECTAR.jpg','Nectar',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Budding star','/images/BuddingStar/Budding.jpg','Budding star',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Nex.com Computer Science','/images/Nex.com/NEX.COM.jpg','Nex.com Computer Science',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Nexkids','/images/Nexkids/Nexkids.jpg','Nexkids',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Nexbloom','/images/Nexbloom/NEXBLOOM.jpg','Nexbloom',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Nexscience','/images/Nexscience/NEXSCI.jpg','Nexscience',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'Rise Up Computer Science','/images/RiseupComputer/RiseUpComputer.jpg','Rise Up Computer Science',TRUE);
INSERT INTO titles(title_id,title_name,title_url,description,status) values (uuid(),'NexChip Computer Science','/images/Nexchip/NEXCHIP.jpg','NexChip Computer Science',TRUE);

​


