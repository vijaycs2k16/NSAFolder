//fee Transaction Details

alter table nsa.fee_transaction_details add(tenant_id timeuuid, school_id uuid, academic_year text);


alter table nsa.fee_transaction_details add(cheque_no text, is_bounce boolean, cheque_date timestamp);

alter table nsa.school_fee_assignment_details add(cheque_no text, is_bounce boolean, cheque_date timestamp);


// end