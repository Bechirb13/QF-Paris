const map = L.map('mapid').setView([48.8534, 2.3488], 13);
let markers = [];

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	id: 'mapbox/streets-v11',
	tileSize: 512,
	zoomOffset: -1
}).addTo(map);

let categories = document.querySelectorAll('.categories .category');

categories.forEach(c => {
	c.addEventListener('click', e => {
		console.log(e);
	})
})


async function getData(q = '') {
    let url = `https://opendata.paris.fr/api/records/1.0/search//?q=${q}&dataset=que-faire-a-paris-&facet=category&facet=zip&facet=address_zipcode&facet=address_city&facet=pmr&facet=blind&facet=deaf&facet=access_type&facet=price_type`
    let response = await fetch(url)
        
    let data = await response.json();

    markers.forEach(({marker}) => {
    	map.removeLayer(marker);
    });
    
    data.records.forEach(function(event) {
	    
	    const { fields } = event;
	    
	    if (!fields.lat_lon) {
	    	return;
	    }

		addInfos(fields);
    });
}
    
getData();


function submitForm(e) {
	getData(query.value);

	e.preventDefault();
}


function addInfos(fields) {
	const {
		title,
		address_name = 'Paris',
		cover_url,
		lead_text,
		price_detail = null,
		url
	} = fields;


	const [ lat, long ] = fields.lat_lon;
	let html = `<div class="item">
					<a href="${url}" target="_blank">${title}</a>
					<p class="lead">
						<img class="img" src="${cover_url}" />
						${cover_url != undefined ? '' : lead_text.slice(0, 133)}
					</p>
					<span class="green">${price_detail ? price_detail : 'Gratuit'}</span>
					&nbsp;&nbsp;&nbsp;<span class="fa fa-map-marker-alt"> ${address_name}</span>
				</div>`;

	let marker = L.marker([lat, long]);

	markers.push({ lat, long, marker });

	marker.addTo(map);
	marker.bindPopup(html).openPopup();
}


























