package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Attendance;

/**
 * Created by praga on 8/9/2017.
 */

public class UpdateAttendanceParser  {
    ArrayList<Attendance> updateAttendanceList = new ArrayList<>();
    public  ArrayList<Attendance>  updateAttendance(JSONArray dataArray) throws Exception{
        for (int i=0;i<dataArray.length();i++){
            JSONObject attendaceObject = dataArray.getJSONObject(i);
            String id = attendaceObject.getString("id");
            String tenantId = attendaceObject.getString("tenantId");
            String schoolId = attendaceObject.getString("schoolId");
            String academicYear = attendaceObject.getString("academicYear");
            String attendanceId = attendaceObject.getString("attendanceId");
            String mediaName = attendaceObject.getString("mediaName");
            String userName = attendaceObject.getString("userName");
            String admissionNo = attendaceObject.getString("admissionNo");
            String primaryPhone = attendaceObject.getString("primaryPhone");
            String deviceToken = attendaceObject.getString("deviceToken");
            String firstName = attendaceObject.getString("firstName");
            String classId = attendaceObject.getString("classId");
            String className = attendaceObject.getString("className");
            String sectionId = attendaceObject.getString("sectionId");
            String sectionName = attendaceObject.getString("sectionName");
            Boolean isPresent = attendaceObject.getBoolean("isPresent");
            String attendanceDate = attendaceObject.getString("attendanceDate");
            String recordedDate = attendaceObject.getString("recordedDate");
            String recordedBy = attendaceObject.getString("recordedBy");
            String recordedUsername = attendaceObject.getString("recordedUsername");
            String updatedBy = attendaceObject.getString("updatedBy");
            String updatedDate = attendaceObject.getString("updatedDate");
            String updatedUsername = attendaceObject.getString("updatedUsername");
            String remarks = attendaceObject.getString("remarks");
            Object hosteller = attendaceObject.get("isHostel");
            Log.v("hosteller","value"+hosteller);
            Attendance attendance = new Attendance();
                if(hosteller != null && !hosteller.toString().equals("null")) {
                    Boolean isHostel = attendaceObject.getBoolean("isHostel");
                    attendance.setHostel(isHostel);
                    Log.v("Hostel","Data"+attendance.getHostel());
                }
            attendance.setId(id);
            attendance.setTenantId(tenantId);
            attendance.setSchoolId(schoolId);
            attendance.setAcademicYear(academicYear);
            attendance.setAttendanceId(attendanceId);
            attendance.setMediaName(mediaName);
            attendance.setUserName(userName);
            attendance.setAdmissionNo(admissionNo);
            attendance.setPrimaryPhone(primaryPhone);
            attendance.setTokens(deviceToken);
            attendance.setFirstName(firstName);
            attendance.setClassId(classId);
            attendance.setClassName(className);
            attendance.setSectionId(sectionId);
            attendance.setSectionName(sectionName);
            attendance.setIsPresent(isPresent);
            attendance.setAttendanceDate(attendanceDate);
            attendance.setRecordedDate(recordedDate);
            attendance.setRecordedBy(recordedBy);
            attendance.setRecordedUsername(recordedUsername);
            attendance.setUpdatedBy(updatedBy);
            attendance.setUpdatedDate(updatedDate);
            attendance.setUpdatedUsername(updatedUsername);
            attendance.setRemarks(remarks);

            updateAttendanceList.add(attendance);
        }
        return updateAttendanceList;
    }
}
