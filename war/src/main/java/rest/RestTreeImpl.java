package rest;

import entity.Tree;
import repository.TreeRepository;
import util.TreeConverter;

import javax.ejb.EJB;
import javax.ws.rs.core.Response;
import java.util.List;

public class RestTreeImpl implements RestTree{

    @EJB
    TreeRepository treeRepository;

    @Override
    public Response initMethod() {
        return null;
    }

    @Override
    public Response findRange(int page, int count) {
        List<Tree> treeList = treeRepository.findRange(page, count);
        return Response.status(Response.Status.OK).entity(TreeConverter.convert(treeList)).build();
    }

    @Override
    public Response getTree(int id) {
        return null;
    }

    @Override
    public Response putMethod(Tree tree) {
        return null;
    }

    @Override
    public Response postMethod() {
        return null;
    }

    @Override
    public Response deleteMethod(Tree tree) {
        return Response.status(Response.Status.OK).entity(treeRepository.remove(tree)).build();
    }
}
