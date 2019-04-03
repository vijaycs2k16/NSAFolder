package nexrise.publication.in.nexrise.Taxanomy;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.support.v7.app.ActionBar;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.unnamed.b.atv.model.TreeNode;
import com.unnamed.b.atv.view.AndroidTreeView;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

import nexrise.publication.in.nexrise.BeanClass.Classes;
import nexrise.publication.in.nexrise.Common.SessionExpiredException;
import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;
import nexrise.publication.in.nexrise.URLConnection.GETUrlConnection;
import nexrise.publication.in.nexrise.Utils.StringUtils;

public class TaxonomyActivity extends AppCompatActivity implements Constants{
    private AndroidTreeView tView;
    TreeNode root = TreeNode.root();
    Bundle savedInstanceState;
    SharedPreferences preferences;
    SharedPreferences.Editor editor;
    String fromActivity = "";
    boolean taxanomyWithoutEmployees = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        this.savedInstanceState = savedInstanceState;
        setContentView(R.layout.activity_taxonomy);
        overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
        Intent intent = getIntent();
        if(intent.hasExtra(FROM))
            fromActivity = intent.getStringExtra(FROM);

        ActionBar actionBar = getSupportActionBar();
        preferences = PreferenceManager.getDefaultSharedPreferences(this);
        editor = preferences.edit();

        if (actionBar!=null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
            actionBar.setTitle(R.string.taxanomy);
            actionBar.setHomeButtonEnabled(true);
            Drawable drawable = getResources().getDrawable(R.drawable.actionbar_tablayout_color);
            actionBar.setBackgroundDrawable(drawable);
            actionBar.setElevation(0);
        }

