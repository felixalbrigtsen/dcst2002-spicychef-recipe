dotenv_server:
	test -f server/.env || cp server/.env.example server/.env

dotenv_client:
	test -f client/.env || cp client/.env.example client/.env

install_server: dotenv_server
	cd server ; \
	npm ci

install_client: dotenv_client
	cd client ; \
	npm prune ; \
	npm ci

install: install_server install_client
	echo "Install complete"

build_client: install_client
	cd client ; \
	npm run build

build: install build_client
	echo "Build complete, start server with 'make run'"

run: 
	test -f client/public/bundle.js || ( echo "Cannot run without client build, run 'make build' first" && exit 1 )
	cd server ; \
	npm start

deliverable: 
	rsync -avz --exclude "node_modules" --exclude ".git" --exclude "coverage" ./ ../dcst2002-recipe-gr2-deliv
	7za a -tzip ../dcst2002-recipe-gr2-deliv.zip ../dcst2002-recipe-gr2-deliv
	rm -rf ../dcst2002-recipe-gr2-deliv
