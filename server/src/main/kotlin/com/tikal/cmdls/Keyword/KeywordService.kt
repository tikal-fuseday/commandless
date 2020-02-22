package com.tikal.cmdls.keyword

import io.reactivex.Flowable
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject
import javax.ws.rs.NotFoundException
// 
import com.tikal.cmdls.keyword.Keyword
import com.tikal.cmdls.keyword.KeywordDao

@ApplicationScoped
class KeywordService {

    @Inject
    lateinit var keywordDao: KeywordDao

    companion object {
        val log: Logger = LoggerFactory.getLogger(KeywordService::class.java)
    }

    fun getByPartialKey(key: String): Flowable<List<Keyword>> =
        keywordDao.find(key).switchIfEmpty(Flowable.empty())

    fun getAll() = keywordDao.findAll()

    fun get(id: Long) = keywordDao.find(id)

    fun addNew(keyword: String) = keywordDao.add(keyword)

}