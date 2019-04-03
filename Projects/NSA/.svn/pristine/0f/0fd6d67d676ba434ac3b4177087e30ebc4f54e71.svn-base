package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ExamList;
import nexrise.publication.in.nexrise.BeanClass.Portions;
import nexrise.publication.in.nexrise.BeanClass.Subjects;

/**
 * Created by karthik on 04-11-2016.
 */

public class PortionsAttachmentParser {

    public List<ExamList> parse(JSONObject jsonObject){
        List<ExamList> examList = new ArrayList<ExamList>();

        try {
            JSONArray teacherExamList = jsonObject.getJSONArray("teacherExamList");
            for(int i=0; i<teacherExamList.length(); i++){
                JSONObject object = teacherExamList.getJSONObject(i);
                String month = object.getString("month");
                String roomNo = object.getString("rno");
                String className = object.getString("class");
                String schedule = object.getString("schedule");
                String examName = object.getString("examName");

                List<Subjects> subjectsList = new ArrayList<Subjects>();
                JSONArray subjects = object.getJSONArray("subject");
                for(int j=0; j<subjects.length(); j++){
                    JSONObject subjectObject = subjects.getJSONObject(j);
                    String date = subjectObject.getString("date");
                    String session = subjectObject.getString("session");
                    String subjectName = subjectObject.getString("name");

                    List<Portions> attachments = new ArrayList<Portions>();
                    JSONArray portions = subjectObject.getJSONArray("portionArray");
                    for (int k=0; k<portions.length(); k++){
                        String part = portions.getJSONObject(k).getString("part");

                        Portions portions1 = new Portions(part);
                        attachments.add(portions1);
                    }

                    Subjects subjects1 = new Subjects(date, session, subjectName, attachments);
                    subjectsList.add(subjects1);
                }

                ExamList examList1 = new ExamList(month, roomNo, className, schedule, examName, subjectsList);
                examList.add(examList1);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return  examList;
    }
}
