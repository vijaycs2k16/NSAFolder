package nexrise.publication.in.nexrise;

import android.content.Context;
import android.support.v4.app.Fragment;

import java.util.LinkedHashMap;

import nexrise.publication.in.nexrise.BeanClass.Icons;
import nexrise.publication.in.nexrise.Dashboard.DashboardFragment;
import nexrise.publication.in.nexrise.EventsFeature.EventsFeatureFragment;
import nexrise.publication.in.nexrise.ExamFeature.ExamFragment;
import nexrise.publication.in.nexrise.Fragments.AttendenceFragment;
import nexrise.publication.in.nexrise.Fragments.FeeManagementEmployeeFragment;
import nexrise.publication.in.nexrise.Fragments.FeeManagementParentFragment;
import nexrise.publication.in.nexrise.Fragments.GalleryViewFragment;
import nexrise.publication.in.nexrise.Fragments.JournalFragment;
import nexrise.publication.in.nexrise.Fragments.ParentAttendanceFragment;
import nexrise.publication.in.nexrise.Fragments.ParentTransportFragment;
import nexrise.publication.in.nexrise.Fragments.ProgressReportFragment;
import nexrise.publication.in.nexrise.Fragments.TeacherTransportFragment;
import nexrise.publication.in.nexrise.HallOfFame.HallOfFameFragment;
import nexrise.publication.in.nexrise.HomeworkFeature.HomeWorkFragment;
import nexrise.publication.in.nexrise.ParentFeatures.HomeworkFeature.ParentHomeworkFragment;
import nexrise.publication.in.nexrise.ParentFeatures.TimeTableFeature.ParentTimeTable;
import nexrise.publication.in.nexrise.TimetableFeature.TimeTableFragment;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 4/17/2017.
 */

public class Config implements Constants {

    public static LinkedHashMap<String, Icons> featureBasedIcons;

    public LinkedHashMap<String, Icons> getFeatureBasedIcons() {

        featureBasedIcons = new LinkedHashMap<String, Icons>();
        Icons dashboard;
        if(ACCESS_ID.equals(BHASHYAM_ACCESS_ID))
            dashboard = new Icons(R.drawable.ic_menu_home,"Bhashyam Blooms",R.drawable.ic_menu_home_selected,"1");
        else
            dashboard = new Icons(R.drawable.ic_menu_home,"Dashboard",R.drawable.ic_menu_home_selected,"1");

        Icons calendar = new Icons(R.drawable.ic_calendar_line, "Calendar", R.drawable.ic_calendar_solid, CALENDAR_FEATURE);
        Icons assignment = new Icons(R.drawable.ic_assignment_menu, "Homework", R.drawable.ic_assignment_menu_selected,CREATE_ASSIGNMENT);
        Icons timetable = new Icons(R.drawable.ic_timetable_menu, "Timetable",R.drawable.ic_timetable_menu_selected,CREATE_TIMETABLE);
        Icons events = new Icons(R.drawable.ic_events_menu, "Activities",R.drawable.ic_events_menu_selected,CREATE_EVENT);
        Icons drawer = new Icons(R.drawable.ic_more_menu, "More", R.drawable.ic_more_menu_selected,"2");
        Icons attendance = new Icons(R.drawable.ic_attendance_line, "Attendance ", R.drawable.ic_attendance_solid, CREATE_ATTENDANCE);
        Icons feeManagement = new Icons(R.drawable.ic_fee_line, "Fee Management", R.drawable.ic_fee_solid, CREATE_FEE_MANAGEMENT);
        Icons progressCard = new Icons(R.drawable.ic_progress_card, "ProgressCard", R.drawable.ic_progress_card,"3");
        Icons transport = new Icons(R.drawable.ic_bus, "Transport",R.drawable.ic_bus_selected, VEHICLE_TRACKING);
        Icons journals = new Icons(R.drawable.ic_notepad, "Journals",R.drawable.ic_notepad, CREATE_JOURNAL);
        Icons photoGallery = new Icons(R.drawable.ic_gallery_line, "Photo Gallery", R.drawable.ic_gallery_solid,"6");
        Icons exam = new Icons(R.drawable.ic_exam1, "Examinations", R.drawable.ic_exam_solid1, CREATE_EXAM);
        Icons hallOfFame = new Icons(R.drawable.ic_hall_of_fame, "Hall of Fame", R.drawable.ic_hall_of_fame, HALL_OF_FAME_FEATURE_ID);
        Icons voiceMms = new Icons(R.drawable.ic_voice_line, "Voice MMS", R.drawable.ic_voice_solid, VOICE_MMS_ID);

        featureBasedIcons.put(DASHBOARD_FEATURE,dashboard);
        featureBasedIcons.put(CALENDAR_FEATURE, calendar);
        featureBasedIcons.put(ASSIGNMENT_FEATURE, assignment);
        featureBasedIcons.put(TIMETABLE_FEATURE, timetable);
        featureBasedIcons.put(EVENTS_FEATURE, events);
        featureBasedIcons.put(DRAWER_FRAGMENT,drawer);
        featureBasedIcons.put(ATTENDANCE_FEATURE, attendance);
        featureBasedIcons.put(FEE_MANAGEMENT_FEATURE, feeManagement);
        featureBasedIcons.put(PROGRESS_CARD_FEATURE, progressCard);
        featureBasedIcons.put(TRANSPORT_FEATURE, transport);
        featureBasedIcons.put(JOURNALS_FEATURE, journals);
        featureBasedIcons.put(PHOTO_GALLERY_FEATURE, photoGallery);
        featureBasedIcons.put(EXAM_FEATURE, exam);
        featureBasedIcons.put(HALL_OF_FAME_FEATURE_ID, hallOfFame);
        featureBasedIcons.put(VOICE_MMS_ID,voiceMms);

        return featureBasedIcons;
    }

