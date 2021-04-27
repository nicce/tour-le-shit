# tour-le-shit 💩

![workflow](https://github.com/nicce/tour-le-shit/actions/workflows/main.yaml/badge.svg)

Keeping track of leaderboard during the season and holder of the snek! 🐍

## Development

### Start

`docker-compose up`
`yarn run start:dev`
`cd ui && yarn start`

## Build

`yarn run build`
`cd ui && yarn run build`

### Heroku

Set `heroku config:set NPM_CONFIG_PRODUCTION=false` in order to make `Heroku` install dev dependecies. This is needed in order to run tsc on build.
