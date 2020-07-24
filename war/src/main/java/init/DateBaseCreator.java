// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

package init;

import entity.Tree;

import javax.annotation.PostConstruct;
import javax.ejb.LocalBean;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.LinkedList;
import java.util.List;

@Startup
@Singleton
@LocalBean
public class DateBaseCreator {

    @PersistenceContext(unitName = "otrPU")
    EntityManager entityManager;

    private long idBranch;


    @PostConstruct
    private void initTableData(){

        Tree treeParent = new Tree();
        treeParent.setTitle("Главная");

        entityManager.persist(treeParent);

        List<Tree> treeBranchList;
        Tree parentBranch;
        int recordCount = 0;

        while(recordCount < 100_001l){
            treeBranchList = new LinkedList<>();

            parentBranch = new Tree();
            parentBranch.setBranch(getBranch());
            parentBranch.setTitle("Пункт " + parentBranch.getBranch());
            parentBranch.setParent(treeParent);

            entityManager.persist(parentBranch);

            treeBuilder(treeBranchList, parentBranch).forEach(tree -> {
                entityManager.persist(tree);
            });

            if(treeBranchList.size() == 0)
                parentBranch.setSheet(true);
            recordCount += treeBranchList.size() + 1;
        }
    }

    private List<Tree> treeBuilder(List<Tree> treeBranchList, Tree parent){
        int level = randomLevel();
        int realLevel = 1;
        Tree tree;
        while(level > realLevel){
            tree = new Tree();
            tree.setBranch(parent.getBranch());
            tree.setTitle(parent.getTitle() + "." + realLevel);
            tree.setSheet(true);
            tree.setParent(parent);
            treeBranchList.add(tree);
            realLevel++;
        }
        return treeBranchList;
    }

    private int randomLevel(){
        return (int) (Math.random()* 7);
    }

    private long getBranch(){
        return ++idBranch;
    }
}
