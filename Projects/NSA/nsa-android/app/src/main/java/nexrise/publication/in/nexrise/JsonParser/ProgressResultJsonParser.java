package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressResult;

/**
 * Created by karthik on 18-10-2016.
 */

public class ProgressResultJsonParser {

    public List<ProgressResult> parse(JSONObject jsonObject, String exam){

        List<ProgressResult> progressResults = new ArrayList<ProgressResult>();
        try {
            JSONObject examObject = jsonObject.getJSONObject(exam);
            String className = examObject.getString("Class");
            String section = examObject.getString("Section");
            String duration = examObject.getString("Duration");
            String passPercent = examObject.getString("Overall pass percentage");
            JSONArray studentsAry = examObject.getJSONArray("Students");
            for (int i=0; i<studentsAry.length(); i++){
                JSONObject studentsObj = studentsAry.getJSONObject(i);
                String name = studentsObj.getString("Name");
                int id = studentsObj.getInt("Id");
                String english = studentsObj.getString("English");
                String tamil = studentsObj.getString("Tamil");
                String maths = studentsObj.getString("Maths");
                String science = studentsObj.getString("Science");
                String social = studentsObj.getString("Social");
                String overallGrade = studentsObj.getString("Overall grade");
                ProgressResult progressResult = new ProgressResult(name, className, section,
                        id, english, tamil, maths, science, social, overallGrade, exam, duration, passPercent);
                progressResults.add(progressResult);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

    return  progressResults;
    }

    public List<ProgressResult> parse(JSONObject jsonObject, String exam, String studentName){
        List<ProgressResult> progressResults = new ArrayList<ProgressResult>();
        String[] examName = {"Formative assessment 1","Formative assessment 2", "Summative assessment 1"};
        try {
            for (int j=0; j<examName.length; j++) {
                JSONObject examObject = jsonObject.getJSONObject(examName[j]);
                String className = examObject.getString("Class");
                String section = examObject.getString("Section");
                String duration = examObject.getString("Duration");
                String passPercent = examObject.getString("Overall pass percentage");
                JSONArray studentsAry = examObject.getJSONArray("Students");
                for (int i = 0; i < studentsAry.length(); i++) {
                    JSONObject studentsObj = studentsAry.getJSONObject(i);
                    String name = studentsObj.getString("Name");

                    if (name.equals(studentName)) {
                        int id = studentsObj.getInt("Id");
                        String english = studentsObj.getString("English");
                        String tamil = studentsObj.getString("Tamil");
                        String maths = studentsObj.getString("Maths");
                        String science = studentsObj.getString("Science");
                        String social = studentsObj.getString("Social");
                        String overallGrade = studentsObj.getString("Overall grade");
                        ProgressResult progressResult = new ProgressResult(name, className, section,
                                id, english, tamil, maths, science, social, overallGrade, examName[j], duration, passPercent);
                        progressResults.add(progressResult);
                    }
                }
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return progressResults;
    }
}
