package repository;

import entity.Tree;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class TreeRepositoryImpl implements TreeRepository {

    @PersistenceContext(unitName = "otrPU")
    EntityManager entityManager;

    @Override
    public Tree create(Tree tree) {
        entityManager.persist(tree);
        return tree;
    }

    @Override
    public Tree update(Tree tree) {
       return entityManager.merge(tree);
    }

    @Override
    public Tree remove(Tree tree) {
        entityManager.remove(entityManager.merge(tree));
        return tree;
    }

    @Override
    public List<Tree> findByTitle(String title) {
        return  entityManager.createQuery("select t from Tree t where t.title=:tile order by t.title")
                .setParameter("title", title)
                .setMaxResults(10).getResultList();
    }

    @Override
    public Tree findBranchTree(Tree tree) {
        return null;
    }

    @Override
    public List<Tree> findRange(int page, int count) {
        return  entityManager
                .createQuery("select t from Tree t where t.sheet = true and t.branch between :start and :finish order by t.id")
                .setParameter("start", count*(page - 1) + 2)
                .setParameter("finish", count*page + 1)
                .getResultList();
    }
}
