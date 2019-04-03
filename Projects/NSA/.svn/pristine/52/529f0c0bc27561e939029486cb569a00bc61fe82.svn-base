package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by Sai Deepak on 25-Oct-16.
 */

public class ParentHomeWorkStringParser {

    int index;
    String studentName;

    public ParentHomeWorkStringParser(int index, String studentName) {
        this.index = index;
        this.studentName = studentName;
    }

    public ArrayList<String> getAllValues(String jsonString, String studentName) {
        JSONObject jsonObject = null;
        ArrayList<String> arrayList = new ArrayList<>();
        if (jsonString != null) {
            try {
                jsonObject = new JSONObject(jsonString);
                JSONArray homeworkAry = jsonObject.getJSONArray("parentHomework");
                for (int i=0; i < homeworkAry.length(); i++) {
                    JSONObject values = homeworkAry.getJSONObject(i);
                    String name = values.getString("name");
                    if(name.equals(studentName)) {
                        JSONArray homework = values.getJSONArray("homework");
                        JSONObject insideValues = homework.getJSONObject(index);
                        String shortDescription = insideValues.getString("Short description");
                        String section = insideValues.getString("Section");
                        String subject = insideValues.getString("Subject");
                        String dueDate = insideValues.getString("Due date");
                        String type = insideValues.getString("Type");
                        String std = insideValues.getString("Std");
                        String repeat = insideValues.getString("Repeat");
                        String teacherName = insideValues.getString("Teacher name");
                        String priority = insideValues.getString("Priority");
                        String status = insideValues.getString("status");

                        arrayList.add(type);
                        arrayList.add(std);
                        arrayList.add(section);
                        arrayList.add(subject);
                        arrayList.add(dueDate);
                        arrayList.add(teacherName);
                        arrayList.add(priority);
                        arrayList.add(repeat);
                        arrayList.add(shortDescription);
                        arrayList.add(status);
                        Log.v("PArser ", " " + homeworkAry.getJSONObject(index));

                    }
                }



            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return arrayList;
    }

}
