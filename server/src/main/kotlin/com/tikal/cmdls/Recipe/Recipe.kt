package com.tikal.cmdls.recipe

import com.tikal.cmdls.command.Command

data class Recipe (
    val id: Long?,
    val description: String,
    val commandId: Long,
    val command: Command,
    val inputs: String,
    val keywords: List<String>?
)
