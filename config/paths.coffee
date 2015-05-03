path = require 'path'

rootPath = process.cwd()

module.exports =
	root: rootPath
	app: path.join rootPath, "app"
	build: path.join rootPath, "app/assets"

