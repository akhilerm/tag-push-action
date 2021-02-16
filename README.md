## About

Github action to retag and push multiplatform images to multiple registries

> :bulb: See also:
> * [login](https://github.com/docker/login-action) action
> * [docker-meta](https://github.com/crazy-max/ghaction-docker-meta) action

This action heavily relies on work done by [@tonistiigi](https://github.com/tonistiigi/repo-copy) and [@crazymax](https://github.com/crazy-max/ghaction-docker-meta)

## Usage

#### Basic
```yaml
name: Push-Image

on: push

jobs:
  push-image:
    runs-on: ubuntu-latest
    steps:

      - name: Login Quay
        uses: docker/login-action@v1
        with:
          registry: 'quay.io'
          username: ${{ secrets.QUAY_USERNAME }}
          password: ${{ secrets.QUAY_TOKEN }}

      - name: Login Dockerhub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Push image
        uses: akhilerm/tag-push-action@v1
        with:
          src: docker.io/akhilerm/node-disk-manager:ci
          dst: |
            quay.io/akhilerm/node-disk-manager-amd64:ci
```

1. Login to all the registries from which you want to pull and push the multiplatform image. 

**NOTE: The source registry should be logged in after all destination regisries are logged in.**

2. Specify the `src` and `dst` registry, both of which are mandatory fields. The action allows multiple destination 
registries specified as a yaml string.

**NOTE: If dockerhub is used, make sure that `docker.io` is specified in the image name**

#### Using with ghaction-docker-meta

The action can be used alongside [ghaction-docker-meta](https://github.com/crazy-max/ghaction-docker-meta) to generate
tags easily.

```yaml
name: Push-Image

on: push

jobs:
  push-image:
    runs-on: ubuntu-latest
    steps:

      - name: Login Dockerhub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Docker meta
        id: docker_meta
        uses: crazy-max/ghaction-docker-meta@v1
        with:
          images: docker.io/akhilerm/node-disk-manager     

      - name: Push image
        uses: akhilerm/tag-push-action@v1
        with:
          src: docker.io/akhilerm/node-disk-manager:ci
          dst: |
            ${{ steps.docker_meta.outputs.tags }}
```

The output tags from the `docker_meta` can be used as destination tags for this github action.
