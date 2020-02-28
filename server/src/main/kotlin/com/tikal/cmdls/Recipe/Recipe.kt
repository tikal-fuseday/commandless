package com.tikal.cmdls.recipe

import com.tikal.cmdls.command.Command

data class Recipe (
    val description: String,
    val command: Command,
    val inputOverrides: String
)
