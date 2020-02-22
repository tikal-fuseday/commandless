package com.tikal.cmdls.recipe

import org.eclipse.microprofile.openapi.annotations.Operation
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
//
import com.tikal.cmdls.command.Resolution
import com.tikal.cmdls.recipe.RecipeService

@Path("/recipes")
class RecipeController {
    @Inject
    lateinit var recipeService: RecipeService

    @Operation
    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    fun getRecipes(
        @QueryParam("keywords") keywords: String,
        @QueryParam("resolution") @DefaultValue("ALL") resolution: String?
    ) =
        recipeService
            .getMatchingRecipes(
                keywords.split(","),
                Resolution.fromStr(resolution)
            )
            .toList()
            .blockingGet()
}