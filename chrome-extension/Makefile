#
# Build environment:  Ubuntu 18.04
#
PROJECT ?= $(shell pwd)

SOURCE ?= $(PROJECT)/source
BUILD ?= $(PROJECT)/build

NODE_NPM ?= $(shell which npm)
NODE_MODS ?= $(PROJECT)/node_modules
NODE_BIN ?= $(NODE_MODS)/.bin

DOCKER_IMAGE = "webflix-extension:latest"


all: deps build

build:
	true

docker:
	docker build . --tag=$(DOCKER_IMAGE)

docker-build:
	docker run --rm -d -v "$(shell pwd)/build:/src/build" $(DOCKER_IMAGE)

deps:
	$(NODE_NPM) install sass 2>/dev/null
	@mkdir -p $(BUILD)
	@mkdir -p $(BUILD)/static

clean: clean-docker
	@rm -rf $(NODE_MODS)
	@rm -rf $(BUILD)

clean-docker:
	docker image rm $(DOCKER_IMAGE) || true
