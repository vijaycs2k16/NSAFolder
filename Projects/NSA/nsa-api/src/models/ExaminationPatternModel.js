module.exports = {
	fields: {
	id: {
		type: "uuid"
		},
	description: {
		type: "varchar"
		},
	name: {
		type: "varchar"
		}
	},
	key: ["id"],
	table_name: "examination_pattern"
}