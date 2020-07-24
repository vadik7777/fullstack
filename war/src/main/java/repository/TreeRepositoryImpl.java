// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

package repository;

import entity.Tree;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class TreeRepositoryImpl implements TreeRepository {

    @PersistenceContext(unitName = "otrPU")
    EntityManager entityManager;

    @Override
    public List<Tree> all(int page, int count) {

        List<Long> branches = entityManager.createQuery("select distinct t.branch from Tree t order by t.branch")
                .setFirstResult(count*page)
                .setMaxResults(count)
                .getResultList();

        return  entityManager.createQuery("select t from Tree t where t.sheet = true and t.branch in :branches order by t.id")
                .setParameter("branches", branches)
                .getResultList();
    }

    @Override
    public List<String> search(String title, int page, int count) {
        return  entityManager.createQuery("select t.title from Tree t where t.title like :title order by t.title")
                .setParameter("title", "%" + title + "%")
                .setFirstResult(count*page)
                .setMaxResults(count)
                .getResultList();
    }

    @Override
    public int length() {
        return (int) (long) (entityManager.createQuery("select count(t) from Tree t where t.parent.id = 1").getSingleResult());
    }

    @Override
    public int searchLength(String title) {
        return (int) (long) (entityManager.createQuery("select count(t) from Tree t where t.title like :title")
                .setParameter("title", "%" + title + "%")
                .getSingleResult());
    }

    @Override
    public Tree create(Tree tree) {

        String title = tree.getTitle();
        Tree parent = entityManager.find(Tree.class, tree.getId());

        Tree addTree = new Tree();
        addTree.setTitle(title);
        addTree.setParent(parent);
        addTree.setBranch(parent.getBranch());
        addTree.setSheet(true);

        entityManager.persist(addTree);

        if(parent.isSheet()){
            parent.setSheet(false);
            entityManager.merge(parent);
        }

        return addTree;
    }

    @Override
    public Tree update(Tree tree) {
        Tree find = entityManager.find(Tree.class, tree.getId());
        find.setTitle(tree.getTitle());
        return entityManager.merge(find);
    }

    @Override
    public int delete(Tree tree) {
       List<Long> removeId = new ArrayList<>();
       removeId.add(tree.getId());
       rem(tree.getId(), removeId);
       Tree parent = (Tree) entityManager.createQuery("select t.parent from Tree t where t.id =:id")
                .setParameter("id", tree.getId())
                .getSingleResult();
       int remove = entityManager.createQuery("delete from Tree t where t.id in :id")
               .setParameter("id", removeId)
               .executeUpdate();
       int parentCount = (int) (long) entityManager
                .createQuery("select count(t) from Tree t where t.parent.id =:parent")
                .setParameter("parent" , parent.getId())
                .getSingleResult();
       if (parentCount == 0) {
            parent.setSheet(true);
            entityManager.merge(parent);
       }
       return remove;
    }

    private void rem(Long tree, List<Long> all){
        List<Long> treeList = entityManager.createQuery("select t.id from Tree t where t.parent.id=:id")
                .setParameter("id", tree)
                .getResultList();
        if(!treeList.isEmpty()){
            all.addAll(treeList);
            treeList.forEach(treeItem -> rem(treeItem, all));
        }
    }
}
