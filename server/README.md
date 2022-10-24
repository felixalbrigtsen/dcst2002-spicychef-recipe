# Recipe-App Backend

# API documentation is found [here](https://recipe.feal.no/api-docs)

### Setup and serve
- Download this folder (e.g. through git)
- `npm install`
- Populate the file `.env` with your configuration
- `npm start`

### Utilities
- Initialize and clear the database with `npm run initdb`
- Import recipes from TheMealDB, see `npm run mealdb help`

### Documentation
- We use jsdoc through better-docs to generate API docs.
- Build with `npm run docs`
- Output can be seen from docs/index.html, and on the link in the top of the document

### Technology stack
- TypeScript
- Node.JS
- Express