        final ViewGroup containerView = (ViewGroup)findViewById(R.id.container);
        if (intent.hasExtra("notifiedCategories")){
            String notifiedCategories = getIntent().getStringExtra("notifiedCategories");
            Log.v("Taxonomy","Notify"+notifiedCategories);
            try {
                JSONArray notifyArray = new JSONArray(notifiedCategories);

                ArrayList<Classes> selectedClasses = draftSelection(notifyArray);
                Log.v("Selected ","classes "+selectedClasses.size());
                if(fromActivity.equals(HOMEWORKFEATURE) && selectedClasses.size() == 1) {
                    StringUtils.taxanomyWithourEmployees = notifyArray;
                    taxanomyWithoutEmployees = true;
                    TaxanomyTreeBuilder taxanomyTreeBuilder = new TaxanomyTreeBuilder(TaxonomyActivity.this, fromActivity);
                    root = taxanomyTreeBuilder.draftTree("", notifyArray);
                } else if(fromActivity.equals(HOMEWORKFEATURE) && selectedClasses.size() > 1) {
                    StringUtils.taxanomy = notifyArray;
                    taxanomyWithoutEmployees = true;
                    TaxanomyTreeBuilder taxanomyTreeBuilder = new TaxanomyTreeBuilder(TaxonomyActivity.this, "");
                    root = taxanomyTreeBuilder.draftTree("", notifyArray);
                } else {
                    StringUtils.taxanomy = notifyArray;
                    TaxanomyTreeBuilder taxanomyTreeBuilder = new TaxanomyTreeBuilder(TaxonomyActivity.this, "");
                    root = taxanomyTreeBuilder.draftTree("", notifyArray);
                }
                tView = new AndroidTreeView(TaxonomyActivity.this, root);
                tView.setDefaultAnimation(true);
                tView.setSelectionModeEnabled(true);
                containerView.addView(tView.getView());
            } catch (Exception e) {
                renderTaxanomy(containerView);
            }
        } else {
            renderTaxanomy(containerView);
        }
    }

    public ArrayList<Classes> draftSelection(JSONArray classesArray) {
        ArrayList<Classes> classlist = new ArrayList<Classes>();
        try {
            for (int i = 0; i < classesArray.length(); i++) {
                JSONObject classesObject = classesArray.getJSONObject(i);
                String classeslabel = classesObject.getString("label");

                if (classeslabel.equalsIgnoreCase("All Classes")) {

                    JSONArray classArray = classesObject.getJSONArray("children");
                    for (int k = 0; k < classArray.length(); k++) {
                        JSONObject classObject = classArray.getJSONObject(k);
                        boolean selected = false;
                        boolean partialSelected = false;

                        if(classObject.has("selected"))
                            selected = classObject.getBoolean("selected");
                        if(classObject.has("partialSelection"))
                            partialSelected = classObject.getBoolean("partialSelection");

                        if(selected || partialSelected) {
                            String classid = classObject.getString("id");
                            String classlabel = classObject.getString("label");
                            String classParentId = classObject.getString("parent_id");
                            String classCategoryId = classObject.getString("category_id");

                            JSONArray sectionArray = classObject.getJSONArray("children");
                            ArrayList<Classes> sectionlist = new ArrayList<>();
                            for (int j = 0; j < sectionArray.length(); j++) {
                                JSONObject sectionObject = sectionArray.getJSONObject(j);
                                String sectionlabel = sectionObject.getString("label");
                                String sectionid = sectionObject.getString("id");
                                String sectionParentId = sectionObject.getString("parent_id");
                                String sectionCategoryId = sectionObject.getString("category_id");

                                Classes sections = new Classes();
                                sections.setId(sectionid);
                                sections.setLabel(sectionlabel);
                                sections.setParentId(sectionParentId);
                                sections.setCategoryId(sectionCategoryId);
                                sectionlist.add(sections);
                            }
                            Classes classes = new Classes();
                            classes.setId(classid);
                            classes.setLabel(classlabel);
                            classes.setSections(sectionlist);
                            classes.setParentId(classParentId);
                            classes.setCategoryId(classCategoryId);
                            classlist.add(classes);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return classlist;
    }

    public void renderTaxanomy(final ViewGroup containerView) {
        String url;
        if(fromActivity.equals(HOMEWORKFEATURE)) {
            url = BASE_URL + API_VERSION_ONE + TAXANOMY + CLASSES + "3";
            taxanomyWithoutEmployees = true;
            if(StringUtils.taxanomyWithourEmployees == null)
                fetchData(url, containerView, true);
            else {
                TaxanomyTreeBuilder taxanomyTreeBuilder = new TaxanomyTreeBuilder(TaxonomyActivity.this, fromActivity);
                root = taxanomyTreeBuilder.parse("", StringUtils.taxanomyWithourEmployees);
                tView = new AndroidTreeView(TaxonomyActivity.this, root);
                tView.setDefaultAnimation(true);
                tView.setSelectionModeEnabled(true);
                containerView.addView(tView.getView());
            }
        } else {
            url = BASE_URL + API_VERSION_ONE + TAXANOMY;
            fetchData(url, containerView, false);
        }
    }

    private void fetchData(String url, final ViewGroup containerView, final boolean taxanomyWihoutEmployees) {
        final ProgressBar progressBar = (ProgressBar) findViewById(R.id.taxanomy_loading);

        GETUrlConnection getUrlConnection = new GETUrlConnection(this, url,null) {
            @Override
            protected void onPreExecute() {
                super.onPreExecute();
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            protected void onPostExecute(String response) {
                super.onPostExecute(response);
                progressBar.setVisibility(View.GONE);
                JSONObject jsonObject = null;
                Log.v("taxanomy ", " " + response);
                if (response != null) {
                    try {
                        new StringUtils().checkSession(response);
                        jsonObject = new JSONObject(response);
                        if(taxanomyWihoutEmployees) {
                            taxanomyWithoutEmployees = true;
                            StringUtils.taxanomyWithourEmployees = jsonObject.getJSONArray("data");

                            TaxanomyTreeBuilder taxanomyTreeBuilder = new TaxanomyTreeBuilder(TaxonomyActivity.this, fromActivity);
                            root = taxanomyTreeBuilder.parse("", StringUtils.taxanomyWithourEmployees);
                        } else {
                            taxanomyWithoutEmployees = false;
                            StringUtils.taxanomy = jsonObject.getJSONArray("data");

                            TaxanomyTreeBuilder taxanomyTreeBuilder = new TaxanomyTreeBuilder(TaxonomyActivity.this, fromActivity);
                            root = taxanomyTreeBuilder.parse("", StringUtils.taxanomy);
                        }

                        tView = new AndroidTreeView(TaxonomyActivity.this, root);
                        tView.setDefaultAnimation(true);
                        tView.setSelectionModeEnabled(true);
                        containerView.addView(tView.getView());
                    } catch (JSONException e) {
                        e.printStackTrace();
                    } catch (SessionExpiredException e) {
                        e.handleException(TaxonomyActivity.this);
                    }
                } else {
                    TextView noContent = (TextView) findViewById(R.id.no_content);
                    noContent.setVisibility(View.VISIBLE);
                }
            }
        };
        getUrlConnection.execute();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.add_homework_actionbar, menu);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                editor.putString(TAXANOMY_SELECTION, null);
                editor.apply();
                setResult(RESULT_CANCELED);
                finish();
                overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
                break;
            case R.id.tick:
                Intent callback = new Intent();
                try {
                    tView.expandLevel(1);
                    JSONObject taxanomyJson = generateJsonArray();
                    String selectedNodes = taxanomyJson.getJSONArray("selectedNodes").toString();
                    String esQuery = elasticsearchQueryBuilder().toString();
                    callback.putExtra("Taxanomy json", taxanomyJson.toString());
                    callback.putExtra("ES query",esQuery);
                    Log.v("TAXANOMY ","SELECTION "+esQuery);
                    Log.v("TAXANOMY ","taxanomyJson "+taxanomyJson);

                    editor.putString(TAXANOMY_SELECTION, selectedNodes);
                    editor.apply();

                    setResult(RESULT_OK, callback);
                    finish();
                    overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
                } catch(JSONException | NullPointerException e) {
                    setResult(RESULT_CANCELED);
                    finish();
                    overridePendingTransition(R.anim.right_to_left_anim, R.anim.exit_animation);
                }

                break;
        }
        return super.onOptionsItemSelected(item);
    }

    private JSONObject generateJsonArray() throws JSONException{
        ArrayList<TreeNode> selected =  tView.getSelected();
        JSONArray selectedNodes = new JSONArray();
        JSONObject taxanomyJson = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        JSONArray userType = new JSONArray();
        JSONArray users = new JSONArray();
        int selectedEmpCount = 0;
        int empCount = 0;
        String text = "";

        for (int i=0; i<selected.size(); i++) {
            IconTreeItemHolder.IconTreeItem treeItem = (IconTreeItemHolder.IconTreeItem)selected.get(i).getValue();
            selectedNodes.put(treeItem.categoryId);

            if(treeItem.text.equalsIgnoreCase("All Employee") || treeItem.categoryId.equals(CATEGORY_ID)) {
                empCount = selected.get(i).getChildren().size();
                text = treeItem.text;
              //  userType.put(treeItem.text);
            } else if (treeItem.parentId.equals(CATEGORY_ID)) {
                ++selectedEmpCount;
                users.put(treeItem.id);
            }
            if(i == selected.size()-1) {
                if(empCount != 0 && selectedEmpCount != 0 && empCount == selectedEmpCount)
                    userType.put(text);
            }
        }
        notifyTo.putOpt("userType", userType);
        taxanomyJson.putOpt("users", users);
        taxanomyJson.putOpt("notifyTo", notifyTo);
        taxanomyJson.putOpt("selectedNodes", selectedNodes);
        Log.v("Selected Nodes ","Type"+userType);
        if(taxanomyWithoutEmployees)
            taxanomyJson.putOpt("taxanomy", StringUtils.taxanomyWithourEmployees);
        else
            taxanomyJson.putOpt("taxanomy", StringUtils.taxanomy);
        return taxanomyJson;
    }

    public JSONObject elasticsearchQueryBuilder() {
        ArrayList<TreeNode> selected =  tView.getSelected();
        JSONArray classesAry = new JSONArray();
        JSONObject taxanomyJson = new JSONObject();
        JSONObject notifyTo = new JSONObject();
        JSONArray userType = new JSONArray();
        int index = 0;

        for (int i=0; i<selected.size(); i++) {
            if(selected.get(i).isLeaf()) {
                IconTreeItemHolder.IconTreeItem treeItem = (IconTreeItemHolder.IconTreeItem)selected.get(i).getValue();
                IconTreeItemHolder.IconTreeItem parentItem = (IconTreeItemHolder.IconTreeItem)selected.get(i).getParent().getValue();
                JSONObject classesObj = new JSONObject();
                JSONArray sectionsArray = new JSONArray();
                if(parentItem!= null) {
                    String parentId = parentItem.id;
                    try {
                        if(!classesAry.toString().contains(parentId)) {
                            classesObj.put("id", parentId);
                            for (int j=0; j < selected.size(); j++) {
                                IconTreeItemHolder.IconTreeItem child = (IconTreeItemHolder.IconTreeItem)selected.get(j).getValue();
                                IconTreeItemHolder.IconTreeItem parent = (IconTreeItemHolder.IconTreeItem)selected.get(j).getParent().getValue();
                                if(parent != null) {
                                    if (parent.id.equals(parentId))
                                        sectionsArray.put(child.id);
                                }
                            }
                            classesObj.put("section", sectionsArray);
                            classesAry.put(classesObj);
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                } else {
                    userType.put(treeItem.text);
                }
            }
        }
        try {
            taxanomyJson.putOpt("classes", classesAry);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return taxanomyJson;
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        editor.putString(TAXANOMY_SELECTION, null);
        editor.apply();
        setResult(RESULT_CANCELED);
    }
}
