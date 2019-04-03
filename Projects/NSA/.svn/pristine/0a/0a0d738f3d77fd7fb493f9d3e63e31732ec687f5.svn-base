package nexrise.publication.in.nexrise.JsonParser;

import android.util.Log;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.FeatureConfiguration;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by senthil on 18-May-17.
 */

public class FeatureConfigurationParser implements Constants{
    public ArrayList<FeatureConfiguration> configJsonParser(String response) throws JSONException, NullPointerException {
        ArrayList<FeatureConfiguration> featureList =new ArrayList<FeatureConfiguration>();
        JSONObject configJson = new JSONObject(response);
        JSONArray features = configJson.getJSONArray(DATA);
        for (int i=0;i<features.length();i++){
            JSONObject object = features.getJSONObject(i);
            String featureId = object.getString("featureId");
            String featureName = object.getString("featureName");
            String mobilePriority = object.getString("mobilePriority");
            boolean enabled = object.getBoolean("status");
            String assetUrl = object.getString("assetUrl");
            FeatureConfiguration feature = new FeatureConfiguration();
            feature.setFeatureId(featureId);
            feature.setFeatureName(featureName);
            feature.setStatus(enabled);
            feature.setAssetUrl(assetUrl);
            featureList.add(feature);
        }
        Log.v("size","size"+ features.length());
        return featureList;
    }
}
