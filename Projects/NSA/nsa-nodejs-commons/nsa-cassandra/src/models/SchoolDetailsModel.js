module.exports = {
	fields: {
	tenant_id: {
		type: "timeuuid"
		},
	school_id: {
		type: "uuid"
		},
	created_date: {
		type: "timestamp"
		},
	school_code: {
		type: "bigint"
	},
	school_management : {
		type: "boolean"
	},
	project_id: {
		type: "varchar"
	},
	merchant_id: {
		type: "varchar"
	},
	sub_merchant_id: {
		type: "varchar"
	},
	server_api_key: {
		type: "varchar"
	},
	app_key: {
		type: "varchar"
	},
	app_link:{
	   type: "varchar"
	},
	password:{
	    type: "varchar"
	},
	google_key: {
		type: "varchar"
	},
	package_name: {
		type: "varchar"
	},
	city: {
		type: "varchar"
		},
	email: {
		type: "varchar" 
		},
	fax: {
		type: "varchar"
		},
	phone_number: {
		type: "map",
		typeDef: "<text, text>"
		},
	pincode: {
		type: "varchar"
		},
	school_name: {
		type: "varchar"
		},
		about_us : {
		type:"varchar"
		},
		contact_us :{
		type:"varchar"
		},
		latitude :{
		type:"double"
		},
		longitude : {
		type:"double"
		},
	state: {
		type: "varchar"
		},
	street_address_1: {
		type: "varchar"
		},
	street_address_2: {
		type: "varchar"
		},
	total_employee_strength: {
		type: "bigint"
		},
	total_student_strength: {
		type: "bigint"
		},
	updated_date: {
		type: "timestamp"
		},
	image_url: {
		type: "map",
		typeDef: "<text, text>"
	},
	website_url: {
		type: "varchar"
		},
		logo: {
			type: "varchar"
		},
        raw_aboutus : {
            type:"varchar"
        },
		type: {
			type: "text"
		}
	},
	key: [["tenant_id", "school_id"],"created_date"],
	indexes: ["school_name"],
	clustering_order: {"created_date": "desc"},
	table_name: "school_details"
};

	