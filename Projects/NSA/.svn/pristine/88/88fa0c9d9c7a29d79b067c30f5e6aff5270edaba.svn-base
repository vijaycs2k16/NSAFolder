package nexrise.publication.in.nexrise.JsonParser;

import android.content.Context;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.WeekObject;
import nexrise.publication.in.nexrise.BeanClass.WeeklyTimeTable;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Utils.Utility;

/**
 * Created by Sai Deepak on 11-Oct-16.
 */

public class WeeklyTimeTableParser implements Constants{

    public ArrayList<WeeklyTimeTable> getWeektimeTableList(String jsonObject, Context context) throws JSONException {
        ArrayList<WeeklyTimeTable> weekList = new ArrayList<WeeklyTimeTable>();
        JSONObject mainObject = new JSONObject(jsonObject);
        //JSONObject dataObject = mainObject.getJSONObject("data");
        JSONArray dataArray = mainObject.getJSONArray(DATA);
        String tenantId = Utility.readProperty(context, "hideSubjectCode");

        if (dataArray.length()!= 0) {
            for (int i = 0; i < dataArray.length(); i++) {
                JSONObject periodObject = dataArray.getJSONObject(i);
                String periodId = periodObject.getString("periodId");
                String periodName = periodObject.getString("periodName");
                String periodStartTime = periodObject.getString("periodStartTime");
                String periodEndTime = periodObject.getString("periodEndTime");
                ArrayList<WeekObject> daysList = new ArrayList<WeekObject>();
                JSONArray days = periodObject.getJSONArray("days");
                for (int j = 0; j < days.length(); j++) {
                    JSONObject dayObject = days.getJSONObject(j);
                    String dayId = dayObject.getString("dayId");
                    String dayName = dayObject.getString("dayName");
                    JSONObject assignee = dayObject.getJSONObject("assignee");
                    JSONArray subEmpInfo = assignee.getJSONArray("subEmpAssociation");

                    String color = null;
                    String subjectCode = "";
                    StringBuilder subEmpCode = new StringBuilder();
                    String employeeCode = "";

                    for (int k=0; k<subEmpInfo.length(); k++) {
                        JSONObject subject = subEmpInfo.getJSONObject(k);
                        String employeeId = subject.getString("employeeId");
                        if (subject.has("employeeCode"))
                            employeeCode = subject.getString("employeeCode");

                        if (subject.has("subCode"))
                            subjectCode = subject.getString("subCode");

                        if(tenantId.contains(ACCESS_ID))
                            subEmpCode.append(subjectCode).append(", ");
                        else
                            subEmpCode.append(subjectCode).append(" - ").append(employeeCode).append(", ");
                        color = subject.getString("color");
                    }

                    WeekObject weekObject = new WeekObject();
                    if(subEmpCode.length() != 0)
                        subEmpCode.setLength(subEmpCode.length()-2);
                    else
                        subEmpCode.append("");

                    weekObject.setSubEmpCode(subEmpCode.toString());
                    weekObject.setDayId(dayId);
                    weekObject.setDayName(dayName);
                    if (color != null && !color.equalsIgnoreCase("null") && !color.isEmpty())
                        weekObject.setColor(color);
                    else
                        weekObject.setColor("#cb2794bf");
                    daysList.add(weekObject);
                }
                WeeklyTimeTable weeklyTimeTable = new WeeklyTimeTable();
                weeklyTimeTable.setPeriodEndTime(periodEndTime);
                weeklyTimeTable.setPeriodName(periodName);
                weeklyTimeTable.setPeriodStartTime(periodStartTime);
                weeklyTimeTable.setPeriodId(periodId);
                weeklyTimeTable.setDays(daysList);
                weekList.add(weeklyTimeTable);
            }
        } else {
            throw new JSONException("Given Data Array is Empty");
        }
        return weekList;
    }
}
