package com.tikal.cmdls.command

data class Command (
    val bin: String,
    val resolutionKey: String?,
    val resolution: String,
    val inputs: String
)
