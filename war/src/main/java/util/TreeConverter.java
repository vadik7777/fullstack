package util;

import entity.Tree;
import entity.TreeNode;
import entity.TreeTmp;

import java.util.*;

public class TreeConverter {
    static public List<TreeTmp> convert(List<Tree> treeList){

        Set<Long> retry = new HashSet<>();
        HashMap<Long, List<TreeNode>> hashTree = new HashMap<>();
        treeList.forEach( tree -> {recursive(tree, hashTree, retry);});

        List<TreeTmp> result = new ArrayList<>();
        if(!hashTree.isEmpty())
            hashTree.get(1l).forEach(treeNode -> {recursive1(treeNode, hashTree, result);});

        return result;
    }

    static private void recursive1(TreeNode treeNode, HashMap<Long, List<TreeNode>> hashTree, List<TreeTmp> result){

        TreeTmp treeTmp = new TreeTmp(treeNode.getId(), treeNode.getParent(), treeNode.getTitle());
        result.add(treeTmp);

        if(hashTree.get(treeNode.getId()) != null){
            treeTmp.setChildren(new ArrayList<>());
            hashTree.get(treeNode.getId()).forEach(treeNodeList -> recursive1(treeNodeList, hashTree, treeTmp.getChildren()));
        }
    }

    static private void recursive(Tree tree,  HashMap<Long, List<TreeNode>> hashTree, Set<Long> retry){
        if(tree.getParent() == null || !retry.add(tree.getId()))
            return;
        if(hashTree.get(tree.getParent().getId()) == null)
            hashTree.put(tree.getParent().getId(), new ArrayList<>());
        hashTree.get(tree.getParent().getId()).add(new TreeNode(tree.getId(), tree.getParent().getId(), tree.getTitle()));
        recursive(tree.getParent(), hashTree, retry);
    }
}
