# Commake (v0.0.1) - https://niallbunting.com/commake/common/makefile/2022/03/09/commake-common-makefile.html

.PHONY: all help init install build run lint test e2e plan deploy
all: lint test run #help Full check

help:
	@echo "-- HELP --"
	@grep '#[h]elp' makefile

init: #help Run through dependencies and check
	git secrets
	echo "Is this node 16?"
	node -v
	echo "If so, OK!"

install: #help Install packages
	npm i

build: #help Bulid the project files
	npm run build

run: #help Run Locally
	npm run start

storybook: #help Run Storybook
	npm run storybook

lint: #help Run linting
	npm run lint

test: #help Run the unit tests
	npm run test
	npm run sonar-scanner

e2e: #help Run the e2e tests
	@echo Not Implemented

plan: #help Plan to run any infra changes
	@echo Not Implemented

deploy: #help Run any infra changes
	@echo Not Implemented
