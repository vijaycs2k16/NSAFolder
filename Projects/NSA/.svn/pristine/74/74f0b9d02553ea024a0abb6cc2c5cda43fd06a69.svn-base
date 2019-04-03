package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;

import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.Constants;

/**
 * Created by Sai Deepak on 14-Oct-16.
 */

public class NotificationJsonParser implements Constants{

    public ArrayList<Notify> getAllNotifications(String jsonString)  throws JSONException{
        ArrayList<Notify> notificationList = new ArrayList<Notify>();

        JSONObject jsonObject = new JSONObject(jsonString);
        JSONArray jsonArray = jsonObject.getJSONArray(DATA);
        if(jsonArray.length() != 0) {
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONObject finalobj = jsonArray.getJSONObject(i);
                String notificationId = finalobj.getString("notification_id");
                String id = finalobj.getString("id");
                String username = finalobj.getString("user_name");
                String academic_year = finalobj.getString("academic_year");
                String updatedDate = finalobj.getString("updated_date");
                String pushTemplateMessage = " ";
                if (finalobj.has("push_template_message"))
                    pushTemplateMessage = finalobj.getString("push_template_message");
                if(finalobj.has("feature_id")) {
                    String featureId = finalobj.getString("feature_id");
                    if(featureId.equals(VOICE_MMS_ID))
                        continue;
                }
                String status = finalobj.getString("status");
                String sentby = finalobj.getString("updated_by");
                String media = finalobj.get("media_name").toString();
                JSONArray mediaName;
                if(media != null && !media.equalsIgnoreCase("null")) {
                    mediaName = finalobj.getJSONArray("media_name");
                } else {
                    mediaName = new JSONArray();
                }
                String updatedUsername = finalobj.getString("updated_username");
                String pushTemplateTitle = " ";
                if (finalobj.has("push_template_title"))
                    pushTemplateTitle = finalobj.getString("push_template_title");
                String title = finalobj.getString("title");
                String priority = finalobj.getString("priority");

                Notify notify = new Notify(notificationId, id, username, academic_year, updatedDate, pushTemplateMessage, status, sentby, pushTemplateTitle, title, priority, null, null, null, updatedUsername,null);

                if(finalobj.has("attachments")) {
                    JSONArray attachmentsAry = finalobj.getJSONArray("attachments");
                    HashMap<String, String> files = new HashMap<>();
                    for (int j=0; j<attachmentsAry.length(); j++) {
                        JSONObject attachmentObj = attachmentsAry.getJSONObject(j);
                        files.put(attachmentObj.getString("id"), attachmentObj.getString("name"));
                        notify.setAttachments(files);
                    }
                }
                notificationList.add(notify);
            }
        } else {
            throw new JSONException("Empty json");
        }
        return notificationList;
    }
}
