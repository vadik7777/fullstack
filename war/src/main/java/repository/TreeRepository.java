package repository;

import entity.Tree;

import java.util.List;

public interface TreeRepository {

    List<Tree> all(int page, int count);

    int length();

    Tree create(Tree tree);

    Tree update(Tree tree);

    int delete(Tree tree);

}
