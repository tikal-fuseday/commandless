package com.tikal.cmdls.command

enum class Resolution {
    BREW,
    NPM,
    ALL;

    companion object {
        fun fromStr(str: String?) =
            str?.let {
                values().firstOrNull { it.name.equals(str, true) } ?: ALL 
            } ?: ALL
    }
}
