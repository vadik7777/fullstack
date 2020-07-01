package entity;

import java.util.List;

public class TreeTmp {
    private Long id;
    private Long parent;
    private String title;
    private List<TreeTmp> children;

    public TreeTmp(Long id, Long parent, String title) {
        this.id = id;
        this.title = title;
        this.parent = parent;
    }

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<TreeTmp> getChildren() {
        return children;
    }

    public void setChildren(List<TreeTmp> children) {
        this.children = children;
    }
}
