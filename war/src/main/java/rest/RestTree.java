package rest;

import entity.Tree;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;


@Path("")
public interface RestTree {

    @GET
    @Path("/init")
    @Produces( MediaType.APPLICATION_JSON )
    Response initMethod();

    @GET
    @Path("/all/{page}/{count}")
    @Produces( MediaType.APPLICATION_JSON )
    Response findRange(@PathParam("page") int page, @PathParam("count") int count);

    @GET
    @Path("/get/{id}" )
    @Produces( MediaType.APPLICATION_JSON)
    Response getTree(@PathParam("id") int id);

    @PUT
    @Path("/update" )
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes (MediaType.APPLICATION_JSON)
    Response putMethod(Tree tree);

    @POST
    @Path("/create")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes (MediaType.APPLICATION_JSON)
    Response postMethod();

    @POST
    @Path("/delete")
    @Produces( MediaType.APPLICATION_JSON )
    @Consumes (MediaType.TEXT_PLAIN)
    Response deleteMethod(Tree tree);
}
