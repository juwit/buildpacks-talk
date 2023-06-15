---

styles

colors

#FFBE53
#FAA259
#F68B5E
#F16B65
#EF5E68

color-main: #f06766
color-secondary: #ffc152
color-tertiary: #f58260

---

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

# Le 'hello-world' selon Spring Boot

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

[](reveal.js/assets/talk-logo.svg)

---

# Mais au fait, c'est quoi une image -Docker- OCI ?

On parle maintenant d'image OCI (Open Container Initiative)

Normalisé : https://github.com/opencontainers/image-spec/blob/main/spec.md

La vision qu'on a souvent :

Les layers

![](reveal.js/assets/buildpacks-diagrams-image-layers.svg)

distrib + runtime/middleware + code

---

## La configuration aussi fait partie de l'image OCI !

* architecture / OS
* variables d'environnements
* users
* labels
* commandes / entrypoints
* ports

```json
{
	"architecture": "amd64",
	"config": {
		"Hostname": "",
		"Domainname": "",
		"User": "",
		"AttachStdin": false,
		"AttachStdout": false,
		"AttachStderr": false,
		"Tty": false,
		"OpenStdin": false,
		"StdinOnce": false,
		"Env": [
			"PATH=/opt/java/openjdk/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
			"JAVA_HOME=/opt/java/openjdk",
			"LANG=en_US.UTF-8",
			"LANGUAGE=en_US:en",
			"LC_ALL=en_US.UTF-8",
			"JAVA_VERSION=jdk-17.0.7+7"
		],
		"Cmd": [
			"jshell"
		],
		"Image": "sha256:1dcdc9129900e8da6859de2013f135eb56cc4b67e04ceda95e957b9555c865a2",
		"Volumes": null,
		"WorkingDir": "",
		"Entrypoint": null,
		"OnBuild": null,
		"Labels": {
			"org.opencontainers.image.ref.name": "ubuntu",
			"org.opencontainers.image.version": "22.04"
		}
	},
	"created": "2023-06-02T01:44:46.577735785Z",
	"docker_version": "20.10.23",
	"os": "linux"
}
```

Et en fait, une image OCI c'est ça : 

```json
{
	"schemaVersion": 2,
	"mediaType": "application/vnd.docker.distribution.manifest.v2+json",
	"config": {
		"mediaType": "application/vnd.docker.container.image.v1+json",
		"size": 6305,
		"digest": "sha256:50440189b0f4cd6264c2f03f92acf4772680d864e3a0d422ef4c463733e139df"
	},
	"layers": [
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 30430275,
			"digest": "sha256:d1669123f28121211977ed38e663dca1a397c0c001e5386598b96c89b1b1cd51"
		},
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 17038759,
			"digest": "sha256:2ec73b48ae406646223453ca41d5d6b7cb739853fb7a44f15d35a31c238271d2"
		},
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 192587566,
			"digest": "sha256:9dbb3ddf83e9096c0e2f32bfa93d16285d2e9586b1a9aa25e33d04cf01d521c7"
		},
		{
			"mediaType": "application/vnd.docker.image.rootfs.diff.tar.gzip",
			"size": 175,
			"digest": "sha256:08d2567dd626029019cc940915699f23b075d05189d99319604fbdae3768fa36"
		}
	]
}
```

Des fichiers `tar.gz`, ayant chacun un digest `sha256`, et une config (avec son digest aussi).

Si on est capable de créer les fichiers `tar.gz`, de calculer un digest `sha256`, on peut créer une image OCI from scratch !

C'est ce que font les buildpacks.

Créer des images OCI, sans avoir besoin de Dockerfile !

---

# ça veut aussi dire, qu'on peut modifier une image, juste en allant modifier son manifest

sans forcément devoir passer par un process de reconstruction

par exemple, remplacer une ou plusieurs layers associées à des distributions ou runtime, sans devoir rebuilder, pratique pour patcher de la sécurité

---

# Buildpacks

Conçu par Heroku en 2011 pour leur propre besoin de PaaS multi-langage.

CNB (Cloud Native Buildpacks) initié en 2018, et a rejoint la CNCF (Cloud Native Computing Foundation) en 2018 en "Incubating"

---

Qui l'utilise en production ? Est-ce que c'est mature ?

Google App Engine - Google Cloud Run - Google Cloud Functions - Azure Container Apps - Gitlab AutoDevOps - KNative - Dokku - Spring Boot (mvn spring-boot:build-image) - Riff (Netlify)

---

# C'est quoi un buildpack ?

Plusieurs composants :

* builder : une image OCI qui va contenir tous les scripts et buildpacks pour construire une application
* stack : un couple de build image + run image (base pour les images qui seront construite)
* les buildpacks : implémentent chacun un logique de construction pour un langage ou un runtime

---

Un buildpack est composé de 2 fichiers : 
* bin/detect : indique si le buildpack doit être activé
* bin/build : contribue à la construction d'une ou plusieurs layers

---

Le builder : 

1. Monte le code source dans un répertoire /workspace
2. Interroge chaque buildpack avec "detect"
3. Exécute tous les buildpacks qui doivent être exécutés
4. Chaque buildpack contribue une ou plusieurs layer dans /layer
5. Les layers dans /layer sont ensuite exportées pour créer une image OCI !

---

Comment ça marche un builder ?

C'est une image de container :D 

On va avoir un répertoire /cnb pour Cloud Native Buildpacks
Ce répertoire va contenir /lifecycle avec des binaires, et /buildpacks 


Explication avec les schémas

---

En bonus

* Du cache peut être chargé depuis un registry OCI (.m2/ node_modules/)
* Les layers buildées peuvent être reproductibles
* l'utilisateur n'est pas root


---

Démo !

Construction d'une image petclinic !

pack build petclinic:demo --builder paketobuildpacks/builder:base

dive petclinic:demo

docker image inspect petclinic:demo | bat -l json

docker image inspect petclinic:demo | jq '.[].RootFS'

docker image inspect rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:paketo-base | jq '.[].RootFS'


diff -s <(docker image inspect petclinic:demo | jq '.[].RootFS') <(docker image inspect rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:paketo-base | jq '.[].RootFS')

---

Les builds reproductibles !

à partir du même code source, produit strictement le même binaire / la même image !
/app
C'est hyper pratique pour économiser de la place, si une layer n'a pas changé, etc

Exemple avec une application Spring Boot

---


Le rebase d'images

implémenté par la couche distrib, mais hyper intéressant 

permet de modifier les layers inférieures d'une image, sans avoir besoin de la reconstruire en entier

on met juste à jour le manifest, et on le push


---

Les builders disponibles

paketo : open source, porté par la fondation cloud foundry (VMWare / Pivotal + SAP)
google buildpacks : Google :D 
heroku : heroku

possibilité de créer son propre builder !

---

Les pro's

* un builder pour toutes vos stacks
* génère des BOM pour chaque layer !
* cache intégré
* facile d'utilisation
* 

---

Les con's