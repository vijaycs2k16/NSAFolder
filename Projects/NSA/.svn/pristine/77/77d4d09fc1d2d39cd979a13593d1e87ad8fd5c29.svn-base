package nexrise.publication.in.nexrise.Attendence;


import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.ReusedActivities.DueDateActivity;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

import static android.app.Activity.RESULT_OK;

/**
 * A simple {@link Fragment} subclass.
 */
public class OverallAttendanceFragment extends Fragment implements Constants {
    String dueDates = "";
    String setDate = "";
    TextView from;
    TextView to;
    String classId;
    String sectionId;
    String className;
    String sectionName;
    String fromDate;
    String toDate;
    View view;
    StringUtils stringUtils;
    Toast toast;

    public OverallAttendanceFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(final LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        Calendar calendar = Calendar.getInstance();
        SimpleDateFormat dateFormat = new SimpleDateFormat("MMMdd,yyyy");
        dueDates = dateFormat.format(calendar.getTime());
        SimpleDateFormat dateFormat1 = new SimpleDateFormat("MMMdd,yyyy");
        fromDate = dateFormat1.format(calendar.getTime());
        toDate = dateFormat1.format(calendar.getTime());
        Bundle arguments = getArguments();
        classId = arguments.getString("classId");
        sectionId = arguments.getString("sectionId");
        className = arguments.getString("className");
        sectionName = arguments.getString("sectionName");
        stringUtils = StringUtils.getInstance();

        view = inflater.inflate(R.layout.fragment_overall_attendance, container, false);
        final LinearLayout layout = (LinearLayout) view.findViewById(R.id.present_layout);
        layout.setVisibility(LinearLayout.GONE);
        final LinearLayout mlayout = (LinearLayout) view.findViewById(R.id.absent_layout);
        mlayout.setVisibility(LinearLayout.GONE);
        final LinearLayout fromLayout = (LinearLayout) view.findViewById(R.id.fromclick);
        final LinearLayout toLayout = (LinearLayout) view.findViewById(R.id.toclick);
        final ImageButton fromDateButton = (ImageButton) view.findViewById(R.id.fromdatebutton);
        final ImageButton toDateButton = (ImageButton) view.findViewById(R.id.todatebutton);
        final LinearLayout percentLayout = (LinearLayout) view.findViewById(R.id.percentlayout);

        from = (TextView) view.findViewById(R.id.fromdatetext);
        from.setText(stringUtils.DateFormat1(fromDate));
        to = (TextView) view.findViewById(R.id.todatetext);
        to.setText(stringUtils.DateFormat1(toDate));

        Button submit = (Button) view.findViewById(R.id.attendance_submit_button);

        fromLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), DueDateActivity.class);
                intent.putExtra(FUTURE_DATE_FREEZE,true);
                intent.putExtra("Date","From Date");
                startActivityForResult(intent, 2);
            }
        });
        fromDateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), DueDateActivity.class);
                intent.putExtra(FUTURE_DATE_FREEZE,true);
                intent.putExtra("Date","From Date");
                startActivityForResult(intent, 2);

            }
        });

        toLayout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), DueDateActivity.class);
                intent.putExtra(FUTURE_DATE_FREEZE,true);
                intent.putExtra("Date","To Date");
                startActivityForResult(intent, 3);
            }
        });
        toDateButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(getActivity(), DueDateActivity.class);
                intent.putExtra(FUTURE_DATE_FREEZE,true);
                intent.putExtra("Date","To Date");
                startActivityForResult(intent, 3);
            }
        });


        submit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if((layout.getVisibility() == View.VISIBLE) || (mlayout.getVisibility() == View.VISIBLE)){
                    percentLayout.setVisibility(View.GONE);
                }

                Date fromDate = new StringUtils().dateCompare1(from.getText().toString());
                Date todate = new StringUtils().dateCompare1(to.getText().toString());
                Log.v("From date"," "+fromDate);
                Log.v("To date"," "+todate);
                SimpleDateFormat dateFormat1 = new SimpleDateFormat("MMMM dd, yyyy");
                String fromDateValue = dateFormat1.format(fromDate);
                fromDateValue = fromDateValue.replaceAll(" ","%20");
                String toDateValue = dateFormat1.format(todate);
                toDateValue = toDateValue.replaceAll(" ","%20");
                if (todate.after(fromDate) || (fromDate.equals(todate))) {
                    String overallAttendaceUrl = BASE_URL + API_VERSION_ONE + ATTENDANCE + HISTORY + OVERVIEW + "?classId=" + classId + "&sectionId=" + sectionId + "&startDate=" + fromDateValue + "&endDate=" + toDateValue;
                    Log.v( "overall ","" + overallAttendaceUrl);
                    GETUrlConnection overallStaus = new GETUrlConnection(getActivity(), overallAttendaceUrl, null) {

                        @Override
                        protected void onPostExecute(String response) {
                            super.onPostExecute(response);
                            Log.v("Response", "overall" + response);
                            try {
                                new StringUtils().checkSession(response);
                                parse(response);
                                percentLayout.setVisibility(View.VISIBLE);
                                layout.setVisibility(View.VISIBLE);
                                mlayout.setVisibility(View.VISIBLE);
                            } catch (JSONException | NullPointerException e) {
                                showToast((String) getResources().getText(R.string.no_attendence_recorded));
                            } catch (SessionExpiredException e) {
                                e.handleException(getActivity());
                            }
                        }
                    };
                    overallStaus.execute();
                } else {
                    showToast((String) getResources().getText(R.string.select_valid_date));
                }

            }
        });

        return view;
    }

    public void parse(String response) throws JSONException,NullPointerException{
        JSONObject jsonObject = new JSONObject(response);
        JSONObject dataObject = jsonObject.getJSONObject(DATA);
        JSONObject attendanceHistoryOverview = dataObject.getJSONObject("attendanceHistoryOverview");
        String avgPrecentPercent = attendanceHistoryOverview.getString("avgPrecentPercent");
        String avgAbsentPercent = attendanceHistoryOverview.getString("avgAbsentPercent");
        String workingDays = attendanceHistoryOverview.getString("workingDays");
        String leaveDays = attendanceHistoryOverview.getString("leaveDays");
        final TextView present = (TextView) view.findViewById(R.id.students_present);
        final TextView absent = (TextView) view.findViewById(R.id.students_absent);
        present.setText(avgPrecentPercent);
        absent.setText(avgAbsentPercent);
    }

    /**
     * This interface must be implemented by activities that contain this
     * fragment to allow an interaction in this fragment to be communicated
     * to the activity and potentially other fragments contained in that
     * activity.
     * <p>
     * See the Android Training lesson <a href=
     * "http://developer.android.com/training/basics/fragments/communicating.html"
     * >Communicating with Other Fragments</a> for more information.
     */
    public interface OnFragmentInteractionListener {
        // TODO: Update argument type and name
        void onFragmentInteraction(Uri uri);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if ((requestCode == 2 ||  requestCode == 4 ) && resultCode == RESULT_OK ){
            fromDate = data.getStringExtra("SelectedDate");
            from.setText(stringUtils.DateFormat1(fromDate));
        }

        if ((requestCode == 3 || requestCode == 5) && resultCode == RESULT_OK) {
            toDate = data.getStringExtra("SelectedDate");
            to.setText(stringUtils.DateFormat1(toDate));
        }
    }

    public void showToast(String message) {
        try {
            if (toast!= null)
                toast.cancel();
            toast = Toast.makeText(getActivity(), message, Toast.LENGTH_SHORT);
            toast.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onPause() {
        super.onPause();
        if (toast!= null)
            toast.cancel();
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (toast!= null)
            toast.cancel();
    }
}