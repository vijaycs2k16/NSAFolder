package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.WeekTeacherObject;
import nexrise.publication.in.nexrise.BeanClass.WeeklyTeacherTimeTable;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by Sai Deepak on 12-Oct-16.
 */

public class WeekTeacherJsonParser  implements Constants{

    public ArrayList<WeekTeacherObject> getWeektimeTableList(String  jsonString) throws JSONException, NullPointerException{
        ArrayList<WeekTeacherObject> timeTableObject = new ArrayList<WeekTeacherObject>();

        JSONObject responseObj = new JSONObject(jsonString);
        JSONArray data = responseObj.getJSONArray(DATA);
        if(data.length() >= 1) {
            for (int i = 0; i < data.length(); i++) {
                JSONObject dataObject = data.getJSONObject(i);
                String periodId = dataObject.getString("periodId");
                String periodName = dataObject.getString("periodName");
                String periodStartTime = dataObject.getString("periodStartTime");
                String periodEndTime = dataObject.getString("periodEndTime");
                JSONArray days = dataObject.getJSONArray("days");
                ArrayList<WeeklyTeacherTimeTable> teacherTimeTables = new ArrayList<WeeklyTeacherTimeTable>();
                for (int j = 0; j < days.length(); j++) {
                    JSONObject daysObject = days.getJSONObject(j);
                    String dayId = daysObject.getString("dayId");
                    String dayName = daysObject.getString("dayName");

                    String classCode = "";
                    if(daysObject.has("classCode") && !daysObject.getString("classCode").equals("null"))
                        classCode = daysObject.getString("classCode");
                    String sectionCode = daysObject.getString("sectionCode");

                    JSONObject assignee = daysObject.getJSONObject("assignee");
                    String coloring = null;
                    if(daysObject.has("color"))
                        coloring = daysObject.getString("color");

                    JSONArray subEmpInfo = assignee.getJSONArray("subEmpAssociation");
                    StringBuilder subjectCode = new StringBuilder();

                    for (int k=0; k<subEmpInfo.length(); k++) {
                        JSONObject subject = subEmpInfo.getJSONObject(k);
                        if(subject.has("subCode"))
                            subjectCode.append(subject.getString("subCode")).append(", ");
                    }
                    WeeklyTeacherTimeTable weeklyTeacherTimeTable = new WeeklyTeacherTimeTable();
                    weeklyTeacherTimeTable.setSectionCode(sectionCode);
                    weeklyTeacherTimeTable.setClassCode(classCode);
                    if(subjectCode.toString().length() != 0)
                        subjectCode.setLength(subjectCode.length()-2);
                    else
                        subjectCode.append("");

                    weeklyTeacherTimeTable.setSubjectCode(subjectCode.toString());
                    weeklyTeacherTimeTable.setDayName(dayName);
                    if (coloring != null && !coloring.equalsIgnoreCase("null") && !coloring.isEmpty())
                        weeklyTeacherTimeTable.setColor(coloring);
                    else
                        weeklyTeacherTimeTable.setColor("#cb2794bf");

                    teacherTimeTables.add(weeklyTeacherTimeTable);
                }
                WeekTeacherObject weekTeacherObject = new WeekTeacherObject();
                weekTeacherObject.setPeriodName(periodName);
                weekTeacherObject.setPeriodStartTime(periodStartTime);
                weekTeacherObject.setPeriodEndTime(periodEndTime);
                weekTeacherObject.setDays(teacherTimeTables);
                timeTableObject.add(weekTeacherObject);
            }
        } else {
            throw new JSONException("Empty json object");
        }
        return timeTableObject;
    }
}
