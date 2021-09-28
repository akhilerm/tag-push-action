# tag-push-action

## About

Github action to retag and push multiplatform images to multiple registries

> :bulb: See also:
>
> * [login](https://github.com/docker/login-action) action
> * [docker-meta](https://github.com/crazy-max/ghaction-docker-meta) action

The v1 version of this action heavily relied on work done by [@tonistiigi](https://github.com/tonistiigi/repo-copy). 

The current version uses [crane](https://github.com/google/go-containerregistry/tree/main/cmd/crane) from google for copying images, and the action itself is a modified version of script written by [@crazymax](https://github.com/docker/metadata-action)

## Usage

### Basic

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
        uses: akhilerm/tag-push-action@v2.0.0
        with:
          src: docker.io/akhilerm/node-disk-manager:ci
          dst: |
            quay.io/akhilerm/node-disk-manager-amd64:ci
```

1. Login to all the registries from which you want to pull and push the multiplatform image.


2. Specify the `src` and `dst` registry, both of which are mandatory fields. The action allows multiple destination registries specified as a yaml string.

**NOTE: If dockerhub is used, make sure that `docker.io` is specified in the image name**

### Using with `docker/metadata-action`

The action can be used alongside [metadata-action](https://github.com/docker/metadata-action) to generate
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
        id: meta
        uses: docker/metadata-action@v3
        with:
          images: docker.io/akhilerm/node-disk-manager     

      - name: Push image
        uses: akhilerm/tag-push-action@v2.0.0
        with:
          src: docker.io/akhilerm/node-disk-manager:ci
          dst: |
            ${{ steps.meta.outputs.tags }}
```

The output tags from the `meta` step can be used as destination tags for this github action.

### Use a custom docker config file

The standard docker config path on GitHub runner is `/home/runner/.docker/config.json`. In case you're running on a custom GitHub runner, and your config path is not standard, then the `docker-config-path` can be used.

```yaml
  - name: Push image
    uses: akhilerm/tag-push-action@v2.0.0
    with:
      docker-config-path: /home/myuser/.docker/config.json
      src: docker.io/akhilerm/node-disk-manager:ci
      dst: |
        quay.io/akhilerm/node-disk-manager-amd64:ci
```
