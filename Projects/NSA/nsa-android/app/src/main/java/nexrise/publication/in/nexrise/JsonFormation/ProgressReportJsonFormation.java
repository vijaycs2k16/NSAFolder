package nexrise.publication.in.nexrise.JsonFormation;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by karthik on 17-10-2016.
 */

public class ProgressReportJsonFormation {

    public JSONObject formJson(){
        JSONObject mainObject = new JSONObject();
        JSONObject classSection = new JSONObject();
        JSONArray students = new JSONArray();

        JSONObject insideStudents = new JSONObject();
        JSONObject insideStudents1 = new JSONObject();
        JSONObject insideStudents2 = new JSONObject();
        JSONObject insideStudents3 = new JSONObject();

        JSONObject classSection1 = new JSONObject();
        JSONArray students1 = new JSONArray();
        JSONObject insideStudents4 = new JSONObject();
        JSONObject insideStudents5 = new JSONObject();
        JSONObject insideStudents6 = new JSONObject();
        JSONObject insideStudents7 = new JSONObject();

        JSONObject classSection2 = new JSONObject();
        JSONArray students2 = new JSONArray();
        JSONObject insideStudents8 = new JSONObject();
        JSONObject insideStudents9 = new JSONObject();
        JSONObject insideStudents10 = new JSONObject();
        JSONObject insideStudents11= new JSONObject();

        JSONArray upcomingEvents = new JSONArray();
        JSONObject upcomingEvents1 = new JSONObject();
        JSONObject upcomingEvents2 = new JSONObject();

        try {
            insideStudents.put("Name","Akshay.v");
            insideStudents.put("Id",654);
            insideStudents.put("English","A1");
            insideStudents.put("Tamil","B1");
            insideStudents.put("Maths","C1");
            insideStudents.put("Science","A1");
            insideStudents.put("Social","B2");
            insideStudents.put("Overall grade","B1");

            insideStudents1.put("Name","Benny.T");
            insideStudents1.put("Id",655);
            insideStudents1.put("English","A2");
            insideStudents1.put("Tamil","B2");
            insideStudents1.put("Maths","C2");
            insideStudents1.put("Science","A2");
            insideStudents1.put("Social","B2");
            insideStudents1.put("Overall grade","A2");

            insideStudents2.put("Name","Deepika.A");
            insideStudents2.put("Id",656);
            insideStudents2.put("English","B1");
            insideStudents2.put("Tamil","A1");
            insideStudents2.put("Maths","B1");
            insideStudents2.put("Science","A1");
            insideStudents2.put("Social","A2");
            insideStudents2.put("Overall grade","E");

            insideStudents3.put("Name","Elango.K");
            insideStudents3.put("Id",657);
            insideStudents3.put("English","A1");
            insideStudents3.put("Tamil","A2");
            insideStudents3.put("Maths","B1");
            insideStudents3.put("Science","A1");
            insideStudents3.put("Social","A2");
            insideStudents3.put("Overall grade","D");

            students.put(0, insideStudents);
            students.put(1, insideStudents1);
            students.put(2, insideStudents2);
            students.put(3, insideStudents3);

            classSection.put("Class","10");
            classSection.put("Section","A");
            classSection.put("Tag","Completed exams");
            classSection.put("Overall pass percentage","70%");
            classSection.put("Duration","Oct 1st - 20th");
            classSection.putOpt("Students",students);


            insideStudents4.put("Name","Akshay.v");
            insideStudents4.put("Id",654);
            insideStudents4.put("English","C2");
            insideStudents4.put("Tamil","C1");
            insideStudents4.put("Maths","A1");
            insideStudents4.put("Science","B2");
            insideStudents4.put("Social","B1");
            insideStudents4.put("Overall grade","C1");

            insideStudents5.put("Name","Benny.T");
            insideStudents5.put("Id",655);
            insideStudents5.put("English","A2");
            insideStudents5.put("Tamil","B2");
            insideStudents5.put("Maths","C2");
            insideStudents5.put("Science","B1");
            insideStudents5.put("Social","A2");
            insideStudents5.put("Overall grade","B1");

            insideStudents6.put("Name","Deepika.A");
            insideStudents6.put("Id",656);
            insideStudents6.put("English","A2");
            insideStudents6.put("Tamil","B2");
            insideStudents6.put("Maths","C1");
            insideStudents6.put("Science","A1");
            insideStudents6.put("Social","B2");
            insideStudents6.put("Overall grade","A2");

            insideStudents7.put("Name","Elango.K");
            insideStudents7.put("Id",657);
            insideStudents7.put("English","B1");
            insideStudents7.put("Tamil","B1");
            insideStudents7.put("Maths","C1");
            insideStudents7.put("Science","B1");
            insideStudents7.put("Social","A1");
            insideStudents7.put("Overall grade","B1");

            students1.put(0, insideStudents4);
            students1.put(1, insideStudents5);
            students1.put(2, insideStudents6);
            students1.put(3, insideStudents7);

            classSection1.put("Class","10");
            classSection1.put("Section","A");
            classSection1.put("Tag","Completed exams");
            classSection1.put("Overall pass percentage","75%");
            classSection1.put("Duration","Oct 15th - 30th");
            classSection1.putOpt("Students",students1);

            insideStudents8.put("Name","Akshay.v");
            insideStudents8.put("Id",654);
            insideStudents8.put("English","A2");
            insideStudents8.put("Tamil","B1");
            insideStudents8.put("Maths","B1");
            insideStudents8.put("Science","A2");
            insideStudents8.put("Social","C2");
            insideStudents8.put("Overall grade","B2");

            insideStudents9.put("Name","Benny.T");
            insideStudents9.put("Id",655);
            insideStudents9.put("English","B2");
            insideStudents9.put("Tamil","C1");
            insideStudents9.put("Maths","A2");
            insideStudents9.put("Science","C2");
            insideStudents9.put("Social","B1");
            insideStudents9.put("Overall grade","C2");

            insideStudents10.put("Name","Deepika.A");
            insideStudents10.put("Id",656);
            insideStudents10.put("English","B1");
            insideStudents10.put("Tamil","A1");
            insideStudents10.put("Maths","B2");
            insideStudents10.put("Science","A1");
            insideStudents10.put("Social","C1");
            insideStudents10.put("Overall grade","B1");

            insideStudents11.put("Name","Elango.K");
            insideStudents11.put("Id",657);
            insideStudents11.put("English","A2");
            insideStudents11.put("Tamil","C2");
            insideStudents11.put("Maths","A2");
            insideStudents11.put("Science","B2");
            insideStudents11.put("Social","C2");
            insideStudents11.put("Overall grade","C2");

            students2.put(0, insideStudents8);
            students2.put(1, insideStudents9);
            students2.put(2, insideStudents10);
            students2.put(3, insideStudents11);

            classSection2.put("Class","10");
            classSection2.put("Section","A");
            classSection2.put("Tag","Completed exams");
            classSection2.put("Overall pass percentage","67%");
            classSection2.put("Duration","Nov 1st - 15th");
            classSection2.putOpt("Students",students2);

            upcomingEvents1.put("Name","Summative assessment 2");
            upcomingEvents1.put("Duration","Nov 20th - 30th");
            upcomingEvents1.put("Tag","Upcoming exams");

            upcomingEvents2.put("Name","Cummulative assessment 1");
            upcomingEvents2.put("Duration","Dec 1st - 20th");
            upcomingEvents2.put("Tag","Upcoming exams");

            upcomingEvents.put(0, upcomingEvents1);
            upcomingEvents.put(1, upcomingEvents2);

            mainObject.putOpt("Formative assessment 1", classSection);
            mainObject.putOpt("Formative assessment 2", classSection1);
            mainObject.putOpt("Summative assessment 1", classSection2);
            mainObject.putOpt("Upcoming events",upcomingEvents);

        } catch (JSONException e) {
            e.printStackTrace();
        }

        return mainObject;
    }
}
