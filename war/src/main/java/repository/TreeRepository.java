// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

package repository;

import entity.Tree;

import java.util.List;

public interface TreeRepository {

    List<Tree> all(int page, int count);

    List<String> search(String title, int page, int count);

    int length();

    int searchLength(String title);

    Tree create(Tree tree);

    Tree update(Tree tree);

    int delete(Tree tree);

}
