/**
 * Created by senthil on 12/02/18.
 */

exports.createUserObj = function (req, data, next) {
    var body = req.body
    var userObj = {
        email: body.studentEmail,
        login: body.studentEmail,
        pass: body.originalPassword,
        profile: "1519104899000",
        relatedEmployee: null,
        userType       : 'Student',
        isActive       : body.isBooking ? false : true,
        student: data.studentId || null,
        savedFilters: []
    }
    data.userObj = userObj

    next(null, req, data)
}

exports.createCenterAdminObj = function (req, data, next) {
    var body = req.body
    var userObj = {
        email: body.studentEmail,
        login: body.studentEmail,
        pass: body.originalPassword,
        profile: "1519104899000",
        relatedEmployee: null,
        userType       : 'Student',
        student: data.studentId || null,
        savedFilters: []
    }
    data.userObj = userObj

    next(null, req, data)
}

exports.createEmpObj = function (req, data, next) {
    var body = req.body
    var userObj =
        {
            isEmployee: true,
            imageSrc: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAAAAACPAi4CAAAACXBIWXMAAABIAAAASABGyWs+AAAACXZwQWcAAABAAAAAQADq8/hgAAAEaElEQVRYw82X6XLbNhCA+f4PVomk5MRyHDtp63oEgDcl3vfRBQhQIEVKSvsnO+OxRBEfFnthV+n/pyi/NaCryzzL8rJu/wOgzQPXJBgjhDExnXPW/Aqgy30DI0yIwYQQ4Bhe2j0I6BIbI1jL9meC2TdkRu0jgMxCGN5H2HT8IIzjKPAdE9NngEjuAhqfv3rOpe3aIrDAFoB1qtuA3ADlMXKuz9vlLqZokt4CxPAOQXa2bPDCRVSJYB0QIDA4ibp+TVKDbuCvAeh6YpX9DWkcUGJCkAARXW9UfXeL0PmUcF4CZBA4cALv5nqQM+yD4mtATQMOGMi9RzghiKriCuBiAzsB1e8uwUUGtroZIAEsqfqHCI2JjdGZHNDSZzHYb0boQK4JOTVXNQFEoJXDPskEvrYTrJHgIwOdZEBrggXzfkbo+sY7Hp0Fx9bUYbUEAAtgV/waHAcCnOew3arbLy5lVXGSXIrKGQkrKKMLcnHsPjEGAla1PYi+/YCV37e7DRp1qUDjwREK1wjbo56hezRoPLxt9lzUg+m96Hvtz3BMcU9syQAxKBSJ/c2Nqv0Em5C/97q+BdGoEuoORN98CkAqzsAAPh690vdv2tOOEcx/dodP0zq+qjpoQQF7/Vno2UA0OgLQQbUZI6t/1+BlRgAlyywvqtNXja0HFQ7jGVwoUA0HUBNcMvRdpW8PpzDPYRAERfmNE/TDuE8Ajis4oJAiUwB2+g+am3YEEmT5kz4HgOdRygHUIPEMsFf/YvXJYoSKbPczQI4HwysSbKKBdk4dLAhJsptrUHK1lSERUDYD6E9pGLsjoXzRZgAIJVaYBCCfA57zMBoJYfV9CXDigHhRgww2Hgngh4UjnCUbJAs2CEdCkl25kbou5ABh0KkXPupA6IB8fOUF4TpFOs5Eg50eFSOBfOz0GYCWoJwDoJzwcjQBfM2rMAjD0CEsL/Qp4ISG/FHkuJ4A9toXv66KomosMMNAuAA6GxOWPwqP64sb3kTm7HX1Fbsued9BXjACZKNIphLz/FF4WIps6vqff+jaIFAONiBbTf1hDITti5RLg+cYoDOxqJFwxb0dXmT5Bn/Pn8wOh9dQnMASK4aaSGuk+G24DObCbm5XzkXs9RdASTuytUZO6Czdm2BCA2cSgNbIWedxk0AV4FVYEYFJpLK4SuA3DrsceQEQl6svXy33CKfxIrwAanqZBA8R4AAQWeUMwJ6CZ7t7BIh6utfos0uLwxqP7BECMaTUuQCoawhO+9sSUWtjs1kA9I1Fm8DoNiCl64nUCsp9Ym1SgncjoLoz7YTl9dNOtbGRYSAjWbMDNPKw3py0otNeufVYN2wvzha5g6iGzlTDebsfEdbtW9EsLOvYZs06Dmbsq4GjcoeBgThBWtRN2zZ1mYUuGZ7axfz9hZEns+mMQ+ckzIYm/gn+WQvWWRq6uoxuSNi4RWWAYGfRuCtjXx25Bh25MGaTFzaccCVX1wfPtkiCk+e6nh/ExXps/N6z80PyL8wPTYgPwzDiAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDExLTAxLTE5VDAzOjU5OjAwKzAxOjAwaFry6QAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxMC0xMi0yMVQxNDozMDo0NCswMTowMGxOe/8AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAAAElFTkSuQmCC",
            name: {
                first: body.centerIncharge,
                last: "test"
            },
            gender: "male",
            marital: "married",
            tags: [
                ""
            ],
            workAddress: {
                street: "",
                city: "",
                state: "",
                zip: "",
                country: ""
            },
            workEmail: body.centerEmail,
            personalEmail: body.personalEmail,
            workPhones: {
                phone: body.centerPhoneNo,
                mobile: body.centerInchargeMobileno
            },
            password: body.originalPassword,
            skype: "",
            officeLocation: "",
            relatedUser: null,
            payrollStructureType: null,
            weeklyScheduler: "57332c3b94ee1140b6bb49e2",
            visibility: "Public",
            department: "5a803fae43c1fb357f38ae80",
            jobPosition: "5a80401c43c1fb357f38ae81",
            nationality: "5a803e9043c1fb357f38ae78",
            identNo: "",
            passportNo: "",
            bankAccountNo: "",
            otherId: "",
            homeAddress: {},
            source: "www.ain.net",
            dateBirth: "2 Feb, 2000",
            hire: [
                "2018-02-28T05:06:34.000Z"
            ],
            fire: [],
            notes: [],
            jobType: "Part-time",
            employmentType: "Employees",
            social: {
                LI: "",
                FB: ""
            },
            manager: "5a8041c343c1fb357f38ae8d",
            coach: null,
            center: body.center,
            userName: body.personalEmail,
            groups: {
                owner: null,
                users: [],
                group: []
            },
            whoCanRW: "everyOne"
        }

    data.empObj = userObj
    next(null, req, data)
}

exports.createEmpTransferObj = function (req, data, next) {
    var empSalaryObj = {
        date: new Date(),
        salary: 0,
        status: "hired",
        department: "5a816c16250f7f3c7d4e63cc",
        jobPosition: "5a80402743c1fb357f38ae82",
        manager: "5a8041c343c1fb357f38ae8d",
        jobType: "Full-time",
        info: "",
        weeklyScheduler: "57332c3b94ee1140b6bb49e2",
        employee: data.empId,
        scheduledPay: "5787a03231b2e2b73b43b6dd",
        payrollStructureType: "5787a09614d93c593b9b53b0"
    }
    data.empSalaryObj = empSalaryObj

    next(null, req, data)
}