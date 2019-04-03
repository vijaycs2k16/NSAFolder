package nexrise.publication.in.nexrise.URLConnection;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.mime.FormBodyPart;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.params.CoreConnectionPNames;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.Constants;

/**
 * Created by karthik on 31-03-2017.
 */

public class FileUploadUrlConnection extends AsyncTask<String, String, String> implements Constants{
    private Context context;
    private String url;
    private File file;
    private BasicHeader[] headers;
    private List<Map.Entry<String, String>> jsonBody;

    protected FileUploadUrlConnection(Context context, String url, BasicHeader[] headers,  File file, List<Map.Entry<String, String>> jsonBody) {
        this.context = context;
        this.url = url;
        this.headers = headers;
        this.file = file;
        this.jsonBody = jsonBody;
    }

    @Override
    protected String doInBackground(String... params) {
        HttpClient client = new DefaultHttpClient();
        HttpPost post = new HttpPost(url);
        MultipartEntity entity = new MultipartEntity(HttpMultipartMode.BROWSER_COMPATIBLE);

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);

        client.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT, 10000);
        client.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT, 30000);

        if(headers != null)
            post.setHeaders(headers);
        else {
            post.setHeader("academic_year", preferences.getString(CURRENT_ACADEMIC_YEAR, null));
            post.setHeader("session-id", preferences.getString(SESSION_TOKEN, null));
        }
        try {
            entity.addPart(file.getName(), new FileBody(file));

            for (int i=0; i<jsonBody.size(); i++) {
                entity.addPart(new FormBodyPart(jsonBody.get(i).getKey(), new StringBody(jsonBody.get(i).getValue())));
                Log.v("new attach "," "+jsonBody.get(i).getKey()+" "+jsonBody.get(i).getValue());
            }

            if(url.equals(BASE_URL + API_VERSION_ONE + VOICE + AUDIO + UPLOAD))
                entity.addPart(new FormBodyPart("voicefile", new FileBody(file)));

            post.setEntity(entity);
            ByteArrayOutputStream bytes = new ByteArrayOutputStream();
            entity.writeTo(bytes);
            String content = bytes.toString();

            Log.v("multi","part "+content);
            HttpResponse response = client.execute(post);
            int statusCode = response.getStatusLine().getStatusCode();
            StringBuilder builder = new StringBuilder();
            if(statusCode == 200 || statusCode == 201) {
                InputStream stream = response.getEntity().getContent();
                int read = stream.read();
                while (read != -1) {
                    builder.append((char) read);
                    read = stream.read();
                }
                stream.close();
            }
            Log.v("multipart ", "status code " + statusCode);
            Log.v("multipart ", "response " + builder.toString());
            return builder.toString();

        } catch (IOException | NullPointerException e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    protected void onPostExecute(String response) {
        super.onPostExecute(response);
    }

}
