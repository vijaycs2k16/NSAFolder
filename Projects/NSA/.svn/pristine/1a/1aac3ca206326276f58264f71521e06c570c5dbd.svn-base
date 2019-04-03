package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.StatusAttendance;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by rsury on 11-01-2018.
 */

public class ParentStatusParser implements Constants {
    public static ArrayList<StatusAttendance> presentList ;
    public static ArrayList<StatusAttendance> absentList;
    public void getParentAttendaceList(String jsonObjct) throws Exception{
        presentList = new ArrayList<StatusAttendance>();
        absentList = new ArrayList<StatusAttendance>();
        JSONObject mainObject = new JSONObject(jsonObjct);
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        if(dataArray.length() !=0) {
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
                if(isPresent){
                    StatusAttendance statusAttendance = new StatusAttendance();
                    statusAttendance.setId(id);
                    statusAttendance.setTenantId(tenantId);
                    statusAttendance.setSchoolId(schoolId);
                    statusAttendance.setAcademicYear(academicYear);
                    statusAttendance.setAttendanceId(attendanceId);
                    statusAttendance.setUserName(userName);
                    statusAttendance.setAttendanceDate(attendanceDate);
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
                    absentList.add(statusAttendance);
                }

            }
        } else {
            throw new Exception("Empty Array");
        }

    }
}
