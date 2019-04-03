package nexrise.publication.in.nexrise.Taxanomy;

import android.app.Activity;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;
import android.util.Log;

import com.unnamed.b.atv.model.TreeNode;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by karthik on 21-02-2017.
 */
class TaxanomyTreeBuilder implements Constants{

    private Activity context;
    private String fromActivity;
    private TreeNode root = TreeNode.root();
    private String category;
    private String value ;
    private TreeNode parent;
    private String parentId;
    private String id;
    private TreeNode subChild;
    private TreeNode child;
    HashMap<String, Boolean> used = new HashMap<>();

    String jsonString;
    JSONObject retrievedObj = new JSONObject();
    TaxanomyTreeBuilder(Activity context,String fromActivity){
        this.context = context;
        this.fromActivity = fromActivity;
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
        jsonString = preferences.getString(TAXANOMY_SELECTION, null);
        Log.v("Selected","Json"+jsonString);
    }

    TreeNode draftTree(String categoryID, JSONArray ary){
        boolean childExpanded = false;
        for (int i=0; i<ary.length(); i++) {
            try {
                JSONObject obj = ary.getJSONObject(i);
                category = obj.getString("category_id");
                value = obj.getString("label");
                id = obj.getString("id");
                parentId = obj.getString("parent_id");
                boolean selected = false;
                boolean expanded = false;

                if(obj.has("selected"))
                    selected = obj.getBoolean("selected");
                if(obj.has("expanded"))
                    expanded = obj.getBoolean("expanded");

                JSONArray subChild = obj.getJSONArray("children");

                // This adds the parent in the hierachy
                if(!categoryID.equals(parentId)) {
                    parent = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                    root.addChild(parent);

                    if(expanded) expand(parent);
                    if((jsonString != null && jsonString.contains(category)) || selected)
                        select(parent);

                } else {
                    // If parent has a child then this condition adds child to the parent
                    this.subChild = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                    if(subChild.length() !=0) {
                        child = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                        parent.addChild(child);

                        if((jsonString != null && jsonString.contains(category)) || selected) {
                            select(child);
                            expand(parent);
                            expand(root);
                            expand(child);
                        }
                    }
                }
                used.put(category, false);
                draftTree(category, subChild);
                // This adds the subchild to the child in the hierachy
                if(this.subChild != null && !used.get(category) && child != null) {

                    TreeNode children = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_sd_storage, value, category, parentId, id)).setViewHolder(new SelectableItemHolder(context, fromActivity));
                    this.subChild = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_sd_storage, value, category, parentId, id)).setViewHolder(new SelectableItemHolder(context, fromActivity));
                    IconTreeItemHolder.IconTreeItem treeItem = (IconTreeItemHolder.IconTreeItem)child.getValue();
                    if(treeItem.categoryId.equals(parentId)) {
                        child.addChild(children);
                        if((jsonString != null && jsonString.contains(category)) || selected) {
                            expand(parent);
                            select(children);
                            expand(child);
                        }
                    }
                    else {
                        child = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                        parent.addChild(child);

                        if((jsonString != null && jsonString.contains(category)) || selected) {
                            select(child);
                            expand(parent);
                        }
                    }
                    used.put(category, true);

                } else if(this.subChild != null && !used.get(category) && child == null) {
                    child = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                    parent.addChild(child);

                    if((jsonString != null && jsonString.contains(category)) || selected) {
                        select(child);
                        expand(parent);
                        expand(root);
                        expand(child);
                    }
                    child = null;
                    used.put(category, true);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return root;
    }

    TreeNode parse(String categoryID, JSONArray ary) {

        for (int i=0; i<ary.length(); i++) {
            try {
                JSONObject obj = ary.getJSONObject(i);
                category = obj.getString("category_id");
                value = obj.getString("label");
                id = obj.getString("id");
                parentId = obj.getString("parent_id");

                JSONArray subChild = obj.getJSONArray("children");
                // This adds the parent in the hierachy

                if(!categoryID.equals(parentId)) {
                    parent = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                    root.addChild(parent);

                    if(jsonString != null && jsonString.contains(category))
                        select(parent);

                } else {
                    // If parent has a child then this condition adds child to the parent
                    this.subChild = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                    if(subChild.length() !=0) {
                        child = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                        parent.addChild(child);
                        if(jsonString != null && jsonString.contains(category)) {
                            select(child);
                            expand(parent);
                            expand(root);
                            expand(child);
                        }
                    }
                }
                used.put(category, false);
                parse(category, subChild);
                // This adds the subchild to the child in the hierachy
                if(this.subChild != null && !used.get(category) && child != null) {

                    TreeNode children = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_sd_storage, value, category, parentId, id)).setViewHolder(new SelectableItemHolder(context, fromActivity));
                    this.subChild = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_sd_storage, value, category, parentId, id)).setViewHolder(new SelectableItemHolder(context, fromActivity));
                    IconTreeItemHolder.IconTreeItem treeItem = (IconTreeItemHolder.IconTreeItem)child.getValue();

                    if(treeItem.categoryId.equals(parentId)) {
                        child.addChild(children);
                        if(jsonString != null && jsonString.contains(category)) {
                            expand(parent);
                            select(children);
                            expand(child);
                        }
                    } else {
                        child = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                        parent.addChild(child);
                        if(jsonString != null && jsonString.contains(category))
                            select(child);
                    }
                    used.put(category, true);

                } else if(this.subChild != null && !used.get(category) && child == null) {
                    child = new TreeNode(new IconTreeItemHolder.IconTreeItem(R.string.ic_folder, value, category, parentId, id)).setViewHolder(new SelectableHeaderHolder(context, fromActivity));
                    parent.addChild(child);

                    if(jsonString != null && jsonString.contains(category)) {
                        select(child);
                        expand(parent);
                        expand(root);
                        expand(child);
                    }
                    child = null;
                    used.put(category, true);
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return root;
    }

    private void expand(TreeNode treeNode) {
        if(!treeNode.isExpanded())
            treeNode.setExpanded(true);
    }

    private void select(TreeNode treeNode) {
        if(!treeNode.isSelected())
            treeNode.setSelected(true);
    }

    private JSONObject getSelection(String id){
        JSONObject jsonObject = new JSONObject();
        if(jsonString != null) {
            try {
                JSONObject entireOject = new JSONObject(jsonString);
                JSONArray selectedNodes = entireOject.getJSONArray("selectedNodes");
                for (int i = 0; i < selectedNodes.length(); i++) {
                    JSONObject entry = selectedNodes.getJSONObject(i);
                    String class_id = entry.getString("classId");
                    if (class_id.equals(id)) {
                        return entry;
                    }
                }
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        return jsonObject;
    }
}

