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

## Changelog

### 2021-07-22

-   New point calculation. From now on you will earn the stable points instead of two times the points over par. This means, if you get 32 stableford points in your round, that is what you will get in tour-le-shit as well. Plus and minus birdies, eagles and muligans.
-   Also the birdies and eagles have changed from netto to brutto. (Note: The variable in the database has not changed)
