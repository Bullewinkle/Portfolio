path = require 'path'
ip = require 'ip'

WebpackDevServer = require 'webpack-dev-server'
webpack = require 'webpack'
webpackConfig = require './config/webpack/'
#
ipAddress = ip.address()
port = webpackConfig.devServer.port
#
compiler = webpack webpackConfig.webpack, (err, compilation) =>
	if err then console.error "!!! error in #{__filename} : #{err}"

#server = new WebpackDevServer compiler, webpackConfig.devServer
#server.listen port, ipAddress, ->
#	console.log "\nwebpack server started on \t\t\t#{ipAddress}:#{port}/bundle"
#	console.log "webpack dev-server started on \t\t#{ipAddress}:#{port}/webpack-dev-server/bundle \n"