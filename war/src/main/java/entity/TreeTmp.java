// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

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
