package com.tikal.cmdls.services

import com.tikal.cmdls.model.Recipe
import com.tikal.cmdls.model.RecipeDao
import io.reactivex.Flowable
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject

@ApplicationScoped
class RecipesService {
    @Inject
    lateinit var recipeDao: RecipeDao

    fun getMatchingRecipes(keywords: List<String>): Flowable<Recipe> =
            recipeDao.findRecipes(keywords)

}