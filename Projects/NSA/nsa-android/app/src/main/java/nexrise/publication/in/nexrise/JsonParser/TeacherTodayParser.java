package nexrise.publication.in.nexrise.JsonParser;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import nexrise.publication.in.nexrise.BeanClass.TeacherTimeTable;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by praga on 01-Apr-17.
 */

public class TeacherTodayParser implements Constants {

    public ArrayList<TeacherTimeTable> getTimeTable(Context context, String jsonObject) throws JSONException {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
        String schoolId = preferences.getString(SCHOOL_ID, null);

        ArrayList<TeacherTimeTable> timeTableObject = new ArrayList<TeacherTimeTable>();
        JSONObject mainObject = new JSONObject(jsonObject);
        JSONArray dataArray = mainObject.getJSONArray(DATA);

        if(dataArray.length() != 0) {
            for (int i = 0; i < dataArray.length(); i++) {
                JSONObject object = dataArray.getJSONObject(i);
                String id = "";
                if(object.has("timetable_id"))
                    id = object.getString("timetable_id");

                String periodId = object.getString("periodId");
                String periodName = object.getString("periodName");
                String periodStartTime = object.getString("periodStartTime");
                String periodEndTime = object.getString("periodEndTime");
                JSONObject assignObject = object.getJSONObject("assignee");
                JSONArray subEmpInfo = assignObject.getJSONArray("subEmpAssociation");

                String subjectName = "";

                for (int j=0; j<subEmpInfo.length(); j++) {
                    JSONObject subject = subEmpInfo.getJSONObject(j);

                    if(subject.has("subName"))
                        subjectName += subject.getString("subName")+ ", ";
                }

                String classId = object.getString("classId");
                String classCode = "";
                if(object.has("classCode") && !object.getString("classCode").equals("null"))
                    classCode = object.getString("classCode");
                String sectionId = object.getString("sectionId");
                String sectionCode = object.getString("sectionCode");
                String sectionName = object.getString("sectionName");

                HashMap<String, String> attachments = new HashMap<>();
                JSONArray attachmentAry = assignObject.getJSONArray("attachments");
                for (int j=0; j<attachmentAry.length(); j++) {
                    JSONObject attachmentObj = attachmentAry.getJSONObject(j);
                    JSONObject attachment = attachmentObj.getJSONObject("attachment");
                    Iterator iterator = attachment.keys();
                    while(iterator.hasNext()) {
                        String key = iterator.next().toString();
                        String fileUrl = AWS_BASE_URL + schoolId + "/" +key;
                        attachments.put(fileUrl, attachment.getString(key));
                    }
                }

                TeacherTimeTable timeTable = new TeacherTimeTable();
                timeTable.setId(id);
                timeTable.setPeriodId(periodId);
                timeTable.setPeriodName(periodName);
                timeTable.setPeriodStartTime(periodStartTime);
                timeTable.setPeriodEndTime(periodEndTime);
                if(!subjectName.isEmpty()) {
                    subjectName = subjectName.substring(0, subjectName.length()-2);
                    timeTable.setSubjectName(subjectName);
                } else
                    timeTable.setSubjectName(subjectName);
                timeTable.setClassId(classId);
                timeTable.setClassCode(classCode);
                timeTable.setSectionId(sectionId);
                timeTable.setSectionCode(sectionCode);
                timeTable.setSectionName(sectionName);
                timeTable.setAttachment(attachments);
                timeTableObject.add(timeTable);
            }
        } else {
            throw new JSONException("Empty json array");
        }
        return timeTableObject;
    }
}
