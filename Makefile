install:
	npm run install
start:
	npx babel-node -- src/bin/gendiff.js
publish: 
	npm run publish --dry-run 
lint:
	npx eslint src
	npx eslint __tests__/*.test.js
test:
	npm run test