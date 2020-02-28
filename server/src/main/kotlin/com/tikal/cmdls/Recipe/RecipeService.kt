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

    fun getMatchingRecipes(
        keywords: List<String>,
        resolutions: List<String>,
        isPackageManager: Boolean
    ): Flowable<Recipe> =
        recipeDao.findRecipes(keywords, resolutions, isPackageManager)
}
