package nexrise.publication.in.nexrise.TimetableFeature;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.preference.PreferenceManager;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.bumptech.glide.Glide;

import org.apache.http.message.BasicHeader;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.List;
import java.util.Map;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.DELETEUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

/**
 * Created by Karthik on 5/9/2017.
 */

class AttachmentsArrayAdapter extends BaseAdapter implements Constants {
    private Activity context;
    private List<Map.Entry<String, String>> attachments;
    SharedPreferences preferences;
    private String schoolId;
    private String uploadId;
    AttachmentsArrayAdapter(Activity context, List<Map.Entry<String, String>> attachments, String uploadId) {
        this.context = context;
        this.attachments = attachments;
        preferences = PreferenceManager.getDefaultSharedPreferences(context);
        schoolId = preferences.getString(SCHOOL_ID, null);
        this.uploadId = uploadId;
    }

    @Override
    public int getCount() {
        return attachments.size();
    }

    @Override
    public Object getItem(int position) {
        return attachments.get(position);
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        LayoutInflater inflater = context.getLayoutInflater();
        ViewHolder holder = new ViewHolder();
        final Map.Entry<String, String> attachment = (Map.Entry<String, String>)getItem(position);

        if(convertView == null) {
            convertView = inflater.inflate(R.layout.activity_view_notes_gridlayout, parent, false);
            holder.image = (ImageView) convertView.findViewById(R.id.imageView9);
            holder.imageName = (TextView)convertView.findViewById(R.id.textView63);
            holder.closeButton = (ImageView)convertView.findViewById(R.id.close_btn);
            convertView.setTag(holder);
        } else
            holder = (ViewHolder)convertView.getTag();

        final String imageUrl = attachment.getKey();
        String[] fileName = imageUrl.split("/");
        String filename = fileName[fileName.length-1];
        String baseUrl = AWS_BASE_URL + schoolId + "/";
        String completeUrl;
        if(imageUrl.contains(baseUrl)){
            completeUrl = imageUrl;
        } else {
            completeUrl = baseUrl + imageUrl;
        }
        Log.v("Complete ","url "+completeUrl);
        Drawable loadingFailed = context.getResources().getDrawable(R.drawable.broken_image);

        if(!uploadId.isEmpty()) {
            holder.closeButton.setVisibility(View.VISIBLE);
            holder.closeButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(final View view) {
                    JSONObject jsonObject = new JSONObject();
                    JSONArray attachmentsAry = new JSONArray();

                    try {
                        for(int i=0; i<attachments.size(); i++) {
                            JSONObject attachmentObj = new JSONObject();
                            attachmentObj.put("id", attachments.get(i).getKey());
                            attachmentObj.put("name", attachments.get(i).getValue());
                            attachmentsAry.put(attachmentObj);
                        }
                        jsonObject.put("curentFile",imageUrl);
                        jsonObject.putOpt("attachments", attachmentsAry);

                        String url = BASE_URL + API_VERSION_ONE + SMS + NOTIFICATION + ATTACHMENTS + uploadId;
                        Log.v("Attachments "," url "+url);
                        //Deleting attachment feasibility is given only to notification feature so notification feature id is given directly
                        BasicHeader[] headers = StringUtils.getInstance().headers(context, CREATE_NOTIFICATION);

                        DELETEUrlConnection deleteUrlConnection = new DELETEUrlConnection(context, url, jsonObject, headers) {
                            ProgressDialog progressDialog = new ProgressDialog(context, ProgressDialog.STYLE_SPINNER);
                            @Override
                            protected void onPreExecute() {
                                super.onPreExecute();
                                progressDialog.setMessage("Deleting image");
                                progressDialog.setCancelable(false);
                                progressDialog.setCanceledOnTouchOutside(false);
                                progressDialog.show();
                            }

                            @Override
                            protected void onPostExecute(String s) {
                                super.onPostExecute(s);
                                progressDialog.dismiss();
                                try {
                                    JSONObject deleteObj = new JSONObject(s);
                                    boolean success = deleteObj.getBoolean(SUCCESS);
                                    if(success) {
                                        attachments.remove(attachment);
                                        ViewNotesActivity viewNotes = (ViewNotesActivity)context;
                                        viewNotes.removeAttachments(attachment);
                                        Log.v("Attachments "," response "+attachment);
                                        notifyDataSetChanged();
                                    }
                                } catch (NullPointerException | JSONException e) {
                                    e.printStackTrace();
                                }
                                Log.v("Attachments "," response "+s);
                            }
                        }; deleteUrlConnection.execute();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            });
        }
        else
            holder.closeButton.setVisibility(View.INVISIBLE);

        if(completeUrl.contains("pdf"))
            Glide.with(context)
                    .load(completeUrl)
                    .placeholder(R.drawable.pdf_file_format).into(holder.image).onLoadFailed(new Exception("Loading failed"), loadingFailed);
        else if (completeUrl.contains("doc"))
            Glide.with(context)
                    .load(completeUrl)
                    .placeholder(R.drawable.doc_file_format).into(holder.image).onLoadFailed(new Exception("Loading failed"), loadingFailed);
        else if(completeUrl.contains("txt"))
            Glide.with(context)
                    .load(completeUrl)
                    .placeholder(R.drawable.txt_file_format).into(holder.image).onLoadFailed(new Exception("Loading failed"), loadingFailed);
        else if (completeUrl.contains("jpg") || completeUrl.contains("png"))
            Glide.with(context)
                    .load(completeUrl)
                    .centerCrop().into(holder.image);
        else
            Glide.with(context)
                    .load(completeUrl)
                    .placeholder(R.drawable.other_file_format).into(holder.image).onLoadFailed(new Exception("Loading failed"), loadingFailed);

        holder.imageName.setText(filename);
        return convertView;
    }

    private class ViewHolder {
        private ImageView image;
        private TextView imageName;
        private ImageView closeButton;
    }
}
