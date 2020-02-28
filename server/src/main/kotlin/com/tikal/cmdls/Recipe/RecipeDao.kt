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
            row.getString("description"),
            Command(
                row.getString("bin"),
                row.getString("resolution_key"),
                row.getValue("resolution").toString(),
                row.getValue("inputs").toString()
            ),
            row.getValue("input_overrides").toString()
        )

    fun findRecipes(keywords: List<String>, resolutions: List<String>, isPackageManager: Boolean): Flowable<Recipe> {
        val whereKeywords = keywords.map { "'$it'" }.joinToString(separator = ",")
        val whereResolutions = resolutions.map { "'$it'" }.joinToString(separator = ",")
        var query = """
            SELECT DISTINCT ON (r.id)
                r.description,
                r.inputs AS input_overrides,
                c.bin,
                c.github,
                c.inputs,
                c.resolution_key,
                c.resolution
            FROM keyword_recipe as kr
            JOIN recipe AS r ON (kr.recipe_id = r.id)
            JOIN command AS c ON (c.id = r.command_id)
            WHERE keyword_id IN (
                SELECT id
                FROM keyword
                WHERE keyword.label IN ($whereKeywords)
            )
        """
        if (resolutions.size > 0) query += ("AND c.resolution ?| array[" + whereResolutions + "]")
        if (isPackageManager) query += " AND c.resolution_key IS NOT NULL"
        return client.rxQuery(query.trimIndent())
            .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
            .map (::rowSetToRecipe)
    }
}
