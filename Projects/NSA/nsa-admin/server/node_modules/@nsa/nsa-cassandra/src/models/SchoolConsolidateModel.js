
module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year : {
            type: "text"
        },
        term_id: {
            type: "uuid"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        section_id: {
            type: "uuid"
        },
        section_name: {
            type: "text"
        },
        term_name:{
            type: "text"
        },
        status: {
            type: "boolean"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        },
        image_url: {
          type: "text"
        },
        ispublish: {
            type: "boolean"
        }
    },
    key: ["tenant_id", "school_id", "term_id", "academic_year", "class_id", "section_id"],
    table_name: "school_consolidate"
};