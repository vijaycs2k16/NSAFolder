package nexrise.publication.in.nexrise.ParentFeatures.ParentLogin;

import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Set;

import nexrise.publication.in.nexrise.BeanClass.User;
import nexrise.publication.in.nexrise.Common.BaseLoginActivity;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.CustomHashMap.Initiater;
import nexrise.publication.in.nexrise.CustomHashMap.OnUpdateListener;
import nexrise.publication.in.nexrise.R;

public class MultipleSchoolsActivity extends BaseLoginActivity implements Constants {
    private static boolean listClicked = false;
    ListView listView;
    MultipleSchoolsArrayAdapter arrayAdapter;
    OnUpdateListener updateListener;
    Boolean activityVisible = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_parent_login);

        activityVisible = true;
        listClicked = false;
        listView = (ListView)findViewById(R.id.parent_login_listview);
        HashMap<String, ArrayList<User>> multipleUsers  = (HashMap<String, ArrayList<User>>)getIntent().getSerializableExtra(MULTIPLE_USERS);

        ActionBar actionBar = getSupportActionBar();
        if (actionBar!=null) {
            actionBar.setTitle(R.string.select_school);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

        ArrayList<String> schoolNames = new ArrayList<>(multipleUsers.keySet());
        arrayAdapter = new MultipleSchoolsArrayAdapter(this, schoolNames);
        listView.setAdapter(arrayAdapter);
        listViewClickHandler(listView, multipleUsers);
        updateListener = new OnUpdateListener() {
            @Override
            public void onUpdate(String classId, String sectionId, String schoolId, String userId, String featureId, int count) {

                if(activityVisible && listView != null && arrayAdapter != null) {
                    listView.invalidate();
                    arrayAdapter.notifyDataSetChanged();
                }

            }
        };
        Initiater.getInstance().setOnUpdateListener(updateListener);
    }

    private void listViewClickHandler(final ListView listView, final HashMap<String, ArrayList<User>> multipleUsers) {
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                String schoolName = listView.getItemAtPosition(i).toString();
                ArrayList<User> users = multipleUsers.get(schoolName);

                Intent intent = new Intent(MultipleSchoolsActivity.this, ParentLogin.class);
                intent.putExtra(FROM_ACTIVITY, "MultipleSchoolsActivity");
                intent.putExtra(MULTIPLE_USERS, users);
                startActivity(intent);
                if(!listClicked) {
                    Set<String> keys = multipleUsers.keySet();
                    for (String key : keys) {
                        if (!key.equals(schoolName)) {
                            ArrayList<User> user = multipleUsers.get(key);
                            for (int j = 0; j < user.size(); j++) {
                                User userObj = user.get(j);
                                authorizeSibilings(userObj);
                            }
                        }
                    }
                    listClicked = true;
                }
            }
        });
    }

    @Override
    protected void onPause() {
        super.onPause();
        activityVisible = false;
    }

    @Override
    protected void onResume() {
        super.onResume();
        activityVisible = true;
        if(listView != null && arrayAdapter != null) {
            arrayAdapter.notifyDataSetChanged();
            listView.invalidate();
        }
    }

    @Override
    public void onBackPressed() {
        Intent home = new Intent(Intent.ACTION_MAIN);
        home.addCategory(Intent.CATEGORY_HOME);
        home.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(home);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        activityVisible = false;
        Initiater.getInstance().remove(updateListener);
    }
}