package repository;

import entity.Tree;

import java.util.List;

public interface TreeRepository {

    Tree create(Tree tree);

    Tree update(Tree tree);

    Tree remove(Tree tree);

    List<Tree> findByTitle(String title);

    Tree findBranchTree(Tree tree);

    List<Tree> findRange(int page, int count);

}
