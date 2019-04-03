module.exports = {
    fields: {
        id: {
            type: "uuid"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        group_name: {
            type: "text",
        },
        group_user: {
            type: "map",
            typeDef: "<text,text>"
        },
        members: {
            type: "int"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "text"
        },
        updated_username: {
            type: "text"
        },
    created_by: {
            type : "text"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "text"
        }
    },
    key: [["id"], "tenant_id", "school_id", "academic_year"],
    table_name: "user_groups"
}