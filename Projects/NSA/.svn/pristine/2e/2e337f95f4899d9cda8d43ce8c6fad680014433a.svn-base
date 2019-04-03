package nexrise.publication.in.nexrise.URLConnection;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/*
 * Created by karthik on 13-02-2017.
 */

public class UPDATEUrlConnection extends AsyncTask<String, String, String> implements Constants {

    private JSONObject updateJson;
    private String url;
    private Context context;
    private BasicHeader[] headers;

    public UPDATEUrlConnection(Context context, String url, BasicHeader[] headers, JSONObject updateJson){
        this.url = url;
        this.updateJson = updateJson;
        this.headers = headers;
        this.context = context;
    }

    @Override
    protected String doInBackground(String... params) {

        HttpClient client = new  DefaultHttpClient();
        HttpPut put = new HttpPut(url);
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);

        client.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 10000);
        client.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 13000);
        if(headers != null) {
            put.setHeaders(headers);
        } else {
            put.setHeaders(new StringUtils().getHeaders(context));
        }
        try {
            HttpEntity requestEntity = new StringEntity(updateJson.toString(),"UTF-8");
            put.setEntity(requestEntity);
            HttpResponse response = client.execute(put);
            int statusCode = response.getStatusLine().getStatusCode();

            if(statusCode == 200 || statusCode == 201) {
                StringBuilder builder = new StringBuilder();
                InputStream stream = response.getEntity().getContent();
                int read = stream.read();
                while (read != -1) {
                    builder.append((char) read);
                    read = stream.read();
                }
                stream.close();
                Log.v("Update ","response "+builder.toString());
                return builder.toString();
            }
        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
        return null;
    }
}
