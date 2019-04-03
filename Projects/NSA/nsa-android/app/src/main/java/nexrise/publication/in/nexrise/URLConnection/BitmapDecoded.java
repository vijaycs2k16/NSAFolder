package nexrise.publication.in.nexrise.URLConnection;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.IOException;
import java.io.InputStream;

/**
 * Created by mac on 11/28/17.
 */

public class BitmapDecoded extends AsyncTask<String, String, Bitmap>{
    private String url;

    public BitmapDecoded(String url) {
        this.url = url;
    }

    @Override
    protected Bitmap doInBackground(String... strings) {

        HttpClient client = new DefaultHttpClient();
        HttpGet get = new HttpGet(url);
        try {
            HttpResponse response = client.execute(get);
            InputStream stream = response.getEntity().getContent();

            return BitmapFactory.decodeStream(stream);
        } catch (IOException | IllegalStateException e) {
            e.printStackTrace();
        }
        return null;
    }
}
