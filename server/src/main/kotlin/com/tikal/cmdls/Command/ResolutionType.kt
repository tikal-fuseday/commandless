package com.tikal.cmdls.command

enum class ResolutionType {
    BREW,
    NPM;

    companion object {
        fun fromStr(str: String?): ResolutionType? =
            str?.let {
                values().firstOrNull { it.name.equals(str, true) } 
            }
    }
}
