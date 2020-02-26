package com.tikal.cmdls.recipe

import io.reactivex.Flowable
import io.vertx.reactivex.pgclient.PgPool
import io.vertx.reactivex.sqlclient.Row
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
// 
import com.tikal.cmdls.command.Command
import com.tikal.cmdls.command.Resolution
import com.tikal.cmdls.command.ResolutionType

@ApplicationScoped
class RecipeDao {
    companion object {
        val TABLE_NAME = "RECIPE"
    }

    @Inject
    lateinit var client: PgPool

    private fun rowSetToRecipe(row: Row): Recipe =
        Recipe(
            row.getLong("recipe_id"),
            row.getString("description"),
            row.getLong("command_id"),
            Command(
                row.getLong("command_id"),
                row.getString("bin"),
                row.getValue("command_inputs").toString(),
                Resolution(
                    row.getString("npm"),
                    row.getString("brew")
                )
            ),
            row.getValue("recipe_inputs").toString(),
            null
        )

    fun findRecipes(keywords: List<String>, resolutions: List<ResolutionType>): Flowable<Recipe> {
        val whereKeywords = keywords.map { "'$it'" }.joinToString(separator = ",")
        val whereResolutions = if (resolutions.size == 0) ""
            else "AND (" + resolutions
                .map { "command.${it.name.toLowerCase()} IS NOT NULL" }
                .joinToString(separator = " OR ") + ")"
        val query = """
            SELECT recipe.id AS recipe_id, recipe.inputs AS recipe_inputs, recipe.description, command.inputs AS command_inputs, 
                command.bin, command.npm, command.brew, command.github , command.id AS command_id
            FROM recipe
                LEFT JOIN command ON recipe.command_id=command.id
            WHERE recipe.id IN (
                SELECT distinct recipe_id FROM keyword_recipe WHERE keyword_id IN (
                    SELECT id FROM keyword WHERE keyword.label IN ($whereKeywords)
                ) $whereResolutions
            )
        """.trimIndent()
        return client.rxQuery(query)
            .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
            .map (::rowSetToRecipe)
    }
}
