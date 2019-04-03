package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Devicetoken;
import nexrise.publication.in.nexrise.BeanClass.Language;
import nexrise.publication.in.nexrise.BeanClass.Student;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by Karthik on 4/28/2017.
 */

public class StudentsParser implements Constants{

    public List<Student> parseStudents(String jsonString) throws JSONException, NullPointerException {
        JSONObject studentsJson = new JSONObject(jsonString);
        JSONArray data = studentsJson.getJSONArray(DATA);
        List<Student> studentList = new ArrayList<>();

        if(data.length() != 0) {
            for (int i = 0; i < data.length(); i++) {
                ArrayList<Language> languages = new ArrayList<>();
                ArrayList<Devicetoken> devicetokens = new ArrayList<>();

                JSONObject studentObject = data.getJSONObject(i);
                Student student = new Student();
                JSONArray classesAry = studentObject.getJSONArray("classes");

                JSONObject classesObj = classesAry.getJSONObject(0);
                student.setClassId(classesObj.getString("class_id"));
                student.setClassName(classesObj.getString("class_name"));
                student.setSectionId(classesObj.getString("section_id"));
                student.setSection(classesObj.getString("section_name"));

                String sectionCode = classesObj.has("section_code") ? classesObj.getString("section_code") : "";
                student.setSection_code(sectionCode);

                String classCode = classesObj.has("class_code") ? classesObj.getString("class_code") : "";
                student.setClassCode(classCode);

                student.setId(studentObject.getString("id"));
                student.setFirstname(studentObject.getString("firstName"));
                student.setUsername(studentObject.getString("userName"));
                student.setTenantId(studentObject.getString("tenantId"));
                student.setSchoolId(studentObject.getString("schoolId"));
                student.setUserType(studentObject.getString("userType"));
                student.setUserCode(studentObject.getString("userCode"));
                student.setPrimaryPhone(studentObject.getString("primaryPhone"));
                student.setAdmissionNo(studentObject.getString("admissionNo"));
                student.setActive(studentObject.getBoolean("active"));
                student.setChecked(false);

                JSONArray languagesObj = studentObject.getJSONArray("languages");

                for (int j=0; j<languagesObj.length(); j++) {
                    Language language = new Language();
                    JSONObject lang = languagesObj.getJSONObject(j);
                    language.setLanguage_id(lang.getString("language_id"));
                    language.setLanguage_name(lang.getString("language_name"));
                    language.setLanguage_type(lang.getString("language_type"));
                    languages.add(language);
                }
                student.setLanguages(languages);
                if(studentObject.has("deviceToken")) {
                    JSONArray deviceTokenAry = studentObject.getJSONArray("deviceToken");
                    for (int k = 0; k < deviceTokenAry.length(); k++) {
                        JSONObject deviceToken = deviceTokenAry.getJSONObject(k);
                        Devicetoken devicetoken = new Devicetoken();
                        devicetoken.setRegistration_id(deviceToken.getString("registration_id"));
                        devicetoken.setEndpoint_arn(deviceToken.getString("endpoint_arn"));
                        devicetokens.add(devicetoken);
                    }
                    student.setDevicetokens(devicetokens);
                    studentList.add(student);
                }
            }
        } else {
            throw new JSONException("Empty json");
        }
        return studentList;
    }
}
