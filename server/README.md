# Recipe-App Backend

# API documentation is found [here](https://recipe.feal.no/api-docs)

### Setup and serve

- Download this folder (e.g. through git)
- `npm install`
- Populate the file `.env` with your configuration
- `npm start`

### env file example

```ini
PORT=3000
MYSQL_HOST=mysql.example.com
MYSQL_USER=spicychef
MYSQL_PASSWORD=spicychefpassword
MYSQL_DATABASE=spicychef
GOOGLE_OAUTH_ID=<GOOGLE_OAUTH2.0_CLIENT_ID>
GOOGLE_OAUTH_SECRET=GOCSPX-YOURSECRET
GOOGLE_CALLBACK_URL=http://yourdomain.com/api/auth/google/callback
SESSION_SECRET=supersecretcookiepassword
SESSION_SECURE_COOKIE=true
DEBUG=false
```

### Utilities

- Initialize and clear the database with `npm run initdb`
- Import recipes from TheMealDB, see `npm run mealdb help`

### Documentation

- We use jsdoc through better-docs to generate API docs.
- Build with `npm run docs`
- Output can be seen from docs/index.html, and on the link in the top of the document
