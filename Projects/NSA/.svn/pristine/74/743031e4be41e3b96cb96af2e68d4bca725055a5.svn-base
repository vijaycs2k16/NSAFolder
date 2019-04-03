package nexrise.publication.in.nexrise.Gallery;

import android.app.ProgressDialog;
import android.os.Bundle;
import android.support.v7.app.ActionBar;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;

import nexrise.publication.in.nexrise.R;

public class VideoPreviewActivity extends BaseImageActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_video_preview);
        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setDisplayShowHomeEnabled(true);
        }
        String fileUrl = getIntent().getStringExtra("FileUrl");
        WebView webView = (WebView)findViewById(R.id.video_view);
        webView.getSettings().setPluginState(WebSettings.PluginState.OFF);
        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);
        webView.getSettings().setUserAgentString("Android Mozilla/5.0 AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30");

        webView.setWebChromeClient(new WebChromeClient() {
            ProgressDialog progressDialog = new ProgressDialog(VideoPreviewActivity.this, ProgressDialog.STYLE_SPINNER);
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                super.onProgressChanged(view, newProgress);
                progressDialog.setMessage(getResources().getText(R.string.loading));
                progressDialog.show();
                if(newProgress == 100)
                    progressDialog.dismiss();
            }
        });
       /* webView.setWebViewClient(newWebViewClient(){
            ProgressDialog progressDialog = new ProgressDialog(VideoPreviewActivity.this, ProgressDialog.STYLE_SPINNER);
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressDialog.setMessage("Loading...");
                progressDialog.show();
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                if(progressDialog.isShowing())
                    progressDialog.dismiss();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if(progressDialog.isShowing())
                    progressDialog.dismiss();
                Toast.makeText(VideoPreviewActivity.this, "Can't load video", Toast.LENGTH_SHORT).show();
            }
        });*/

      //  webView.loadData("<iframe src=\"https://player.vimeo.com/video/232005590?badge=0&autopause=0&player_id=0\" width=\"400\" height=\"300\" frameborder=\"0\" title=\"Untitled\" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>", "text/html", "utf-8");
        webView.loadUrl(fileUrl);
        /*VideoView videoView = (VideoView)findViewById(R.id.video_view);
        Uri uri = Uri.parse("http://player.vimeo.com/video/231981831");
        videoView.setVideoURI(uri);
        videoView.requestFocus();
        videoView.start();*/
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.download_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                finish();
                break;
        }
        return super.onOptionsItemSelected(item);
    }
}
