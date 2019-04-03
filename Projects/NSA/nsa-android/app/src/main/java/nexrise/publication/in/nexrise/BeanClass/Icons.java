package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by Karthik on 4/17/2017.
 */

public class Icons implements Serializable {

    private Integer menuIcon;
    private String featureName;
    private Integer menuIconSelected;
    private String subFeatureId;

    public Icons(Integer menuIcon, String featureName, Integer menuIconSelected, String subFeatureId ) {
        this.menuIcon = menuIcon;
        this.featureName = featureName;
        this.menuIconSelected = menuIconSelected;
        this.subFeatureId = subFeatureId;
    }

    public String getSubFeatureId() {
        return subFeatureId;
    }

    public void setSubFeatureId(String subFeatureId) {
        this.subFeatureId = subFeatureId;
    }

    public Integer getMenuIcon() {
        return menuIcon;
    }

    public void setMenuIcon(Integer menuIcon) {
        this.menuIcon = menuIcon;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public Integer getMenuIconSelected() {
        return menuIconSelected;
    }

    public void setMenuIconSelected(Integer menuIconSelected) {
        this.menuIconSelected = menuIconSelected;
    }
}
