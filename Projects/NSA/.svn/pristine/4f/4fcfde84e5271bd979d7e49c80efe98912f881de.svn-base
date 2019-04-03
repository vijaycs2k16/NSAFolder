package nexrise.publication.in.nexrise.FeeManagement;

/**
 * Created by karthik on 06-03-2017.
 */

public class HttpsClient {


    /*public static HttpClient getHttpsClient(HttpClient client, Activity context) {
        Certificate certificate;
        InputStream inputStream = null;
        String keystoreType = KeyStore.getDefaultType();
        try{
            X509TrustManager x509TrustManager = new X509TrustManager() {

                @Override
                public void checkClientTrusted(java.security.cert.X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {

                }

                @Override
                public void checkServerTrusted(java.security.cert.X509Certificate[] chain, String authType) throws java.security.cert.CertificateException {

                }

                @Override
                public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                    return new java.security.cert.X509Certificate[0];
                }
            };

            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            inputStream =  new BufferedInputStream(context.getResources().getAssets().open("ccavenuecom.crt"));
            certificate = certificateFactory.generateCertificate(inputStream);
            Log.v("Certificate "," "+((java.security.cert.X509Certificate)certificate).getSubjectDN());

            KeyStore keystore = KeyStore.getInstance(keystoreType);
            keystore.load(null, null);

            String tmfAlgorithm = TrustManagerFactory.getDefaultAlgorithm();
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(tmfAlgorithm);
            tmf.init(keystore);

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, tmf.getTrustManagers(), null);

            SSLSocketFactory sslSocketFactory = new ExSSLSocketFactory(sslContext);
            sslSocketFactory.setHostnameVerifier(SSLSocketFactory.ALLOW_ALL_HOSTNAME_VERIFIER);
            ClientConnectionManager clientConnectionManager = client.getConnectionManager();
            SchemeRegistry schemeRegistry = clientConnectionManager.getSchemeRegistry();
            schemeRegistry.register(new Scheme("https", sslSocketFactory, 443));
            return new DefaultHttpClient(clientConnectionManager, client.getParams());
        } catch (Exception ex) {
            return null;
        }
    } */
}
