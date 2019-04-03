'use strict';

(function () {
    var root;

    var FILTERS = {
        wTrackInvoice: {
            _type: {
                backend: '_type',
                type   : 'string'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'invoiceDate',
                    operator: ['$gte', '$lte']
                }
            }
        },

        Register: {
            _type: {
                backend: '_type',
                type   : 'string'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'student.createDate',
                    operator: ['$gte', '$lte']
                }
            }
        },

        VLeadsReports: {
            _type: {
                backend: '_type',
                type   : 'string'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'creationDate',
                    operator: ['$gte', '$lte']
                }
            }
        },


        Payment: {
            date: {
                type   : 'date',
                backend: {
                    key     : 'date',
                    operator: ['$gte', '$lte']
                }
            }
        },

        integrationUnlinkedOrders: {
            order: {
                displayName: 'Channel',
                backend    : 'channel._id'
            }
        },

        integrationUnlinkedProducts: {
            order: {
                displayName: 'Order',
                backend    : 'fields.order'
            }
        },

        wTrack: {
            employee: {
                displayName: 'Employee',
                backend    : 'employee._id'
            },

            customer: {
                displayName: 'Customer',
                backend    : 'customer._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            month: {
                displayName: 'Month',
                backend    : 'month',
                type       : 'integer'
            },

            year: {
                displayName: 'Year',
                backend    : 'year',
                type       : 'integer'
            },

            week: {
                displayName: 'Week',
                backend    : 'week',
                type       : 'integer'
            },

            _type: {
                displayName: 'Type',
                backend    : '_type',
                type       : 'string'
            },

            jobs: {
                backend: 'jobs'
            },

            array: ['employee', 'customer', 'project', 'department', 'month', 'year', 'week', '_type']
        },

        Persons: {
            name: {
                displayName: 'Full Name',
                backend    : '_id'
            },

            country: {
                displayName: 'Country',
                backend    : 'address.country',
                type       : 'string'
            },

            services: {
                displayName: 'Services',
                backend    : 'services',
                type       : 'boolean'
            },

            channel: {
                displayName: 'Channel',
                backend    : 'channel._id'
            },

            array: ['name', 'country', 'services', 'channel']
        },

        DashVacation: {
            dateFilterArray: [
                'custom'
            ],

            name: {
                displayName: 'Employee',
                backend    : 'employee'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            projecttype: {
                displayName: 'Project Type',
                backend    : 'project.projecttype',
                type       : 'string'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager.employeeId'
            },

            array: ['name', 'department', 'projecttype', 'salesManager']
        },

        DealTasks: {
            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            category: {
                displayName: 'Category',
                backend    : 'category'
            },

            assignedTo: {
                displayName: 'Assigned To',
                backend    : 'assignedTo'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            },

            deal: {
                displayName: 'Opportunity',
                backend    : 'deal'
            },

            taskType: {
                displayName: 'Task Type',
                backend    : 'taskType'
            },

            array: ['name', 'assignedTo', 'workflow', 'deal', 'category', 'taskType']
        },

        Companies: {
            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            country: {
                displayName: 'Country',
                backend    : 'address.country',
                type       : 'string'
            },

            services: {
                displayName: 'Services',
                backend    : 'services'
            },

            channel: {
                displayName: 'Channel',
                backend    : 'channel._id'
            },

            array: ['name', 'country', 'services', 'channel']
        },

        Employees: {
            name: {
                backend    : '_id',
                displayName: 'Full Name'
            },

            department: {
                backend    : 'department._id',
                displayName: 'Department'
            },

            manager: {
                backend    : 'manager._id',
                displayName: 'Manager'
            },

            jobPosition: {
                backend    : 'jobPosition._id',
                displayName: 'Job Position'
            },

            center: {
                backend     : 'center._id',
                displayName : 'Center'
            },
                workEmail:{
                backend :'workEmail',
                displayName:'Email',
                type: 'string'
            },

            array: ['name', 'department', 'manager', 'jobPosition', 'center','workEmail']
        },

        JobPositions: {

            name       :{
              backend     :'_id',
              displayName :'Job Name'
            } ,

            department :{
               backend     :'department._id',
               displayName :'Department'
            },

            workflow    :{
                backend     : 'workflow._id',
                displayName :'Status'
            },

            array:['name' , 'department' , 'workflow']
        },

        VPracticeExam:{
            name:{
              backend: '_id',
                displayName: 'Name'
            },
            course: {
                backend: 'course._id',
                displayName: 'Course'
            },
            array: ['name','course']
        },

        EnrollMent: {
            student: {
                backend    : 'student._id',
                displayName: 'Student'
            },

            registerNo: {
                backend    : 'student._id',
                displayName: 'Reg No'
            },

            center: {
                backend    : 'center._id',
                displayName: 'Center'
            },

            course: {
                backend    : 'course._id',
                displayName: 'Course'
            },

            batch: {
                backend    : 'batch._id',
                displayName: 'Batch'
            },

            array: ['registerNo', 'student', 'center', 'course', 'batch']
        },

        VStudent:{
            studentName: {
                backend    : '_id',
                displayName: 'Full Name',
                type       : 'ObjectId'
            },
            studentEmail: {
                backend    : 'studentEmail',
                displayName: 'Email',
                type       : 'string'
            },

            center: {
                backend    : 'center._id',
                displayName: 'Center'
            },
            course: {
                backend    : 'course._id',
                displayName: 'Course'
            },
            array: ['studentName', 'studentEmail', 'center', 'course']
        },

        VQuestionBank:{
            code : {
                displayName : 'Q-Code ',
                backend    : 'code',
                type        : 'string'
            },

            subject : {
                backend    : 'subject._id',
                displayName: 'Subject'
            },

            topic : {
                backend    : 'topic',
                displayName: 'Topic'
            },

            weightage : {
                backend    : 'weightage',
                displayName:'Weightage',
                type       : 'integer'
            },

            point : {
                backend    : 'point',
                displayName:'Score',
                type       : 'integer'
            },

            classDetail:{
              backend : 'classDetail._id',
              displayName : 'Class'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'lastModified',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['code', 'subject', 'weightage','point', 'topic', 'classDetail']
        },

        VExamSchedule: {
            name: {
                backend    : 'name',
                displayName: 'Name',
                type       : 'string'
            },

            course: {
                backend    : 'course._id',
                displayName: 'Course',
            },
            date: {
                type   : 'date',
                backend: {
                    key     : 'dateBeginAhead',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['name', 'course']

        },

        BundleMove: {
            reason: {
                backend: 'reason',
                displayName: 'Reason',
                type: 'string'
            },

            product: {
                backend:'product',
                displayName: 'Product'
            },

            array: ['reason', 'product']
        },

        BundleReturns: {
            reason: {
                backend: 'reason',
                displayName: 'Reason',
                type: 'string'
            },

            product: {
                backend:'product',
                displayName: 'Product'
            },

            array: ['reason', 'product']
        },

        stockReturns: {

            name: {
                backend: 'name',
                displayName: 'Name',
                type: 'string'
            },

            order: {
                backend: 'order._id',
                displayName: 'Order'
            },

            sku : {
             backend: 'product._id',
                displayName:'SKU'
            },

            array: ['name', 'order', 'sku']
        },

        stockCorrections: {

            warehouse: {
                backend    :'_id',
                displayName: 'Warehouse',
            },

            product: {
                backend    : 'product._id',
                displayName: 'Name',
                type       :'string'

            },

            array: ['warehouse','product']

        },

        Users: {
            department: {
                backend    : 'department._id',
                displayName: 'Department'
            },

            login: {
                backend    : '_id',
                displayName: 'Login'
            },

            email: {
                backend    : '_id',
                displayName: 'Email'
            },

            profile: {
                backend    : 'profile._id',
                displayName: 'Profile',
                type: 'integer'
            },

            array: ['department', 'login', 'email', 'profile']
        },

        VExamStudentsResult: {
            center: {
                backend    : 'studentCenter._id',
                displayName: 'Center'
            },
            student: {
                backend    : 'student._id',
                displayName: 'Student'
            },

            array: ['student', 'center']
        },

        Applications: {
            name: {
                displayName: 'Full Name',
                backend    : '_id'
            },

            department: {
                displayName: 'Department',
                backend    : 'department._id'
            },

            jobPosition: {
                displayName: 'Job Position',
                backend    : 'jobPosition._id'
            },

            array: ['name', 'department', 'jobPosition']
        },

        /* JobPositions: {
         name: {
         displayName: 'Name',
         backend    : 'name'
         },

         workflow: {
         displayName: 'Status',
         backend    : 'workflow'
         },

         department: {
         displayName: 'Department',
         backend    : 'department'
         }
         }, */

        salesInvoices: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'invoiceDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['supplier', 'salesPerson', 'project', 'workflow']
        },

        ExpensesInvoice: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['supplier', 'workflow']
        },

        WriteOff: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },
            journal: {
                displayName: 'Journal',
                backend    : 'journal._id'
            },

            array: ['project', 'journal']
        },

        DividendInvoice: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['workflow']
        },

        salesProforma: {
            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['supplier', 'salesPerson', 'project', 'workflow']
        },

        Projects: {
            name: {
                displayName: 'Project Name',
                backend    : '_id'
            },

            customer: {
                displayName: 'Contact',
                backend    : 'customer._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            projectManager: {
                displayName: 'Project Manager',
                backend    : 'projectManager._id'
            },

            summary: {
                backend: '_id'
            },

            type: {
                backend: 'projecttype',
                type   : 'string'
            },

            assignedTo: {
                backend: 'assignedTo._id'
            },

            array: ['name', 'customer', 'workflow', 'salesManager', 'projectManager']
        },

        warehouseMovements: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        contractJobs: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ],

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            customer: {
                displayName: 'Contact',
                backend    : 'project.customer'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager.employeeId'
            },

            projectManager: {
                displayName: 'Project Manager',
                backend    : 'projectManager.employeeId'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'invoice.invoiceDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['project', 'customer', 'workflow', 'salesManager', 'projectManager']
        },

        SalesByCountry: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        LeadsBySale: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        LeadsBySource: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        LeadsByName: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        Leads: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ],

            contactName: {
                displayName: 'Contact Name',
                backend    : 'contactName',
                type       : 'string'
            },

            source: {
                displayName: 'Source',
                backend    : 'source',
                type       : 'string'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow._id'
            },

            salesPerson: {
                displayName: 'Assigned To',
                backend    : 'salesPerson._id'
            },

            createdBy: {
                displayName: 'Created By',
                backend    : 'createdBy.user._id'
            },

            Priority: {
                displayName: 'Priority',
                backend    : 'priority',
                type       : 'string'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'createdBy.date',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['contactName','Priority', 'source', 'workflow', 'salesPerson', 'createdBy']

        },

        VStudentLeads: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ],

            contactName: {
                displayName: 'Contact Name',
                backend    : 'contactName',
                type       : 'string'
            },

            source: {
                displayName: 'Source',
                backend    : 'source',
                type       : 'string'
            },

            priority: {
                displayName: 'Priority',
                backend    : 'priority',
                type       : 'string'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow._id'
            },

            salesPerson: {
                displayName: 'Assigned To',
                backend    : 'salesPerson._id'
            },

            createdBy: {
                displayName: 'Created By',
                backend    : 'createdBy.user._id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'createdBy.date',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['contactName', 'source', 'workflow', 'salesPerson','priority', 'createdBy']

        },

        OpportunitiesConversion: {
            rangeFilterArray: [
                'sevenDays',
                'thirtyDays',
                'ninetyDays',
                'twelveMonths'
            ],

            date: {
                type   : 'date',
                backend: {
                    key     : 'convertedDate',
                    operator: ['$gte', '$lte']
                }
            }
        },

        WonLost: {
            rangeFilterArray: [
                'sevenDays',
                'thirtyDays',
                'ninetyDays',
                'twelveMonths'
            ],

            date: {
                type   : 'date',
                backend: {
                    key     : 'createdBy.date',
                    operator: ['$gte', '$lte']
                }
            }
        },

        Opportunities: {
            rangeFilterArray: [
                'sevenDays',
                'thirtyDays',
                'ninetyDays',
                'twelveMonths'
            ],

            customer: {
                displayName: 'Customer',
                backend    : 'customer'
            },

            workflow: {
                displayName: 'Stage',
                backend    : 'workflow'
            },

            salesPerson: {
                displayName: 'Sales Person',
                backend    : 'salesPerson'
            },

            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'creationDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['customer', 'salesPerson', 'workflow', 'name']
        },

        Tasks: {
            project: {
                displayName: 'Project',
                backend    : 'project'
            },

            summary: {
                displayName: 'Task Summary',
                backend    : 'summary'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            },

            assignedTo: {
                displayName: 'Assigned To',
                backend    : 'assignedTo'
            },

            type: {
                displayName: 'Type',
                backend    : 'type',
                type       : 'string'
            }
        },

        customerPayments: {
            assigned: {
                displayName: 'Assigned',
                backend    : 'assigned._id'
            },

            supplier: {
                displayName: 'Company',
                backend    : 'supplier._id'
            },

            paymentMethod: {
                displayName: 'Payment way',
                backend    : 'paymentMethod._id'
            },

            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            refund: {
                displayName: 'Type',
                backend    : 'refund',
                type       : 'boolean'
            },

            array: ['assigned', 'supplier', 'paymentMethod', 'name', 'refund']
        },

        purchasePayments: {
            assigned: {
                displayName: 'Assigned',
                backend    : 'assigned._id'
            },

            supplier: {
                displayName: 'Company',
                backend    : 'supplier._id'
            },

            paymentMethod: {
                displayName: 'Payment way',
                backend    : 'paymentMethod._id'
            },

            name: {
                displayName: 'Name',
                backend    : '_id'
            },

            refund: {
                displayName: 'Type',
                backend    : 'refund',
                type       : 'boolean'
            },

            array: ['assigned', 'supplier', 'paymentMethod', 'name', 'refund']
        },

        supplierPayments: {
            supplier: {
                displayName: 'Employee',
                backend    : 'supplier._id'
            },

            paymentRef: {
                displayName: 'Bonus Type',
                backend    : 'paymentRef',
                type       : 'string'
            },

            year: {
                displayName: 'Year',
                backend    : 'year',
                type       : 'integer'
            },

            month: {
                displayName: 'Month',
                backend    : 'month',
                type       : 'integer'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow',
                type       : 'string'
            }
        },

        ExpensesPayments: {
            supplier: {
                displayName: 'Employee',
                backend    : 'supplier._id'
            },

            year: {
                displayName: 'Year',
                backend    : 'year'
            },

            month: {
                displayName: 'Month',
                backend    : 'month'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            }
        },

        /*
         DividendPayments: {
         year: {
         displayName: 'Year',
         backend    : 'year'
         },

         month: {
         displayName: 'Month',
         backend    : 'month'
         },

         workflow: {
         displayName: 'Status',
         backend    : 'workflow'
         }
         },
         */

        Products: {
            name: {
                displayName: 'Product Name',
                backend    : '_id'
            },

            /*
             productType: {
             displayName: 'Product Type',
             backend    : 'info.productType',
             type       : 'string'
             },
             */

            canBeSold: {
                displayName: 'Can be Sold',
                backend    : 'canBeSold',
                type       : 'boolean'
            },

            canBeExpensed: {
                displayName: 'Can be Expensed',
                backend    : 'canBeExpensed',
                type       : 'boolean'
            },

            canBePurchased: {
                displayName: 'Can be Purchased',
                backend    : 'canBePurchased',
                type       : 'boolean'
            },

            /* hasJob: {
             displayName: 'Not assigned Job',
             backend    : 'job',
             type       : 'boolean'
             },*/

            productCategory: {
                displayName: 'Category',
                backend    : 'info.categories'
            },

            channelLinks: {
                backend: 'channelLinks.channel'
            },

            array: ['name', 'canBeSold', 'canBeExpensed', 'canBePurchased']
        },

        salesProduct: {
            name: {
                displayName: 'Product Name',
                backend    : '_id'
            },

            productType: {
                displayName: 'Product Type',
                backend    : 'info.productType'
            },

            canBeSold: {
                displayName: 'Can be Sold',
                backend    : 'canBeSold'
            },

            canBeExpensed: {
                displayName: 'Can be Expensed',
                backend    : 'canBeExpensed'
            },

            canBePurchased: {
                displayName: 'Can be Purchased',
                backend    : 'canBePurchased'
            }
        },

        Quotations: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['supplier', 'workflow']
        },

        Invoices: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'invoiceDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['supplier', 'workflow']
        },

        Transactions: {

            date: {
                type   : 'date',
                backend: {
                    key     : 'orderDate',
                    operator: ['$gte', '$lte']
                }
            },
        },

        SubjectWise: {

            date: {
                type   : 'date',
                backend: {
                    key     : 'lastModified',
                    operator: ['$gte', '$lte']
                }
            },
        },


        purchaseInvoices: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'invoiceDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['supplier', 'workflow']
        },

        salesQuotations: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['project', 'supplier', 'salesManager', 'workflow']
        },

        salesOrders: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['project', 'supplier', 'salesManager', 'workflow']
        },

        Orders: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            array: ['workflow', 'supplier']
        },

        purchaseOrders: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Supplier',
                backend    : 'supplier._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'orderDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['supplier', 'workflow']
        },

        order: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned To',
                backend    : 'salesPerson._id',
                type        :'string'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            registrationNo: {
                displayName: 'Reg No',
                backend    : 'student.registrationNo',
                type       : 'string'
            },

            center: {
              displayName: 'Center',
              backend    : 'student.center'
            },

            allocationStatus: {
                displayName: 'Allocation Status',
                backend    : 'status.allocateStatus',
                type       : 'string'
            },

            fulfilledStatus: {
                displayName: 'Fulfilled Status',
                backend    : 'status.fulfillStatus',
                type       : 'string'
            },

            shippingStatus: {
                displayName: 'Shipping Status',
                backend    : 'status.shippingStatus',
                type       : 'string'
            },

            channel: {
                displayName: 'Channel',
                backend    : 'channel._id'
            },

            name: {
                displayName: 'Reference',
                backend    : '_id'
            },

            /*name: {
             displayName: 'Reference',
             backend    : 'name',
             type       : 'string'
             },*/

            date: {
                type   : 'date',
                backend: {
                    key     : 'orderDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['supplier', 'salesPerson', 'registrationNo', 'center', 'workflow', 'allocationStatus', 'fulfilledStatus', 'shippingStatus', 'channel', 'name']
        },

        PayrollExpenses: {
            employee: {
                displayName: 'Employee',
                backend    : 'employee._id'
            },

            type: {
                displayName: 'Payment Type',
                backend    : 'type._id'
            },

            dataKey: {
                displayName: 'Data Key',
                backend    : 'dataKey',
                type       : 'string'
            }
        },

        jobsDashboard: {
            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesManager._id'
            },

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            type: {
                displayName: 'Type',
                backend    : 'type',
                type       : 'string'
            },

            paymentsCount: {
                displayName: 'Payment Count',
                backend    : 'payment.count',
                type       : 'integer'
            }
        },

        salaryReport: {
            dateFilterArray: [
                'custom'
            ]/* ,


             employee: {
             displayName: 'Employee',
             backend    : '_id'
             },

             department: {
             displayName: 'Department',
             backend    : 'department._id'
             },

             onlyEmployees: {
             displayName: 'Only Employees',
             backend    : 'onlyEmployees',
             type       : 'boolean'
             },

             array: ['employee', 'department', 'onlyEmployees']
             */
        },

        invoiceCharts: {
            dateFilterArray: [
                'custom'
            ]
        },

        trialBalance: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        journalEntry: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ],

            journal: {
                displayName: 'Journal',
                backend    : 'journal._id'
            },

            name: {
                displayName: 'Source Document',
                backend    : 'sourceDocument.name',
                type       : 'string'
            },

            timestamp: {
                displayName: 'Name',
                backend    : 'timestamp',
                type       : 'string'
            },

            debit: {
                backend: 'debit',
                type   : 'integer'
            },

            credit: {
                backend: 'credit',
                type   : 'integer'
            },

            account: {
                displayName: 'Account',
                backend    : 'account._id'
            },

            salesManager: {
                backend: 'salesmanager._id'
            },

            project: {
                backend: 'project._id'
            },

            type: {
                backend: 'project.projecttype',
                type   : 'string'
            },

            sum: {
                displayName: 'Debit or Credit Amount',
                backend    : '_id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'date',
                    operator: ['$gte', '$lte']
                }
            },

            _type: {
                backend: '_type',
                type   : 'string'
            },

            array: ['journal', 'name', 'account', 'timestamp', 'sum']
        },

        customDashboardCharts: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        VRegistration: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        ExamSchedule: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        QuestionBank: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        testing: {
            dateFilterArray: [
                'thisMonth',
                'line',
                'lastMonth',
                'custom'
            ]
        },

        customDashboard: {
            dateFilterArray: [
                'thisMonth',
                'thisFinYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastFinYear',
                'line',
                'custom'
            ]
        },

        inventoryReport: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ],

            project: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            salesManager: {
                displayName: 'Sales Manager',
                backend    : 'salesmanager._id'
            },

            type: {
                displayName: 'Project Type',
                backend    : 'project.projecttype',
                type       : 'string'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'date',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['project', 'salesManager', 'type']
        },

        projectsDashboard: {
            customer: {
                displayName: 'Customer',
                backend    : 'customer._id'
            },

            name: {
                displayName: 'Project',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow'
            },

            type: {
                displayName: 'Type',
                backend    : 'type',
                type       : 'string'
            },

            array: ['workflow', 'name', 'customer', 'type']

        },

        manualEntry: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        cashBook: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        cashFlow: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        balanceSheet: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        taxReport: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        reports: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        profitAndLoss: {
            dateFilterArray: [
                'thisMonth',
                'thisYear',
                'line',
                'lastMonth',
                'lastQuarter',
                'lastYear',
                'line',
                'custom'
            ]
        },

        goodsOutNotes: {
            customer: {
                displayName: 'Customer',
                backend    : 'customer._id'
            },

            warehouse: {
                displayName: 'Warehouse',
                backend    : 'warehouse._id'
            },

            workflow: {
                displayName: 'Order Status',
                backend    : 'workflow._id'
            },

            status: {
                displayName: 'Status',
                backend    : 'status',
                type       : 'boolean'
            },

            name: {
                displayName: 'Goods Note ID',
                backend    : '_id'
            },

            array: ['workflow', 'warehouse', 'customer', 'status', 'name']
        },

        stockTransactions: {
            warehouse: {
                displayName: 'From',
                backend    : 'warehouse'
            },

            warehouseTo: {
                displayName: 'To',
                backend    : 'warehouseTo'
            },

            status: {
                displayName: 'Status',
                backend    : 'status',
                type       : 'boolean'
            },

            array: ['warehouse', 'warehouseTo', 'status']
        },

        invoice: {
            forSales: {
                backend: 'forSales',
                type   : 'boolean'
            },

            supplier: {
                displayName: 'Customer',
                backend    : 'supplier._id'
            },

            salesPerson: {
                displayName: 'Assigned',
                backend    : 'salesPerson._id'
            },

            project: {
                displayName: 'Project Name',
                backend    : 'project._id'
            },

            workflow: {
                displayName: 'Status',
                backend    : 'workflow._id'
            },

            date: {
                type   : 'date',
                backend: {
                    key     : 'invoiceDate',
                    operator: ['$gte', '$lte']
                }
            },

            array: ['supplier', 'salesPerson', 'project', 'workflow']
        },

        rates: {
            date: {
                type   : 'date',
                backend: {
                    key     : 'date',
                    operator: ['$gte', '$lte']
                }
            }
        },

        stockInventory: {
            warehouse: {
                displayName: 'Warehouse',
                backend    : 'warehouse._id'
            },
            location : {
                displayName: 'Location',
                backend    : 'location._id'
            },
            product  : {
                displayName: 'Product',
                backend    : 'product.name',
                type       : 'string'
            },
            SKU      : {
                displayName: 'SKU',
                backend    : 'product._id'
            },
            order    : {
                displayName: 'PO ref',
                backend    : 'order._id'
            },

            array: ['warehouse', 'location', 'product', 'SKU', 'order']
        },

        ChartOfAccount: {
            category: {
                displayName: 'Category',
                backend    : 'category._id'
            },

            account: {
                displayName: 'Account Name',
                backend    : 'account',
                type       : 'string'
            },

            code    : {
                displayName: 'Code',
                backend    : 'code',
                type       : 'integer'
            },
            currency: {
                displayName: 'Currency',
                backend    : 'payMethod.currency',
                type       : 'string'
            }
        },

        billOfMaterials: {
            product    : {
                displayName: 'Product',
                backend    : 'product',
                type       : 'string'
            },
            name       : {
                displayName: 'Name',
                backend    : 'name',
                type       : 'string'
            },
            routing    : {
                displayName: 'Routing',
                backend    : 'routing',
                type       : 'string'
            },
            quantity   : {
                displayName: 'Quantity',
                backend    : 'quantity',
                type       : 'integer'
            },
            description: {
                displayName: 'Description',
                backend    : 'description',
                type       : 'string'
            },

            array: [
                'product', 'name', 'routing', 'quantity', 'description'
            ]
        }
    };

    if (typeof window === 'object' && this === window) {
        root = window;
    } else if (typeof global === 'object' && this === global) {
        root = global;
    } else {
        root = this;
    }

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = FILTERS;
        }
    } else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return FILTERS;
        });
    } else {
        root.FILTERS = FILTERS;
    }
}());
