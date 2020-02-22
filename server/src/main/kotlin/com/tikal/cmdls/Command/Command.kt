package com.tikal.cmdls.command

data class Command (
    val id: Long,
    val inputs: String,
    val bin: String,
    val npm: String?,
    val brew: String?,
    val github: String?
)
