/**
 * Created by Kiranmai A on 4/24/2017.
 */

module.exports = {
    fields: {
        event_type_id:{
            type: "uuid"
        },
        event_type_name: {
            type: "varchar"
        },
        description: {
            type: "varchar"
        },
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_by: {
            type: "varchar"
        },
        updated_username: {
            type: "varchar"
        },
        created_by: {
            type : "varchar"
        },
        created_date : {
            type : "timestamp"
        },
        created_firstname: {
            type: "varchar"
        }
    },
    key: [["tenant_id", "school_id"], "event_type_id"],
    table_name: "school_event_type"
};