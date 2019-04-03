package nexrise.publication.in.nexrise.Utils;

import android.content.Context;
import android.support.v4.view.MenuItemCompat;
import android.view.MenuItem;
import android.widget.SearchView;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * Created by karthik on 7/19/17.
 */

public class Utility {

    public static void searchViewHandler(final SearchView searchView, MenuItem menuItem) {
        MenuItemCompat.setOnActionExpandListener(menuItem, new MenuItemCompat.OnActionExpandListener() {
            @Override
            public boolean onMenuItemActionExpand(MenuItem item) {
                searchView.setIconified(false);
                searchView.setSubmitButtonEnabled(false);
                return true;
            }

            @Override
            public boolean onMenuItemActionCollapse(MenuItem item) {
                searchView.setQuery("", false);
                searchView.clearFocus();
                return true;
            }
        });
    }

    public static String readProperty(Context context, String key) {
        String value = "";
        try {
            Properties properties = new Properties();
            InputStream inputStream = context.getAssets().open("Config.properties");
            properties.load(inputStream);
            value = properties.getProperty(key);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return value;
    }

    public String getBytes(long bytes) {
        long bytesCount = bytes/1000;
        String bytesString = String.valueOf(bytesCount);
        int length = bytesString.length();
        if(length <= 3) {
            return bytesCount+" bytes";
        } else if(length == 4) {
            return bytesCount+" KB";
        } else if(length == 5) {
            return bytesCount + " MB";
        } else {
            return bytesCount + " GB";
        }
    }

}
