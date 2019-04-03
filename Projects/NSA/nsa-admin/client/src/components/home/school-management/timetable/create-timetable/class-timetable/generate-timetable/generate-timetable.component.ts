/**
 * Created by Cyril on 2/22/2017.
 */
import {Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList} from "@angular/core";
import {BaseService} from "../../../../../../../services/index";
import {Constants, ServiceUrls} from "../../../../../../../common/index";
import {ExtCalendarComponent} from "../../../../../common/calendar/ext.calendar.component";
import {DateService} from "../../../../../../../services/common/date.service";
import {CalendarService} from "../../../../../../../services/calendar/calendar.service";
import {CommonService} from "../../../../../../../services/common/common.service";
import {FormBuilder, Validators} from "@angular/forms";
declare var $: any;
declare var _: any;

@Component({
    selector: 'generate-timetable',
    templateUrl: 'generate-timetable.html'
})
export class GenerateTimetableComponent implements OnInit {
    edit: boolean = false;
    btnVal: string  = 'Save';
    classes: any;
    sections: any;
    subjects: any;
    sectionId: any;
    classId: any;
    className: any;
    sectionName: any;
    employees: any;
    classEmployees: any;
    timetable: any = {};
    timetableId: any;
    deletTimetableObj: any = {}
    eventId: any;
    subjectId: any;
    classTeacherName: any = '';
    feature:any[];
    enable: boolean = false;
    enableData: boolean = false;
    isNewTimetable: boolean = false;
    isEditTimetable: boolean = false;
    subEmpAssociation: any;
    timetableForm: any;
    timetableConfig: any;
    isInValid: boolean = true;
    modelId : any;
    isGenerated: boolean;
    isVal: boolean;
    isEnabled: boolean;
    employeesData: any;
    Disabled: boolean;

    @ViewChild('singleClass') singleClass: ElementRef;
    @ViewChildren("subEmpDetails") subEmpDetails: QueryList<any>
    @ViewChild('sectionSelect') sectionSelect: ElementRef;
    @ViewChild('subject') subject: ElementRef;
    @ViewChild('subjectTeacher') subjectTeacher: ElementRef;
    @ViewChild('classTeacher') classTeacher: ElementRef;
    @ViewChild('slot') slot: ElementRef;
    @ViewChild('startTime') startTime: ElementRef;
    @ViewChild('endTime') endTime: ElementRef;
    @ViewChild('sms') sms: ElementRef;
    @ViewChild('push') push: ElementRef;

    constructor(private baseService: BaseService,
                private constants: Constants,
                private calendarService: CalendarService,
                private dateService: DateService,
                private commonService: CommonService,
                private serviceUrls: ServiceUrls,
                private fb: FormBuilder) {}

    @ViewChild(ExtCalendarComponent) exeCalendar: ExtCalendarComponent;

    ngOnInit() {
        this.getAllEmployees();
        this.getActiveClasses();
        this.baseService.selectStyle();
        this.enable = this.baseService.havePermissionsToEdit(this.constants.TIMETABLE_PERMISSIONS);
        this.createTimetableForm();

    }

    createTimetableForm() {
        this.timetableForm = this.fb.group({
            'periods': this.fb.array([
            ]),
        });
    }

    initSubject() {
        return this.fb.group({
            'subject_name': ['', Validators.required],
            'subject_id': ['', Validators.required],
            'emp_name': ['', Validators.required],
            'emp_id': ['', Validators.required],
            'allocated_periods': ['0', Validators.required],
            'max_periods': ['', Validators.required]
        });
    }

    editInitSubject(value: any) {
        return this.fb.group({
            'subject_name': [value.subject_name],
            'subject_id': [value.subject_id],
            'emp_name': [value.emp_name],
            'emp_id': [value.emp_id],
            'allocated_periods': [value.allocated_periods, Validators.required],
            'max_periods': [value.max_periods]
        });
    }

    isEmptyObject() {
        var scheduledSubjects = this.timetableForm.controls['periods'].value, i = 0;
        while (i < scheduledSubjects.length) {
            for (var key in scheduledSubjects[i]) {
                if (scheduledSubjects[i].hasOwnProperty(key)) {
                    if (scheduledSubjects[i][key] === '') {
                        return true;
                    }
                }
            }
            i++;
        }
        return false;
    }

