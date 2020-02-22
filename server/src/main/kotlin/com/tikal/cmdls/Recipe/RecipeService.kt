package com.tikal.cmdls.recipe

import io.reactivex.Flowable
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
//
import com.tikal.cmdls.command.Resolution
import com.tikal.cmdls.recipe.Recipe
import com.tikal.cmdls.recipe.RecipeDao

@ApplicationScoped
class RecipeService {
    @Inject
    lateinit var recipeDao: RecipeDao

    fun getMatchingRecipes(
        keywords: List<String>,
        resolution: Resolution
    ): Flowable<Recipe> =
        recipeDao.findRecipes(keywords, resolution)
}
