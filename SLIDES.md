# Laissez tomber vos Dockerfile, adoptez un buildpack !

---

# Présentation du speaker

---

# Exécuter une application dans un container, c'est facile

# Un Dockerfile 🐋 et hop 🚀

---

# J'écris des (mauvais) Dockerfile depuis 2015

# J'ai vu tout et n'importe quoi

---

# Le 'hello-world' Spring Boot, selon Docker

https://www.docker.com/blog/kickstart-your-spring-boot-application-development/

```Dockerfile
FROM eclipse-temurin:17-jdk-focal
 
WORKDIR /app
 
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline
 
COPY src ./src
 
CMD ["./mvnw", "spring-boot:run"]
```

NOTE:
Ok, on voit que ça va fonctionner, mais y'a plein de choses qui ne vont pas
Le spring-boot:run, ça va compiler le code et l'exécuter, c'est à faire en amont
Le code source est présent dans l'image finale!
User root
Comment tu passes des options à ta JVM ?

---

# Le 'hello world' selon Spring Boot

https://spring.io/guides/topicals/spring-boot-docker/

```Dockerfile
# build stage
FROM eclipse-temurin:17-jdk-alpine as build
WORKDIR /workspace/app

COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src src

RUN ./mvnw install -DskipTests
RUN mkdir -p target/dependency && (cd target/dependency; jar -xf ../*.jar)

# run stage
FROM eclipse-temurin:17-jdk-alpine

RUN addgroup -S demo && adduser -S demo -G demo
USER demo

VOLUME /tmp
ARG DEPENDENCY=/workspace/app/target/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
ENTRYPOINT ["java","-cp","app:app/lib/*","hello.Application"]
```

NOTE:
C'est beaucoup mieux
On est pas root
On a des jolies layers
Le code source n'est plus présent dans l'image finale
Le port n'est pas déclaré (EXPOSE 8080)
Aucun Label / métadata
Comment je paramètre mon appli ? je passe 3000 paramètres derrière mon entrypoint ?
La version du jdk est fixée sur 17, mais 17.0.1 ou 17.0.7 ? => ça dépend de la date à laquelle on a buildé ?
---

# Mais aucun être humain n'est capable d'écrire ça !

---

# Comment font les développeurs ?

Au pire : ils copie/colle un Dockerfile qu'ils ne comprennent pas, d'un tuto random sur internet

Au milieu : ils copie/colle un Dockerfile qu'ils ne comprennent pas, celui de Spring Boot ?

Au mieux : ils sont experts Docker, et améliorent le Dockerfile de Spring Boot

---

# Imaginons qu'on travaille dans une grosse DSI, avec plein de projets

Chaque projet a son Dockerfile, forcément différent.
Comment on assure la cohérence de tout ça ?
Comment on met à jour des versions de Java, des règles de sécurité ?
On ouvre des MR/PR sur les 150 projets de l'entreprise et on espère que les devs mergent rapidement ?

---

 # Est-ce qu'écrire un Dockerfile, c'est le travail d'un développeur ?

---

Adoptez un buildpack !

[](talk-logo.svg)

---

# Mais au fait, c'est quoi une image Docker ?

On parle maintenant d'image OCI (Open Container Initiative)

