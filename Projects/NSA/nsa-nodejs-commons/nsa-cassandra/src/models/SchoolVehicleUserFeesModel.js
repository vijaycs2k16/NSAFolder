/**
 * Created by ashok on 19/02/18.
 */
module.exports = {
    fields: {
        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        route_id: {
            type: "uuid"
        },
        stop_id: {
          type: "int"
        },
        first_name: {
            type: "text"
        },
        user_name: {
            type: "text"
        },
        charges: {
            type: "float"
        }
    },
    key: ["route_id", "tenant_id", "school_id", "academic_year", "user_name", "stop_id"],
    table_name: "school_vehicle_user_fees"
};
