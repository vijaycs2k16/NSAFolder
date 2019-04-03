package nexrise.publication.in.nexrise.Notifications;


import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.design.widget.FloatingActionButton;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.michael.easydialog.EasyDialog;

import org.json.JSONException;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Notify;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.JsonParser.NotificationJsonParser;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;


/**
 * A simple {@link Fragment} subclass.
 */
public class NotificationLogFragment extends Fragment implements Constants {
    ListView listView;
    ArrayList<Notify> notifies;
    ArrayList<Notify> allNotifications = new ArrayList<>();
    Boolean clicked = false;
    View view;
    //This method has been overriden to change the font

    public NotificationLogFragment() {
        // Required empty public constructor
    }
    @Override
    public View onCreateView(LayoutInflater inflater, final ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        view = inflater.inflate(R.layout.notification_log, container, false);
        listView = (ListView) view.findViewById(R.id.notify);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(getActivity());
        String id = preferences.getString(CURRENT_USER_ID, null);

        String NotificationCredential = BASE_URL + API_VERSION_ONE + NOTIFICATION + LOG + id ;
        GETUrlConnection GETUrlConnection = new GETUrlConnection(getActivity(), NotificationCredential,null) {
            ProgressBar progressBar = (ProgressBar)view.findViewById(R.id.notification_loading);
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.GONE);
                Log.v("Notifyresponse",""+ response);
                try {
                    NotificationJsonParser parser = new NotificationJsonParser();
                    allNotifications = parser.getAllNotifications(response);
                    NotificationArrayAdapter adapter = new NotificationArrayAdapter(getActivity(), allNotifications, false);
                    listView.setAdapter(adapter);
                } catch (JSONException | NullPointerException e) {
                    TextView emptyListview = (TextView)view.findViewById(R.id.no_content);
                    emptyListview.setVisibility(View.VISIBLE);
                    e.printStackTrace();
                }
            }
        };
        GETUrlConnection.execute();

        // notifies = (ArrayList<Notify>) bundle.getSerializable("Notification");
        Log.v("Noti",""+notifies);
        final FloatingActionButton createNotification = (FloatingActionButton) view.findViewById(R.id.create_notification);
        final FloatingActionButton moreOptions = (FloatingActionButton)view.findViewById(R.id.fab_more_oprions);
        final FloatingActionButton myNotification = (FloatingActionButton)view.findViewById(R.id.my_notification);
        LinearLayout moreOptionsLayout = (LinearLayout)view.findViewById(R.id.more_options);
        final LinearLayout createNotificationLayout = (LinearLayout)view.findViewById(R.id.create_notification_with_text);
        final LinearLayout myNotificationLayout = (LinearLayout)view.findViewById(R.id.my_notification_with_text);
        final RelativeLayout whiteback = (RelativeLayout)view.findViewById(R.id.whiteback);
        final RelativeLayout headback = (RelativeLayout)view.findViewById(R.id.headingblack);

        //If the user is not employee then he will not have permission to create notification so we are simply hiding the FloatingActionButton
        if(!StringUtils.userRole.equalsIgnoreCase(EMPLOYEE)) {
            moreOptionsLayout.setVisibility(View.INVISIBLE);
        }
        moreOptions.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                floatingActionButtonClick(createNotification, myNotification, createNotificationLayout, myNotificationLayout,whiteback,headback);
            }
        });

        listviewClick(listView);
        customTooltip();
        return  view;
    }

    @Override
    public void onResume() {
        super.onResume();
    }
    public void listviewClick(final ListView listView){
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                int pos =  listView.getPositionForView(view);
                Notify notification = (Notify) listView.getItemAtPosition(position);
                String priority = notification.getPriority();
                if(priority.equals("1")) {
                    Intent intent = new Intent(getActivity(), NotificationDetailsActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, notification);
                    intent.putExtra(BUNDLE,bundle);
                    intent.putExtra(FROM_ACTIVITY,"Notify fragment");
                    intent.putExtra(ACTIONBAR_TITLE, "Draft");
                    startActivity(intent);
                }else  if (priority.equals("2")){
                    Intent intent = new Intent(getActivity(), NotificationDetailsActivity.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, notification);
                    intent.putExtra(BUNDLE,bundle);
                    intent.putExtra(FROM_ACTIVITY,"Notify fragment");
                    intent.putExtra(ACTIONBAR_TITLE, "Emergency");
                    startActivity(intent);
                } else {
                    Intent intent = new Intent(getActivity(), CreateNotification.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable("notification", notification);
                    intent.putExtra("bundle", bundle);
                    startActivityForResult(intent, 1);
                }
            }
        });
    }
    public void customTooltip(){

        final ImageView help = (ImageView) view.findViewById(R.id.help);
        if (StringUtils.userRole.equalsIgnoreCase(EMPLOYEE)) {
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                    tooltip.setText("Create important notifications adding to the list of all notifications");
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(getActivity()).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44, 34)
                            .show();
                }
            });
        } else if(StringUtils.userRole.equalsIgnoreCase(PARENT)){
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                    tooltip.setText("Important notification alerts of your child");
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(getActivity()).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44, 34)
                            .show();
                }
            });
        }else {
            help.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    View view = getActivity().getLayoutInflater().inflate(R.layout.tooltip_layout, null);
                    TextView tooltip = (TextView) view.findViewById(R.id.textView53);
                    tooltip.setText("Stay Alert! Follow ups.");
                    tooltip.setTextColor(getResources().getColor(R.color.colorWhite));
                    new EasyDialog(getActivity()).setLayout(view)
                            .setLocationByAttachedView(help)
                            .setGravity(EasyDialog.GRAVITY_BOTTOM)
                            .setTouchOutsideDismiss(true)
                            .setMatchParent(false)
                            .setBackgroundColor(getActivity().getResources().getColor(R.color.colorGreen))
                            .setMarginLeftAndRight(44, 34)
                            .show();
                }
            });
        }
    }

    public void floatingActionButtonClick(final FloatingActionButton createNotification, FloatingActionButton myNotifications,
                                          final LinearLayout createNotificationLayout, final LinearLayout myNotificationLayout, final RelativeLayout whiteback, final RelativeLayout headback){

        if(!clicked) {
            headback.setVisibility(View.VISIBLE);
            whiteback.setVisibility(View.VISIBLE);
            createNotificationLayout.setVisibility(View.VISIBLE);
            myNotificationLayout.setVisibility(View.VISIBLE);
            createNotification.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(getActivity(), CreateNotification.class);
                    Bundle bundle = new Bundle();
                    bundle.putSerializable(NOTIFICATION_OBJECT, null);
                    intent.putExtra("bundle", bundle);
                    startActivity(intent);
                }
            });

            myNotifications.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent myNotification = new Intent(getActivity(), MyNotificationActivity.class);
                    startActivity(myNotification);
                }
            });
            clicked = true;
        } else {
            clicked = false;

            whiteback.setVisibility(View.INVISIBLE);
            headback.setVisibility(View.GONE);
            createNotificationLayout.setVisibility(View.INVISIBLE);
            myNotificationLayout.setVisibility(View.INVISIBLE);
        }
    }
}
