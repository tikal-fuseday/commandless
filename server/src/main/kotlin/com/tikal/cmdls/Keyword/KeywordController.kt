package com.tikal.cmdls.keyword

import org.eclipse.microprofile.openapi.annotations.Operation
import javax.inject.Inject
import javax.ws.rs.*
import javax.ws.rs.core.MediaType
// 
import com.tikal.cmdls.keyword.KeywordService

@Path("/keywords")
class KeywordController {
    @Inject
    lateinit var keywordService: KeywordService

    @Operation
    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    fun keywordAutocompletion(@QueryParam("q") key: String): List<Keyword> =
        keywordService.getByPartialKey(key)
            .defaultIfEmpty(emptyList())
            .blockingFirst()

    @Operation
    @GET
    @Path("/all")
    @Produces(MediaType.APPLICATION_JSON)
    fun getAll(): List<Keyword> = keywordService.getAll().toList().blockingGet()
}