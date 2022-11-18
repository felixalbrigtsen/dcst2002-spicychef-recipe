# dcst2002-recipe-gr2

## Install:
- Build the client as described in `client/README.md`
- Start the server as described in `server/README.md`

## See the demo
- https://recipe.feal.no


------------------

# Quick Introduction

SpicyChef is an online recipe application. It is developed by students at NTNU, as course work in DCST2002 Webutvikling.

![Front page screenshot](documentation/frontpage.png)

# Usage / Features

- Recipes can be browsed and searched in [/recipes](https://recipe.feal.no/recpies) and [/search](https://recipe.feal.no/search)
- Users can sign in using google
- Users can like recipes, and find their favorites in [/likes](https://recipe.feal.no/likes)
- Ingredients can be added to the users shopping list in [/shoppinglist](https://recipe.feal.no/shoppinglist)
- Recipes can be filtered and found by their tags, categories, area of origin and their number of likes
- Administrators can easily edit and add new recipes, or automatically import them from TheMealDB


# Development

- The client and the server are independent projects, separated in [/client](/client) and [/server](/server)
- The two parts communicate via a REST API, described in [/api-docs](https://recipe.feal.no/api-docs)
- Changes are verified and tested, before they are automatically deployed by our CI/CD pipelines

![GitLab Pipelines](documentation/full_pipeline.png)
