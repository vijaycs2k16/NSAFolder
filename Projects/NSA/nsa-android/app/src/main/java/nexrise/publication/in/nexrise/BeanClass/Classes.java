package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;
import java.util.ArrayList;

/**
 * Created by Sai Deepak on 04-Oct-16.
 */

public class Classes implements Serializable {

    private String id;
    private String label;
    private ArrayList<Classes> sections;
    private String classId;
    private String className;
    private String sectionId;
    private String sectionName;
    private String parentId;
    private String categoryId;

    public Classes(String id, String label, ArrayList<Classes> sections) {
        this.id = id;
        this.label = label;
        this.sections = sections;
    }
    public Classes() {

    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public ArrayList<Classes> getSections() {
        return sections;
    }

    public void setSections(ArrayList<Classes> sections) {
        this.sections = sections;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public String getSectionId() {
        return sectionId;
    }

    public void setSectionId(String sectionId) {
        this.sectionId = sectionId;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}
