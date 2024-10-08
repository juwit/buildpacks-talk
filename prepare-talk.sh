#!/bin/sh

# pruning all docker data
# docker system prune --all --volumes

# pulling talk images
docker image pull paketobuildpacks/builder:base
docker image pull paketobuildpacks/builder:tiny
docker image pull heroku/builder:22
docker image pull gcr.io/buildpacks/builder:google-22

docker image pull eclipse-temurin:17.0.7_7-jdk

# building petclinic with dockerfile
cd /home/jwittouck/workspaces/sunny-tech/buildpacks-talk/spring-petclinic/
docker image build -t petclinic:dockerfile .

