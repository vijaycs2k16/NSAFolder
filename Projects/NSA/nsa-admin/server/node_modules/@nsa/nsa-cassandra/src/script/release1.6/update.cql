
DROP TABLE IF EXISTS nsa.school_vehicle_user_fees;
CREATE TABLE nsa.school_vehicle_user_fees (
    user_name text,
    tenant_id timeuuid,
    school_id uuid,
    academic_year text,
    stop_id int,
    route_id uuid,
    charges float,
    first_name text,
    PRIMARY KEY (user_name, tenant_id, school_id, academic_year, stop_id, route_id));

alter table nsa.school_fee_assignment_details add transport_fees float;

alter table nsa.school_vehicle_stop_details add charges float;


DROP TYPE IF EXISTS nsa.school_teacher_allocation;
CREATE TYPE nsa.school_teacher_allocation (
	subject_name text,
	subject_id uuid,
	emp_name text,
	emp_id text,
	max_periods text,
	allocated_periods text
);

DROP TABLE IF EXISTS nsa.school_teacher_allocation;
CREATE TABLE nsa.school_teacher_allocation (
    class_id uuid,
    tenant_id timeuuid,
    school_id uuid,
    academic_year text,
    section_id uuid,
    class_name text,
    class_teacher_username text,
    notify list<text>,
    section_name text,
    status boolean,
    is_generated boolean,
    teacher_allocation set<frozen<nsa.school_teacher_allocation>>,
    PRIMARY KEY (class_id, tenant_id, school_id, academic_year, section_id)
);