package nexrise.publication.in.nexrise.JsonParser;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.ProgressReport;

/**
 * Created by karthik on 17-10-2016.
 */

public class ProgressReportJsonParser {

    public List<ProgressReport> parse(JSONObject jsonObject){
        List<ProgressReport> progressReportList = new ArrayList<ProgressReport>();
        try {
            JSONObject fa1 = jsonObject.getJSONObject("Formative assessment 1");
            JSONArray students = fa1.getJSONArray("Students");
            String test = "Formative assessment 1";
            String tag = fa1.getString("Tag");
            String className = fa1.getString("Class");
            String section = fa1.getString("Section");
            String duration = fa1.getString("Duration");
            String passPercent = fa1.getString("Overall pass percentage");
            ProgressReport progressReport = new ProgressReport(tag, className, test, section, duration, passPercent);
            progressReportList.add(progressReport);

            JSONObject fa2 = jsonObject.getJSONObject("Formative assessment 2");
            JSONArray students1 = fa2.getJSONArray("Students");
            String test1 = "Formative assessment 2";
            String tag1 = fa2.getString("Tag");
            String className1 = fa2.getString("Class");
            String section1 = fa2.getString("Section");
            String duration1 = fa2.getString("Duration");
            String passPercent1 = fa2.getString("Overall pass percentage");
            ProgressReport progressReport1 = new ProgressReport(tag1, className1, test1,section1, duration1, passPercent1);
            progressReportList.add(progressReport1);

            JSONObject sa1 = jsonObject.getJSONObject("Summative assessment 1");
            JSONArray students2 = sa1.getJSONArray("Students");
            String test2 = "Summative assessment 1";
            String tag2 = sa1.getString("Tag");
            String className2 = sa1.getString("Class");
            String section2 = sa1.getString("Section");
            String duration2 = sa1.getString("Duration");
            String passPercent2 = sa1.getString("Overall pass percentage");
            ProgressReport progressReport2 = new ProgressReport(tag2, className2, test2,section2, duration2, passPercent2);
            progressReportList.add(progressReport2);

            JSONArray array = jsonObject.getJSONArray("Upcoming events");
            for(int i=0; i<array.length(); i++){
                JSONObject jsonObject1 = array.getJSONObject(i);
                String test3 = jsonObject1.getString("Name");
                String tag3 = jsonObject1.getString("Tag");
                String duration3 = jsonObject1.getString("Duration");
                ProgressReport progressReport3 = new ProgressReport(tag3, null, test3, null, duration3, null);
                progressReportList.add(progressReport3);
            }

        } catch (JSONException e) {
            e.printStackTrace();
        }
        return progressReportList;
    }
}
