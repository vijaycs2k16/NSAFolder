package nexrise.publication.in.nexrise.FeeManagement;

import android.annotation.TargetApi;
import android.app.FragmentManager;
import android.app.FragmentTransaction;
import android.app.ProgressDialog;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.res.Configuration;
import android.graphics.drawable.Drawable;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import org.apache.http.NameValuePair;
import org.apache.http.message.BasicNameValuePair;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.POSTUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class WebviewActivity extends AppCompatActivity implements Constants{

    WebView myBrowser;
    WebSettings webSettings;
    private BroadcastReceiver mIntentReceiver;
    String bankUrl="";
    FragmentManager manager;
    ActionDialog actionDialog= new ActionDialog();
    Timer timer = new Timer();
    TimerTask timerTask;
    //we are going to use a handler to be able to run in our TimerTask
    final Handler handler = new Handler();
    public int loadCounter = 0;
    private boolean transactionSuccess = false;

    private ProgressDialog dialog;
    String html, encVal;
    int MyDeviceAPI;

    String TAG = "Webview Activity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_webview);
        TAG = this.getLocalClassName();
        manager = getFragmentManager();

        myBrowser = (WebView) findViewById(R.id.webView);
        webSettings = myBrowser.getSettings();
        webSettings.setJavaScriptEnabled(true);

        MyDeviceAPI = Build.VERSION.SDK_INT;
        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null){
            actionBar.setElevation(0);
            actionBar.setTitle("Make payment");
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
        }

       // new RenderView().execute();
        renderData();
    }

    public void renderData() {
        String feeId = getIntent().getStringExtra("FeeId");
        Log.v("FeeId "," "+feeId);
        String url = BASE_URL + API_VERSION_ONE + CCAVENUE;
        JSONObject json = new JSONObject();
        try {
            json.put("feeId", feeId);
            POSTUrlConnection getEncryptedUrl = new POSTUrlConnection(json, url, null, this) {
                ProgressDialog progressDialog = new ProgressDialog(WebviewActivity.this, ProgressDialog.STYLE_SPINNER);
                @Override
                protected void onPreExecute() {
                    super.onPreExecute();
                    progressDialog.setMessage("Loading");
                    progressDialog.setCancelable(false);
                    progressDialog.setCanceledOnTouchOutside(false);
                    progressDialog.show();
                }

                @Override
                protected void onPostExecute(String result) {
                    super.onPostExecute(result);
                    progressDialog.dismiss();
                    try {
                        new StringUtils().checkSession(result);
                        JSONObject response = new JSONObject(result);
                        JSONObject data = response.getJSONObject(DATA);
                        String paymentUrl = data.getString("hash");
                        Log.v("Payment ","url "+paymentUrl);

                        @SuppressWarnings("unused")
                        class MyJavaScriptInterface
                        {
                            @JavascriptInterface
                            public void processHTML(String html)
                            {
                                // process the html as needed by the app
                                String status = null;
                                Log.v(TAG, " Html "+html);
                                if(html.indexOf("Failure")!=-1){
                                    status = "Transaction Declined!";
                                }else if(html.indexOf("Success")!=-1){
                                    status = "Transaction Successful!";
                                }else if(html.indexOf("Aborted")!=-1){
                                    status = "Transaction Cancelled!";
                                }else{
                                    status = "Status Not Known!";
                                }
                            }
                        }

                        final WebView webview = (WebView) findViewById(R.id.webView);
                        webview.getSettings().setJavaScriptEnabled(true);
                        webview.addJavascriptInterface(new MyJavaScriptInterface(), "HTMLOUT");

                        //    webview.getSettings().setUserAgentString("Mozilla/5.0 (Linux; Android 4.4; Nexus 4 Build/KRT16H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36");
                        webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
                        webview.setWebViewClient(new WebViewClient(){
                            @Override
                            public void onPageFinished(WebView view, String url) {
                                super.onPageFinished(view, url);
                                Log.v(TAG, " ccavResponseHandler " +url);

                                if(url.indexOf("BankRespReceive")!=-1) {
                                    Log.v(TAG, " Entered");
                                    transactionSuccess = true;
                                    PendingFeesFragment.rendered = false;
                                    view.loadUrl("javascript:window.HTMLOUT.processHTML('<head>'+document.getElementsByTagName('html')[0].innerHTML+'</head>');");
                                }
                            }

                            @Override
                            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                                super.onReceivedError(view, errorCode, description, failingUrl);
                                view.reload();

                            }
                        });

                        try {
                            webview.postUrl(paymentUrl, null);
                        } catch (Exception e) {
                            showToast("Exception occured while opening webview.");
                        }
                    } catch (JSONException | NullPointerException e) {
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(WebviewActivity.this);
                    }
                }
            };
            getEncryptedUrl.execute();
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onBackPressed() {
        Intent intent = new Intent();
        if(transactionSuccess) {
            setResult(RESULT_OK, intent);
            finish();
        } else {
            setResult(RESULT_CANCELED, intent);
            finish();
        }
    }

    private class RenderView extends AsyncTask<Void, Void, Void> {
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            // Showing progress dialog
            dialog = new ProgressDialog(WebviewActivity.this);
            dialog.setMessage("Please wait...");
            dialog.setCancelable(false);
            dialog.show();
        }

        @Override
        protected Void doInBackground(Void... arg0) {
            // Creating service handler class instance
            ServiceHandler sh = new ServiceHandler();
            if (dialog.isShowing())
                dialog.dismiss();
            // Making a request to url and getting response
            List<NameValuePair> params = new ArrayList<NameValuePair>();
            params.add(new BasicNameValuePair(Constants.ACCESS_CODE,"AVOA00EC93BU81AOUB"));
            params.add(new BasicNameValuePair(Constants.ORDER_ID, "2570564"));

            String vResponse = sh.makeServiceCall(WebviewActivity.this, Constants.RSA_KEY_URL, ServiceHandler.POST, params);

            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            super.onPostExecute(result);
            // Dismiss the progress dialog

            @SuppressWarnings("unused")
            class MyJavaScriptInterface
            {
                @JavascriptInterface
                public void processHTML(String html)
                {
                    // process the html as needed by the app
                    String status = null;
                    Log.v(TAG, " Html "+html);
                    if(html.indexOf("Failure")!=-1){
                        status = "Transaction Declined!";
                    }else if(html.indexOf("Success")!=-1){
                        status = "Transaction Successful!";
                    }else if(html.indexOf("Aborted")!=-1){
                        status = "Transaction Cancelled!";
                    }else{
                        status = "Status Not Known!";
                    }
                    Toast.makeText(getApplicationContext(), status, Toast.LENGTH_SHORT).show();
                    /*Intent feeDetailsActivity = new Intent();
                    feeDetailsActivity.putExtra("Status", status);
                    setResult(RESULT_OK, feeDetailsActivity);
                    WebviewActivity.this.finish();*/
                }
            }

            final WebView webview = (WebView) findViewById(R.id.webView);
            webview.getSettings().setJavaScriptEnabled(true);
            webview.addJavascriptInterface(new MyJavaScriptInterface(), "HTMLOUT");

        //    webview.getSettings().setUserAgentString("Mozilla/5.0 (Linux; Android 4.4; Nexus 4 Build/KRT16H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/30.0.0.0 Mobile Safari/537.36");
            webview.setLayerType(View.LAYER_TYPE_SOFTWARE, null);
            webview.setWebViewClient(new WebViewClient(){
                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    Log.v(TAG, " ccavResponseHandler " +url);

                    if(url.indexOf("BankRespReceive")!=-1) {
                        Log.v(TAG, " Entered");
                        view.loadUrl("javascript:window.HTMLOUT.processHTML('<head>'+document.getElementsByTagName('html')[0].innerHTML+'</head>');");
                    }
                }

                @Override
                public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                    super.onReceivedError(view, errorCode, description, failingUrl);
                    view.reload();

                }
            });

			/* An instance of this class will be registered as a JavaScript interface */
            StringBuffer params = new StringBuffer();
            String returnUrl = BASE_URL + API_VERSION_ONE + "ccavenue/return";
            params.append(ServiceUtility.addToPostParams(Constants.ACCESS_CODE, "AVOA00EC93BU81AOUB"));
            params.append(ServiceUtility.addToPostParams(Constants.MERCHANT_ID, "125202"));
            params.append(ServiceUtility.addToPostParams(Constants.ORDER_ID, "2570564"));
            params.append(StringUtils.addToPostParams(Constants.REDIRECT_URL, returnUrl));
            params.append(StringUtils.addToPostParams(Constants.CANCEL_URL, ""));
            params.append(ServiceUtility.addToPostParams(Constants.LANGUAGE,"EN"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_NAME,"Charli"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_ADDRESS,"Room no 1101 near Railway station Ambad"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_CITY, "Indore"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_STATE, "MH"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_ZIP,"425001"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_COUNTRY,"India"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_TEL,"9595226054"));
            params.append(ServiceUtility.addToPostParams(Constants.BILLING_EMAIL,"pratik.pai@avenues.info"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_NAME,"Charli"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_ADDRESS,"Room no 1101 near Railway station Ambad"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_CITY, "Indore"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_STATE, "MH"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_ZIP,"425001"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_COUNTRY,"India"));
            params.append(ServiceUtility.addToPostParams(Constants.DELIVERY_TEL,"9595226054"));
            params.append(ServiceUtility.addToPostParams(Constants.MERCHANT_PARAM1,"additional Info."));
            params.append(ServiceUtility.addToPostParams(Constants.MERCHANT_PARAM2,"additional Info."));
            params.append(ServiceUtility.addToPostParams(Constants.MERCHANT_PARAM3,"additional Info."));
            params.append(ServiceUtility.addToPostParams(Constants.MERCHANT_PARAM4,"additional Info."));
            params.append(ServiceUtility.addToPostParams(Constants.PAYMENT_OPTION,"OPTNBK"));
            params.append(ServiceUtility.addToPostParams(Constants.CARD_TYPE, "NBK"));
            params.append(ServiceUtility.addToPostParams(Constants.CARD_NAME,"AvenuesTest"));
            params.append(ServiceUtility.addToPostParams(Constants.DATA_ACCEPTED_AT, "N"));
            params.append(ServiceUtility.addToPostParams(Constants.ISSUING_BANK, "State Bank of India"));
            params.append(ServiceUtility.addToPostParams(Constants.ENC_VAL, URLEncoder.encode(encVal)));
            /*params.append(ServiceUtility.addToPostParams(Constants.EMI_PLAN_ID, ));
            params.append(ServiceUtility.addToPostParams(Constants.EMI_TENURE_ID,mainIntent.getStringExtra(Constants.EMI_TENURE_ID)));*/

            String vPostParams = params.substring(0,params.length()-1);
            try {
                //EncodingUtils.getBytes(vPostParams, "UTF-8");
            //    webview.postUrl(Constants.TRANS_URL, ServiceHandler.getBytes(vPostParams, "UTF-8"));
                webview.postUrl("http://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=125202&encRequest=83c14acfa236fee32f18d2e3d0e76f66ff1fe2ae6c8aa6e270d145c078cec5fdb58628b7c4a3f3e11895737c99d4830353cf130711e15617429d42dc72b84a5a0f08ab80bc90fd47bdac9877e7cc68accbe6947cb747d3477fef24bbf44b66fbbf6e613019352141dd29d12d12bef60e0cfef93322764566d34e7d0501996687480b31eeddfb1c2619fa0b35916758847b359734cc409166c7251ecf419a662c038bb2836a14f873f3f20ecb5e46a957d8dc23c385311987eac42914ae8864cdbfdcda6aad666998459d86947dfa115b5a0363d713e220e29c4d80825e99f3b9331664da5e4118703ab1d0e43cd9177ac8aa0aed004f8ce93dbe6ab4945bf97751b07795ef4077288aa6dfc7a26c09ee07a3cbe33901a8395887ae695229a0a6e1d17da3e5d06ad355aeadc6a58df982f7d3263af00a9235e65542ccf5de59c30acd6f95e163fdc3a9076ab2110a90a92482067f01773f16bc88d9cad6e6046b30c7ae9fad61464d965cebfb0a2e41f71497eb2455b9fba65832c20ac42241a60f23a69a9687e4830a95ea8112390f4431917d7d80dce2d818676535295a70da673e57b1f91332021e7a2a12a5363ac3fb403c8e87eb4d67cbf041e25a5298a59f226ac2c1d875a4d250658a0b369dd1c16951d39b3b9b8b5160d28793771336ae05e31832cb289a38ada7ee09d2c2f9b6c3f68fd6edd3f1b45aeb2f014363fb9ef4259ce065bc4148c07cb61a6ab3f201293187ab19bd1858a97e169229fae316b7233942ed2c1f35562e3bda264920fb025af2492d493cd670ac954c69b40a53156646515e1f01d7f4e8224840c5d4fc6c816af2eceae770852faf419763967bde0d037648f45ae3d0a1c2cc64e500be5dec578535bc643a75d049ed311589a950e881aa4c9bc46d703c5327613b7d21dd9948615106bc3d9b5d9bee0cd04e&access_code=AVSU00EB90BV18USVB", null);
                Log.v(TAG, " Handler "+webview.getHitTestResult().getExtra());
            } catch (Exception e) {
                showToast("Exception occured while opening webview.");
            }
        }
    }

    public void showToast(String msg) {
        Toast.makeText(this, "Toast: " + msg, Toast.LENGTH_LONG).show();
    }
    // Method to start Timer for 30 sec. delay
    public void startTimer() {
        try {
            //set a new Timer
            if(timer == null) {
                timer = new Timer();
            }
            //initialize the TimerTask's job
            initializeTimerTask();

            //schedule the timer, after the first 5000ms the TimerTask will run every 10000ms
            timer.schedule(timerTask, 30000, 30000);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    // Method to Initialize Task
    public void initializeTimerTask() {
        try {
            timerTask = new TimerTask() {
                public void run() {

                    //use a handler to run a toast that shows the current timestamp
                    handler.post(new Runnable() {
                        public void run() {
                        /*int duration = Toast.LENGTH_SHORT;
                        Toast toast = Toast.makeText(getApplicationContext(), "I M Called ..", duration);
                        toast.show();*/
                            loadActionDialog();
                        }
                    });
                }
            };
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    // Method to stop timer
    public void stopTimerTask(){
        //stop the timer, if it's not already null
        if (timer != null) {
            timer.cancel();
            timer = null;
        }
    }

    public void loadCitiBankAuthenticateOption(String url){
        if(url.contains("https://www.citibank.co.in/acspage/cap_nsapi.so")){
            CityBankFragment citiFrag = new CityBankFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, citiFrag, "CitiBankAuthFrag");
            transaction.commit();
            loadCounter++;
        }
    }

    public void removeCitiBankAuthOption(){
        CityBankFragment cityFrag = (CityBankFragment) manager.findFragmentByTag("CitiBankAuthFrag");
        FragmentTransaction transaction = manager.beginTransaction();
        if(cityFrag!=null){
            transaction.remove(cityFrag);
            transaction.commit();
        }
    }

    // Method to load Waiting for OTP fragment
    public void loadWaitingFragment(String url){

        // SBI Debit Card
        if(url.contains("https://acs.onlinesbi.com/sbi/")){
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }

        // Kotak Bank Visa Debit card
        else if(url.contains("https://cardsecurity.enstage.com/ACSWeb/")){
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }
        // For SBI and All its Asscocites Net Banking
        else if(url.contains("https://merchant.onlinesbi.com/merchant/smsenablehighsecurity.htm") || url.contains("https://merchant.onlinesbi.com/merchant/resendsmsotp.htm") || url.contains("https://m.onlinesbi.com/mmerchant/smsenablehighsecurity.htm")
                || url.contains("https://merchant.onlinesbh.com/merchant/smsenablehighsecurity.htm") || url.contains("https://merchant.onlinesbh.com/merchant/resendsmsotp.htm")
                || url.contains("https://merchant.sbbjonline.com/merchant/smsenablehighsecurity.htm") || url.contains("https://merchant.sbbjonline.com/merchant/resendsmsotp.htm")
                || url.contains("https://merchant.onlinesbm.com/merchant/smsenablehighsecurity.htm") || url.contains("https://merchant.onlinesbm.com/merchant/resendsmsotp.htm")
                || url.contains("https://merchant.onlinesbp.com/merchant/smsenablehighsecurity.htm") || url.contains("https://merchant.onlinesbp.com/merchant/resendsmsotp.htm")
                || url.contains("https://merchant.sbtonline.in/merchant/smsenablehighsecurity.htm") || url.contains("https://merchant.sbtonline.in/merchant/resendsmsotp.htm")){
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }

        // For ICICI Credit Card
        else if(url.contains("https://www.3dsecure.icicibank.com/ACSWeb/EnrollWeb/ICICIBank/server/OtpServer")){
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }
        // City bank Debit card
        else if(url.equals("cityBankAuthPage")){
            removeCitiBankAuthOption();
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }
        // HDFC Debit Card and Credit Card
        else if(url.contains("https://netsafe.hdfcbank.com/ACSWeb/jsp/dynamicAuth.jsp?transType=payerAuth")){
            //removeCitiBankAuthOption();
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }
        // For SBI  Visa credit Card
        else if(url.contains("https://secure4.arcot.com/acspage/cap")){
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }

        // For Kotak Bank Visa Credit Card
        else if (url.contains("https://cardsecurity.enstage.com/ACSWeb/EnrollWeb/KotakBank/server/OtpServer")){
            OtpFragment waitingFragment = new OtpFragment();
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.add(R.id.otp_frame, waitingFragment, "OTPWaitingFrag");
            transaction.commit();
            startTimer();
        }
        else{
            removeWaitingFragment();
            removeApprovalFragment();
            stopTimerTask();
        }
    }

    // Method to remove Waiting fragment
    public void removeWaitingFragment(){
        OtpFragment waitingFragment = (OtpFragment) manager.findFragmentByTag("OTPWaitingFrag");
        if(waitingFragment!=null){
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.remove(waitingFragment);
            transaction.commit();
        }
        else{
            // DO nothing
            //Toast.makeText(this," --test-- ",Toast.LENGTH_SHORT).show();
        }
    }

    // Method to load Approve Otp Fragment
    public void loadApproveOTP(String otpText,String senderNo){
        try{
            Integer vTemp = Integer.parseInt(otpText);

            if(bankUrl.contains("https://acs.onlinesbi.com/sbi/") && senderNo.contains("SBI") && (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For Kotak bank Debit Card
            else if(bankUrl.contains("https://cardsecurity.enstage.com/ACSWeb/") && senderNo.contains("KOTAK") && (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // for SBI Net Banking
            else if((((bankUrl.contains("https://merchant.onlinesbi.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbi.com/merchant/resendsmsotp.htm") || bankUrl.contains("https://m.onlinesbi.com/mmerchant/smsenablehighsecurity.htm")) && senderNo.contains("SBI"))
                    || ((bankUrl.contains("https://merchant.onlinesbh.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbh.com/merchant/resendsmsotp.htm")) && senderNo.contains("SBH"))
                    || ((bankUrl.contains("https://merchant.sbbjonline.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.sbbjonline.com/merchant/resendsmsotp.htm")) && senderNo.contains("SBBJ"))
                    || ((bankUrl.contains("https://merchant.onlinesbm.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbm.com/merchant/resendsmsotp.htm")) && senderNo.contains("SBM"))
                    || ((bankUrl.contains("https://merchant.onlinesbp.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbp.com/merchant/resendsmsotp.htm")) && senderNo.contains("SBP"))
                    || ((bankUrl.contains("https://merchant.sbtonline.in/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.sbtonline.in/merchant/resendsmsotp.htm")) && senderNo.contains("SBT"))) && (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For ICICI Visa Credit Card
            else if(bankUrl.contains("https://www.3dsecure.icicibank.com/ACSWeb/EnrollWeb/ICICIBank/server/OtpServer") && senderNo.contains("ICICI")&& (otpText.length() == 6 || otpText.length() == 8)) {
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For ICICI Debit card
            else if(bankUrl.contains("https://acs.icicibank.com/acspage/cap?") && senderNo.contains("ICICI")&& (otpText.length() == 6 || otpText.length() == 8)) {
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For CITI bank Debit card
            else if(bankUrl.contains("https://www.citibank.co.in/acspage/cap_nsapi.so") && senderNo.contains("CITI")&& (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For HDFC bank debit card and Credit Card
            else if(bankUrl.contains("https://netsafe.hdfcbank.com/ACSWeb/jsp/dynamicAuth.jsp?transType=payerAuth") && senderNo.contains("HDFC")&& (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For HDFC Netbanking
            else if(bankUrl.contains("https://netbanking.hdfcbank.com/netbanking/entry") && senderNo.contains("HDFC")&& (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            // For SBI Visa credit Card
            else if(bankUrl.contains("https://secure4.arcot.com/acspage/cap") && senderNo.contains("SBI")&& (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            else if(bankUrl.contains("https://cardsecurity.enstage.com/ACSWeb/EnrollWeb/KotakBank/server/OtpServer") && senderNo.contains("KOTAK") && (otpText.length() == 6 || otpText.length() == 8)){
                removeWaitingFragment();
                stopTimerTask();
                ApproveOTPFragment approveFragment = new ApproveOTPFragment();
                FragmentTransaction transaction = manager.beginTransaction();
                transaction.add(R.id.otp_frame, approveFragment, "OTPApproveFrag");
                transaction.commit();
                approveFragment.setOtpText(otpText);
            }
            else{
                removeApprovalFragment();
                stopTimerTask();
            }

        }catch (Exception e){
            e.printStackTrace();
        }
    }

    public void removeApprovalFragment(){
        ApproveOTPFragment approveOTPFragment = (ApproveOTPFragment)manager.findFragmentByTag("OTPApproveFrag");
        if(approveOTPFragment !=null){
            FragmentTransaction transaction = manager.beginTransaction();
            transaction.remove(approveOTPFragment);
            transaction.commit();
        }
    }

    public void loadActionDialog(){

        try {
            actionDialog.show(getFragmentManager(), "ActionDialog");
            stopTimerTask();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        IntentFilter intentFilter = new IntentFilter("SmsMessage.intent.MAIN");
        mIntentReceiver = new BroadcastReceiver() {
            @TargetApi(Build.VERSION_CODES.KITKAT)
            @Override
            public void onReceive(Context context, Intent intent) {

                try{
                    //removeWaitingFragment();
                    removeApprovalFragment();
                    ///////////////////////////////////////
                    String msgText = intent.getStringExtra("get_otp");
                    String otp = msgText.split("\\|")[0];
                    String senderNo = msgText.split("\\|")[1];
                    if(MyDeviceAPI >=19) {
                        loadApproveOTP(otp, senderNo);
                    }
                }catch(Exception e){
                    e.printStackTrace();
                    Toast.makeText(getApplicationContext(),"Exception :"+e,Toast.LENGTH_SHORT).show();
                }
            }
        };
        this.registerReceiver(mIntentReceiver, intentFilter);
    }

    @Override
    protected void onPause() {
        super.onPause();
        this.unregisterReceiver(this.mIntentReceiver);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig){
        super.onConfigurationChanged(newConfig);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.

        switch (item.getItemId()){
            case android.R.id.home:
                Intent intent = new Intent();
                if(transactionSuccess) {
                    setResult(RESULT_OK, intent);
                    finish();
                } else {
                    setResult(RESULT_CANCELED, intent);
                    finish();
                }
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    // On click of Approve button
    @TargetApi(Build.VERSION_CODES.KITKAT)

    public void respond(String otpText) {

        String data = otpText;
        try{
            // For SBI and all the associates
            if (bankUrl.contains("https://acs.onlinesbi.com/sbi/")) {
                myBrowser.evaluateJavascript("javascript:document.getElementById('otp').value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For Kotak Bank Debit card
            else if (bankUrl.contains("https://cardsecurity.enstage.com/ACSWeb/EnrollWeb/KotakBank")) {
                myBrowser.evaluateJavascript("javascript:document.getElementById('txtOtp').value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For SBI Visa credit card
            else if(bankUrl.contains("https://secure4.arcot.com/acspage/cap")){
                myBrowser.evaluateJavascript("javascript:document.getElementsByName('pin1')[0].value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For SBI and associates banks Net Banking
            else if (bankUrl.contains("https://merchant.onlinesbi.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbi.com/merchant/resendsmsotp.htm") || bankUrl.contains("https://m.onlinesbi.com/mmerchant/smsenablehighsecurity.htm")
                    || bankUrl.contains("https://merchant.onlinesbh.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbh.com/merchant/resendsmsotp.htm")
                    || bankUrl.contains("https://merchant.sbbjonline.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.sbbjonline.com/merchant/resendsmsotp.htm")
                    || bankUrl.contains("https://merchant.onlinesbm.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbm.com/merchant/resendsmsotp.htm")
                    || bankUrl.contains("https://merchant.onlinesbp.com/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.onlinesbp.com/merchant/resendsmsotp.htm")
                    || bankUrl.contains("https://merchant.sbtonline.in/merchant/smsenablehighsecurity.htm") || bankUrl.contains("https://merchant.sbtonline.in/merchant/resendsmsotp.htm")) {
                myBrowser.evaluateJavascript("javascript:document.getElementsByName('securityPassword')[0].value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For ICICI credit card
            else if(bankUrl.contains("https://www.3dsecure.icicibank.com/ACSWeb/EnrollWeb/ICICIBank/server/OtpServer")){
                myBrowser.evaluateJavascript("javascript:document.getElementById('txtAutoOtp').value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For ICICI bank Debit card
            else if(bankUrl.contains("https://acs.icicibank.com/acspage/cap?")){
                myBrowser.evaluateJavascript("javascript:document.getElementById('txtAutoOtp').value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For Citi Bank debit card
            else if(bankUrl.contains("https://www.citibank.co.in/acspage/cap_nsapi.so")){
                myBrowser.evaluateJavascript("javascript:document.getElementsByName('otp')[0].value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For HDFC Debit card and Credit card
            else if(bankUrl.contains("https://netsafe.hdfcbank.com/ACSWeb/jsp/dynamicAuth.jsp?transType=payerAuth")){
                myBrowser.evaluateJavascript("javascript:document.getElementById('txtOtpPassword').value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // HDFC Net Banking
            else if(bankUrl.contains("https://netbanking.hdfcbank.com/netbanking/entry")){
                myBrowser.evaluateJavascript("javascript:document.getElementsByName('fldOtpToken')[0].value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // For Kotak Band visa Credit Card
            else if(bankUrl.contains("https://cardsecurity.enstage.com/ACSWeb/EnrollWeb/KotakBank/server/OtpServer")){
                myBrowser.evaluateJavascript("javascript:document.getElementById('otpValue').value = '" + otpText + "'", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            // for CITI Bank Authenticate with option selection
            if(data.equals("password")){
                myBrowser.evaluateJavascript("javascript:document.getElementById('uid_tb_r').click();", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
            }
            if(data.equals("smsOtp")){
                myBrowser.evaluateJavascript("javascript:document.getElementById('otp_tb_r').click();", new ValueCallback<String>() {
                    @Override
                    public void onReceiveValue(String value) {

                    }
                });
                loadWaitingFragment("cityBankAuthPage");
            }
            loadCounter++;
        }catch (Exception e){
            e.printStackTrace();
        }

    }

    @TargetApi(Build.VERSION_CODES.KITKAT)

    public void actionSelected(String data) {
        try {
            if (data.equals("ResendOTP")) {
                stopTimerTask();
                removeWaitingFragment();
                if (bankUrl.contains("https://cardsecurity.enstage.com/ACSWeb/EnrollWeb/KotakBank")) {
                    myBrowser.evaluateJavascript("javascript:reSendOtp();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {

                        }
                    });
                }
                // For HDFC Credit and Debit Card
                else if(bankUrl.contains("https://netsafe.hdfcbank.com/ACSWeb/jsp/dynamicAuth.jsp?transType=payerAuth")){
                    myBrowser.evaluateJavascript("javascript:generateOTP();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {

                        }
                    });
                }
                // SBI Visa Credit Card
                else if(bankUrl.contains("https://secure4.arcot.com/acspage/cap")){
                    myBrowser.evaluateJavascript("javascript:OnSubmitHandlerResend();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {

                        }
                    });
                }
                // For Kotak Visa Credit Card
                else if(bankUrl.contains("https://cardsecurity.enstage.com/ACSWeb/EnrollWeb/KotakBank/server/OtpServer")){
                    myBrowser.evaluateJavascript("javascript:doSendOTP();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {

                        }
                    });
                }
                // For ICICI Credit Card
                else if(bankUrl.contains("https://www.3dsecure.icicibank.com/ACSWeb/EnrollWeb/ICICIBank/server/OtpServer")){
                    myBrowser.evaluateJavascript("javascript:resend_otp();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {}
                    });
                }
                else {
                    myBrowser.evaluateJavascript("javascript:resendOTP();", new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String value) {

                        }
                    });
                }
                //loadCounter=0;
            } else if (data.equals("EnterOTPManually")) {
                stopTimerTask();
                removeWaitingFragment();
            } else if (data.equals("Cancel")) {
                stopTimerTask();
                removeWaitingFragment();
            }
        }catch (Exception e){
            Toast.makeText(getApplicationContext(),"Action not available for this Payment Option !", Toast.LENGTH_LONG).show();
            e.printStackTrace();
        }
    }
}
