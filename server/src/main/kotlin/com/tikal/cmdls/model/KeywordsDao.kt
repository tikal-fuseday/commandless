package com.tikal.cmdls.model

import io.reactivex.Flowable
import io.reactivex.Maybe
import io.reactivex.Single
import io.vertx.reactivex.pgclient.PgPool
import io.vertx.reactivex.sqlclient.Row
import io.vertx.reactivex.sqlclient.Tuple
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
import javax.transaction.Transactional

@ApplicationScoped
class KeywordDao {

    @Inject
    lateinit var client: PgPool

    companion object {
        const val TABLE_NAME = "KEYWORD"
        val CREATE_TABLE = """
            DROP TABLE IF EXISTS $TABLE_NAME;
            CREATE TABLE $TABLE_NAME (
                id SERIAL PRIMARY KEY, 
                keyword TEXT NOT NULL)
        """.trimIndent()
    }

    fun findAll(): Flowable<Keyword> =
            client.rxQuery("SELECT id, label FROM $TABLE_NAME")
                    .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
                    .map (::rowSetToKeyword)

    fun find(key: String): Flowable<Keyword> =
            client.rxQuery("SELECT id, label FROM $TABLE_NAME WHERE lower(label) LIKE '${key.toLowerCase()}%'")
                    .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
                    .map (::rowSetToKeyword)

    fun find(id: Long): Maybe<Keyword> =
            client.rxQuery("SELECT id, label FROM $TABLE_NAME WHERE id=$id")
                    .flatMapPublisher { Flowable.fromIterable(it.asIterable()) }
                    .map (::rowSetToKeyword)
                    .firstElement()

    private fun rowSetToKeyword(row: Row): Keyword =
            Keyword(row.getLong("id"), row.getString("label"))

    @Transactional
    fun add(keyword: String): Single<Long> =
            client.rxPreparedQuery("INSERT INTO $TABLE_NAME (label) VALUES (\$1) RETURNING (id)", Tuple.of(keyword))
                    .flatMapPublisher { rowSet -> Flowable.fromIterable(rowSet.asIterable()) }
                    .map { it.getLong("id") }
                    .firstElement()
                    .toSingle()
}
