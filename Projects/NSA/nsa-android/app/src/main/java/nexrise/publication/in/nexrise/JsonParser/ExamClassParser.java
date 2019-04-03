package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ExamObject;

/**
 * Created by Sai Deepak on 07-Oct-16.
 */

public class ExamClassParser {

    public List<ExamObject> getExamList(String classJson){
        JSONObject jsonObject = null;
        if(classJson!= null){
            try {
                jsonObject = new JSONObject(classJson);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return getExamList(jsonObject);
    }

    private List<ExamObject> getExamList(JSONObject jsonObject) {

        List<ExamObject> examObjects = new ArrayList<ExamObject>();

        JSONArray examList = null;
        try {
            examList = jsonObject.getJSONArray("examList");
            for(int i=0; i < examList.length(); i++) {
                JSONObject examJsonObject = examList.getJSONObject(i);
                String examName = examJsonObject.getString("examName");
                String date = examJsonObject.getString("date");
                String month = examJsonObject.getString("month");

                ExamObject examObject = new ExamObject(examName, date, month);
                examObjects.add(examObject);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return examObjects;
    }
}
