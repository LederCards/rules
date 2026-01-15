# RULE

One app to RULE them all!

## Getting Started

1. `npm i`
1. `npm run compile:rules`

## Adding/Updating a New Game or Language

1. Create/update the game and/or language in `content/app.yml`
1. Create/update a folder in `content/rules/` with the game's short name (e.g. `arcs`)
1. Create/update a folder in `content/rules/<game>/` for the version of the game rules you want to add (e.g. `p1`) - _note: printings should be `p<number>` to ensure correct ordering_
1. Create/update a folder in `content/rules/<game>/<printing>/` for the language of the rules you want to add (e.g. `en-US`)
1. Create/update the necessary YAML files (`rules.yml`, `faq.yml`) in `content/rules/<game>/<printing>/` - _note: `faq.yml` is optional, but `rules.yml` is not_
1. Create/update `appconfig.yml` in `content/rules/<game>/`
1. Create/update `errata.yml` in `content/rules/<game>/` - _note: this is optional_

If you want to make a new game available to view without populating it in the publicly accessible menu, follow all of these steps except step 1, then
view it using this URL: "https://rules.buriedgiantstudios.com/?product=XXX&locale=XXX&printing=XXX", replacing the "XXX" with the appropriate names.
