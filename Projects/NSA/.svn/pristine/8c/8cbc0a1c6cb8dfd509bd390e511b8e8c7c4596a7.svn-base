package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Exam;
import nexrise.publication.in.nexrise.BeanClass.ExamMarks;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by deepak on 8/31/2017.
 */

public class ExamMarkParser implements Constants {

    public Exam examMarksParser(String response) throws JSONException, NullPointerException {
        JSONObject jsonObject = new JSONObject(response);
        JSONObject data = jsonObject.getJSONObject(DATA);
        Exam exam = new Exam();
        ArrayList<ExamMarks> marksList = new ArrayList<>();

        exam.setTotalMarks(data.getString("totalMarks"));
        exam.setTotalObtained(data.getString("subjectTotal"));
        Object subjectMarkDetails = data.get("subjectMarkDetails");
        if(subjectMarkDetails != null && !subjectMarkDetails.equals("null")) {
            JSONArray subjectMarksAry = (JSONArray)subjectMarkDetails;
            for (int j=0; j<subjectMarksAry.length(); j++) {
                ExamMarks examMarks = new ExamMarks();
                JSONObject subjectMark = subjectMarksAry.getJSONObject(j);
                examMarks.setSubjectId(subjectMark.getString("subject_id"));
                examMarks.setSubjectName(subjectMark.getString("subject_name"));
                String marksObtained = subjectMark.getString("marks_obtained");
                    examMarks.setMarksObtained(marksObtained);
                    examMarks.setMaxMarks(subjectMark.getString("max_marks"));
                marksList.add(examMarks);
            }
            exam.setMarkList(marksList);
        } else
            throw new JSONException("Empty json");

        return exam;
    }


}
