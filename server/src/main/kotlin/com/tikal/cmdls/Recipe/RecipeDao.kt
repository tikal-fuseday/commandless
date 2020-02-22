package com.tikal.cmdls.recipe

import io.reactivex.Flowable
import io.vertx.reactivex.pgclient.PgPool
import io.vertx.reactivex.sqlclient.Row
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
// 
import com.tikal.cmdls.command.Command
import com.tikal.cmdls.command.Resolution

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
                row.getValue("command_inputs").toString(),
                row.getString("bin"),
                row.getString("npm"),
                row.getString("brew"),
                row.getString("github")
            ),
            row.getValue("recipe_inputs").toString(),
            null
        )

    fun findRecipes(keys: List<String>, resolution: Resolution): Flowable<Recipe> {
        val resolutionSelection =
            if (resolution == Resolution.ALL) ""
            else " AND command.${resolution.name.toLowerCase()} IS NOT NULL "

        val list = keys.map { "'$it'" }.joinToString(separator = ",")
        val query = """
            SELECT recipe.id AS recipe_id, recipe.inputs AS recipe_inputs, recipe.description, command.inputs AS command_inputs, 
                command.bin, command.npm, command.brew, command.github , command.id AS command_id
            FROM recipe
                LEFT JOIN command ON recipe.command_id=command.id
            WHERE recipe.id IN (
                SELECT distinct recipe_id FROM keyword_recipe WHERE keyword_id IN (
                    SELECT id FROM keyword WHERE keyword.label IN ($list)
                ) $resolutionSelection
            )
        """.trimIndent()
        return client.rxQuery(query)
            .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
            .map (::rowSetToRecipe)
    }
}
