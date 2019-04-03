package nexrise.publication.in.nexrise.Common;

import android.support.multidex.MultiDex;

import nexrise.publication.in.nexrise.R;
import uk.co.chrisjenx.calligraphy.CalligraphyConfig;

/**
 * created by karthik on 04-10-2016.
 */

public class ReplaceFont extends ApplicationAnalytics {

    @Override
    public void onCreate() {
        super.onCreate();
        MultiDex.install(this);
        CalligraphyConfig.initDefault(new CalligraphyConfig.Builder()
                .setDefaultFontPath("fonts/ufonts.com_proximasansregular.ttf")
                .setFontAttrId(R.attr.fontPath)
                .build() );

    }
}
