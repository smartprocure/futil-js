
# Test on the saucelabs cloud.
browser:
	TEST_ENV=browser ./node_modules/.bin/karma start karma.conf.js

# Test on local browsers.
local-browser:
	./node_modules/.bin/karma start karma.conf.js