    addSubject(index: number) {

        var currentPeriod = this.timetableForm.controls['periods'].controls[index-1].value,
            periods = this.timetableForm.controls['periods'].value,
            foundEmp = {}, foundDuplicate = false;

        if (this.timetableForm.controls['periods'].length >= 2) {
            periods.forEach(function (obj: any) {
                if (foundEmp[obj.subject_id] && foundEmp[obj.subject_id] ==  obj.emp_id) {
                    foundDuplicate = true;
                } else {
                    foundEmp[obj.subject_id] = obj.emp_id;
                }
            });
        }

        var currentPeriod = this.timetableForm.controls['periods'].controls[index-1].value;

        if (currentPeriod.subject_id === '') {
            this.baseService.showNotification('Please choose the subject !', '', 'bg-danger');
        } else if (currentPeriod.emp_id === '') {
            this.baseService.showNotification('Please choose the teacher for ' + currentPeriod.subject_name + ' !', '', 'bg-danger');
        } else if (this.isEmptyObject()) {
            this.baseService.showNotification('Please fill all the fields to add subject', '', 'bg-danger');
            return;
        } else if(foundDuplicate){
            this.baseService.showNotification('Please choose the Different teacher for ' + currentPeriod.subject_name + ' !', '', 'bg-danger');
        } else if (currentPeriod.max_periods === '') {
            this.baseService.showNotification('Please enter the max periods per week !', '', 'bg-danger');
        } else {
            this.timetableForm.controls['periods'].insert(index, this.initSubject());
            setTimeout(() => {
                this.baseService.enableSelectWithEmpty('#select-subject' + index, this.subjects, this.constants.sectionSubObj, null);
            }, 100);
        }
    }

    getSubject(event: any, index: number) {
        if (event.target.value === '') {
            this.timetableForm.controls.periods.controls[index].controls.subject_id.setValue('');
            this.timetableForm.controls.periods.controls[index].controls.subject_name.setValue('');
        } else {
            this.timetableForm.controls.periods.controls[index].controls.subject_id.setValue(event.target.value);
            this.timetableForm.controls.periods.controls[index].controls.subject_name.setValue(event.target.selectedOptions[0].text);
        }
    }

    getTimetableData() {
        this.commonService.get(this.serviceUrls.getDashboardTimetable).then(data => this.timetableDataCallback(data))
    }

    timetableDataCallback(data: any) {
        this.timetable = data;
    }

    getActiveClasses() {
        this.commonService.get(this.serviceUrls.getActiveClasses).then(
            classes => this.callBackClasses(classes)
        )
    }

    callBackClasses(data: any) {
        this.classes = data;
        this.baseService.enableSelectWithEmpty('#select-class', this.classes, this.constants.classObj, null);
    }

    getAllEmployees() {
        this.commonService.get(this.serviceUrls.getActiveEmployees).then(
            employees => this.callBackClassEmployees(employees)
        )
    }

    callBackClassEmployees(data: any) {
        this.classEmployees = data;
    }

    renderCalendar(data: any, view: any, role: any) {
        this.exeCalendar.enableCalendar(data, view, role);
    }

    refreshCalendar(data: any) {
        this.exeCalendar.refresh(data)
    }

    classTeacherChange(event: any) {
        this.classTeacherName = this.baseService.extractOptions(this.classTeacher.nativeElement.selectedOptions)[0].id;
    }

    openOverlay(event:any) {
        this.isInValid = true;
        this.btnVal = 'Save';
        this.getActiveClasses();
        this.enableData = true;
        this.baseService.removeHideClass('.noteClass')
        this.baseService.addHideClass('.calDiv')
        this.baseService.openOverlay(event);
    }

