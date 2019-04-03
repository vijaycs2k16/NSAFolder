package nexrise.publication.in.nexrise.BeanClass;

import java.io.Serializable;

/**
 * Created by vignesh on 18-04-2017.
 */

public class Feature implements Serializable {
    private String featureId;
    private String featureName;
    private String featureDesc;
    private Boolean enabled;
    private String assetUrl;
    private String assetBaseUrl;
    private String videoBaseUrl;

    public String getFeatureId() {
        return featureId;
    }

    public void setFeatureId(String featureId) {
        this.featureId = featureId;
    }

    public String getFeatureName() {
        return featureName;
    }

    public void setFeatureName(String featureName) {
        this.featureName = featureName;
    }

    public String getFeatureDesc() {
        return featureDesc;
    }

    public void setFeatureDesc(String featureDesc) {
        this.featureDesc = featureDesc;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public String getAssetUrl() {
        return assetUrl;
    }

    public void setAssetUrl(String assetUrl) {
        this.assetUrl = assetUrl;
    }

    public String getAssetBaseUrl() {
        return assetBaseUrl;
    }

    public void setAssetBaseUrl(String assetBaseUrl) {
        this.assetBaseUrl = assetBaseUrl;
    }

    public String getVideoBaseUrl() {
        return videoBaseUrl;
    }

    public void setVideoBaseUrl(String videoBaseUrl) {
        this.videoBaseUrl = videoBaseUrl;
    }
}
