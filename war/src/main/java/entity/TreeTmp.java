package entity;

import java.util.List;

public class TreeTmp extends TreeNode{

    private List<TreeTmp> children;

    public TreeTmp(Long id, Long parent, String title) {
       super(id, parent,title);
    }

    public List<TreeTmp> getChildren() {
        return children;
    }

    public void setChildren(List<TreeTmp> children) {
        this.children = children;
    }
}
