package nexrise.publication.in.nexrise.Taxanomy;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;

import com.github.johnkil.print.PrintView;
import com.unnamed.b.atv.model.TreeNode;

import java.util.List;

import nexrise.publication.in.nexrise.Constants;
import nexrise.publication.in.nexrise.R;

/**
 * Created by Bogdan Melnychuk on 2/15/15.
 */
public class SelectableHeaderHolder extends TreeNode.BaseNodeViewHolder<IconTreeItemHolder.IconTreeItem> implements Constants{
    private TextView tvValue;
    private PrintView arrowView;
    private CheckBox nodeSelector;
    private String fromActivity;

    public SelectableHeaderHolder(Context context, String fromActivity) {
        super(context);
        this.fromActivity = fromActivity;
    }

    @Override
    public View createNodeView(final TreeNode node, IconTreeItemHolder.IconTreeItem value) {
        final LayoutInflater inflater = LayoutInflater.from(context);
        final View view = inflater.inflate(R.layout.layout_selectable_header, null, false);

        tvValue = (TextView) view.findViewById(R.id.node_value);
        tvValue.setText(value.text);

        final PrintView iconView = (PrintView) view.findViewById(R.id.icon);
        iconView.setIconText(context.getResources().getString(value.icon));

        arrowView = (PrintView) view.findViewById(R.id.arrow_icon);
        if (node.isLeaf()) {
            arrowView.setVisibility(View.GONE);
        }

        nodeSelector = (CheckBox) view.findViewById(R.id.node_selector);
       /* nodeSelector.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                boolean isChecked = nodeSelector.isChecked();
                Log.v("Click ","listener "+isChecked);

                node.setSelected(isChecked);
                for (TreeNode n : node.getChildren()) {
                    getTreeView().selectNode(n, isChecked);
                }
                if(fromActivity != null && !fromActivity.isEmpty() && fromActivity.equals(HOMEWORKFEATURE))
                    handleSingleSelection(isChecked, node);
            }
        });*/

        nodeSelector.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton compoundButton, boolean isChecked) {
                node.setSelected(isChecked);
                for (TreeNode n : node.getChildren()) {
                    getTreeView().selectNode(n, isChecked);
                }
                //selectionMethod(node,isChecked, nodeSelector);
                if(fromActivity != null && !fromActivity.isEmpty() && fromActivity.equals(HOMEWORKFEATURE))
                    handleSingleSelection(isChecked, node);
            }
        });
        if(fromActivity != null && !fromActivity.isEmpty() && fromActivity.equals(HOMEWORKFEATURE) && node.getParent().isRoot())
            nodeSelector.setEnabled(false);

        nodeSelector.setChecked(node.isSelected());

        return view;
    }

    private void selectionMethod(TreeNode node, boolean isChecked, CheckBox rootSelector) {
        List<TreeNode> childrens = node.getParent().getChildren();
        for (int i=0; i<childrens.size(); i++) {
            if (childrens.get(i).isSelected() ==  isChecked){
                if(i == (childrens.size()-1)) {
                    Log.v("isChecked2", " "+isChecked);
                    IconTreeItemHolder.IconTreeItem childItem = (IconTreeItemHolder.IconTreeItem)childrens.get(i).getValue();
                    Log.v("label", childItem.text);
                    if(node.getParent().isSelected()) {
                        Log.v("isChecked3", " "+isChecked);
                        rootSelector.setChecked(isChecked);
                    } else {
                        View parentView = node.getParent().getViewHolder().getView();
                        CheckBox parentCheckBox = (CheckBox) parentView.findViewById(R.id.node_selector);
                        parentCheckBox.setChecked(isChecked);
                    }
                }
            } else
                break;
        }

    }

    @Override
    public void toggle(boolean active) {
        arrowView.setIconText(context.getResources().getString(active ? R.string.ic_keyboard_arrow_down : R.string.ic_keyboard_arrow_right));
    }

    @Override
    public void toggleSelectionMode(boolean editModeEnabled) {
        nodeSelector.setVisibility(editModeEnabled ? View.VISIBLE : View.GONE);
        nodeSelector.setChecked(mNode.isSelected());
    }

    private void handleSingleSelection(boolean isChecked, TreeNode node) {
        IconTreeItemHolder.IconTreeItem item = (IconTreeItemHolder.IconTreeItem)node.getValue();
        String selectedItem = item.id;
        String categoryId = item.categoryId;
        Log.v("text parent "," "+item.text);
        if(isChecked) {
            for (int i = 0; i < node.getParent().getChildren().size(); i++) {
                IconTreeItemHolder.IconTreeItem treeItem = (IconTreeItemHolder.IconTreeItem) node.getParent().getChildren().get(i).getValue();
                Log.v("text child "," "+treeItem.text);
                if (!selectedItem.equals(treeItem.id)) {
                    View nodeView = node.getParent().getChildren().get(i).getViewHolder().getView();
                    CheckBox parentNode = (CheckBox) nodeView.findViewById(R.id.node_selector);
                    parentNode.setEnabled(false);
                    if(parentNode.isChecked()) parentNode.setChecked(false);

                    for (int j=0; j< node.getParent().getChildren().size(); j++) {
                        List<TreeNode> childrens = node.getParent().getChildren().get(j).getChildren();
                        for (int k=0; k<childrens.size(); k++) {
                            IconTreeItemHolder.IconTreeItem childItem = (IconTreeItemHolder.IconTreeItem)childrens.get(k).getValue();
                            String childParentId = childItem.parentId;
                            if(!childParentId.equals(categoryId)) {
                                View childView = childrens.get(k).getViewHolder().getView();
                                CheckBox childNode = (CheckBox) childView.findViewById(R.id.node_selector);
                                childNode.setEnabled(false);
                                if(childNode.isChecked()) childNode.setChecked(false);
                            }
                        }
                    }
                }
            }
        } else {
            for (int i = 0; i < node.getParent().getChildren().size(); i++) {
                IconTreeItemHolder.IconTreeItem treeItem = (IconTreeItemHolder.IconTreeItem) node.getParent().getChildren().get(i).getValue();
                View nodeView = node.getParent().getChildren().get(i).getViewHolder().getView();
                CheckBox parentNode = (CheckBox) nodeView.findViewById(R.id.node_selector);
                parentNode.setEnabled(true);

                for (int j=0; j< node.getParent().getChildren().size(); j++) {
                    List<TreeNode> childrens = node.getParent().getChildren().get(j).getChildren();
                    for (int k=0; k<childrens.size(); k++) {
                        View childView = childrens.get(k).getViewHolder().getView();
                        CheckBox childNode = (CheckBox) childView.findViewById(R.id.node_selector);
                        childNode.setEnabled(true);
                    }
                }
            }
        }
    }
}
