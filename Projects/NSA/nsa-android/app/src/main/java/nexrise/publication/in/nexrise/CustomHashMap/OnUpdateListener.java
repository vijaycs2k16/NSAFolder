package nexrise.publication.in.nexrise.CustomHashMap;

/**
 * Created by Karthik on 7/11/17.
 */

public interface OnUpdateListener {

    void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count);
}
