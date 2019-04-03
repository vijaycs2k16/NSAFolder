package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by deepak on 7/18/2017.
 */

public class TeacherExamListParser implements Constants {
    public ArrayList<Exam> ExamListParser(String response) throws  JSONException,NullPointerException{
        ArrayList<Exam> examArrayList = new ArrayList<>();
            JSONObject mainObject = new JSONObject(response);
            JSONObject dataObject = mainObject.getJSONObject(DATA);
            JSONArray userArray = dataObject.getJSONArray("users");
            if (userArray.length() != 0) {
                for (int i = 0; i < userArray.length(); i++) {
                    JSONObject usersObject = userArray.getJSONObject(i);
                    String firstName = usersObject.getString("firstName");
                    String totalMarks = usersObject.getString("totalMarks");
                    JSONObject subjects = usersObject.getJSONObject("subjects");
                    String totalObtained = subjects.getString("maxTotal");
                    String examName = usersObject.getString("writtenExamName");
                    Boolean status = usersObject.getBoolean("status");
                    JSONArray userSubMarkDetails = usersObject.getJSONArray("userSubMarkDetails");
                    ArrayList<ExamMarks> examSubjectArrayList = new ArrayList<>();
                    for (int j = 0; j < userSubMarkDetails.length(); j++) {
                        JSONObject userSubMarkObject = userSubMarkDetails.getJSONObject(j);
                        String subjectName = userSubMarkObject.getString("subjectName");
                        String marksObtained = userSubMarkObject.getString("marksObtained");
                        String maxMarks = userSubMarkObject.getString("maxMarks");
                        ExamMarks examSubject = new ExamMarks();
                        examSubject.setMarksObtained(marksObtained);
                        examSubject.setSubjectName(subjectName);
                        examSubjectArrayList.add(examSubject);
                    }
                    if(status) {
                        Exam exam = new Exam();
                        exam.setFirstName(firstName);
                        if(totalMarks != null && !totalMarks.equalsIgnoreCase("null"))
                            exam.setTotalMarks(totalMarks);
                        else
                            exam.setTotalMarks("0");
                        exam.setMarkList(examSubjectArrayList);
                        exam.setTotalObtained(totalObtained);
                        exam.setExamName(examName);
                        examArrayList.add(exam);
                    }else {
                        throw new JSONException("Not Published");
                    }
                }
            }else {
                throw new NullPointerException("Empty Array");
            }

        return examArrayList;
    }
}
