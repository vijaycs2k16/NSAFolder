use nsa;

CREATE TABLE nsa.syllabus(
class_id uuid ,
tenant_id timeuuid,
school_id uuid,
academic_year text,
class_name text,
attachments map<text, text>,
name text,
description text,
created_date timestamp,
updated_date timestamp,
PRIMARY KEY ((tenant_id, school_id, academic_year), class_id)

);
