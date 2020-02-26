package com.tikal.cmdls.command

data class Command (
    val id: Long,
    val bin: String,
    val inputs: String,
    val resolution: Resolution
)
