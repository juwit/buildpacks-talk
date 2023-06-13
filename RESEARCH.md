# Laissez tomber vos Dockerfile, adoptez un buildpack !

# Plan détailllé
* accroche -> construire une image c'est compliqué
* comment Docker construit une image
* c'est quoi une image docker
* c'est quoi le problème
    * l'écriture du Dockerfile
        * Dockerfile simple
        * Dockerfile multi-layers optimisé
        * Dockerfile multi-stage
    * re-builder des images
* c'est quoi un buildpack, d'où ça vient
* comment buildpacks construit une image
* le vocabulaire
    * stack, builder = build image, buildpack, run image
* les buildpacks de la commu
    * paketo
    * heroku
    * google
    * cloud foundry (paketo)
* demo
* le rebase d'image
* demo ?
* les soucis avec buildpack
    * bien mais pas top
    * compliqué à customiser
    * certains buildpacks sont pas oufs pour de la prod
        * code source embarqué dans l'image finale
* conclusion

# Liens et recherche

* https://buildpacks.io/

OCI : 
* https://github.com/opencontainers/image-spec

Icônes : 
* https://www.pngrepo.com/collection/logistic-delivery/

Paketo:
* https://paketo.io/docs/concepts/stacks/

Code Go : 
* https://github.com/buildpacks/lifecycle/blob/ae5c3e572c8dc7555fe64d6b7c483ca1d543f8c3/rebaser.go#L40

Buildpack Google : 
* https://cloud.google.com/docs/buildpacks/build-application
* https://cloud.google.com/docs/buildpacks/build-run-image

## Illustrations

Photos Thème pirate
* https://unsplash.com/s/photos/pirate
Slides thèmes:
* https://slidesgo.com/fr/theme/minitheme-journee-du-parler-pirate
* https://slidesgo.com/fr/theme/activites-pour-lecole-elementaire-tresor-de-pirate
* https://slidesgo.com/fr/theme/activites-avec-des-pirates-pour-les-maternelles
Icônes:
* https://www.flaticon.com/fr/packs/pirates-6
* https://www.flaticon.com/fr/packs/pirates-7
* https://www.flaticon.com/fr/packs/pirates-10
* https://www.flaticon.com/fr/packs/pirates-11
* https://www.flaticon.com/fr/packs/pirates-16
* https://www.flaticon.com/fr/packs/pirates-22
* https://www.flaticon.com/fr/packs/pirates-25
* https://www.flaticon.com/fr/packs/pirates-31
* https://www.flaticon.com/fr/packs/pirates-33
* https://www.flaticon.com/fr/packs/pirates-91
* https://www.flaticon.com/fr/packs/pirate-25
* 
* https://icons8.com/icons/authors/3kSkbuAyjUdG/justicon/external-justicon-flat-justicon/external-pirates-justicon-flat-justicon
* https://icons8.com/icons/authors/WVmZbri2l0pj/flat-icons/external-flaticons-flat-flat-icons/external-pirates-flaticons-flat-flat-icons
* 

## Labels sur les images

Pour rebase correctement, le stack.id doit être le même

```json
"Labels": {
    "io.buildpacks.stack.distro.name": "Ubuntu",
    "io.buildpacks.stack.distro.version": "22.04",
    "io.buildpacks.stack.homepage": "https://github.com/GoogleCloudPlatform/buildpacks/stacks/google-22",
    "io.buildpacks.stack.id": "google.22",
    "io.buildpacks.stack.maintainer": "Google",
    "io.buildpacks.stack.mixins": "[]",
    "org.opencontainers.image.ref.name": "ubuntu",
    "org.opencontainers.image.version": "22.04"
}
```

# installation
https://buildpacks.io/docs/tools/pack/


pack CLI


# sur un projet maven:

## Le buildpack Google

```bash
pack build petclinic:google-v1 --builder gcr.io/buildpacks/builder:v1 -e GOOGLE_RUNTIME_VERSION=17

docker image tag petclinic:google-v1 rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:google-v1

docker push rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:google-v1

pack build petclinic:google-22 --builder gcr.io/buildpacks/builder:google-22 -e GOOGLE_RUNTIME_VERSION=17

docker image tag petclinic:google-22 rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:google-22

docker push rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:google-22
```

Produit des images contenant le source !
![Image not found: buildpacks/dive-run-google.png](buildpacks/dive-run-google.png "Image not found: buildpacks/dive-run-google.png")

## Le build pack spring-boot de paketo

```bash
pack build petclinic:paketo-base --builder paketobuildpacks/builder:base

docker image tag petclinic:paketo-base rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:paketo-base

docker push rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:paketo-base
```

```bash
pack build petclinic:paketo-tiny --builder paketobuildpacks/builder:tiny

docker image tag petclinic:paketo-tiny rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:paketo-tiny

docker push rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:paketo-tiny
```

optimisé (avec maven uniquement)
```bash
pack build petclinic:paketo --builder gcr.io/paketo-buildpacks/builder:base
  
```

## Les build packs heroku

Ajouter un system.properties:
```properties
java.runtime.version=17
```

```bash
pack build rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:heroku --builder heroku/builder:22

docker push rg.fr-par.scw.cloud/sunny-tech-buildpacks/petclinic:heroku
```

# Registry + browser
```yaml
services:
  registry-browser:
    image: klausmeyer/docker-registry-browser
    ports:
      - "5001:8080"
    environment:
      - DOCKER_REGISTRY_URL=http://registry:5000
  registry:
    image: "registry:2"
    ports:
      - "5000:5000"
```

# Reproductibilité des builds

Attention, ne fonctionne qu'avec des langages au build reproductible (node, go), et pas java

Tester de builder 2 fois la même appli avec Docker

Tester de builder 2 fois la même appli avec Buildpack:
```
pack build nodejs-hello --builder paketobuildpacks/builder:base
```

Comparer les sha256 des layers

# Qui utilise les buildpacks ?
Cloud Run
Cloud Functions
Knative => "func build"
mvn spring-boot:build-image