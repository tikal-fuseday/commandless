# cmdls project
This is the backend service for cmdls.

# Installation
* Install graalvm:
https://quarkus.io/guides/building-native-image

and set the GRAALVM_HOME to the root of graalvm extracted dir.  
* Then, from the project root dir, exec
```$xslt
$ ./mvnw clean install -Pnative
```

# Run
Execute 
```
$ ./target/cmdls-0.0.1-SNAPSHOT-runner
```

# Postgres server - Docker
 ```
docker run --ulimit memlock=-1:-1 -it --rm=true --memory-swappiness=0 --name cmdls_postgres -e POSTGRES_USER=cmdls_user \
-e POSTGRES_PASSWORD=cmdls_passw0rd -e POSTGRES_DB=cmdls_db -p 5432:5432 postgres:10.5
```





#
#
#




This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: https://quarkus.io/ .

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:
```
./mvnw quarkus:dev
```

## Packaging and running the application

The application is packageable using `./mvnw package`.
It produces the executable `cmdls-0.0.1-SNAPSHOT-runner.jar` file in `/target` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/lib` directory.

The application is now runnable using `java -jar target/cmdls-0.0.1-SNAPSHOT-runner.jar`.

## Creating a native executable

You can create a native executable using: `./mvnw package -Pnative`.

Or you can use Docker to build the native executable using: `./mvnw package -Pnative -Dquarkus.native.container-build=true`.

You can then execute your binary: `./target/cmdls-0.0.1-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult https://quarkus.io/guides/building-native-image-guide .