    LinkedHashMap<String,Fragment> setFragmentList(Context context) {
        String userRole = new StringUtils().getUserRole(context);
        LinkedHashMap<String,Fragment> fragmentList = new LinkedHashMap<String, Fragment>();
        try {
            if (userRole.equalsIgnoreCase(EMPLOYEE)) {
                fragmentList.put(DASHBOARD_FEATURE, new DashboardFragment());
                fragmentList.put(CALENDAR_FEATURE, new OverviewFragment());
                fragmentList.put(ASSIGNMENT_FEATURE, new HomeWorkFragment());
                fragmentList.put(TIMETABLE_FEATURE, new TimeTableFragment());
                fragmentList.put(EVENTS_FEATURE, new EventsFeatureFragment());
                fragmentList.put(ATTENDANCE_FEATURE, new AttendenceFragment());
                fragmentList.put(FEE_MANAGEMENT_FEATURE, new FeeManagementEmployeeFragment());
                fragmentList.put(PROGRESS_CARD_FEATURE, new ProgressReportFragment());
                fragmentList.put(JOURNALS_FEATURE, new JournalFragment());
                fragmentList.put(TRANSPORT_FEATURE, new TeacherTransportFragment());
                fragmentList.put(PHOTO_GALLERY_FEATURE, new GalleryViewFragment());
                fragmentList.put(EXAM_FEATURE, new ExamFragment());
                fragmentList.put(HALL_OF_FAME_FEATURE_ID, new HallOfFameFragment());
                fragmentList.put(VOICE_MMS_ID, new HallOfFameFragment());
            } else {
                fragmentList.put(DASHBOARD_FEATURE, new DashboardFragment());
                fragmentList.put(CALENDAR_FEATURE, new OverviewFragment());
                fragmentList.put(ASSIGNMENT_FEATURE, new ParentHomeworkFragment());
                fragmentList.put(TIMETABLE_FEATURE, new ParentTimeTable());
                fragmentList.put(EVENTS_FEATURE, new EventsFeatureFragment());
                fragmentList.put(ATTENDANCE_FEATURE, new ParentAttendanceFragment());
                fragmentList.put(FEE_MANAGEMENT_FEATURE, new FeeManagementParentFragment());
                fragmentList.put(PROGRESS_CARD_FEATURE, new ProgressReportFragment());
                fragmentList.put(JOURNALS_FEATURE, new JournalFragment());
                fragmentList.put(TRANSPORT_FEATURE, new ParentTransportFragment());
                fragmentList.put(PHOTO_GALLERY_FEATURE, new GalleryViewFragment());
                fragmentList.put(EXAM_FEATURE, new ExamFragment());
                fragmentList.put(HALL_OF_FAME_FEATURE_ID, new HallOfFameFragment());
                fragmentList.put(VOICE_MMS_ID, new HallOfFameFragment());
            }
        } catch(NullPointerException e) {
            e.getMessage();
        }
        return  fragmentList;
    }
}
