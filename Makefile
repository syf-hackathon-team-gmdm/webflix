#
# Build environment:  Ubuntu 18.04
#

PROJECT ?= $(shell pwd)
SOURCE ?= $(PROJECT)/source
BUILD  ?= $(PROJECT)/build

NODE_NPM  ?= $(shell which npm)
NODE_MODS ?= $(PROJECT)/node_modules
NODE_BIN  ?= $(NODE_MODS)/.bin

#
# source
#

SOURCE_CHROME  ?= $(SOURCE)/chrome-extension
SOURCE_FIREFOX ?= $(SOURCE)/firefox-extension
SOURCE_WEBFLIX ?= $(SOURCE)/webflix.js

#
# build
#

EXT_CHROME  ?= $(BUILD)/chrome-extension
EXT_FIREFOX ?= $(BUILD)/firefox-extension
WEBFLIX_JS  ?= $(BUILD)/webflix


all: deps build

build: webflix.js chrome firefox

chrome:
	@mkdir -p $(EXT_CHROME)

firefox:
	@mkdir -p $(EXT_FIREFOX)

webflix.css:
	true

webflix.js:
	@mkdir -p $(WEBFLIX_JS)
	$(NODE_BIN)/browserify $(SOURCE_WEBFLIX)/webflix.js -o $(WEBFLIX_JS)/bundle.js

deps:
	$(NODE_NPM) install browserify sass webtorrent 2>/dev/null || true

clean:
	@rm -rf $(NODE_MODS)
	@rm -rf $(BUILD)
