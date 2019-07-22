install:
	npm install
start:
	npm run babel-node -- src/bin/gendiff.js
publish: 
	npm publish --dry-run 
lint:
	npm run eslint
test:
	npm run test