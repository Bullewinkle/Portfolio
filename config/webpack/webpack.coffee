path = require 'path'
paths = require '../paths'

module.exports =

	context: paths.app

	entry: "./index.js"

	output:
		path: paths.build
		filename: "bundle.js"
		publicPath: '/'
		pathinfo: true

	resolve:
		root: paths.app
		extensions:	[
			'',
			'.webpack.js',
			'.web.js',
			'.js',
			'.coffee',
			'.styl',
			'.jade',
			'.json'
		]

	plugins: [ {}, { options: {} } ]

	module:
		preLoaders: []

		loaders: [
			{ test: /\.html$/, 		loader: 'html-loader' }
			{ test: /\.css$/,		loader: 'style!css' }
			{ test: /\.png$/, 		loader: 'url-loader?limit=100000&mimetype=image/png' }
			{ test: /\.jpg$/, 		loader: 'file-loader' }
			{ test: /\.json$/, 		loader: 'json-loader' }

			{ test: /\.jade$/, 		loader: 'jade-loader' }
			{ test: /\.styl$/, 		loader: 'style-loader!css-loader!stylus-loader' }
			{ test: /\.coffee$/,	loader: "coffee-loader" }
			{ test: /\.(coffee\.md|litcoffee)$/, loader: "coffee-loader?literate" }
		]

console.log '\n !!! -------------- webpackConfig -------------- !!! \n'
console.log  module.exports