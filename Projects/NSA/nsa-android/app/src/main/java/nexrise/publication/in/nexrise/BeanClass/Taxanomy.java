package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by karthik on 23-02-2017.
 */

public class Taxanomy implements Serializable{
    private String categoryId;
    private String label;
    private Boolean selected;
    private String parentCategoryId;
    private String parentId;
    private String id;

    public Taxanomy(String categoryId, String label, Boolean selected, String parentCategoryId, String parentIdString, String id) {
        this.categoryId = categoryId;
        this.label = label;
        this.selected = selected;
        this.parentCategoryId = parentCategoryId;
        this.parentId = parentId;
        this.id = id;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Boolean getSelected() {
        return selected;
    }

    public void setSelected(Boolean selected) {
        this.selected = selected;
    }

    public String getParentCategoryId() {
        return parentCategoryId;
    }

    public void setParentCategoryId(String parentCategoryId) {
        this.parentCategoryId = parentCategoryId;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
}
