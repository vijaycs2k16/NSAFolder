use nsa;
alter table nsa.school_grading_system add application text;

alter table nsa.school_details add type text;

alter table nsa.school_class_subjects add grade boolean;

alter table nsa.school_exam_schedule add (term_id uuid, term_name text, academic set<frozen<school_subject_schedule>>, non_academic set<frozen<school_subject_schedule>>);

alter table nsa.school_mark_list add (term_id uuid, term_name text);

alter table nsa.school_mark_list_details add (term_id uuid, term_name text, non_academic_marks_details set<frozen<user_subject_mark_details>>);


use nsa;
create table school_term_consolidate
(
 tenant_id timeuuid,
 school_id uuid,
 term_id uuid,
 term_name text,
 user_name text,
 image_url text,
 class_id uuid,
 section_id uuid,
  PRIMARY KEY (tenant_id, school_id, term_id, user_name )
)

create table school_consolidate
(
 tenant_id timeuuid,
 school_id uuid,
 term_id uuid,
 academic_year text,
 image_url text,
 class_id uuid,
 class_name text,
 section_id uuid,
 section_name text,
 term_name text,
 status boolean,
 created_by varchar,
 created_date timestamp,
 created_firstname varchar,

  PRIMARY KEY (tenant_id, school_id, term_id, academic_year, class_id, section_id)
)


alter table nsa.school_term_consolidate add ispublish boolean;
alter table nsa.school_consolidate add ispublish boolean; 