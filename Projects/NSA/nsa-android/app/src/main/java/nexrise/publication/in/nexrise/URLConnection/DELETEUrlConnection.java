package nexrise.publication.in.nexrise.URLConnection;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import org.apache.http.client.HttpClient;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.HttpConnectionParams;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStreamReader;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 20-02-2017.
 */

public class DELETEUrlConnection extends AsyncTask<String, String, String> implements Constants{
    private String url;
    private JSONObject jsonObject;
    private Context context;
    private BasicHeader[] headers;

    public DELETEUrlConnection(Context context, String url, JSONObject jsonObject, BasicHeader[] headers) {
        this.context = context;
        this.url = url;
        this.jsonObject = jsonObject;
        this.headers = headers;
    }
    @Override
    protected String doInBackground(String... params) {

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);

        HttpClient client = new DefaultHttpClient();
        HttpDeleteWithBody delete = new HttpDeleteWithBody(url);
        int statusCode = 0;

        StringBuilder builder = new StringBuilder();
        try {
            Log.v("User delete json "," "+jsonObject);

            if(headers == null)
                delete.setHeaders(new StringUtils().getHeaders(context));
            else
                delete.setHeaders(headers);

            if(jsonObject != null) {
                StringEntity entity = new StringEntity(jsonObject.toString());
                delete.setEntity(entity);
            }
            HttpConnectionParams.setConnectionTimeout(client.getParams(), 7000);
            HttpConnectionParams.setSoTimeout(client.getParams(), 10000);
            org.apache.http.HttpResponse response = client.execute(delete);
            InputStreamReader streamReader = new InputStreamReader(response.getEntity().getContent());
            int read = streamReader.read();

            statusCode = response.getStatusLine().getStatusCode();
            if(statusCode == 200) {
                while(read != -1) {
                    builder.append((char)read);
                    read = streamReader.read();
                }
                streamReader.close();
                return builder.toString();
            }
        } catch (IOException  e) {
            e.printStackTrace();
        }
        return null;
    }
}
