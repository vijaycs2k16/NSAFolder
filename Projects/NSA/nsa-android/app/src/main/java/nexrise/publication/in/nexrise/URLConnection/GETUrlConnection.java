package nexrise.publication.in.nexrise.URLConnection;

import android.content.Context;
import android.os.AsyncTask;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;

import java.io.IOException;
import java.io.InputStream;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 15-02-2017.
 */

public class GETUrlConnection extends AsyncTask<String, String , String> implements Constants {
    private Context context;
    private String url;
    private BasicHeader[] headers;

    public GETUrlConnection( Context context,String url, BasicHeader[] headers) {
        this.headers = headers;
        this.context = context;
        this.url = url;
    }

    @Override
    protected String doInBackground(String... params){
        HttpClient client = new DefaultHttpClient();
        HttpGet get = new HttpGet(url);

        client.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 10000);
        client.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 13000);
        try {
            if(headers!= null) {
                get.setHeaders(headers);
            } else {
                get.setHeaders(new StringUtils().getHeaders(context));
            }
            HttpResponse response = client.execute(get);
            int statusCode = response.getStatusLine().getStatusCode();
            if(statusCode == 200 || statusCode == 201) {
                StringBuilder builder = new StringBuilder();
                InputStream stream = response.getEntity().getContent();
                int read = stream.read();
                while (read != -1) {
                    builder.append((char)read);
                    read = stream.read();
                }
                stream.close();
                Log.v("GET ","RESULT "+builder.toString());
                return builder.toString();
            }

        } catch (IOException | IllegalStateException | NullPointerException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    protected void onPostExecute(String response) {
        super.onPostExecute(response);
    }
}
