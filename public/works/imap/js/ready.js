/*	TODO
	[]	-	Fix zoomIn(235) and zoomOut(394) functions
	[]	-	Optimaze zoomIn(235) and zoomOut(394) functions, especially zoomIn
	[]	-	Make zoomOut by click outside
	[]	-	Remove zoomOut button
*/

var GLOBAL = window;

(function (GLOBAL) {

	//DEFINE
	function IMap () {
		this.name = 'iMap'
	}

	function Attributes () {
		this.svg = {
			el: 'svg',
			attrs: {
				id: 'map-Russia',
				width: 722,
				height: 560,
				viewBox: '-110 0 920 560'
			}
		};
		this.projection = {
			rotate:[-105, 0],
			center:[-10, 65],
			parallels: [52, 64],
			scale:700,
			translate: [
				this.svg.attrs.width / 2,
				this.svg.attrs.height / 2
			]
		};
		this.common = {
			baseDuration: 140,
			markerIconPath: 'sources/red-marker.svg',
			zoomOutIconPath: 'sources/zoom-out.svg',
		};
		this.colors = {
			hover: 'tomato'
		};
		this.tooltip = {
			el: "div",
			attrs: {
				class: "tooltip"

			}

		};
		this.zoomOutButton = {
			attrs: function (opts) {
				var attrs = {
					id: 'zoomOutButton',
					x: opts.x,
					y: opts.y,
					xlinkhref: attributes.common.zoomOutIconPath,
					width: 42,
					height: 42
				}
				return attrs
			}
		};
	}

	function Functions () {
		this.svg = {
			onMouseMove: function (tooltip) {
				return function () {
					if (d3.event.target.nodeName == 'path' || d3.event.target.nodeName == 'g') {
						tooltip.style({
							'opacity': 0.8,
							'top': d3.event.layerY + 20 + 'px',
							'left': d3.event.layerX + 20 + 'px'
						})
					} else {
						tooltip.style({
							'opacity': 0,
							'top': d3.event.layerY + 20 + 'px',
							'left': d3.event.layerX + 20 + 'px'
						})
					}
				}
			}
		};
		this.d3 = {
			trigger: function(d3Obj, evtName) {
				var el = d3Obj[0][0],
					event = d3.event;

				if (event.initMouseEvent) {
					var mousedownEvent = document.createEvent("MouseEvent");
					mousedownEvent.initMouseEvent(
						"mousedown", true, true, window, 0,
						event.screenX, event.screenY, event.clientX, event.clientY,
						event.ctrlKey, event.altKey, event.shiftKey, event.metaKey,
						0, null);
					el.dispatchEvent(mousedownEvent);
				} else {
					if (document.createEventObject) {
						var mousedownEvent = document.createEventObject(window.event);
						mousedownEvent.button = 1;
						el.fireEvent(evtName, mousedownEvent);
					}
				}
			},
			getCentroid: function(selection) {
				var element = selection.node(),
					bbox = element.getBBox();
				return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
			}
		};
		this.map = {
			showDistrictsWithCities: function showDistrictsWithCities () {
				d3.selectAll('#map-Russia > .markers .with_cities_marker').each(function (data,index) {
					var marker = d3.select(this)
					var delay = 20*((index+1)*index/3)
					marker
						.attr({
							'transform' : function (d) {
								return 'translate('+ (d[0]) +','+(d[1] -25 -100) +')';
							}
						})
						.select('.with_cities_marker_image')
						.attr({
							'transform' : 'translate(-18,0)'
						})
						.style({
							'display' : 'block'
						})
						.transition()
						.delay(delay)
						.duration(attributes.common.baseDuration*2)
						.style('opacity',1)

					marker
						.transition()
						.delay(delay)
						.duration(attributes.common.baseDuration*2)
						.attr({
							'transform' : function (d) {
								return 'translate('+ (d[0]) +','+(d[1] -25) +')';
							}
						})
				})
			},
			hideDistrictsWithCities: function hideDistrictsWithCities () {
				d3.selectAll('#map-Russia > .markers .with_cities_marker > .with_cities_marker_image')
					.transition()
					.duration(attributes.common.baseDuration*2)
					.attr({
						'transform' : function (d) {
							return '';
						}
					})
					.style('opacity',0)
					.delay(10)
					.each('end',function (d) {
						d3.select(this).style('display','none')
					})
			},
			showRegionsWithCities: function showRegionsWithCities (element) {
				element.selectAll('.markers .with_cities_marker').each(function (d,index) {
					var marker = d3.select(this)
					var coords = d.coords
					marker
						.attr({
							transform : function (d) {
								return 'translate('+ (coords[0])+',' + (coords[1] - 50 ) +')' + 'scale('+( 1/ d3.select(this.parentNode.parentNode).datum().zoomValue)+')'
							}
						})
						.select('.with_cities_marker_image')
						.attr({
							'transform' : 'translate(-21,-35)'
						})
						.style({
							'display' : 'block'
						})
						.transition()
						.delay(function (d,i) {
							return 10*(index+1)
						})
						.duration(attributes.common.baseDuration*2 + 100)
						.style('opacity',1)

					marker
						.transition()
						.delay(function (d,i) {
							return 10*(index+1)
						})
						.duration(attributes.common.baseDuration*2 + 100)
						.attr({
							transform : function (d) {
								return  'translate('+ (coords[0])+',' + (coords[1]-1) +')' + 'scale('+( 1/ d3.select(this.parentNode.parentNode).datum().zoomValue)+')'
							}
						})
				})
			},
			hideRegionsWithCities: function hideRegionsWithCities (element) {

				svg.selectAll('.district.with_cities > .markers .with_cities_marker_image')
					.transition()
					.duration(attributes.common.baseDuration*2)
					.style('opacity',0)
					.delay(10)
					.each('end',function (d) {
						d3.select(this).style('display','none')
					})
			},
			showCities: function showCities (element) {
				var currentCities = element.selectAll('.city')

				currentCities.each(function (d) {
					var currentCity = d3.select(this)
					var currentTranslate = currentCity.attr('transform')
					if ( currentCity.datum().resized ) {
						currentCity.style('display','block')
					} else {
						currentCity.style('display','block')
							.selectAll('.city_link')
							.attr({
								transform: function (d) {
									var parentDistrict = d3.select(this.parentNode.parentNode.parentNode.parentNode)
									return 'scale('+( 1/parentDistrict.datum().zoomValue )+')' + 'scale('+( 1/element.datum().zoomValue )+')'
								}
							})
							.datum().resized = true
					}
				})
			},
			hideCities: function hideCities (element) {
				element.selectAll('.city')
					.style('display','none')
			},
			zoomIn: function zoomIn (element) {
				if ( element.classed('district') && element.datum().zoom !== 2 ) { // zoom level 2


					var svgNode = svg.node()
					var svgBbox = svgNode.getBBox()
					var svgWidth = svgBbox.width
					var svgHeight = svgBbox.height
					var svgCenter = d3.getCentroid(svg)

					var elNode = element.node()
					var elBbox = elNode.getBBox()
					var elWidth = elBbox.width - 260;
					var elHeight = elBbox.height;
					var elCenter = d3.getCentroid(element)

					var elSiblings = element.node().parentNode.childNodes
					for ( var i = 0; i < elSiblings.length; i++ ) {
						if ( elSiblings[i] !== element.node() && elSiblings[i].id !== 'zoomOutButton') {
							d3.select(elSiblings[i])
								.transition()
								.duration(240)
								.style({
									'opacity' : 0
								})
								.each('end',function () {
									d3.select(this).style('display','none')
								})
						}
					}

					var coefficent;
					var moveX;
					var moveY;
					if ( elWidth >= elHeight ) {

						coefficent = (svgWidth / elWidth ).toFixed(3)

					} else if ( elHeight >= elWidth ) {

						coefficent = (svgHeight / elHeight).toFixed(3)

					}
					if ( coefficent < 1.3 ) {
						coefficent = 1.3
					}
					element.datum().zoomValue = coefficent


					functions.map.hideDistrictsWithCities()
					functions.map.showRegionsWithCities(element)
					svg.currentZoomedElement = element
					element.datum().zoom = 2

					moveX = (svgCenter[0] - elCenter[0]* coefficent) ;
					moveY = (svgCenter[1] - elCenter[1]* coefficent) ;
					element.classed('zoom_2',true)
						.transition()
						.duration(300)
						.attr({
							'transform': function () {
								return 'translate('+ moveX +','+ moveY +')scale('+ coefficent +')'
							},
							'fill': function (d) {
								return d.color
							}
						})
						.selectAll('.city_link')

					setTimeout(function () {
						element.selectAll('path')
							.transition().duration(attributes.common.baseDuration)
							.style({
								'stroke': '#fff',
								'stroke-width': '1px'
							})
					},100)
					zoomOutButton
						.style('display','block')
						.transition()
						.duration(200)
						.style('opacity','1')
				} else if ( element.classed('region') && element.datum().zoom !== 3 ) { // zoom level 3

					functions.map.hideRegionsWithCities()
					svg.currentZoomedElement = element
					element.datum().zoom = 3

					var svgEl = element.parent
					var svgNode = svgEl.node()
					var svgBbox = svgNode.getBBox()
					var svgWidth = svgBbox.width
					var svgHeight = svgBbox.height
					var svgCenter = d3.getCentroid(svgEl)

					var elNode = element.node()
					var elBbox = elNode.getBBox()
					var elWidth = elBbox.width;
					var elHeight = elBbox.height;
					var elCenter = d3.getCentroid(element)

					var elSiblings = element.node().parentNode.childNodes
					for ( var i = 0; i < elSiblings.length; i++ ) {
						if ( elSiblings[i] !== element.node()) {
							d3.select(elSiblings[i])
								.transition()
								.duration(240)
								.style({
									'opacity' : 0
								})
								.each('end',function () {
									d3.select(this).style('display','none')
								})
						}
					}

					var coefficent;
					var moveX;
					var moveY;
					if ( elWidth >= elHeight ) {

						coefficent = (svgWidth / elWidth ).toFixed(3)

					} else if ( elHeight >= elWidth ) {

						coefficent = (svgHeight / elHeight).toFixed(3)

					}
					if ( coefficent < 1.3 ) {
						coefficent = 1.3
					}
					element.datum().zoomValue = coefficent

					moveX = -(elCenter[0])*(coefficent-1) + (svgCenter[0] - elCenter[0]);
					moveY = -(elCenter[1])*(coefficent-1) + (svgCenter[1] - elCenter[1]);

					element.classed('zoom_3',true)
						.transition()
						.duration(300)
						.attr({
							'transform': function () {
								return 'translate('+ moveX +','+ moveY +')scale('+ coefficent +')'
							},
							'fill': function (d) {
								return d.color
							}
						})

					setTimeout(function () {
						element.selectAll('path')
							.transition().duration(attributes.common.baseDuration)
							.style({
								'stroke': '#fff',
								'stroke-width': '0'
							})
					},100)
					setTimeout(functions.map.showCities(element),200)
				}
			},
			zoomOut: function zoomOut () {
				if ( svg.currentZoomedElement && svg.currentZoomedElement.length > 0) {

					var elSiblings = svg.currentZoomedElement.node().parentNode.childNodes

					for ( var i = 0; i < elSiblings.length; i++ ) {
						if ( elSiblings[i] !== svg.currentZoomedElement.node() && elSiblings[i].id !== 'zoomOutButton') {
							d3.select(elSiblings[i])
								.style('display','block')
								.transition()
								.duration(240)
								.style({
									'opacity' : 1
								})
						} else if ( elSiblings[i] === svg.currentZoomedElement.node()) {

						}
					}

					svg.currentZoomedElement
						.transition()
						.duration(300)
						.attr({
							'transform': 'translate(0,0)scale(1)',
							'fill': function (d) {
								return d.color
							}
						})

					setTimeout(function () {
						svg.currentZoomedElement.selectAll('path')
							.transition().duration(attributes.common.baseDuration)
							.style({
								'stroke': '#fff',
								'stroke-width': '1px'
							})
					},100)

					if (  svg.currentZoomedElement.datum().zoom === 3  ) {
						svg.currentZoomedElement.classed('zoom_3',false)
						svg.currentZoomedElement.datum().zoom = 1
						svg.currentZoomedElement = svg.currentZoomedElement.parent

						setTimeout(hideCities( svg.currentZoomedElement ),200)
						showRegionsWithCities( svg.currentZoomedElement )
					} else if ( svg.currentZoomedElement.datum().zoom === 2 ) {
						hideRegionsWithCities( svg.currentZoomedElement )
						svg.currentZoomedElement.datum().zoom = 1
						svg.currentZoomedElement.classed('zoom_2',false)
						setTimeout(function () {
							svg.currentZoomedElement.selectAll('path')
								.transition().duration(attributes.common.baseDuration)
								.style({
									'stroke': '#fff',
									'stroke-width': '0'
								})
						},100)
						showDistrictsWithCities()

						zoomOutButton
							.transition()
							.duration(200)
							.style('opacity','0')
							.each('end',function () {
								d3.select(this)
									.style('display','none')
							})
					}
				}
			}
		}
		this.districtCallbacks = {
			mouseenter: function (dictionary) {
				return function(d) {
					var _this = d3.select(this)
					if ( _this.classed( 'zoom_2' ) ) {return false } else {
						tooltip.node().innerHTML = dictionary[this.id];
						_this
							.attr('fill', attributes.colors.hover);
					}
				}
			} ,
			mouseleave: function(d) {
				var _this = d3.select(this)
				_this
					.attr('fill', function (d) {
						return d.color
					});
			},
			click: function(d) {
				this.parentNode.appendChild(this);
				var _this = d3.select(this)
				_this.target = d3.select(d3.event.target.parentNode)
				if ( !_this.classed('zoom_2') ) {
					functions.map.zoomIn(_this)
				}
			}
		};
		this.regionCallbacks = {
			mouseenter: function(dictionary) {
				return	function(d) {
					var _this = d3.select(this)
					_this.parent = d3.select(this.parentNode.parentNode)

					if (_this.datum().zoom === 3) {
						return false
					}

					if ( !_this.parent.classed('zoom_2') ) { return false } else {
						tooltip.node().innerHTML = dictionary[this.id];
						_this.attr('fill', _this.parent.data()[0].color)
							.attr('fill', attributes.colors.hover);
					}
				}
			},
			mouseleave: function(d) {
				var _this = d3.select(this)
				_this.parent = d3.select(this.parentNode.parentNode)

				if (_this.datum().zoom === 3) {
					return false
				}

				if ( !_this.parent.classed('zoom_2') ) { return false } else {
					_this
						.attr('fill',null)
				}
			},
			click: function(d) {
				var _this = d3.select(this)
				_this.parent = d3.select(this.parentNode.parentNode)
				if (_this.datum().zoom === 3) {
					window.location.href = _this.datum().link;
				}

				if ( !_this.parent.classed('zoom_2') ) { return false } else {
					this.parentNode.appendChild(this);
					functions.map.zoomIn(_this)
				}
			}
		};
		this.ready = function (error, map, Russia, dictionary) {
			if (error) throw error

			var mapShapes = topojson.object(map, map.objects.russia).geometries;

			/* Preparing received data for drawing the map */
			prepareRussiaDataObject = function () {
				for (var i = 0; i < mapShapes.length; i++) {
					var region = mapShapes[i].properties.region;
					var currentShape = mapShapes[i];
					for (var i2 = 0; i2 < Russia.length; i2++) {

						for (var i3 = 0; i3 < Russia[i2].regions.length; i3++) {
							if (!Russia[i2].regions[i3].shape) Russia[i2].regions[i3].shape = []
							if (Russia[i2].regions[i3].regionName == region) {
								var pathCords = path(currentShape);
								if (pathCords) {
									Russia[i2].regions[i3].shape.push(path(currentShape));
								}
							}
						}
					}
				};
				return Russia
			}
			Russia = prepareRussiaDataObject()
			/* Object Russia is ready */
			//districtCallbacks.mouseenter(dictionary)
			var districtCallbacks = functions.districtCallbacks;

			var regionCallbacks = functions.regionCallbacks;


			/* Drowind with d3.data */
			var districts = svg.append('g')
				.attr({
					'class': 'districts',
				})
				.selectAll('g').data(Russia)

				/* 	Drow districts	 */
				.enter().append('g').attr({
					'id': function(d) {
						return d.districtName;
					},
					'class' : 'district',
					'fill' : function(d) {
						return d.color;
					},
					'transform' : 'translate(0,0)scale(1,1)'
				})
				.on('mouseenter', 	districtCallbacks.mouseenter(dictionary) )
				.on('mouseleave', 	districtCallbacks.mouseleave )
				.on('click',		districtCallbacks.click )
				.each(function(d) {
					d3.select(this).append('g').attr({
						'class': 'markers'
					})
					/* 	Drow regions */
					d3.select(this).append('g').attr({
						'class': 'regions'
					})
						.selectAll('g').data(d.regions)
						.enter().append('g').attr({
							'id': function(d) {
								return d.regionName;
							},
							'class': 'region',
							'transform': 'translate(0,0)scale(1,1)'
						})
						.on('mouseenter', 	regionCallbacks.mouseenter(dictionary))
						.on('mouseleave', 	regionCallbacks.mouseleave)
						.on('click', 		regionCallbacks.click)
						.each(function(d2) {

							var regions = d3.select(this).selectAll('path').data(d2.shape).enter().append('path')
								.attr({
									'd': function(d) {
										return d;
									}
								});

							var city = d3.select(this)
								.selectAll('g')
								.data(d2.cities)
								.enter()
								.append('g').attr({
									'class': 'city',
									transform: function(d) {
										var coords = projection([d.lon, d.lat]);
										return "translate(" + coords[0].toFixed() + ',' + coords[1].toFixed() + ")";
									}
								});

							if ( city.size() > 0 ) {
								city.node().parentNode.parentNode.appendChild(city.node().parentNode);

								if ( d3.select(this.parentNode.parentNode).classed('with_cities') === false ) {
									var thisPar = d3.select(this.parentNode.parentNode)
									thisPar.classed('with_cities',true )
								}

								if ( d3.select(this).classed('with_cities') === false ) {
									d3.select(this).classed('with_cities',true)

									d3.select(this)
										.append('g')
										.attr({
											'class': 'with_cities_marker'
										})
										.append("image")
										.attr({
											'class' : 'with_cities_marker_image'
										})
										.attr("xlink:href", attributes.common.markerIconPath)
										.attr("width", 42)
										.attr("height", 42)

								}
							}
							city = city.style("cursor", "pointer")
								.append('a')
								.attr({
									'class': 'city_link',
									'xlink:href':function (d) {
										return d.link
									}
								})

							city.append('circle')
								.attr({
									'r': 5
								});

							city.append('svg:text')
								.text(function(d) {
									return d.cityName;
								})
								.attr("x", 10)
						});
				});

			var districtsMarkers = svg.append('g').attr('class','markers')
			var districtMarkersData = [];
			svg.selectAll('.district.with_cities').each(function () {
				d3.select(this).datum().markers = []
				districtMarkersData.push(d3.getCentroid(d3.select(this)))
			})
			districtsMarkers.selectAll('g').data(districtMarkersData).enter().append('g')
				.attr({
					'class': 'with_cities_marker'
				})
				.append("image")
				.attr({
					'class' : 'with_cities_marker_image'
				})
				.attr("xlink:href", attributes.common.markerIconPath)
				.attr("width", 42)
				.attr("height", 42)

			svg.selectAll('.region.with_cities .with_cities_marker').each(function (d) {
				d3.select(this).datum().coords = d3.getCentroid(d3.select(this.parentNode))
				var markersGroup = d3.select(this.parentNode.parentNode.parentNode).select('.markers')
				markersGroup.node().parentNode.appendChild(markersGroup.node())
				markersGroup.node().appendChild(this)
			})

			functions.map.showDistrictsWithCities();


		};
	}
	//DEFINE END

	//INITIALIZE
	IMap.prototype.attributes = new Attributes()
	IMap.prototype.functions = new Functions()
	var iMap = GLOBAL.iMap = new IMap()
	//INITIALIZE END

	var attributes = iMap.attributes
	var functions = iMap.functions

	//INIT UI
	var mapWrapper = d3.select("#map-wrapper")
	var tooltip = mapWrapper.append(attributes.tooltip.el)
		.attr(attributes.tooltip.attrs)

	var svg = mapWrapper
		.append(attributes.svg.el)
		.attr(attributes.svg.attrs)
		.on('mousemove', functions.svg.onMouseMove(tooltip));

	var zoomOutButton = svg.append("image")
		.attr(iMap.attributes.zoomOutButton.attrs({
			x : svg.node().getBBox().x,
			y : svg.node().getBBox().y + svg.node().getBBox().height,
		}))
		.style({
			'display': 'none',
			'opacity':'0',
			'cursor': 'pointer'
		})
		.on({
			'click': functions.map.zoomOut
		});

	var projection = d3.geo.albers()
		.rotate(attributes.projection.rotate)
		.center(attributes.projection.center)
		.parallels(attributes.projection.parallels)
		.scale(attributes.projection.scale)
		.translate(attributes.projection.translate);

	var path = d3.geo.path().projection(projection);

	for (f in functions.d3) d3[f] = functions.d3[f]
	//INIT UI END

	//Reading map file and data, then START
	queue()
		.defer(d3.json, "./sources/russia_1e-7sr.json")
		.defer(d3.json, "./sources/rus_structure_d3data.json")
		.defer(d3.json, "./sources/dictionary.json")
		.await(functions.ready);

})(GLOBAL);