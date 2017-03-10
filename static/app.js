

var app = {

	data: null,
	init: function (data) {
		app.data = data;
		addKeys();
		routes.init();
	}
}

function addKeys() {
	for (var i = app.data.events.length - 1; i >= 0; i--) {
		app.data.events[i].unique = i;
		app.data.events[i].color = 'rgb('+Math.round(app.data.events[i].mag*(255/5.8))+',110,90)';
	};
}

var sort = {
	init: function (data,sortBy) {
		app.data.events.sort(function(a, b) {
		    return parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
		});

		var insert = '';
		for (var i = data.events.length - 1; i >= 0; i--) {
			insert += '<li class="preAnim"><span style="background-color:'+app.data.events[i].color+' "class="mag"> '+data.events[i].mag+' </span><span class="date">'+data.events[i].date+' </span><span class="place"> '+data.events[i].place+'</span></li>';
		}
		sort.data = data;
		section.init(app.data,insert)
	}
}

var filter = {
	init: function (data,filterBy) {
		var insert = '';
		for (var i = data.events.length - 1; i >= 0; i--) {
			if (data.events[i].place.includes(filterBy)) {
				insert += '<li class="preAnim"><span style="background-color:'+app.data.events[i].color+' "class="mag"> '+data.events[i].mag+' </span><span class="date">'+data.events[i].date+' </span><span class="place"> '+data.events[i].place+'</span></li>';
			}
		}
		section.init(sort.data,insert)
	},
	alter: function (data) {
		var insert = '';
		for (var i = data.events.length - 1; i >= 0; i--) {
			if (!data.events[i].place.includes('(Duitsland)')&&!data.events[i].place.includes('(België)')) {
				insert += '<li class="preAnim"><span style="background-color:'+app.data.events[i].color+' "class="mag"> '+data.events[i].mag+' </span><span class="date">'+data.events[i].date+' </span><span class="place"> '+data.events[i].place+'</span></li>';
			}
		}
		section.init(sort.data,insert)
	}
}

var mag = {
	init: function (data) {
		var insert = '';
		for (var i = data.events.length - 1; i >= 0; i--) {
				insert += '<li class="preAnim"><span style="background-color:'+app.data.events[i].color+' "class="mag"> '+data.events[i].mag+' </span><span class="date">'+data.events[i].date+' </span><span class="place"> '+data.events[i].place+'</span></li>';
		}
		document.getElementById("min_mag").value = '';

		section.init(app.data,insert)
	},
	filter: function (data,inputVal) {
		var insert = '';
		for (var i = data.events.length - 1; i >= 0; i--) {
			if ( data.events[i].mag >= inputVal ) {
			insert += '<li class="preAnim"><span style="background-color:'+app.data.events[i].color+' "class="mag"> '+data.events[i].mag+' </span><span class="date">'+data.events[i].date+' </span><span class="place"> '+data.events[i].place+'</span></li>';
			}
		}
		section.init(app.data,insert)
	}
}

document.getElementById('magReset').addEventListener('click', function() {
	document.querySelector('a#minMag').classList.remove('cur');
	mag.init(app.data)
})
document.getElementById('minMag').addEventListener('click', function() {
	document.querySelector('a#minMag').classList.add('cur');
	var inputVal = document.getElementById("min_mag").value;
	mag.filter(app.data,inputVal)
})

var routes = {
	init: function () {
		routie({
			    'date': function() {
			    	document.querySelector('a[href="#mag"]').classList.remove('cur');
			    	document.querySelector('a[href="#date"]').classList.add('cur');
			    	sort.init(app.data,'date')
		    },
			    'mag': function() {
			    	document.querySelector('a[href="#date"]').classList.remove('cur');
			    	document.querySelector('a[href="#mag"]').classList.add('cur');
			    	sort.init(app.data,'mag') 
		    },
			    'all': function() {
			    	document.querySelector('a[href="#nl"]').classList.remove('cur');document.querySelector('a[href="#de"]').classList.remove('cur');document.querySelector('a[href="#be"]').classList.remove('cur');
			    	document.querySelector('a[href="#all"]').classList.add('cur');
			    	filter.init(app.data,'') 
		    },
			    'nl': function() {
			    	document.querySelector('a[href="#all"]').classList.remove('cur');document.querySelector('a[href="#de"]').classList.remove('cur');document.querySelector('a[href="#be"]').classList.remove('cur');
			    	document.querySelector('a[href="#nl"]').classList.add('cur');
			    	filter.alter(app.data) 
		    },
			    'de': function() {
			    	document.querySelector('a[href="#all"]').classList.remove('cur');document.querySelector('a[href="#nl"]').classList.remove('cur');document.querySelector('a[href="#be"]').classList.remove('cur');
			    	document.querySelector('a[href="#de"]').classList.add('cur');
			    	filter.init(app.data,'(Duitsland)') 
		    },
			    'be': function() {
			    	document.querySelector('a[href="#all"]').classList.remove('cur');document.querySelector('a[href="#nl"]').classList.remove('cur');document.querySelector('a[href="#de"]').classList.remove('cur');
			    	document.querySelector('a[href="#be"]').classList.add('cur');
			    	filter.init(app.data,'(België)') 
		    }
		})
	}
}

var section = {
	init: function (data,insert) {
		document.querySelector("#app").innerHTML = insert;
	}
}

aja()
	.url('http://cdn.knmi.nl/knmi/map/page/seismologie/all_tectonic.json')
	.type('json')
	.on('success', function(data){
		app.init(data);
	})
.go();

