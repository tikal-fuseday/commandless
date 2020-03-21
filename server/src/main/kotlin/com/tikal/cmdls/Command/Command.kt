package com.tikal.cmdls.command

import com.squareup.moshi.Json
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.squareup.moshi.Moshi

val moshi = Moshi.Builder()
      .add(KotlinJsonAdapterFactory())
      .build()

data class Command (
    val bin: String,
    val resolution: Resolution,
    val inputs: List<Input>
)

typealias Resolution = Map<String, String>

val resolutionAdapter = moshi.adapter<Resolution>(Map::class.java)

data class Input (
    val name: String,
    val description: String,
    val type: String,
    val isRequired: Boolean,
    val long: String?,
    val short: String?
)

val inputsAdapter = moshi.adapter<List<Input>>(List::class.java)