    getSectionByClass() {
        this.sectionId = '';
        this.classId = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].id;
        this.className = this.baseService.extractOptions(this.singleClass.nativeElement.selectedOptions)[0].name;
        this.timetableForm.controls['periods'].controls = [];
        if(this.classId.length < 1) {
            this.baseService.addHideClass('#select-section');
        }  else {
            this.baseService.enableLoadingWithMsg('')
            this.commonService.get(this.serviceUrls.getSectionsByClass + this.classId).then( sections => this.callBackSections(sections))
            this.baseService.removeHideClass('#select-section');
            this.commonService.get(this.serviceUrls.timetableConfigByClass + this.classId).then(
                timetable => this.callbackTimeTableConfig(timetable)
            );
        }
    }

    getSelectSectionByClass(data: any) {
            this.commonService.get(this.serviceUrls.getSectionsByClass + data.classId).then( sections => this.callBackSelectedSections(sections, data))
    }

    getFeatureChannelConfiguration() {
        this.commonService.get(this.serviceUrls.getFeatureById).then(
            channels => this.callBackChannels(channels)
        )
    }

    callBackChannels(data: any) {
        this.feature =data;
        this.commonService.getActiveFeatureChannelDetails(data);
    }

    getSubjectsByEmployee(event:any, index: number) {
        if (event.target.value === '') {
            this.timetableForm.controls.periods.controls[index].controls.subject_id.setValue('');
            this.timetableForm.controls.periods.controls[index].controls.subject_name.setValue('');
        } else {
            this.timetableForm.controls.periods.controls[index].controls.subject_id.setValue(event.target.value);
            this.timetableForm.controls.periods.controls[index].controls.subject_name.setValue(event.target.selectedOptions[0].text);
            this.commonService.get(this.serviceUrls.subjectByEmployee + event.target.value + '?timetable=true').then( subjects => this.callBackEmployees(subjects, index))
        }

    }

    getEmployee(event: any, index: number) {
        if (event.target.value === '') {
            this.timetableForm.controls.periods.controls[index].controls.emp_id.setValue('');
            this.timetableForm.controls.periods.controls[index].controls.emp_name.setValue('');
        } else {
            var periodObj = _.filter(this.employeesData, {'userName' : event.target.value});
            if(!_.isEmpty(periodObj)) {
                this.timetableForm.controls.periods.controls[index].controls.allocated_periods.setValue((periodObj[0].noOfPeriods).toString());
            }
            this.timetableForm.controls.periods.controls[index].controls.emp_id.setValue(event.target.value);
            this.timetableForm.controls.periods.controls[index].controls.emp_name.setValue(event.target.selectedOptions[0].text);
        }
    }

    getSubjectsByEmployeeForEdit(event: any) {
        var targetId = event.target.dataset['id'];
        this.subjectId = event.target.value;
        this.getEmployeeBySubject(targetId, null)
    }

    getEmployeeBySubject(targetId: any, selectedEmp: any) {
        if(this.subjectId.length > 1) {
            this.commonService.get(this.serviceUrls.subjectByEmployee + this.subjectId).then( subjects => this.callBackEmployeesForEdit(subjects, targetId, selectedEmp))
        }
    }

    callBackEmployeesForEdit(data: any, id: any, selectedEmp: any) {
        this.employees = data;
        this.baseService.enableSelectWithEmpty('#' + id, this.employees, this.constants.empObj, selectedEmp)
    }

    editTimetable(event: any) {
        this.baseService.enableLoadingWithMsg('')
        var obj = JSON.parse(event.target.value);
        var cyear = (localStorage.getItem(this.constants.cyear) == 'true');
        this.enableData = obj.editPermissions && cyear;
        if(this.enableData == true) {
            this.baseService.removeHideClass('.noteClass')
        } else {
            this.baseService.addHideClass('.noteClass');
        }
        
        this.classId = obj.classId;
        this.className = obj.className;
        this.sectionName = obj.sectionName;
        this.sectionId = obj.sectionId;
        this.getClassTeacher();
        this.getFeatureChannelConfiguration();
        this.commonService.get(this.serviceUrls.getClassPeriods + obj.classId).then(periods => this.callBackClassPeriods(periods, this.enableData));

        this.commonService.post(this.serviceUrls.getSubjectsBySections, {sectionId: this.sectionId, classId: this.classId}).then(
            subjects => this.callBackSubjects(subjects)
        )

        this.edit = true;
        this.baseService.openOverlay(event);
    }

    newTimetable(event: any) {
        this.Disabled = false;
        this.edit = false;
        this.sections = ''
        this.isInValid = true;
        this.isVal = false;
        this.btnVal = 'Save';
        this.isEnabled = false;
        this.openOverlay(event);
    }

    genTimetable(event: any, btnShow: any, isEnable: any) {
        this.Disabled = true;
        this.isInValid = false;
        this.isVal = btnShow;
        this.isEnabled = isEnable;
        this.modelId = event;
        var val = JSON.parse(event.target.value);
        this.classId = val.classId;
        this.className = val.className;
        this.sectionName = val.sectionName;
        this.sectionId = val.sectionId;
        this.commonService.get(this.serviceUrls.getTeacherAllocation + val.classId + '/' + val.sectionId).then(result => this.callBackGenTimetable(result, this.modelId));
    }

    callBackGenTimetable(value: any, modelId: any) {
        this.timetableForm.controls['periods'].controls = [];
        if(!_.isEmpty(value)){
            this.getSelectSectionByClass(value[0]);
            this.editForm(value[0]);
            this.commonService.get(this.serviceUrls.timetableConfigByClass + value[0].classId).then(
                timetable => this.callbackTimeTableConfig(timetable)
            );
            if(modelId != null)
            this.baseService.openOverlay(this.modelId)
        } else {
            this.commonService.post(this.serviceUrls.getSubjectsBySections, {
                sectionId: this.sectionId,
                classId: this.classId
            }).then(
                subjects => this.callBackSubjects(subjects)
            );
        }
    }

    editForm(form:any) {
        this.btnVal = 'Update';
        this.isGenerated = form.isGenerated;
        this.baseService.enableSelectWithEmpty('#select-class', this.classes, this.constants.classObj, form.classId)
        this.baseService.enableSelectWithEmpty('#select-employee', this.classEmployees, this.constants.empObj, this.classTeacherName)
        this.classId = form.classId;
        this.sectionId = form.sectionId;
        this.classTeacherName = form.classTeacherUserName;
        var self = this;
        self.genSubjectsBySec(form);
    }

    callBackClassPeriods(data: any, role: any) {
        if(data.length > 0) {
            this.baseService.removeDisabled('.noteClass');
            this.timetable.eleAttr = '.fullcalendar';
            this.timetable.newEvent = '#newTimetable';
            this.timetable.newEventButton = '#eventNewButton';
            this.timetable.weekEle = '#classWeekData';
            this.timetable.eventMenu = '.timetable-menu';
            this.timetable.slots = data;
            this.timetable.showSelectHelper = true
            this.timetable.stopOverlap = true;
            this.timetable.isTimetable = true;
            this.renderCalendar(this.timetable, 'week', role);
            this.refreshCalendar(this.timetable)
        } else {
            this.baseService.addDisabled('.noteClass')
            this.baseService.showInformation('top', this.constants.classConfigValidation, this.constants.n_danger);
        }
        this.baseService.disableLoading();
    }

    callBackSections(data: any) {
        this.sections = _.sortBy(data, 'sectionName');
        this.baseService.disableLoading();

        this.getFeatureChannelConfiguration();
        setTimeout(() => {
            this.baseService.enableSelectWithEmpty('#select-employee', this.classEmployees, this.constants.empObj, null)
            this.baseService.enableSelectWithEmpty('#select-section', this.sections, this.constants.sectionObj, null)
        }, 250);

    }

    callBackSelectedSections(data: any, res: any) {
        this.sections = _.sortBy(data, 'sectionName');
        this.baseService.disableLoading();

        this.getFeatureChannelConfiguration();
        setTimeout(() => {
            this.baseService.enableSelectWithEmpty('#select-employee', this.classEmployees, this.constants.empObj, res.classTeacherUserName);
            this.baseService.enableSelectWithEmpty('#select-section', this.sections, this.constants.sectionObj, res.sectionId);
        }, 250);

    }

    callBackEmployees(data: any, index: number) {
        this.baseService.removeHideClass('#subject-teacher'+index);
        this.employeesData = data;
        this.baseService.enableSelectWithEmpty('#subject-teacher'+index, data, this.constants.empObj, null)
    }

    getSubjectBySection() {
        this.baseService.enableLoadingWithMsg('');
        this.classTeacherName = '';
        this.sectionId = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0].id;
        this.sectionName = this.baseService.extractOptions(this.sectionSelect.nativeElement.selectedOptions)[0].name;
        this.getClassTeacher();

        if(this.sectionId.length > 0) {
            var date = new Date();
            date.setDate(date.getDate() + 1);
            var weekNumber = this.dateService.getWeekNumber(date);
            this.commonService.get(this.serviceUrls.timetableForClass + this.classId + "/section/" + this.sectionId + '?weekNo=' + weekNumber[1]).then(
                timetable => this.callbackTimeTable(timetable)
            );
        }
    }

    keypress(event:any) {
        var charCode = (event.which) ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }

     genSubjectsBySec(form: any) {
         this.btnVal = 'Update';
         this.commonService.post(this.serviceUrls.getSubjectsBySections, {
            sectionId: this.sectionId,
            classId: this.classId
        }).then(
            subjects => this.callBackAllSubjects(subjects, form)
        );

    };

    callbackTimeTable(timetable: any) {
        if (Array.isArray(timetable) && timetable.length > 0 ) {
            setTimeout(()=> {
                this.baseService.addHideClass('.calDiv')
                this.baseService.showNotification('Timetable is already generated for this class.', "", 'bg-danger');
            }, 50);
        } else {
            this.commonService.get(this.serviceUrls.getTeacherAllocation + this.classId + '/' + this.sectionId).then(result => this.callBackGenTimetable(result, null));
            this.baseService.removeHideClass('.calDiv')
        }
    }

    callbackTimeTableConfig(timetableConfig: any) {
        this.timetableConfig = timetableConfig;
        if (Array.isArray(timetableConfig) && timetableConfig.length === 0 ) {
            this.baseService.addHideClass('.calDiv');
            this.baseService.addHideClass('.select-hide-class');
            this.baseService.showNotification('No time table has been configure for this class.', "", 'bg-danger')
        } else {
            this.baseService.removeHideClass('.calDiv');
            this.baseService.removeHideClass('.select-hide-class');
        }
    }

    callBackSubjects(data: any) {
        this.btnVal = 'Save';
        if(data.length < 1){
            this.baseService.addHideClass('.calDiv');
            this.baseService.showNotification('No subject has been allocated for this Section.', "", 'bg-danger');
        } else {
            this.subjects = data;
            this.baseService.removeHideClass('.calDiv');
            if (this.timetableForm.controls['periods'].length === 0) {
                this.timetableForm.controls['periods'].push(this.initSubject());
            }
            setTimeout(()=> {
                this.baseService.enableSelectWithEmpty('#select-subject0', this.subjects, this.constants.sectionSubObj, null);
            }, 100);
        }
    }

    callBackAllSubjects(data: any, form: any) {
            var self = this;
            this.subjects = data;
            setTimeout(()=> {
                for(var i=0; i < form.teachers.length; i++){
                    this.timetableForm.controls['periods'].push(this.editInitSubject(form.teachers[i]));
                }
            }, 100);
            setTimeout(()=> {
                for(var i=0; i < form.teachers.length; i++){
                    self.baseService.enableSelectWithEmpty('#select-subject' + i, data, self.constants.sectionSubObj,  form.teachers[i].subject_id);
                    this.subjectId = form.teachers[i].subject_id;
                    this.baseService.removeHideClass('#subject-teacher'+ i);
                    this.getEmployeeBySubject('subject-teacher' + i, form.teachers[i].emp_id);
                }
            }, 100);
    }

    closeOverlay(event:any) {
        this.resetInput();
        this.baseService.closeOverlay('#generate-timetable');
    }

    saveTimetable(event: any, id: any) {
        if(this.setValidationsForAssign()) {
            var obj = this.buildTimetableObj();
            if(this.isNewTimetable) {
                this.baseService.enableBtnLoading(id);
                this.commonService.post(this.serviceUrls.timetableForClass, obj).then(result => this.callbackSaveTimetable(result, id))
            } else {
                this.baseService.enableBtnLoading(id);
                this.commonService.put(this.serviceUrls.timetableForClassAdd + this.timetableId, obj).then(result => this.callbackSaveTimetable(result, id))
            }
        }

    }

    callbackSaveTimetable(result: any, btnId: any) {
        this.baseService.disableBtnLoading(btnId);
        this.renderCalendar(this.timetable, 'week', this.enable);
        this.refreshCalendar(this.timetable)
        this.baseService.dataTableReload('class_timetable_datatable');
        this.baseService.closeModal('newTimetable')
    }

    callbackUpdateTimetable(result: any, btnId: any) {
        this.baseService.disableBtnLoading(btnId);
        this.renderCalendar(this.timetable, 'week', this.enable);
        this.refreshCalendar(this.timetable)
        this.baseService.dataTableReload('class_timetable_datatable');
        this.baseService.closeModal('newTimetable')
    }

    getWeekData(event: any) {
        var date = new Date(event.target.value);
        date.setDate(date.getDate() + 1);
        var weekNumber = this.dateService.getWeekNumber(date)
        this.commonService.get(this.serviceUrls.classTimetable + this.classId + '/' + this.sectionId + '?weekNo=' + weekNumber[1]).then(result => this.callbackWeekData(result))
    }

    callbackWeekData(data: any) {
        this.timetable.events = data;
        this.refreshCalendar(this.timetable)
    }

    editEventTimetable(event: any) {
        var event = JSON.parse(event.target.value);
        this.isEditTimetable = true;
        this.subEmpAssociation = event.subEmpAssociation
        this.timetableId = event.timetable_id;
        this.eventId = event._id;
        this.baseService.removeHideClass('#updateEvent');
        this.baseService.addHideClass('#addEvent');
        this.baseService.removeHideClass('#teacher');
        this.subEmpAssociation.forEach((subEmp: any, index: any) => {
            this.subjectId = subEmp.subjectId
            this.getEmployeeBySubject('emp_' + index, subEmp.employeeId);
            setTimeout(() => {
                this.baseService.enableSelectWithEmpty('#sub_' + index, this.subjects, this.constants.sectionSubObj, subEmp.subjectId)
            })
        });

        this.calendarService.showEventPopup(event, this.timetable)
    }

    addEventTimetable(event: any) {
        this.isNewTimetable = false;
        this.isEditTimetable = false;
        var event = JSON.parse(event.target.value);
        this.timetableId = event.timetable_id;
        this.eventId = event._id;
        setTimeout(() =>{
            this.baseService.enableSelectWithEmpty('#subject-select', this.subjects, this.constants.sectionSubObj, null)
        }, 100)
        this.baseService.addHideClass('#updateEvent');
        this.baseService.removeHideClass('#addEvent');
        this.baseService.addHideClass('#teacher')
        this.calendarService.showEventPopup(event, this.timetable)
    }

    newEventTimetable(event: any) {
        this.isNewTimetable = true;
        this.isEditTimetable = false;
        var event = JSON.parse(event.target.value);
        setTimeout(() =>{
            this.baseService.enableSelectWithEmpty('#subject-select', this.subjects, this.constants.sectionSubObj, null)
        }, 100)
        this.baseService.addHideClass('#updateEvent');
        this.baseService.removeHideClass('#addEvent');
        this.baseService.addHideClass('#teacher')
        this.calendarService.showEventPopup(event, this.timetable)
    }

    deleteEventTimetable(event: any) {
        var attachment = $("#deleteButton").attr("attachment");
        if(attachment == 'false' || attachment == undefined){
            this.commonService.deleteTimetableById(this.timetableId, this.deletTimetableObj).then(result => this.callbackTimetableDelete(result))
        }
    }

    callbackTimetableDelete(result: any) {
        this.baseService.showInformation('top', result.message, this.constants.n_success)
        this.calendarService.removeEvent(this.eventId)
    }

    showWarning(event: any) {
        var event = JSON.parse(event.target.value);
        this.eventId = event._id;
        this.timetableId = event.timetable_id;
        this.deletTimetableObj.classId = event.classId;
        this.deletTimetableObj.sectionId = event.sectionId;
        $("#deleteButton").attr('attachment', false);
        this.baseService.showWarning();
    }

    updateTimetable(event: any, id: any) {
        if(this.setValidationsForEdit()) {
            var obj = this.buildEditTimetableObj();
            obj.swap = false;
            this.baseService.enableBtnLoading(id);
            this.commonService.put(this.serviceUrls.timetableForClass + this.timetableId, obj).then(result => this.callbackUpdateTimetable(result, id))
            if(obj.subEmpAssociation.length < 1){
                this.deletTimetableObj.classId = this.classId;
                this.deletTimetableObj.sectionId = this.sectionId;
                this.deleteEventTimetable(event);
            }
        }
    }

    buildTimetableObj(): any {
        var slotObj = JSON.parse(this.slot.nativeElement.value);
        var startTime = new Date(this.startTime.nativeElement.value);
        var periodId = slotObj.id;
        var subjectId = this.baseService.extractOptions(this.subject.nativeElement.selectedOptions)[0].id;
        var employeeId = this.baseService.extractOptions(this.subjectTeacher.nativeElement.selectedOptions)[0].id;

        var obj = {
            classId: this.classId,
            sectionId: this.sectionId,
            periodId: periodId,
            subjectId: subjectId,
            empId: employeeId,
            dayId: startTime.getDay(),
            classTeacherUserName: this.classTeacherName
        }
        return obj;
    }

    buildEditTimetableObj(): any {
        var slotObj = JSON.parse(this.slot.nativeElement.value);
        var subEmpAssociationObj: any[] = []
        this.subEmpDetails.forEach(div => {
            var selected = div.nativeElement.getElementsByTagName('select')
            var obj = {}
            for (let entry of selected) {
                obj[entry.dataset['name']] = entry.value
            }
            if(!this.baseService.isEmptyObject(obj))
            subEmpAssociationObj.push(obj)
        });

        var startTime = new Date(this.startTime.nativeElement.value);
        var periodId = slotObj.id;

        var obj = {
            classId: this.classId,
            sectionId: this.sectionId,
            periodId: periodId,
            subEmpAssociation: subEmpAssociationObj,
            dayId: startTime.getDay(),
            classTeacherUserName: this.classTeacherName

        }

        return obj;
    }

    save(event: any) {
            if (this.setValidations()) {
                var form = {sms: this.sms.nativeElement.checked, push: this.push.nativeElement.checked}
                var notifyTo = {status: 'Sent'};
                var saveForm = {
                    notify: form,
                    notifyTo: notifyTo,
                    classId: this.classId,
                    className: this.className,
                    sectionName: this.sectionName,
                    sectionId: this.sectionId,
                    classTeacherUserName: this.classTeacherName,
                    teachers: this.timetableForm.controls.periods.value
                };
                var url = this.serviceUrls.generateTimtetable + this.classId + '/' + this.sectionId;
                this.commonService.post(url, saveForm).then(
                    result => this.saveCallback(result, false),
                    error => this.saveCallback(<any>error, true))

                this.baseService.enableDivLoading('.generate-timetable', this.constants.getReady);
            }
    }


    saveTeacherAllocation(event: any) {
        var form = {sms:false, push: false};
        var notifyTo = {status: false};
        if (this.setValidations()) {
            var formVal = {
                notify: form,
                notifyTo: notifyTo,
                classId: this.classId,
                className: this.className,
                sectionName: this.sectionName,
                sectionId: this.sectionId,
                classTeacherUserName: this.classTeacherName,
                teachers: this.timetableForm.controls.periods.value,
                isGenerated: false
            };
            if (this.isGenerated == undefined) {
                var postUrl = this.serviceUrls.saveTeacherAllocation;
                this.commonService.post(postUrl, formVal).then(
                    result => this.saveTeacherAllocationCallback(result, false),
                    error => this.saveTeacherAllocationCallback(<any>error, true))
            }
            else {
                var putUrl = this.serviceUrls.updateTeacherAllocation;
                this.commonService.put(putUrl, formVal).then(
                    result => this.updateTeacherAllocationCallback(result, false),
                    error => this.updateTeacherAllocationCallback(<any>error, true))
            }
        }
    }

    setValidations() : any {
        this.classTeacherName = this.baseService.extractOptions(this.classTeacher.nativeElement.selectedOptions)[0].id;
        var dataFound = false;
        var numOfPeriodsPerDay = this.timetableConfig.school_periods.length  - this.timetableConfig.school_breaks.length;
        var numOfPeriodsPerWeek = numOfPeriodsPerDay * this.timetableConfig.working_days.length;
        var periodsConfig = this.timetableForm.controls.periods.value, totalPeriods = 0;
        periodsConfig.forEach(function (obj: any) {
            totalPeriods += +obj.max_periods;
        });

        var currentPeriod = this.timetableForm.controls['periods'].controls._value,
            periods = this.timetableForm.controls['periods'].value,
            foundEmp = {}, foundDuplicate = false;

        if (this.timetableForm.controls['periods'].length >= 2) {
            periods.forEach(function (obj: any) {
                if (foundEmp[obj.subject_id] && foundEmp[obj.subject_id] ==  obj.emp_id) {
                    foundDuplicate = true;
                } else {
                    foundEmp[obj.subject_id] = obj.emp_id;
                }
            });
        }

        if (this.isEmptyObject()) {
            this.baseService.showNotification('Please fill all the fields ', '', 'bg-danger');
            return;
        } else if (foundDuplicate){
            this.baseService.showNotification('Please choose the Different teacher', '', 'bg-danger');
        } else if (numOfPeriodsPerWeek < totalPeriods) {
            this.baseService.showNotification(this.constants.periods, "", this.constants.j_danger);
        } else if(this.classId.length < 1) {
            this.baseService.showNotification(this.constants.selectClass, "", this.constants.j_danger);
        } else if (this.sectionId.length < 1) {
            this.baseService.showNotification(this.constants.selectSection, "", this.constants.j_danger);
        } else if (this.classTeacherName.length < 1) {
            this.baseService.showNotification(this.constants.selectClassTeacher, "", this.constants.j_danger);
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    setValidationsForAssign() : any {
        var dataFound = false;
        var subjectId = this.baseService.extractOptions(this.subject.nativeElement.selectedOptions)[0];
        var employeeId = this.baseService.extractOptions(this.subjectTeacher.nativeElement.selectedOptions)[0];
        if(subjectId.id == "" || subjectId.id == undefined) {
            this.baseService.showNotification(this.constants.selectSubject, "", this.constants.j_danger);
        } else if (employeeId.id == "" ||  employeeId.id == undefined) {
            this.baseService.showNotification(this.constants.selectEmp, "", this.constants.j_danger);
        } else {
            dataFound = true;
        }

        return dataFound;
    }

    setValidationsForEdit() : any {
        var dataFound = true;
        this.subEmpDetails.forEach(div => {
            var selected = div.nativeElement.getElementsByTagName('select')
            for (let entry of selected) {
                if(entry.value  == "" || entry.value == undefined) {
                    dataFound = false;
                    if(entry.dataset['name'] == 'id') {
                        this.baseService.showNotification(this.constants.selectSubject, "", this.constants.j_danger);
                    } else {
                        this.baseService.showNotification(this.constants.selectEmp, "", this.constants.j_danger);
                    }
                }
            }
        });

        return dataFound;
    }

    deleteSubject(index: number) {
        this.timetableForm.controls.periods.removeAt(index);
    }

    saveCallback(result: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', !_.isEmpty(result.err) ? result.err : result, 'bg-danger');
        } else {
            this.resetInput();
            this.baseService.showNotification('Success!', result.message, 'bg-success');
            this.baseService.closeOverlay('#generate-timetable');
        }
        this.baseService.disableDivLoading('.generate-timetable');
        this.baseService.dataTableReload('class_timetable_datatable');
    }

    saveTeacherAllocationCallback(result: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', result.err, 'bg-danger');
        } else {
            this.resetInput();
            this.baseService.showNotification('Success!', result.message, 'bg-success');
            this.baseService.closeOverlay('#generate-timetable');
        }
        this.baseService.dataTableReload('class_timetable_datatable');
    }

    updateTeacherAllocationCallback(result: any, err: any) {
        if(err) {
            this.baseService.showNotification('Failure!', result.err, 'bg-danger');
        } else {
            this.resetInput();
            this.baseService.showNotification('Success!', result.message, 'bg-success');
            this.baseService.closeOverlay('#generate-timetable');
        }
        this.baseService.dataTableReload('class_timetable_datatable');
    }

    resetInput() {
        this.classTeacherName = null;
        this.sections = [];
        this.enableData = true;
        this.createTimetableForm();
        this.baseService.removeHideClass('.noteClass');
        this.baseService.addHideClass('.calDiv')
    }

    getClassTeacher() {
        this.commonService.get(this.serviceUrls.getClassTeacher + this.classId + '/' + this.sectionId).then(
            result => this.classTeacherCallback(result, false),
            error => this.classTeacherCallback(<any>error, true))
    }

    classTeacherCallback(result: any, err: any) {
        this.classTeacherName = result.class_teacher_id;
        this.baseService.enableSelectWithEmpty('#select-employee', this.classEmployees, this.constants.empObj, this.classTeacherName)
        this.baseService.disableLoading()
    }

    enableBtn() {
        var val = this.timetableForm.controls.periods.controls[0].controls.max_periods.value;
        if (val > 0) {
            this.isInValid = false;
        }
    }

}

