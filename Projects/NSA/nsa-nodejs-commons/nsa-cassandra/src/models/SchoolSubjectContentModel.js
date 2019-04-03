/**
 * Created by Britto on 4/7/2017.
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
        subject_id: {
            type: "uuid"
        },
        class_id: {
            type: "uuid"
        },
        subject_name: {
            type: "text"
        },
        term_id: {
            type: "uuid"
        },
        term_name: {
            type: "text"
        },
        topic_name: {
            type: "text"
        },
        title: {
            type: "text"
        },
        desc: {
            type: "text"
        },
        active: {
          type: "boolean"  
        },
        url: {
            type: "text"
        },
        updated_by: {
            type: "text"
        },
        updated_date: {
            type: "timestamp"
        },
        updated_firstname: {
            type: "text"
        },
        created_by: {
            type: "text"
        },
        created_date: {
            type: "timestamp"
        },
        created_firstname: {
            type: "text"
        },
        image_url : {
            type: "text"
        },
        content_title : {
            type: "text"
        },
        content_type: {
            type: "text"
        }
    },
    key: [["tenant_id", "school_id", "academic_year"], "subject_id",  "content_title", "title", "class_id"],
    table_name: "school_subject_content"
};