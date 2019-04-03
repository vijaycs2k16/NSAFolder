package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.EventObject;

/**
 * Created by Sai Deepak on 08-Oct-16.
 */

public class EventJsonParser {

    public List<EventObject> getEventList(String classJson){
        JSONObject jsonObject = null;
        if(classJson!= null){
            try {
                jsonObject = new JSONObject(classJson);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return getEventList(jsonObject);
    }

    private List<EventObject> getEventList(JSONObject jsonObject) {

        List<EventObject> eventObjects = new ArrayList<EventObject>();

        JSONArray eventList = null;
        try {
            eventList = jsonObject.getJSONArray("eventList");
            for(int i=0; i < eventList.length(); i++) {
                JSONObject eventJsonObject = eventList.getJSONObject(i);
                String eventName = eventJsonObject.getString("eventName");
                String date = eventJsonObject.getString("date");
                String month = eventJsonObject.getString("month");
                String place = eventJsonObject.getString("place");

                EventObject eventObject = new EventObject(eventName, date, month, place);
                eventObjects.add(eventObject);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }

        return eventObjects;
    }
}
