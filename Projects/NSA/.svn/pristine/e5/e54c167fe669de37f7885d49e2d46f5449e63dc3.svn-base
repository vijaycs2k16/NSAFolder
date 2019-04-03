package nexrise.publication.in.nexrise.EventsFeature;

import android.content.Context;
import android.content.Intent;
import android.graphics.drawable.Drawable;
import android.location.Address;
import android.location.Geocoder;
import android.os.Bundle;
import android.support.design.widget.TabLayout;
import android.support.v4.view.ViewPager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

import com.google.android.gms.maps.model.LatLng;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import nexrise.publication.in.nexrise.BeanClass.Venue;
import nexrise.publication.in.nexrise.FragmentPagerAdapter.ClassTabsPagerAdapter;

import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyContextWrapper;

public class LocationActivity extends AppCompatActivity{
    static ArrayList<Venue> venues = new ArrayList<>();
    Double lattitude = null;
    Double longitude = null;
    String words = "";

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(CalligraphyContextWrapper.wrap(newBase));
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location);

        ViewPager vpPager = (ViewPager) findViewById(R.id.pager);
        setUpViewPager(vpPager);

        TabLayout tabLayout = (TabLayout)findViewById(R.id.tablayout);
        tabLayout.setupWithViewPager(vpPager);

        String[] titles = {(String) getResources().getText(R.string.our_school), (String) getResources().getText(R.string.map)};
        for (int i = 0; i < titles.length; i++) {
            tabLayout.getTabAt(i).setText(titles[i]);
        }

        ActionBar actionBar = getSupportActionBar();

        if(actionBar!= null) {
            actionBar.setTitle(R.string.add_event);
            actionBar.setElevation(0);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                Intent back = new Intent();
                setResult(RESULT_CANCELED, back);
                venues.clear();
                onBackPressed();
                break;
            case R.id.tick:
                Intent intent = new Intent();
                intent.putExtra("Our school",venues);
                intent.putExtra("Address",words);
                intent.putExtra("Lattitude", lattitude);
                intent.putExtra("Longitude", longitude);
                setResult(RESULT_OK, intent);
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);

        return super.onCreateOptionsMenu(menu);
    }

    public void setUpViewPager(ViewPager viewPager) {
        ClassTabsPagerAdapter pagerAdapter = new ClassTabsPagerAdapter(getSupportFragmentManager());
        OurSchoolLocationFragment ourSchoolLocationFragment = new OurSchoolLocationFragment();
        Bundle bundle = new Bundle();
        bundle.putSerializable("Selected location" ,getIntent().getSerializableExtra("Selected location"));
        ourSchoolLocationFragment.setArguments(bundle);

        pagerAdapter.addFragment(ourSchoolLocationFragment, "Our school");
        pagerAdapter.addFragment(new MapsFragment(), "Map");
        viewPager.setAdapter(pagerAdapter);
    }

    public void ourSchoolLocation(Venue venue, String action) {
        if(action.equalsIgnoreCase("add")) {
            //venues.add(venue);
            addVenue(venue);
        } else if(action.equalsIgnoreCase("remove")) {
            venues.remove(venue);
        }
    }
    private void addVenue(Venue venue) {
        boolean canAdd = true;
        if(venues!= null) {
            if(venues.size() != 0) {
                for (int i = 0; i < venues.size(); i++) {
                    if (venues.get(i).getVenue_type_id().equals(venue.getVenue_type_id()))
                        canAdd = false;
                }
            } else {
                venues.add(venue);
                canAdd = false;
            }
            if(canAdd) venues.add(venue);
        }
    }

    public void mapLocation(LatLng latLng) {
        int length;
        lattitude = latLng.latitude;
        longitude = latLng.longitude;
        Geocoder geocoder = new Geocoder(this);
        try {
            List<Address> addresses = geocoder.getFromLocation(lattitude, longitude, 2);
            if(addresses.size()>1){

                length = addresses.size() - 1;
            } else {
                length = addresses.size();
            }
            for (int i=0; i<length; i++) {
                //for (int j = 0; j < addresses.get(i).getMaxAddressLineIndex(); j++) {
                //Log.v("Address ", " " + addresses.get(i).getAddressLine(j));
                words = words + addresses.get(i).getAddressLine(i);
                Log.v("Words"," "+words);
                //}
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        Log.v("Latlng "," "+latLng.latitude);
        Log.v("Latlng "," "+latLng.longitude);
    }
}
