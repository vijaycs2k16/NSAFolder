/**
 * Created by ashok on 8/03/2018.
 */
module.exports = {
    fields: {
        class_id : {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type: "text"
        },
        section_id : {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        class_teacher_username : {
            type: "text"
        },
        notify: {
            type: "list",
            typeDef: "<text>"
        },
        section_name: {
            type: "text"
        },
        status: {
            type: "boolean",
        },
        is_generated: {
            type: "boolean",
        },
        teacher_allocation:{
            type: "frozen",
            typeDef: "<set <school_teacher_allocation>>"
        }
    },
    key: ["class_id", "tenant_id", "school_id", "academic_year", "section_id"],
    table_name: "school_teacher_allocation"
};
