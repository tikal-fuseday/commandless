package com.tikal.cmdls.recipe

import org.eclipse.microprofile.openapi.annotations.Operation
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
//
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
        @QueryParam("keywords") @DefaultValue("") keywords: String,
        @QueryParam("package_managers") @DefaultValue("") availableResolutions: String,
        @QueryParam("type") @DefaultValue("") recipeTypes: String
    ) =
        if (keywords != "")
            recipeService
                .getRecipesByKeywords(
                    keywords.split(",").filter{ it != "" },
                    availableResolutions.split(",").filter{ it != "" }
                )
                .toList()
                .blockingGet()
        else recipeService
                .getRecipesByTypes(
                    recipeTypes.split(",").filter{ it != "" }
                )
                .toList()
                .blockingGet()
}
