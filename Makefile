
# Test on the saucelabs cloud.
browser:
	./node_modules/.bin/zuul --no-coverage -- test/*

# Spin up a server and test on localhost.
local-browser:
	./node_modules/.bin/zuul --no-coverage --local 8080 --open -- test/*

# Spin up a server and open a tunnel which could be accessed through internet.
tunnel:
	./node_modules/.bin/zuul --no-coverage --local 8080 --tunnel -- test/*
