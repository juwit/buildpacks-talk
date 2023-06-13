#!/bin/bash

echo "create a directory, and put some binary file in it"

mkdir -p image/blobs/sha256

cd image

# création d'une layer, ajout de ls, et de quelques fichiers
mkdir -p layer-1/bin
cp /bin/ls layer-1/bin
touch layer-1/homer
touch layer-1/marge 
touch layer-1/bart
touch layer-1/lisa 

"""
.
├── bart
├── bin
│   └── ls
├── homer
├── list
└── marge

1 directory, 5 files
"""

cd layer-1
tar cvf layer-1.tar *
gzip layer-1.tar

sha256sum layer-1.tar
f4d0ddff1b93ca0b65163ec5d45d76eeefb96248f880e48a082a046330c9d019