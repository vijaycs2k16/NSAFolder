package nexrise.publication.in.nexrise.FeeManagement;

import android.content.Context;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.conn.scheme.PlainSocketFactory;
import org.apache.http.conn.scheme.Scheme;
import org.apache.http.conn.scheme.SchemeRegistry;
import org.apache.http.conn.ssl.SSLSocketFactory;
import org.apache.http.conn.ssl.X509HostnameVerifier;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.conn.SingleClientConnManager;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.UnrecoverableKeyException;
import java.util.Iterator;
import java.util.List;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;


public class ServiceHandler {
    String response = null;
    public final static int GET = 1;
    public final static int POST = 2;

    /**
     * Making service call
     * @url - url to make request
     * @method - http request method
     * */
   /* public String makeServiceCall(String url, int method, Activity context) {
        return this.makeServiceCall(url, method, null, context);
    }*/

    /**
     * Making service call
     *
     * @url - url to make request
     * @method - http request method
     * @params - http request params
     */
    public String makeServiceCall(Context context, String url, int method,
                                  List<NameValuePair> params) {
        /*try {
            // http client

            HttpEntity httpEntity = null;
            org.apache.http.HttpResponse httpResponse = null;

            // Checking http request method type
            if (method == POST) {
                HttpPost httpPost = new HttpPost(url);
                // adding post params
                if (params != null) {
                    Log.v("URL ","encoded form entiry name"+new UrlEncodedFormEntity(params).getContentType().getName());
                    Log.v("URL ","encoded form entiry value"+new UrlEncodedFormEntity(params).getContentType().getValue());
                    httpPost.setEntity(new UrlEncodedFormEntity(params));
                }


                DefaultHttpClient httpClient = new DefaultHttpClient();

                //Setting user agent
                httpClient.getParams().setParameter(
                        HttpProtocolParams.USER_AGENT,
                        "Mozilla/5.0 (Linux; U; Android-4.0.3; en-us; Galaxy Nexus Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7"
                );
                httpResponse = httpClient.execute(httpPost);
            } *//*else if (method == GET) {
                // appending params to url
                if (params != null) {
                    String paramString = URLEncodedUtils.format(params, "utf-8");
                    url += "?" + paramString;
                }
                HttpGet httpGet = new HttpGet(url);
                httpResponse = httpClient.execute(httpGet);
            }*//*
            assert httpResponse != null;
            httpEntity = httpResponse.getEntity();
            response = EntityUtils.toString(httpEntity);
        } catch (IOException e) {
            e.printStackTrace();
        }*/

        try {
            HttpClient client = new DefaultHttpClient();
            HttpPost post = new HttpPost(url);
            client.getParams().setParameter("http.useragent", "Mozilla/5.0 (Linux; U; Android-4.0.3; en-us; Galaxy Nexus Build/IML74K) AppleWebKit/535.7 (KHTML, like Gecko) CrMo/16.0.912.75 Mobile Safari/535.7");
            SchemeRegistry registry = new SchemeRegistry();

            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            MySSLSocketFactory socketFactory = new MySSLSocketFactory(keyStore);
            HostnameVerifier hostnameVerifier = SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER;
            socketFactory.setHostnameVerifier((X509HostnameVerifier) hostnameVerifier);
            socketFactory.createSocket();

            registry.register(new Scheme("https", socketFactory, 443));
            registry.register(new Scheme("http", PlainSocketFactory.getSocketFactory(), 80));
            SingleClientConnManager manager = new SingleClientConnManager(client.getParams(), registry);
            HttpClient httpClient = new DefaultHttpClient(manager, client.getParams());
            HttpsURLConnection.setDefaultHostnameVerifier(hostnameVerifier);

           // Log.v("SCHEME "," "+socketFactory);
           // HttpEntity requestEntity = new StringEntity(format(params, "ISO-8859-1"), "application/x-www-form-urlencoded; charset=ISO-8859-1", "UTF-8");
            UrlEncodedFormEntity encodedFormEntity = new UrlEncodedFormEntity(params);
            post.setEntity(encodedFormEntity);

            HttpResponse response = httpClient.execute(post);
            int statusCode = response.getStatusLine().getStatusCode();
            if(statusCode == 200) {
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
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnrecoverableKeyException e) {
            e.printStackTrace();
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }
        return response;
    }

    private String format(List<NameValuePair> parameters, String encoding) {
        StringBuilder builder = new StringBuilder();
        Iterator paramIterator = parameters.iterator();

        while (paramIterator.hasNext()) {
            NameValuePair nameValuePair = (NameValuePair) paramIterator.next();
            String encodedName = encode(nameValuePair.getName(), encoding);
            String value = nameValuePair.getValue();
            String encodedValue = value != null ? encode(value, encoding) : "";
            if (builder.length() > 0) {
                builder.append("&");
            }
            builder.append(encodedName);
            builder.append("=");
            builder.append(encodedValue);
        }

        return builder.toString();
    }

    private String encode(String content, String encoding) {
        try {
            return URLEncoder.encode(content, "ISO-8859-1");
        } catch (UnsupportedEncodingException var3) {
            throw new IllegalArgumentException(var3);
        }
    }

    public static byte[] getBytes(String data, String charset) {
        if(data == null) {
            throw new IllegalArgumentException("data may not be null");
        } else if(charset != null && charset.length() != 0) {
            try {
                return data.getBytes(charset);
            } catch (UnsupportedEncodingException var3) {
                return data.getBytes();
            }

        } else {
            throw new IllegalArgumentException("charset may not be null or empty");
        }
    }
}
