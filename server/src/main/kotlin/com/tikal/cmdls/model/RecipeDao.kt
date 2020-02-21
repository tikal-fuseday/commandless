package com.tikal.cmdls.model

import io.reactivex.Flowable
import io.vertx.reactivex.pgclient.PgPool
import io.vertx.reactivex.sqlclient.Row
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject

@ApplicationScoped
class RecipeDao {
    companion object {
        val TABLE_NAME = "RECIPE"
    }

    @Inject
    lateinit var client: PgPool

    private fun rowSetToRecipe(row: Row): Recipe =
            Recipe(row.getLong("recipe_id"),
                    row.getString("description"),
                    row.getLong("command_id"),
                    Commands(row.getLong("command_id"),
                            row.getValue("command_inputs").toString(),
                            row.getString("bin"),
                            row.getString("npm"),
                            row.getString("github")),
                    row.getValue("recipe_inputs").toString(),
                    null)

    fun findRecipes(keys: List<String>): Flowable<Recipe> {
        val list = keys.map { "'$it'" }.joinToString(separator = ",")
        return client.rxQuery("""
            select recipe.id as recipe_id, recipe.inputs as recipe_inputs, recipe.description, command.inputs as command_inputs, 
                    command.bin, command.npm, command.github , command.id as command_id
                from recipe
                    left join command on recipe.command_id=command.id
                where recipe.id in(
                    select distinct recipe_id from keyword_recipe where keyword_id  in(
                        select id from keyword where keyword.label in ($list)
                    )
                )
        """.trimIndent())
                .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
                .map (::rowSetToRecipe)
    }





}