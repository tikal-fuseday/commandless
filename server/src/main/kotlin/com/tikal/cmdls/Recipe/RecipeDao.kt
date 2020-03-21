package com.tikal.cmdls.recipe

import io.reactivex.Flowable
import io.vertx.reactivex.pgclient.PgPool
import io.vertx.reactivex.sqlclient.Row
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
// 
import com.tikal.cmdls.command.Command
import com.tikal.cmdls.command.Resolution
import com.tikal.cmdls.command.resolutionAdapter
import com.tikal.cmdls.command.Input
import com.tikal.cmdls.command.inputsAdapter

@ApplicationScoped
class RecipeDao {
    companion object {
        val TABLE_NAME = "RECIPE"
    }

    @Inject
    lateinit var client: PgPool

    private fun getInputOverrides(row: Row): InputOverrides {
        val inputOverridesJson = row.getValue("input_overrides").toString() // .toJsonObject()
        val inputOverrides = inputOverridesAdapter.fromJson(inputOverridesJson)
        if (inputOverrides == null) throw Exception("InputOverrides: Invalid JSON")
        return inputOverrides
    }

    private fun getResolution(row: Row): Resolution {
        val resolutionJson = row.getValue("resolution").toString()
        val resolution = resolutionAdapter.fromJson(resolutionJson)
        if (resolution == null) throw Exception("Resolution: Invalid JSON")
        return resolution
    }

    private fun getInputs(row: Row): List<Input> {
        val inputsJson = row.getValue("inputs").toString()
        val inputs = inputsAdapter.fromJson(inputsJson)
        if (inputs == null) throw Exception("Inputs: Invalid JSON")
        return inputs
    }

    private fun rowSetToRecipe(row: Row): Recipe {
        val inputOverrides = getInputOverrides(row)
        val resolution = getResolution(row)
        val inputs = getInputs(row)
        return Recipe(
            row.getString("description"),
            Command(
                row.getString("bin"),
                resolution,
                inputs
            ),
            inputOverrides,
            row.getString("recipe_type"),
            row.getString("resolution_key")
        )
    }

    fun findRecipes(
        keywords: List<String> = emptyList(),
        resolutions: List<String> = emptyList(),
        recipeTypes: List<String> = emptyList()
    ): Flowable<Recipe> {
        val whereKeywords = keywords.map { "'$it'" }.joinToString(separator = ",")
        val whereResolutions = resolutions.map { "'$it'" }.joinToString(separator = ",")
        val whereRecipeTypes = recipeTypes.map { "'$it'" }.joinToString(separator = ",")
        var query = """
            SELECT DISTINCT ON (r.id)
                r.description,
                r.inputs AS input_overrides,
                r.recipe_type,
                r.resolution_key,
                c.bin,
                c.resolution,
                c.github,
                c.inputs
            FROM keyword_recipe as kr
            JOIN recipe AS r ON (kr.recipe_id = r.id)
            JOIN command AS c ON (c.id = r.command_id)
        """
        if (whereKeywords.length > 0) {
            query += """
                WHERE kr.keyword_id IN (
                    SELECT id
                    FROM keyword
                    WHERE keyword.label IN ($whereKeywords)
                )
            """
        }
        if (whereResolutions.length > 0) {
            query += ("AND c.resolution ?| array[" + whereResolutions + "]")
        }
        if (whereRecipeTypes.length > 0) {
            query += ("WHERE r.resolution_key IS NOT NULL AND r.recipe_type IN ($whereRecipeTypes)")
        }
        return client.rxQuery(query.trimIndent())
            .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
            .map (::rowSetToRecipe)
    }
}
