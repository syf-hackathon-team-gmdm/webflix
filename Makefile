#
# Build environment:  Ubuntu 18.04
#

PROJECT ?= $(shell pwd)
SOURCE  ?= $(PROJECT)/source
BUILD   ?= $(PROJECT)/build

#
# npm
#

NODE_NPM  ?= $(shell which npm)
NODE_MODS ?= $(PROJECT)/node_modules
NODE_BIN  ?= $(NODE_MODS)/.bin

#
# source
#

SOURCE_EXTENSION   ?= $(SOURCE)/extension
SOURCE_CHROME      ?= $(SOURCE)/chrome-extension
SOURCE_FIREFOX     ?= $(SOURCE)/firefox-extension
SOURCE_WEBFLIX_CSS ?= $(SOURCE)/webflix.css
SOURCE_WEBFLIX_JS  ?= $(SOURCE)/webflix.js

#
# build
#

BUILD_CHROME  ?= $(BUILD)/chrome-extension
BUILD_FIREFOX ?= $(BUILD)/firefox-extension
BUILD_WEBFLIX ?= $(BUILD)/webflix


all: deps build

deps:
	$(NODE_NPM) install browserify sass webtorrent 2>/dev/null || true

build: webflix.css webflix.js chrome firefox

chrome: webflix.css webflix.js
	@mkdir -p $(BUILD_CHROME)/static
	@cp $(BUILD_WEBFLIX)/* $(BUILD_CHROME)/static
	@cp -r $(SOURCE_EXTENSION)/* $(BUILD_CHROME)
	@cp -r $(SOURCE_CHROME)/* $(BUILD_CHROME)

firefox: webflix.css webflix.js
	@mkdir -p $(BUILD_FIREFOX)/static
	@cp $(BUILD_WEBFLIX)/* $(BUILD_FIREFOX)/static
	@cp -r $(SOURCE_EXTENSION)/* $(BUILD_FIREFOX)
	@cp -r $(SOURCE_FIREFOX)/* $(BUILD_FIREFOX)

webflix.css:
	@mkdir -p $(BUILD_WEBFLIX)
	@cat $(SOURCE_WEBFLIX_CSS)/bootstrap.min.css > $(BUILD_WEBFLIX)/styles.css
	$(NODE_BIN)/sass $(SOURCE_WEBFLIX_CSS)/styles.sass >> $(BUILD_WEBFLIX)/styles.css

webflix.js:
	@mkdir -p $(BUILD_WEBFLIX)
	$(NODE_BIN)/browserify $(SOURCE_WEBFLIX_JS)/webflix.js --s webflix -o $(BUILD_WEBFLIX)/bundle.js

clean:
	@rm -rf $(NODE_MODS)
	@rm -rf $(BUILD)
