package nexrise.publication.in.nexrise.FeeManagement;

import android.app.Activity;
import android.os.AsyncTask;

import org.apache.http.NameValuePair;

import java.util.List;

/**
 * Created by karthik on 06-03-2017.
 */

public class PaymentUrlConnection  extends AsyncTask<String, String, String>{
    private String url;
    private List<NameValuePair> postData = null;
    private String response;
    Activity context;

    PaymentUrlConnection(String url, List<NameValuePair> postData, Activity context) {
        this.url = url;
        this.postData = postData;
        this.context = context;
    }
    @Override
    protected String doInBackground(String... param) {
       /* HttpClient client = (HttpsClient.getHttpsClient(new DefaultHttpClient()));
        HttpEntity httpEntity = null;

        String cert ="c1vA1v3As/xADPhYyGuMv+XPxY4=";

        try {
            InputStream caInput = new BufferedInputStream(new ByteArrayInputStream(cert.getBytes("US-ASCII")));
            CertificateFactory cf = CertificateFactory.getInstance("X.509");
            Certificate ca = cf.generateCertificate(caInput);
            Log.d("JavaSSLHelper", "ca=" + ((X509Certificate) ca).getSubjectDN());
            Log.d("JavaSSLHelper", "Certificate successfully created");

            String keyStoreType = KeyStore.getDefaultType();
            KeyStore keyStore = KeyStore.getInstance(keyStoreType);
            keyStore.load(null, null);
            keyStore.setCertificateEntry("ca", ca);

            String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(keyStore);

            // Create an SSLContext that uses our TrustManager
            SSLContext context = SSLContext.getInstance("TLS");
            context.init(null, tmf.getTrustManagers(), null);

        } catch (IOException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }


        HttpParams params = new BasicHttpParams();
        HttpProtocolParams.setVersion(params, HttpVersion.HTTP_1_1);
        HttpProtocolParams.setContentCharset(params, HTTP.UTF_8);

        try {
            //Add your request URL

            HttpPost httpPost = new HttpPost(url);
            client.getParams().setParameter(
                    HttpProtocolParams.USER_AGENT,
                    "Mozilla/5.0 (Linux; U; Android-4.0.3; en-us; Galaxy Nexus Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7"
            );
            httpPost.setEntity(new UrlEncodedFormEntity(postData));

            HttpResponse httpResponse = client.execute(httpPost);
            httpEntity = httpResponse.getEntity();
            response = EntityUtils.toString(httpEntity);

        } catch (ConnectTimeoutException e) {
            Log.w("Connection Tome Out", e);
        } catch (ClientProtocolException e) {
            Log.w("ClientProtocolException", e);
        } catch (SocketException e) {
            Log.w("SocketException", e);
        } catch (IOException e) {
            Log.w("IOException", e);
        }
        return response;*/

        /*InputStream inputStream = null;
        HttpClient client = (HttpsClient.getHttpsClient(new DefaultHttpClient(), context));
        HttpEntity httpEntity = null;

        try {
            HttpPost httpPost = new HttpPost(url);
            assert client != null;
            client.getParams().setParameter(
                    HttpProtocolParams.USER_AGENT,
                    "Mozilla/5.0 (Linux; U; Android-4.0.3; en-us; Galaxy Nexus Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7"
            );

            httpPost.setEntity(new UrlEncodedFormEntity(postData));
            HttpResponse httpResponse = client.execute(httpPost);
            httpEntity = httpResponse.getEntity();
            response = EntityUtils.toString(httpEntity);

        } catch (IOException e) {
            e.printStackTrace();
        }
*/
        return response;
    }
}
