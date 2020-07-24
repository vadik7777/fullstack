// Copyright © 2020 Vadim Konovalov. Contacts: <vadik.olympus@e1.ru>
// License: https://www.eclipse.org/legal/epl-2.0/

package rest;

import entity.Tree;
import repository.TreeRepository;
import util.TreeConverter;

import javax.ejb.EJB;
import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.core.Response;
import java.util.LinkedList;
import java.util.List;

public class RestTreeImpl implements RestTree{

    @EJB
    TreeRepository treeRepository;

    @Override
    public Response all(int page, int count) {
        List<Tree> treeList = treeRepository.all(page, count);
        return Response.status(Response.Status.OK).entity(TreeConverter.convert(treeList)).build();
    }

    @Override
    public Response search(String title, int page, int count) {
        List<String> titleList = treeRepository.search(title, page, count);
        List<JsonObject> jsonObjectList = new LinkedList<>();
        titleList.forEach(titleSearch -> {
            JsonObjectBuilder jsonObjBuilder = Json.createObjectBuilder();
            jsonObjBuilder.add( "title", titleSearch);
            jsonObjectList.add(jsonObjBuilder.build());
        });

        return Response.status(Response.Status.OK).entity(jsonObjectList.toString()).build();
    }

    @Override
    public Response length() {
        return Response.status(Response.Status.OK).entity(treeRepository.length()).build();
    }

    @Override
    public Response searchLength(String title) {
        return Response.status(Response.Status.OK).entity(treeRepository.searchLength(title)).build();
    }

    @Override
    public Response create(Tree tree) {

        Tree createTree = treeRepository.create(tree);

        JsonObjectBuilder jsonObjBuilder = Json.createObjectBuilder();
        jsonObjBuilder.add( "id", createTree.getId());
        jsonObjBuilder.add( "title", createTree.getTitle());
        JsonObject jsonObj = jsonObjBuilder.build();

        return Response.status(Response.Status.OK).entity(jsonObj.toString()).build();
    }

    @Override
    public Response update(Tree tree) {

        Tree updateTree = treeRepository.update(tree);

        JsonObjectBuilder jsonObjBuilder = Json.createObjectBuilder();
        jsonObjBuilder.add( "title", updateTree.getTitle());
        JsonObject jsonObj = jsonObjBuilder.build();

        return Response.status(Response.Status.OK).entity(jsonObj.toString()).build();
    }

    @Override
    public Response delete(Tree tree) {
        return Response.status(Response.Status.OK).entity(treeRepository.delete(tree)).build();
    }
}
