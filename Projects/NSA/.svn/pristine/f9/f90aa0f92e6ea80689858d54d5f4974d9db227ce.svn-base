package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;

import nexrise.publication.in.nexrise.BeanClass.AttachmentDetails;
import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.BeanClass.TeacherHomeWork;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by deepak on 8/16/2017.
 */

public class HomeworkParser implements Constants {
    String tag = "";
    public ArrayList<TeacherHomeWork> weekDataParser(String response, ArrayList<TeacherHomeWork> existingHomeworkList)throws JSONException, NullPointerException {

        if(existingHomeworkList != null) {
            for (int i=0; i<existingHomeworkList.size(); i++) {
                String dateTag = existingHomeworkList.get(i).getTag();
                if(dateTag != null && !dateTag.equals("null")) {
                    tag = dateTag;
                }
            }
        }
        ArrayList<TeacherHomeWork> teacherData = new ArrayList<TeacherHomeWork>();
        JSONArray dataAry = new JSONArray();
        String key = "";

        JSONObject jsonObject = new JSONObject(response);
        Object data = jsonObject.get(DATA);
        if(data instanceof JSONObject) {
            JSONObject dataObject = jsonObject.getJSONObject(DATA);
            Iterator iterator = dataObject.keys();
            if (dataObject.length() == 0)
                throw new JSONException("Empty Json");
            while (iterator.hasNext()) {
                key = iterator.next().toString();
                dataAry = dataObject.getJSONArray(key);
                ArrayList<TeacherHomeWork> homeWorkList = parse(dataAry, key);
                teacherData.addAll(homeWorkList);
            }
        } else if(data instanceof  JSONArray) {
            dataAry = jsonObject.getJSONArray(DATA);
            ArrayList<TeacherHomeWork> homeWorkList = parse(dataAry, key);
            teacherData.addAll(homeWorkList);
        }
        return teacherData;
    }

    private ArrayList<TeacherHomeWork> parse(JSONArray dataAry, String key) throws JSONException, NullPointerException {
        ArrayList<TeacherHomeWork> teacherData = new ArrayList<TeacherHomeWork>();
        for (int i= 0;i<dataAry.length();i++){
            JSONObject object = dataAry.getJSONObject(i);
            String id = object.getString("id");
            String tenantId = object.getString("tenantId");
            String schoolId = object.getString("schoolId");
            String academicYear = object.getString("academicYear");
            String assignmentName = object.getString("assignmentName");
            String assignmentTypeId = object.getString("assignmentTypeId");
            String assignmentTypeName = object.getString("assignmentTypeName");
            String assignmentDesc = "";
            if(object.has("assignmentDesc"))
                assignmentDesc = object.getString("assignmentDesc");
            String notifiedCategories = object.getString("notifiedCategories");
            String subjectId = object.getString("subjectId");
            String subjectName = object.getString("subjectName");
            Object subjects = object.get("subjects");
            ArrayList<Subject> subjectArrayList = new ArrayList<>();
            if(subjects instanceof  JSONArray) {
                JSONArray subjectArray = object.getJSONArray("subjects");
                for (int k = 0; k < subjectArray.length(); k++) {
                    JSONObject subjectObject = (JSONObject) subjectArray.get(k);
                    Subject subject = new Subject();
                    String subjectsId = subjectObject.getString("id");
                    String name = subjectObject.getString("name");
                    subject.setSubjectId(subjectsId);
                    subject.setSubName(name);
                    subjectArrayList.add(subject);
                }
            }
            String dueDate = object.getString("dueDate");
            int priority = object.getInt("priority");
            Object attachment = object.get("attachments");
            ArrayList<AttachmentDetails> details = new ArrayList<AttachmentDetails>();
            if(!attachment.toString().equals("null")) {
                JSONArray attachArray = object.getJSONArray("attachments");
                for (int j=0;j<attachArray.length();j++){
                    JSONObject attachObject = attachArray.getJSONObject(j);
                    String imageUrl = attachObject.getString("id");
                    String name = attachObject.getString("name");
                    String fileName = attachObject.getString("fileName");
                    AttachmentDetails attach = new AttachmentDetails();
                    attach.setId(imageUrl);
                    attach.setName(name);
                    attach.setFileName(fileName);
                    details.add(attach);
                }
            }
            String repeatOptionId = object.getString("repeatOptionId");
            String repeatOption = object.getString("repeatOption");
            String updatedBy = object.getString("updatedBy");
            String updatedDate = object.getString("updatedDate");
            String updatedUserName = object.getString("updatedUserName");
            String status = object.getString("status");
            String notifyTo = object.getString("notifyTo");
            Boolean editPermissions = object.getBoolean("editPermissions");

            TeacherHomeWork teacherHomeWork = new TeacherHomeWork();
            if(i == 0 && !key.isEmpty()) {
                if(tag.isEmpty())
                    teacherHomeWork.setTag(key);
                else if(!tag.isEmpty() && !tag.equals(key))
                    teacherHomeWork.setTag(key);
            }
            teacherHomeWork.setId(id);
            teacherHomeWork.setTenantId(tenantId);
            teacherHomeWork.setSchoolId(schoolId);
            teacherHomeWork.setAssignmentName(assignmentName);
            teacherHomeWork.setAssignmentTypeId(assignmentTypeId);
            teacherHomeWork.setAssignmentTypeName(assignmentTypeName);
            teacherHomeWork.setAssignmentDesc(assignmentDesc);
            teacherHomeWork.setSubjectId(subjectId);
            teacherHomeWork.setSubjectName(subjectName);
            teacherHomeWork.setDueDate(dueDate);
            teacherHomeWork.setPriority(priority);
            teacherHomeWork.setUpdatedBy(updatedBy);
            teacherHomeWork.setUpdatedDate(updatedDate);
            teacherHomeWork.setUpdatedUserName(updatedUserName);
            teacherHomeWork.setStatus(status);
            teacherHomeWork.setAcademicYear(academicYear);
            teacherHomeWork.setNotifiedCategories(notifiedCategories);
            teacherHomeWork.setRepeatOptionId(repeatOptionId);
            teacherHomeWork.setRepeatOption(repeatOption);
            teacherHomeWork.setEditPermissions(editPermissions);
            teacherHomeWork.setNotifyTo(notifyTo);
            teacherHomeWork.setAttachments(details);
            teacherHomeWork.setSubjects(subjectArrayList);
            teacherData.add(teacherHomeWork);
        }
        return teacherData;
    }
}
