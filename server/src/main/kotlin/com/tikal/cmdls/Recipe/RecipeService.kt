package com.tikal.cmdls.recipe

import io.reactivex.Flowable
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
//
import com.tikal.cmdls.recipe.Recipe
import com.tikal.cmdls.recipe.RecipeDao

@ApplicationScoped
class RecipeService {
    @Inject
    lateinit var recipeDao: RecipeDao

    fun getRecipesByKeywords(
        keywords: List<String>,
        resolutions: List<String>
    ): Flowable<Recipe> {
        return recipeDao.findRecipes(
            keywords,
            resolutions
        )
    }

    fun getRecipesByTypes(
        recipeTypes: List<String>
    ): Flowable<Recipe> {
        return recipeDao.findRecipes(recipeTypes = recipeTypes)
    }
}
