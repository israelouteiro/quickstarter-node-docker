# Quick Start API NodeJS With JWT Auth

###### ( NodeJS, Express, MongoDB, Docker )

## To up and Run with docker follow this simple steps

- Run in your environment a MongoDB instance, (just run command below)

```shell
$ docker-compose up -d mongodb
```


- Then, run Api project, (just run command below)

```shell
$ docker-compose up api
```


## About ApiDoc

- we documented the API using apidoc, take sure you have it installed on your OS, to update run the command below

```shell
$ apidoc -i <input_folder> -o <output_folder> -t <template_folder>
```

## About Tests

- to test application we use `Mocha` , take sure you have it installed on your OS, and follow this steps

- Access Service folder, 
```shell
$ cd service
```

- Run Test Automatized
```shell
$ npm test
```

Contribute!
