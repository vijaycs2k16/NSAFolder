package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Classes;

/**
 * Created by praga on 13-Mar-17.
 */

public class  TaxanomyJsonParser {
    public ArrayList<Classes> classlist = new ArrayList<Classes>();

    public ArrayList<Classes> getClassDetails(JSONArray classesArray)throws JSONException{

        for (int i=0;i<classesArray.length();i++){
            JSONObject classesObject = classesArray.getJSONObject(i);
            String classeslabel = classesObject.getString("label");
            if (classeslabel.equalsIgnoreCase("All Classes")) {
                JSONArray classArray = classesObject.getJSONArray("children");
                for (int k=0;k<classArray.length();k++) {
                    JSONObject classObject = classArray.getJSONObject(k);
                    String classid = classObject.getString("id");
                    String classlabel = classObject.getString("label");
                    JSONArray sectionArray = classObject.getJSONArray("children");
                    ArrayList<Classes> sectionlist = new ArrayList<>();
                    for (int j = 0; j < sectionArray.length(); j++) {
                        JSONObject sectionObject = sectionArray.getJSONObject(j);
                        String sectionlabel = sectionObject.getString("label");
                        String sectionid = sectionObject.getString("id");
                        Classes sections = new Classes();
                        sections.setId(sectionid);
                        sections.setLabel(sectionlabel);
                        sectionlist.add(sections);
                    }
                    Classes classes = new Classes();
                    classes.setId(classid);
                    classes.setLabel(classlabel);
                    classes.setSections(sectionlist);
                    classlist.add(classes);
                }
            }
        }
        return classlist;
    }
}
