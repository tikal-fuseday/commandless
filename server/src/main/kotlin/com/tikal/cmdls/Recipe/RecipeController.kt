package com.tikal.cmdls.recipe

import org.eclipse.microprofile.openapi.annotations.Operation
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
//
import com.tikal.cmdls.command.ResolutionType
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
        @QueryParam("resolution") @DefaultValue("") resolution: String
    ) =
        recipeService
            .getMatchingRecipes(
                keywords.split(","),
                resolution.split(",")
                    .map { ResolutionType.fromStr(it) }
                    .filterNotNull()
            )
            .toList()
            .blockingGet()
}