# RULE

One app to RULE them all!

## Getting Started

1. `npm i`
1. `npm run compile:rules`

## Adding/Updating a New Game or Language

1. Create/update the game and/or language in `content/app.yml`
1. Create/update a folder in `content/rules/` with the game's short name (e.g. `root`)
1. Create/update a folder in `content/rules/<game>/` for the version of the game rules you want to add (e.g. `v1`) - _note: versions should be `v<number>` to ensure correct ordering_
1. Create/update a folder in `content/rules/<game>/<version>/` for the language of the rules you want to add (e.g. `en-US`)
1. Create/update the necessary YAML files (`rules.yml`, `faq.yml`) in `content/rules/<game>/<version>/` - _note: `faq.yml` is optional, but `rules.yml` is not_
1. Create/update `appconfig.yml` in `content/rules/<game>/`
