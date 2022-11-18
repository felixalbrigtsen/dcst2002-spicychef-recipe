# SpicyChef Frontend

### Description
The SpicyChef frontend is built with [React.JS](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/) and [Bulma.io](https://bulma.io).

### Development Setup
1. Download or clone the project
2. Install the depenencies
   * `npm install` for updated versions
   * `npm ci` for our known, working versions
3. Configure a backend server
   * Most functions require a backend server to be running
   * The process of configuring a server is described in [server/README.md](../server/README.md).
4. Configure an environment file
   * Create the file `.env` with the content `REACT_APP_API_URL=yourserver/api`
   * Replace "yourserver" with the address of your backend, for example `REACT_APP_API_URL=http://localhost:3000/api`
5. Start the development server environment
   * If you are not running the backend server:
     * `npm run`
     * This will start webpack in "watch mode", rebuilding and bundling the site every time a file changes
     * It will automatically start a web server on port 3000
   * or, if you are already running the server locally:
     * `npm run dev`
     * This will also start webpack as before, but will not start an additional web server
6. Visit the site in your browser
  * For example by visiting `localhost:3000`


### Tests
- We strive to test all aspects of our application.
- Run the tests with `npm test`
- The test do not require a running server instance

### Bundle the client for production
1. Follow [Development Setup](#development-setup) step 1-4
2. Run `npm run build` to bundle the project with webpack
3. The result is placed in `/public`, and contains all code and assets required
4. Deploy `/public` to your production environment.
   * **Recommended**:
     * Copy the public-directory next to your server 
     * Update `server/.env` to reflect your `CLIENT_BUILD_PATH`
     * The server will automatically serve the files from the client
   * **Alternate**:
     * Serve the client separately
     * The public-directory contains only vanliia HTML, JavaScript, CSS and assets, and can be served by any web server
     * Eg. Apache, IIS or nginx can be used to serve the client 
