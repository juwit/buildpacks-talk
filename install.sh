#!/bin/bash

echo "installing pack"
sudo add-apt-repository ppa:cncf-buildpacks/pack-cli
sudo apt-get update
sudo apt-get install pack-cli

echo "installing kn"
KN_VERSION="v1.10.0"
wget https://github.com/knative/client/releases/download/knative-$KN_VERSION/kn-linux-amd64
chmod +x kn-linux-amd64
sudo mv kn-linux-amd64 /usr/local/bin/kn

echo "installing func"
wget https://github.com/knative/func/releases/download/knative-$KN_VERSION/func_linux_amd64
chmod +x func_linux_amd64
sudo mv func_linux_amd64 /usr/local/bin/func