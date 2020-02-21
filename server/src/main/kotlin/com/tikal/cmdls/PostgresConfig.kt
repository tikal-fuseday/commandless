package com.tikal.cmdls

import com.tikal.cmdls.model.KeywordDao
import io.vertx.reactivex.pgclient.PgPool
import org.eclipse.microprofile.config.inject.ConfigProperty
import javax.annotation.PostConstruct
import javax.enterprise.context.ApplicationScoped
import javax.inject.Inject

@ApplicationScoped
class PostgresConfig (@Inject val pgClient: PgPool, @ConfigProperty(name = "myapp.schema.create", defaultValue = "false") val createSchema: Boolean) {

    companion object {
        const val DATABASE_NAME = "cmdls_db"
    }

    @PostConstruct
    fun config() {
        if (createSchema) {
            initDb()
        }
    }

    private fun initDb() {
        pgClient.rxQuery("CREATE DATABASE IF NOT EXIST $DATABASE_NAME")
        pgClient.rxQuery(KeywordDao.CREATE_TABLE)
                .compose { pgClient.rxQuery("INSERT INTO ${KeywordDao.TABLE_NAME} (keyword) VALUES ('Orange')") }
                .compose { pgClient.rxQuery("INSERT INTO ${KeywordDao.TABLE_NAME} (keyword) VALUES ('Pear')") }
                .compose { pgClient.rxQuery("INSERT INTO ${KeywordDao.TABLE_NAME} (keyword) VALUES ('Apple')") }
                .blockingGet()
    }
}
