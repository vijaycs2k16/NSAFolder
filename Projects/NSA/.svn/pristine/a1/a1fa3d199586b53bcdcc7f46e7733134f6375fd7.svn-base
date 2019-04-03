package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Holiday;
import nexrise.publication.in.nexrise.BeanClass.StatusAttendance;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by deepak on 7/27/2017.
 */

public class ParentAttendanceParser implements Constants {
    public static ArrayList<StatusAttendance> presentList ;
    public static ArrayList<StatusAttendance> absentList;
    public static ArrayList<Holiday> holidayList;
    public void getParentAttendaceList(String jsonObjct) throws Exception{
        presentList = new ArrayList<StatusAttendance>();
        absentList = new ArrayList<StatusAttendance>();
        holidayList = new ArrayList<Holiday>();
        JSONObject jsonObject = new JSONObject(jsonObjct);
        Log.v("json","jasonObject"+ jsonObjct);
        JSONObject mainObject = jsonObject.getJSONObject(DATA);

        if (mainObject.has("holidays")) {
            JSONArray holidayArray = mainObject.getJSONArray("holidays");
            if (holidayArray.length() != 0) {
                for (int i = 0; i < holidayArray.length(); i++) {
                    Holiday holidays = new Holiday();
                    JSONObject holidayObject = holidayArray.getJSONObject(i);

                    holidays.setSchoolId(holidayObject.getString("schoolId"));
                    holidays.setTenantId(holidayObject.getString("tenantId"));
                    holidays.setHolidayId(holidayObject.getString("holidayId"));
                    holidays.setHolidayTypeId(holidayObject.getString("holidayTypeId"));
                    holidays.setHolidayName(holidayObject.getString("holidayName"));
                    holidays.setHolidayType(holidayObject.getString("holidayType"));
                    holidays.setAcademicYear(holidayObject.getString("academicYear"));
                    holidays.setStartDate(holidayObject.getString("startDate"));
                    holidays.setEndDate(holidayObject.getString("endDate"));
                    holidays.setFullDate(holidayObject.getString("fullDate"));
                    holidays.setUpdatedDate(holidayObject.getString("updatedDate"));
                    holidays.setUpdatedBy(holidayObject.getString("updatedBy"));
                    holidays.setUpdatedUsername(holidayObject.getString("updatedUsername"));
                    holidays.setUpdateddateAndName(holidayObject.getString("updateddateAndName"));
                    Log.v("holiday","leave "+holidays);
                    holidayList.add(holidays);
                }
            }
        }

        if (mainObject.has("attendance")) {
            JSONArray dataArray = mainObject.getJSONArray("attendance");
            if (dataArray.length() != 0) {
                for (int i = 0; i < dataArray.length(); i++) {
                    JSONObject dataOject = dataArray.getJSONObject(i);
                    String id = dataOject.getString("id");
                    String tenantId = dataOject.getString("tenantId");
                    String schoolId = dataOject.getString("schoolId");
                    String academicYear = dataOject.getString("academicYear");
                    String attendanceId = dataOject.getString("attendanceId");
                    String userName = dataOject.getString("userName");
                    String attendanceDate = dataOject.getString("attendanceDate");
                    Boolean isPresent = dataOject.getBoolean("isPresent");
                    if (isPresent) {
                        StatusAttendance statusAttendance = new StatusAttendance();
                        statusAttendance.setId(id);
                        statusAttendance.setTenantId(tenantId);
                        statusAttendance.setSchoolId(schoolId);
                        statusAttendance.setAcademicYear(academicYear);
                        statusAttendance.setAttendanceId(attendanceId);
                        statusAttendance.setUserName(userName);
                        statusAttendance.setAttendanceDate(attendanceDate);
                        Log.v("present","leave "+statusAttendance);
                        presentList.add(statusAttendance);
                    } else {
                        StatusAttendance statusAttendance = new StatusAttendance();
                        statusAttendance.setId(id);
                        statusAttendance.setTenantId(tenantId);
                        statusAttendance.setSchoolId(schoolId);
                        statusAttendance.setAcademicYear(academicYear);
                        statusAttendance.setAttendanceId(attendanceId);
                        statusAttendance.setUserName(userName);
                        statusAttendance.setAttendanceDate(attendanceDate);
                        Log.v("absent","leave "+statusAttendance);
                        absentList.add(statusAttendance);
                    }

                }
            }
        }
    }
}