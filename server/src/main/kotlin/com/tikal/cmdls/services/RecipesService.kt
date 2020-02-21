package com.tikal.cmdls.services

import com.tikal.cmdls.model.Recipe
import com.tikal.cmdls.model.RecipeDao
import com.tikal.cmdls.model.Resolution
import io.reactivex.Flowable
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject

@ApplicationScoped
class RecipesService {
    @Inject
    lateinit var recipeDao: RecipeDao

    fun getMatchingRecipes(keywords: List<String>, resolution: Resolution): Flowable<Recipe> =
            recipeDao.findRecipes(keywords, resolution)

}