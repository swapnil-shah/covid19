console.log('process.env.API_KET_MAPBOX', process.env.API_KET_MAPBOX);
fetch('https://corona-api.com/countries', { cache: 'no-cache' })
	.then((response) => response.json())
	.then((countries) => {
		var mymap = L.map('covidWorldMap').setView([ 20, 0 ], 2);
		let mapboxAccessToken = API_KET_MAPBOX;
		L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
			id: 'mapbox/dark-v10',
			attribution:
				'Map data <a href="https://about-corona.net/">about-corona</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			minZoom: 2,
			noWrap: true,
			bounds: [ [ -90, -180 ], [ 90, 180 ] ]
		}).addTo(mymap);
		var myRenderer = L.canvas({ padding: 0.5 });
		function htmlPopup(region, regionAlt, confirmed, recovered, deaths) {
			let output = '';
			if (region !== null) {
				output += `<b>${region}</b>`;
			} else {
				output += `<b>${regionAlt}</b>`;
			}
			if (confirmed !== null) {
				output += `<br/>Confirmed: ${confirmed.toLocaleString()}`;
			}
			if (recovered !== null) {
				output += `<br/>Recovered: ${recovered.toLocaleString()}`;
			}
			if (deaths !== null) {
				output += `<br/>Deaths: ${deaths.toLocaleString()}`;
			}
			return output;
		}
		countries.data.forEach(function(points) {
			if (points.coordinates.latitude && points.coordinates.longitude) {
				var latlng = L.latLng({ lat: points.coordinates.latitude, lng: points.coordinates.longitude });
				var circle = L.circleMarker(latlng, {
					fillOpacity: 0.5,
					radius: Math.sqrt(points.latest_data.confirmed) * 0.03,
					stroke: false,
					fillColor: '#d11a1a',
					renderer: myRenderer
				})
					.addTo(mymap)
					.bindTooltip(
						htmlPopup(
							points.name,
							points.code,
							points.latest_data.confirmed,
							points.latest_data.recovered,
							points.latest_data.deaths
						)
					);
			}
		});

		var info = L.control({ position: 'bottomright' });

		info.onAdd = function(map) {
			this._div = L.DomUtil.create('div', 'map-info'); // create a div with a class "info"
			this._div.innerHTML =
				'<h4>COVID19 WORLD SPREAD DATA</h4><p>Tap/hover on the marker for more information</p>';
			return this._div;
		};
		info.addTo(mymap);
	});