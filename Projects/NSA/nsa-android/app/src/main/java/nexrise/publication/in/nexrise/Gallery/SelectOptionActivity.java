package nexrise.publication.in.nexrise.Gallery;

import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.view.MenuItem;
import android.widget.CheckBox;
import android.widget.ListView;

import nexrise.publication.in.nexrise.BeanClass.SelectOptionDataProvider;
import nexrise.publication.in.nexrise.R;

public class SelectOptionActivity extends AppCompatActivity {
    String[] selectoptions;
    SelectOptionAdapter adapter;
    CheckBox checkBox;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_select_option);

        ListView listView = (ListView) findViewById(R.id.lists);
        selectoptions = getResources().getStringArray(R.array.selectoption);
        int i=0;
        adapter = new SelectOptionAdapter(getApplicationContext(),R.layout.activity_selectoption_listview);
        listView.setAdapter(adapter);
        for (String checkBox: selectoptions) {
            SelectOptionDataProvider dataProvider = new SelectOptionDataProvider(selectoptions[i]);
            adapter.add(dataProvider);
            i++;
        }

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle(R.string.select_option);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

    }
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()){
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
