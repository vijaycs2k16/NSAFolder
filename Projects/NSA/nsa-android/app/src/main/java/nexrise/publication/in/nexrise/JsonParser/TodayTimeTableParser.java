package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.TimeTableObject;
import nexrise.publication.in.nexrise.Constants;


/**
 * Created by Sai Deepak on 06-Oct-16.
 */

public class TodayTimeTableParser implements Constants{

    public List<TimeTableObject> getTimeTable(String jsonObject) throws JSONException{

        List<TimeTableObject> timeTableObject = new ArrayList<TimeTableObject>();

        JSONObject mainObject = new JSONObject(jsonObject);
       // JSONObject dataObject = mainObject.getJSONObject("data");
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        if(dataArray.length() != 0) {
            for (int i = 0; i < dataArray.length(); i++) {
                JSONObject object = dataArray.getJSONObject(i);
                TimeTableObject timeTable = new TimeTableObject();

                String periodId = object.getString("periodId");
                String periodName = object.getString("periodName");
                String periodStartTime = object.getString("periodStartTime");
                String periodEndTime = object.getString("periodEndTime");

                JSONObject assignObject = object.getJSONObject("assignee");
                JSONArray subEmpAssociation = assignObject.getJSONArray("subEmpAssociation");

                StringBuilder employeeName = new StringBuilder();
                employeeName.append("");
                StringBuilder subjectCode = new StringBuilder();
                subjectCode.append("");
                StringBuilder subjectName = new StringBuilder();
                subjectName.append("");

                for (int j=0; j<subEmpAssociation.length(); j++) {
                    JSONObject subEmpObj = subEmpAssociation.getJSONObject(j);
                    employeeName.append(subEmpObj.getString("employeeName"));
                    subjectName.append(subEmpObj.getString("subName"));

                    if(subEmpObj.has("subCode"))
                        subjectCode.append(subEmpObj.getString("subCode"));

                    if(j != subEmpAssociation.length()-1) {
                        employeeName.append("\n");
                        subjectName.append("\n");
                        subjectCode.append("\n");
                    }
                }

                JSONArray attachmentsAry = assignObject.getJSONArray("attachments");
                HashMap<String, String> attachmentMap = new HashMap<>();
                for(int j=0; j<attachmentsAry.length();j++) {
                    JSONObject attachmentsObj = attachmentsAry.getJSONObject(j);
                    JSONObject attachment = attachmentsObj.getJSONObject("attachment");

                    Iterator iterator = attachment.keys();
                    while (iterator.hasNext()) {
                        String key = iterator.next().toString();
                        attachmentMap.put(key, attachment.getString(key));
                    }
                }

                timeTable.setAttachments(attachmentMap);
                timeTable.setPeriodId(periodId);
                timeTable.setPeriodName(periodName);
                timeTable.setPeriodStartTime(periodStartTime);
                timeTable.setPeriodEndTime(periodEndTime);
                timeTable.setEmployeeName(employeeName.toString());
                timeTable.setSubjectName(subjectName.toString());
                timeTable.setSubjectCode(subjectCode.toString());
                timeTableObject.add(timeTable);
            }
        } else {
            throw new JSONException("Empty json array");
        }
        return timeTableObject;
    }
}
