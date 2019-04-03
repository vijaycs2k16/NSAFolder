package nexrise.publication.in.nexrise.Common;

import android.app.ProgressDialog;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageView;
import android.widget.Toast;

import com.bumptech.glide.Glide;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.Gallery.BaseImageActivity;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.Utils.StringUtils;
import nexrise.publication.in.nexrise.Utils.Utility;

public class AttachmentPreviewActivity extends BaseImageActivity implements Constants {
    SharedPreferences preferences;
    String fileName = "";
    String imageUrl;
    String filePath = "";
    StringUtils utils;
    Utility utility;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_attachment_preview);
        utils = new StringUtils();
        imageUrl = getIntent().getStringExtra("Image");
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String schoolId = preferences.getString(SCHOOL_ID, null);
        String[] file = imageUrl.split("/");
        fileName = file[file.length-1];
        String baseUrl = AWS_BASE_URL + schoolId + "/";
        String completeUrl;
        if(imageUrl.contains(baseUrl)){
            completeUrl = imageUrl;
        } else {
            completeUrl = baseUrl + imageUrl;
        }

        ActionBar actionBar = getSupportActionBar();
        if(actionBar!= null) {
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
            actionBar.setTitle(R.string.preview);
        }
        showPreview(completeUrl);
    }

    private void showPreview(String completeUrl) {
        WebView webView = (WebView)findViewById(R.id.attachment);
        ImageView imageView = (ImageView)findViewById(R.id.imageView2);
        webView.setWebViewClient(new Callback());
        webView.getSettings().setJavaScriptEnabled(true);
        webView.getSettings().setPluginState(WebSettings.PluginState.ON);
        webView.getSettings().setAppCacheEnabled(true);
        webView.getSettings().setDomStorageEnabled(true);
        String url = completeUrl.toLowerCase();

        if(url.endsWith("pdf") || url.endsWith("doc") || url.endsWith("docx") || url.endsWith("docs") || url.endsWith("txt") || url.endsWith("xlsx") || url.endsWith("xls")) {
            webView.setVisibility(View.VISIBLE);
            imageView.setVisibility(View.GONE);
            webView.setWebViewClient(new WebViewClient() {
                ProgressDialog progressDialog = new ProgressDialog(AttachmentPreviewActivity.this, ProgressDialog.STYLE_SPINNER);

                @Override
                public void onPageStarted(WebView view, String url, Bitmap favicon) {
                    super.onPageStarted(view, url, favicon);
                    progressDialog.setMessage(getResources().getText(R.string.loading));
                    progressDialog.setCanceledOnTouchOutside(false);
                    progressDialog.show();
                }

                @Override
                public void onPageFinished(WebView view, String url) {
                    super.onPageFinished(view, url);
                    Log.v("WEBVIEW ","FINISHED ");
                    progressDialog.dismiss();
                }

                @Override
                public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                    super.onReceivedError(view, request, error);
                    if(progressDialog.isShowing())
                        progressDialog.dismiss();
                    Toast.makeText(AttachmentPreviewActivity.this, R.string.oops, Toast.LENGTH_SHORT).show();
                }
            });
            webView.loadUrl("http://docs.google.com/gview?embedded=true&url=" + completeUrl);
        } else if (url.endsWith("jpg") || url.endsWith("jpeg")|| url.endsWith("png") || url.endsWith("bmp") || url.endsWith("gif")) {
            Glide.with(this)
                    .load(completeUrl)
                    .placeholder(R.drawable.loading).into(imageView);
        } else {
            Glide.with(this)
                    .load(completeUrl)
                    .placeholder(R.drawable.broken_image);
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.download_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.download:
                Log.v("Image ","url "+imageUrl);
                Log.v("Image ","Name "+fileName);
                fileDownload(imageUrl, fileName);
                break;

            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private class Callback extends WebViewClient {
        @Override
        public boolean shouldOverrideUrlLoading(
                WebView view, String url) {
            return (false);
        }
    }
}
