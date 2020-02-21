package com.tikal.cmdls.model

data class Keyword (val id: Long?, val label: String)

data class Recipe(val id: Long?, val description: String, val commandId: Long, val command: Commands, val input: String, val keywords: List<String>?)

data class Commands(val id: Long, val inputs: String, val bin: String, val npm: String?, val brew: String?, val github: String?)

enum class Resolution {
    BREW,
    NPM,
    ALL
}

//data class RecipesDto(val id: Long?, val description: String, val commandId: Long, val input: String, val keywords: List<String>?)