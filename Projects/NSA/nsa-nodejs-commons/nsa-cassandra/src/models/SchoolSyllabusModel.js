/**
 * Created by Deepa on 7/28/2018.
 */


module.exports = {

    fields : {

        tenant_id: {
            type: "timeuuid"
        },
        school_id: {
            type: "uuid"
        },
        academic_year: {
            type: "text"
        },
        class_id: {
            type: "uuid"
        },
        class_name: {
            type: "text"
        },
        attachments: {
            type: "map",
            typeDef: "<text, text>"
        },
        name: {
            type: "text"
        },
        description: {
            type: "text"
        },
        created_date: {
            type: "timestamp"
        },

        updated_date: {
            type: "timestamp"
        },
    },

        key: [["tenant_id", "school_id", "academic_year"],"class_id"],
        table_name: "syllabus"

};