fetch('https://covid19.mathdro.id/api/countries/usa/confirmed').then((states) => states.json()).then((data) => {
	var mymap = L.map('covidCountryMap').setView([ 37.8, -96 ], 3);
	let mapboxAccessToken = process.env.API_KET_MAPBOX;
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
		id: 'mapbox/dark-v10',
		attribution:
			'Map data <a target="_blank" href="https://github.com/mathdroid/covid-19-api">Mathdroid</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		tileSize: 512,
		zoomOffset: -1,
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
	data.forEach(function(points) {
		var latlng = L.latLng({ lat: points.lat, lng: points.long });
		var circle = L.circleMarker(latlng, {
			fillOpacity: 0.5,
			radius: 3,
			stroke: false,
			fillColor: '#ff8725',
			renderer: myRenderer
		})
			.addTo(mymap)
			.bindTooltip(
				htmlPopup(points.combinedKey, points.admin2, points.confirmed, points.recovered, points.deaths)
			);
	});
	var info = L.control({ position: 'bottomright' });

	info.onAdd = function(map) {
		this._div = L.DomUtil.create('div', 'map-info'); // create a div with a class "info"
		this._div.innerHTML = '<h4>COVID19 USA SPREAD DATA</h4><p>Tap/hover on the marker for more information</p>';
		return this._div;
	};
	info.addTo(mymap);
});
