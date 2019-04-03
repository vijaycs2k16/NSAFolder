package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;

import nexrise.publication.in.nexrise.BeanClass.AttachmentDetails;
import nexrise.publication.in.nexrise.BeanClass.ParentHomeWork;
import nexrise.publication.in.nexrise.BeanClass.Subject;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by deepak on 8/16/2017.
 */

public class ParentHomeworkParser implements Constants {
    private String tag = "";
    public ArrayList<ParentHomeWork> weekDataParser(String response, ArrayList<ParentHomeWork> existingHomeworkList)throws JSONException, NullPointerException {

        if(existingHomeworkList != null) {
            for (int i=0; i<existingHomeworkList.size(); i++) {
                String dateTag = existingHomeworkList.get(i).getTag();
                if(dateTag != null && !dateTag.equals("null")) {
                    tag = dateTag;
                }
            }
        }
        ArrayList<ParentHomeWork> parentData = new ArrayList<ParentHomeWork>();
        JSONArray dataAry = null;
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
                ArrayList<ParentHomeWork> homeWorkList = parse(dataAry, key);
                parentData.addAll(homeWorkList);
            }
        } else if(data instanceof  JSONArray) {
            dataAry = jsonObject.getJSONArray(DATA);
            ArrayList<ParentHomeWork> homeWorkList = parse(dataAry, key);
            parentData.addAll(homeWorkList);
        }
        return parentData;
    }

    private ArrayList<ParentHomeWork> parse(JSONArray dataAry, String key) throws JSONException, NullPointerException {
        ArrayList<ParentHomeWork> parentData = new ArrayList<ParentHomeWork>();
        for (int i= 0;i<dataAry.length();i++){
            JSONObject object = dataAry.getJSONObject(i);
            String id = object.getString("id");
            String academicYear = object.getString("academicYear");
            String assignmentId = object.getString("assignmentId");
            String assignmentName = object.getString("assignmentName");
            String assignmentTypeId = object.getString("assignmentTypeId");
            String assignmentTypeName = object.getString("assignmentTypeName");
            String assignmentDesc = "";
            if(object.has("assignmentDesc"))
                assignmentDesc = object.getString("assignmentDesc");
            String userName = object.getString("userName");
            String firstName = object.getString("firstName");
            String classId = object.getString("classId");
            String className = object.getString("className");
            String sectionId = object.getString("sectionId");
            String sectionName = object.getString("sectionName");
            String subjectId = object.getString("subjectId");
            String subjectName = object.getString("subjectName");
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
            String updatedBy = object.getString("updatedBy");
            String updatedDate = object.getString("updatedDate");
            String updatedUserName = object.getString("updatedUserName");
            String status = object.getString("status");
            String submittedDate = object.getString("submittedDate");
            String isSubmitted = object.getString("isSubmitted");
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

            String dueDateFormatted = object.getString("dueDateFormatted");
            String createdBy = object.getString("createdBy");
            String createdDate = object.getString("createdDate");
            String createdFirstName = object.getString("createdFirstName");

            ParentHomeWork parentHomework = new ParentHomeWork();

            if(i == 0 && !key.isEmpty()) {
                if(tag.isEmpty())
                    parentHomework.setTag(key);
                else if(!tag.isEmpty() && !tag.equals(key))
                    parentHomework.setTag(key);
            }
            parentHomework.setId(id);
            parentHomework.setAssignmentId(assignmentId);
            parentHomework.setAssignmentName(assignmentName);
            parentHomework.setAssignmentTypeId(assignmentTypeId);
            parentHomework.setAssignmentTypeName(assignmentTypeName);
            parentHomework.setAssignmentDesc(assignmentDesc);
            parentHomework.setUserName(userName);
            parentHomework.setFirstName(firstName);
            parentHomework.setClassId(classId);
            parentHomework.setClassName(className);
            parentHomework.setSectionId(sectionId);
            parentHomework.setSectionName(sectionName);
            parentHomework.setSubjectId(subjectId);
            parentHomework.setSubjectName(subjectName);
            parentHomework.setDueDate(dueDate);
            parentHomework.setPriority(priority);
            parentHomework.setUpdatedBy(updatedBy);
            parentHomework.setUpdatedDate(updatedDate);
            parentHomework.setUpdatedUserName(updatedUserName);
            parentHomework.setStatus(status);
            parentHomework.setSubmittedDate(submittedDate);
            parentHomework.setIsSubmitted(isSubmitted);
            parentHomework.setAttachments(details);
            parentHomework.setSubjectArrayList(subjectArrayList);
            parentData.add(parentHomework);
        }
        return parentData;
    }
}
