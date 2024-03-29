# Commake (v0.0.1) - https://niallbunting.com/commake/common/makefile/2022/03/09/commake-common-makefile.html

.PHONY: all help init install build run lint test e2e plan deploy versioncheck
all: #help Full check
	lint test run
help:
	@echo "-- HELP --"
	@grep '#[h]elp' makefile | sed s/#[h]elp//g

init: #help Run through dependencies and check
	git secrets
	echo "Is this node 18?"
	node -v
	echo "If so, OK!"

versioncheck:
	if [ `node -v | cut -c 2-3` -lt 18 ]; then echo "Less than node v18."; exit 1; fi

install: versioncheck #help Install packages
	npm i

build: #help Build the project files
	npm run build

run: versioncheck #help Run Locally
	npm run start

api: versioncheck #help Run Locally
	npm run mock-api

storybook: #help Run Storybook
	npm run storybook

lint: #help Run linting
	npm run lint

test: #help Run the unit tests
	npm run test
	npm run sonar-scanner

e2e: #help Run the e2e tests
	npm run e2e

plan: #help Plan to run any infra changes
	@echo Not Implemented

deploy: #help Run any infra changes
	@echo Not Implemented
