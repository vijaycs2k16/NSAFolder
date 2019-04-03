package nexrise.publication.in.nexrise.URLConnection;

import android.app.Activity;
import android.os.AsyncTask;
import android.util.Log;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import nexrise.publication.in.nexrise.Common.LoginActivity;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.PasswordChangeActivity;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by karthik on 08-02-2017.
 */
public class POSTUrlConnection extends AsyncTask<String, Void , String> implements Constants {
    private String regId = null;
    private String endpointARN =  null;
    private JSONObject object = new JSONObject();
    private String url;
    private List<NameValuePair> param = null;
    private Activity context;
    private BasicHeader[] headers;

    public POSTUrlConnection(JSONObject object, String url, List<NameValuePair> param) {
        this.object = object;
        this.url = url;
        this.param = param;
    }
    public POSTUrlConnection(JSONObject object, String url, BasicHeader[] headers, Activity context) {
        this.object = object;
        this.url = url;
        this.headers = headers;
        this.context = context;
    }

    @Override
    protected String doInBackground(String... params) {
        HttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(url);

        client.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 10000);
        client.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 13000);

        if(context instanceof LoginActivity) {
            post.setHeaders(new StringUtils().getHeadersWithoutSession(context));
        } else {
            if(headers!= null) {
                post.setHeaders(headers);
            } else {
                post.setHeaders(new StringUtils().getHeaders(context));
            }
        }

        try {
            HttpEntity requestEntity = new StringEntity(object.toString(),"UTF-8");
            post.setEntity(requestEntity);
            HttpResponse response = client.execute(post);
            int statusCode = response.getStatusLine().getStatusCode();
            Log.v("status code","Status code " +statusCode);
            if(statusCode == 200 || statusCode == 201 || statusCode == 500) {
                StringBuilder builder = new StringBuilder();
                InputStream stream = response.getEntity().getContent();
                int read = stream.read();
                while (read != -1) {
                    builder.append((char)read);
                    read = stream.read();
                }
                stream.close();
                return builder.toString();
            }
        } catch (IOException e) {
            if(context instanceof LoginActivity || context instanceof PasswordChangeActivity) {
                return "Connection too slow";
            } else
                e.printStackTrace();
        } catch (NullPointerException e) {
            e.printStackTrace();
        }
        return null;
    }
}
