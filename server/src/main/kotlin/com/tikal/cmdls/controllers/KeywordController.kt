package com.tikal.cmdls.controllers

import com.tikal.cmdls.model.Keyword
import com.tikal.cmdls.services.KeywordsService
import com.tikal.cmdls.services.RecipesService
import org.eclipse.microprofile.openapi.annotations.Operation
import javax.inject.Inject
import javax.ws.rs.GET
import javax.ws.rs.Path
import javax.ws.rs.Produces
import javax.ws.rs.QueryParam
import javax.ws.rs.core.MediaType

@Path("")
class KeywordController {

    @Inject
    lateinit var keywordsService: KeywordsService

    @Inject
    lateinit var recipeService: RecipesService

    @Operation(summary = "Keyword autocompletion", description = "Get keywords by their prefix (autocompletion)")
    @GET
    @Path("/keywords")
    @Produces(MediaType.APPLICATION_JSON)
    fun keywordAutocompletion(@QueryParam("q") key: String) =
            keywordsService.getByPartialKey(key).toList().blockingGet()

    @Operation(summary = "dump all", description = "Dump all keywords")
    @GET
    @Path("/keywords/all")
    @Produces(MediaType.APPLICATION_JSON)
    fun getAll(): List<Keyword> = keywordsService.getAll().toList().blockingGet()

    @Operation
    @GET
    @Path("/recipes")
    @Produces(MediaType.APPLICATION_JSON)
    fun getRecipes(@QueryParam("keywords") keywords: String, @QueryParam("resolution") resolution: String?) =
            recipeService.getMatchingRecipes(keywords.split(",")).toList().blockingGet()





    /*@Operation(summary = "Hi", description = "Just saying hi")
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    fun findByKeywords() = keywordsService.sayHi()



    @Operation(summary = "Get a keyword")
    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    fun get(@PathParam("id") id: Long): Keywords = keywordsService.get(id)
            .switchIfEmpty(Single.error(NotFoundException()))
            .blockingGet()

    @Operation(summary = "Add a keyword")
    @PUT
    @Path("add/{keyword}")
    @Produces(MediaType.APPLICATION_JSON)
    fun add(@PathParam("keyword") keyword: String) =
            keywordsService.addNew(keyword)
                    .blockingGet()*/
}