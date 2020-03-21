package com.tikal.cmdls.recipe

import com.squareup.moshi.Json
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.squareup.moshi.Moshi
//
import com.tikal.cmdls.command.Command

data class Recipe (
    val description: String,
    val command: Command,
    val inputOverrides: InputOverrides,
    val recipeType: String,
    val resolutionKey: String?
)

typealias InputOverrides = Map<String, InputOverride>

data class InputOverride (
    val value: Any
)

val moshi = Moshi.Builder()
      .add(KotlinJsonAdapterFactory())
      .build()

val inputOverridesAdapter = moshi.adapter<InputOverrides>(Map::class.java)
