
module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        term_id: {
            type: "uuid"
        },
        user_name: {
            type: "text"
        },
        image_url: {
            type: "text"
        },
        class_id: {
            type: "uuid"
        },
        section_id: {
            type: "uuid"
        },
        term_name:{
            type: "text"
        }
    },
    key: ["tenant_id", "school_id", "term_id", "user_name"],
    table_name: "school_term_consolidate"
};