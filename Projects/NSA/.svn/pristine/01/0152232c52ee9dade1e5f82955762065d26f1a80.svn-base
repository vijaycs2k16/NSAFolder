package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Homework;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by praga on 15-Mar-17.
 */

public class HomeworkStatusJsonParser implements Constants{
    public static ArrayList<Homework> completedList;
    public static ArrayList<Homework> incompletedList;

    public void getStatus(String jsonString){
        completedList = new ArrayList<Homework>();
        incompletedList =new ArrayList<Homework>();
        try {
            JSONObject jsonObject = new JSONObject(jsonString);
            JSONArray jsonArray = jsonObject.getJSONArray(DATA);
            for (int i=0;i<jsonArray.length();i++) {
                JSONObject finalobject = jsonArray.getJSONObject(i);
                String studentname = finalobject.getString("firstName");
                String isSubmitted = finalobject.getString("isSubmitted");
                String className = finalobject.getString("className");
                String classId = finalobject.getString("classId");
                String sectionId = finalobject.getString("sectionId");
                String sectionName = finalobject.getString("sectionName");
                String username = finalobject.getString("userName");
                String assignmentDetailId = finalobject.getString("id");
                String id = finalobject.getString("assignmentId");
                if(isSubmitted.equalsIgnoreCase("Submitted")){
                    Homework homework = new Homework();
                    homework.setFirstName(studentname);
                    homework.setIsSubmitted(isSubmitted);
                    homework.setClassName(className);
                    homework.setSectionName(sectionName);
                    homework.setUsername(username);
                    homework.setClassId(classId);
                    homework.setSectionid(sectionId);
                    homework.setAssignmentDetailId(assignmentDetailId);
                    homework.setAssignmentId(id);
                    completedList.add(homework);
                    Log.v("completed","true"+completedList);
                }else {
                    Homework homework = new Homework();
                    homework.setFirstName(studentname);
                    homework.setIsSubmitted(isSubmitted);
                    homework.setClassName(className);
                    homework.setSectionName(sectionName);
                    homework.setUsername(username);
                    homework.setClassId(classId);
                    homework.setSectionid(sectionId);
                    homework.setAssignmentDetailId(assignmentDetailId);
                    homework.setAssignmentId(id);
                    incompletedList.add(homework);
                }
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
