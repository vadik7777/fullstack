package entity;

public class TreeNode {
    private Long id;
    private Long parent;
    private String title;

    public TreeNode(Long id, Long parent, String title) {
        this.id = id;
        this.parent = parent;
        this.title = title;
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

    public Long getParent() {
        return parent;
    }

    public void setParent(Long parent) {
        this.parent = parent;
    }
}
