package nexrise.publication.in.nexrise.Taxanomy;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import com.unnamed.b.atv.model.TreeNode;

import java.util.List;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Karthik on 2/15/15.
 */
public class SelectableItemHolder extends TreeNode.BaseNodeViewHolder<IconTreeItemHolder.IconTreeItem> implements Constants{
    private TextView tvValue;
    private CheckBox nodeSelector;
    private String fromActivity;

    public SelectableItemHolder(Context context, String fromActivity) {
        super(context);
        this.fromActivity = fromActivity;
    }

    @Override
    public View createNodeView(final TreeNode node, IconTreeItemHolder.IconTreeItem value) {
        final LayoutInflater inflater = LayoutInflater.from(context);
        final View view = inflater.inflate(R.layout.layout_selectable_item, null, false);

        tvValue = (TextView) view.findViewById(R.id.node_value);
        tvValue.setText(value.text);

        nodeSelector = (CheckBox) view.findViewById(R.id.node_selector);
        nodeSelector.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                node.setSelected(isChecked);
                //selectionMethod(node,isChecked);
                if(fromActivity!= null && !fromActivity.isEmpty() && fromActivity.equals(HOMEWORKFEATURE))
                    disableChildNodes(node, isChecked);
            }

            private void selectionMethod(TreeNode node, boolean isChecked) {
                    List<TreeNode> childrens = node.getParent().getChildren();
                    for (int i=0; i<childrens.size(); i++) {
                        if (childrens.get(i).isSelected() ==  isChecked){
                            if(i == (childrens.size()-1)) {
                                Log.v("isCheckedcheck", " "+isChecked);
                                View parentView = node.getParent().getViewHolder().getView();
                                CheckBox parentCheckBox = (CheckBox) parentView.findViewById(R.id.node_selector);
                                parentCheckBox.setChecked(isChecked);
                            } else {
                                View parentView = node.getParent().getViewHolder().getView();
                                CheckBox parentCheckBox = (CheckBox) parentView.findViewById(R.id.node_selector);
                                parentCheckBox.setChecked(false);
                            }
                        } else
                            break;
                    }

            }
        });
        nodeSelector.setChecked(node.isSelected());

        if (node.isLastChild()) {
            view.findViewById(R.id.bot_line).setVisibility(View.INVISIBLE);
        }

        return view;
    }


    @Override
    public void toggleSelectionMode(boolean editModeEnabled) {
        nodeSelector.setVisibility(editModeEnabled ? View.VISIBLE : View.GONE);
        nodeSelector.setChecked(mNode.isSelected());
    }

    private void disableChildNodes(TreeNode node, boolean isChecked) {
        List<TreeNode> parentNodes = node.getParent().getParent().getChildren();
        IconTreeItemHolder.IconTreeItem child = (IconTreeItemHolder.IconTreeItem)node.getValue();
        boolean canEnable = false;
        for (int i=0; i<parentNodes.size(); i++) {
            IconTreeItemHolder.IconTreeItem parent = (IconTreeItemHolder.IconTreeItem)parentNodes.get(i).getValue();
            List<TreeNode> subChild = parentNodes.get(i).getChildren();

            if (isChecked && !child.parentId.equals(parent.categoryId)) {
                View childView = parentNodes.get(i).getViewHolder().getView();
                CheckBox childCheckBox = (CheckBox) childView.findViewById(R.id.node_selector);
                childCheckBox.setEnabled(false);
            } else if (!isChecked) {
                canEnable = canEnable(node);
                if(canEnable) {
                    View childView = parentNodes.get(i).getViewHolder().getView();
                    CheckBox childCheckBox = (CheckBox) childView.findViewById(R.id.node_selector);
                    childCheckBox.setEnabled(true);
                }
            }

            for (int j=0; j<subChild.size(); j++) {
                if (isChecked && !child.parentId.equals(parent.categoryId)) {
                    View childView = subChild.get(j).getViewHolder().getView();
                    CheckBox childCheckBox = (CheckBox) childView.findViewById(R.id.node_selector);
                    childCheckBox.setEnabled(false);
                } else if (!isChecked && canEnable) {
                    View childView = subChild.get(j).getViewHolder().getView();
                    CheckBox childCheckBox = (CheckBox) childView.findViewById(R.id.node_selector);
                    childCheckBox.setEnabled(true);
                }
            }
        }
    }

    private boolean canEnable(TreeNode node) {
        boolean enable = true;
        if(node.getParent().isSelected()) {
            enable = false;
        } else {
            List<TreeNode> childrens = node.getParent().getChildren();
            for (int i=0; i<childrens.size(); i++) {
                if(childrens.get(i).isSelected()) {
                    enable = false;
                }
            }
        }
        return enable;
    }
}
