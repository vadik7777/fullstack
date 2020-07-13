package rest;

import entity.Tree;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("")
public interface RestTree {

    @GET
    @Path("/all/{page}/{count}")
    @Produces( MediaType.APPLICATION_JSON )
    Response all(@PathParam("page") int page, @PathParam("count") int count);

    @GET
    @Path("/search/{title}/{page}/{count}")
    @Produces( MediaType.APPLICATION_JSON )
    Response search(@PathParam("title") String title, @PathParam("page") int page, @PathParam("count") int count);

    @GET
    @Path("/length")
    @Produces( MediaType.TEXT_PLAIN )
    Response length();

    @GET
    @Path("/search-length/{title}")
    @Produces( MediaType.TEXT_PLAIN )
    Response searchLength(@PathParam("title") String title);

    @POST
    @Path("/create")
    @Produces (MediaType.APPLICATION_JSON)
    @Consumes (MediaType.APPLICATION_JSON)
    Response create(Tree tree);

    @POST
    @Path("/update" )
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    Response update(Tree tree);

    @POST
    @Path("/delete")
    @Produces( MediaType.TEXT_PLAIN )
    @Consumes (MediaType.APPLICATION_JSON)
    Response delete(Tree tree);
}
