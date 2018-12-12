
//some front end javascript code idea is based on the work http://projectalexandria.net/ with many extra functions added


var alldata = [];;

q = d3.queue()
      .defer(d3.json, "/static/data1.json")
      .defer(d3.json, "/static/data2.json")
      .defer(d3.json, "/static/data3.json")
      .await(function(error, data1, data2, data3) {
           if (error) throw error;
		   var dt = data1.posts;
		   for( var i = 0 ; i<dt.length; i++) {
	           
	           alldata.push({"movieId":dt[i].movieID, "rank": dt[i].rank, "title": dt[i].primaryTitle, "genres": dt[i].genres, "averageRating": dt[i].averageRating,
			   "imdbid": dt[i].imdbId, "tmdbid": dt[i].tmdbId, "numVotes": dt[i].numVotes, "startYear": dt[i].startYear, 
		   "runMinutes": dt[i].runtimeMinutes, "director": dt[i].directorName, "actors": dt[i].actorName.substring(1,dt[i].actorName.length-1)});
            }
		   var dt = data2.posts;
		   for( var i = 0 ; i<dt.length; i++) {
	           
	           alldata.push({"movieId":dt[i].movieID, "rank": dt[i].rank, "title": dt[i].primaryTitle, "genres": dt[i].genres, "averageRating": dt[i].averageRating,
			    "imdbid": dt[i].imdbId, "tmdbid": dt[i].tmdbId, "numVotes": dt[i].numVotes, "startYear": dt[i].startYear, 
		   "runMinutes": dt[i].runtimeMinutes, "director": dt[i].directorName, "actors": dt[i].actorName.substring(1,dt[i].actorName.length-1)});
            }
		   var dt = data3.posts;
					   for( var i = 0 ; i<dt.length; i++) {
	           
	           alldata.push({"movieId":dt[i].movieID, "rank": dt[i].rank, "title": dt[i].primaryTitle, "genres": dt[i].genres, "averageRating": dt[i].averageRating,
			    "imdbid": dt[i].imdbId, "tmdbid": dt[i].tmdbId, "numVotes": dt[i].numVotes, "startYear": dt[i].startYear, 
		   "runMinutes": dt[i].runtimeMinutes, "director": dt[i].directorName, "actors": dt[i].actorName.substring(1,dt[i].actorName.length-1)});
           }

    });
	  



var w = $('.movie_graph').width(), h = $('.movie_graph').height();

var genresGroup = {
				'Comedy': 1,
				'Drama': 2,
				'Crime': 3,
				'Comedy': 4,
				'Horror': 5,
				'Action': 6,
				'Crime': 7,
				'Other': 8
				}

linkcolors=["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"]			
				
var c10 = d3.scale.category10();	
var max_connection = 5;
var rating = 0;
var votes = 0;
var radius = 20;
var year = 1800;
var clicked;

var drag;


var box, graph, layout, edge, hiddenedge, amovie;
var movies = [], edges = [], movieIds = [];
var middle = 0, prevmiddle = -1, middleX = 0, middleY = 0, count = 0;


var buildGraph = function() {
	  $('svg').remove();
	  graph = d3.select('.movie_graph').append('svg')
			.attr('width', w)
			.attr('height', h)
			.call(zoom)
			.on('dblclick.zoom', null);
	  box = graph.append('g');	
      layout = d3.layout.force()
	         	.charge(-400)
		    	.linkDistance(150)
                .linkStrength(function(d) { return d.transient ? .2 : 1; }) 
                .gravity(0)			
		        .size([w, h])
			    .nodes(movies)
		        .links(edges)
			    .on('tick', tick)
				.on('end', end);
	zoom.translate([0, 0]).scale(1);			
				
  }
  
var clearGraph = function() {
	
	movieIds = [], movies = [], edges = [];
	buildGraph();
};  
  
var addMovie = function(movie) {
	premiddle = middle;
	middle = movieIds.indexOf(movie.movieId);
	if (middle === -1) {

		middle = 0, movie.x = w / 2, movie.y = h / 2;
		movie.id = movie.movieId;
		movies.push(movie);
		movieIds.push(movie.movieId);
	}
    var i = 0;
	var neigh = movie.neighbors
	neigh.forEach(function(neighbor) {
        if (max_connection < i + 1  ) { 
		   return false; 
		}
		if (movieFilter(rating,votes, neighbor)) {
		  addMovieLinks(i, middle, neighbor);
		  i++;
		}
	});
}

var movieFilter = function(rating, votes, movie){
	//console.log(parseInt(movie.numVotes))
	var votesi = parseInt(votes);
	console.log(votesi)
	if(movie.averageRating >= rating) {
		return true;
	} else {
		return false;
	}
}


var addMovieLinks = function(index, middle, movie) {
		var pos = movieIds.indexOf(movie.movieId);
		if (pos === -1) {
			movies[middle].fixed = false;
			if (pos === -1) {
				pos = movies.push({startYear:movie.startYear, numVotes:movie.numVotes, averageRating:movie.averageRating,
				title:movie.title, runMinutes:movie.runMinutes, genres:movie.genres, 
				director:movie.director, actors: movie.actors, tmdbid:movie.tmdbid, imdbid:movie.imdbid,
				movieId: movie.movieId, id: movie.movieId}) - 1;
			}
			edges.push({source: movies[middle], target: movies[pos], rank: movie.rank});
			movieIds.push(movie.movieId);
		} else {

			if (pos - 1 !== middle) {
				edges.push({source: movies[middle], target: movies[pos], rank: movie.rank, transient: true});
				movies[pos].fixed = false;
			} 
		}
	};

  
var updateGraph = function() {
	    count = 0;
	    edge = box.selectAll('.link')
        edge = edge.data(layout.links(), function(d) { return d.source.id + '-' + d.target.id; });
		edge.enter().insert('line', '.node')
			.attr('class', 'link')
			.attr('stroke-width', 5)
			.style('stroke', function(d) { return linkcolors[linkcolors.length - d.rank]; });
		edge.exit().remove();


		hiddenedge = box.selectAll('.invislink');
		hiddenedge = hiddenedge.data(layout.links(), function(d) { return d.source.id + '--' + d.target.id; });
		hiddenedge.enter().insert('line', '.node')
			.attr('class', 'invislink')
			.attr('stroke-width', 20)
			.attr('stroke-opacity', 0)
			.style('stroke', function(d) { return linkcolors[linkcolors.length - d.rank]; })

		hiddenedge.exit().remove();
	  
	    amovie = box.selectAll('.node');
		amovie = amovie.data(layout.nodes(), function(d) { return d.id; });
		var amovieG = amovie.enter().append('g');
		amovieG.attr('class', 'node')
			.on('mouseover', movieFocus)
			.on('mouseout', movieBlur)
			.call(d3.behavior.drag().origin(function(d) { return d; })
		          .on('dragstart', function(d) {
		           d3.select(this).classed('dragging', true);
		           clicked = true;
	             }).on('drag',  function(d) {
		           d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
		           clicked = false;
	            }).on('dragend',function(d) {
		       d3.select(this).classed('dragging', false);
	        }));
			
        amovie.append('circle')
			.attr('r', function (d) {
				 return 2*d.averageRating;
			})
			.style('fill', function(d) { 
			      gen = d.genres.split(',')
			         return c10(gen[0]); 
			});
			
		amovie.append('text')
			.attr('x', 0)
			.attr('y', -15)
			.classed('format', true)
			.text(function(d) { return d.title; });


		amovie.exit().remove();

		
		$('#graph_node').html('<strong>Number of Nodes: </strong>' + movies.length + '</div>');	
		$('#graph_edge').html('<strong>Number of Edges: </strong>' + edges.length + '</div>');	
		layout.start();   
		movies[0].fixed = true;
 }
 
var sortMovies = function(movies, key){
	 return movies.sort(function(a, b) {
        return ((a[key] > b[key]) ? -1 : ((a[key] > b[key]) ? 1 : 0));
    });
}

	var zoom = d3.behavior.zoom()
		.scaleExtent([0.15, 1.5])
		.on('zoomstart', function() {
		     drag = true;

	     })
		.on('zoom', function() {
		     box.attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
	     })
		.on('zoomend',  function() {
		    drag = false;
	    });
 

var tick = function(event) {

	  
	    if (0.025 >= event.alpha ) {
			layout.stop();
		}
		if (count === 0) {
			amovie.on('click', null);
		}
		amovie.attr('transform', function(d) { return 'translate(' + d.x + ',' + d.y + ')'; });
 
       edge.attr('x1', function(d) { 
		return d.source.x; 
	  })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });
	  hiddenedge.attr('x1', function(d) { return d.source.x; })
				.attr('y1', function(d) { return d.source.y; })
				.attr('x2', function(d) { return d.target.x; })
				.attr('y2', function(d) { return d.target.y; });
	  count++;
  }

var end = function(event) {
	amovie.on('click', movieClick);
	var sortedMovies = sortMovies(movies, 'averageRating')
	var moviesName = "";
	for(var t = 0; t<sortedMovies.length && t < 3;t++) {
		moviesName = moviesName + "," +sortedMovies[t].title;
	}
	$('#top_movies').html('<strong>Top Movies: </strong>' + moviesName.substring(1,moviesName.length) + '</div>');
	
	if (middle !== premiddle) {
		    var newY = layout.size()[1]/2 - movies[middle].y * zoom.scale();
			var newX = layout.size()[0]/2 - movies[middle].x * zoom.scale();
			
			if (!drag) {
		
				zoom.translate([newX, newY]).scale(zoom.scale());
			}
			zoom.event(d3.select('g').transition());
	} else {
			middleX = movies[middle].x;
			middleY = movies[middle].y;
	}
	
	amovie.selectAll('text').each(function(d) {
			var content = d3.select(this).transition();
			
			if (d.x < middleX) {
				content.attr('x', -this.getBBox().width);
			}
			
			if (d.y > middleY) {
				content.attr('y', 25);
			}
			
		});	
   
}


var refreshMovies = function() {
		$.each(movies, function(i, value) {
			value.fixed = true;
		});
};

function movieClick(e) {

	if (clicked) {
        if(searchMovie(e.title)) {
			 exploreGraph(prepareMovie(e.title), false);
		}
	}
}

function exploreGraph(movie, newGraph) {

	if (movie) {
		if (newGraph) {
			clearGraph();
			
		} else {
			refreshMovies();
		}
		addMovie(movie);
		updateGraph();
		showMovie(movie);
		
	} 
}

var showMovie = function(movie) {
	$('#graph_stat').show();
	$('#movie_info').show();
	$('#movie_title').html('<strong>Title: </strong>' + movie.title + '</div>');
		$('#movie_director').html('<strong>Director: </strong>' + movie.director + '</div>');
		$('#movie_votes').html('<strong>Number of Votes: </strong>' + movie.numVotes + '</div>');
		$('#movie_rating').html('<strong>Average Rating: </strong>' + movie.averageRating + '</div>');
		$('#movie_year').html('<strong>Year:  </strong>' + movie.startYear + '</div>');
		$('#movie_length').html('<strong>RunMinutes:  </strong>' + movie.runMinutes + '</div>');
		$('#movie_genre').html('<strong>Genres:  </strong>' + movie.genres + '</div>');
		$('#movie_actor').html('<strong>Actors:  </strong>' + movie.actors + '</div>');
		$('#tmdb_movie_link').html('<a href="https://www.themoviedb.org/movie/' + movie.tmdbid + '" target="_blank">TMDB Link<\a>');
		$('#imdb_movie_link').html('<a href="https://www.imdb.com/title/tt' + movie.imdbid + '" target="_blank">IMDB Link<\a>');
}

var movieFocus = function (e) {
	d3.select(this).select('circle').classed("high", true)
	for(var k = 0; k < movies.length; k++) {
		if(movies[k].movieId == e.movieId) {
			 tmp = movies[k];
			 showMovie(movies[k]);
		}
	}

}

var movieBlur = function () {
		d3.select(this).select('circle').classed("high", false)
}


function searchMovie(title){
	var flag = -1;
	for (var i = 0 ; i < alldata.length; i++) {
		if(alldata[i].title == title) {
			//alert(title);
			flag = i;
			break;
		}
	}; 
	if (flag < 0) {
		return false;
	} else {
		return true;
	}
	
}

function prepareMovie(title){
	var movie = null;
	for (var i = 0 ; i < alldata.length; i++) {
		if(alldata[i].title == title) {
			//alert(title);
			movie = alldata[i];
			var neighbors = [];
			for (var k = 1; k <10; k++) {
				neighbors.push(alldata[i+k])
			}
			movie.neighbors = neighbors;
		}
	}; 
	
	return movie;
}


var search = function() {

	 var movietitle = $('#movie_search').val()
	 if (movietitle!='' && searchMovie(movietitle)) {
		 $('#alertmsg').hide();
		 max_connection = $('#conn').val();
		 rating = $('#rating').val();
		 votes = $('#votes').val();
		 if(rating == "all") {
			 rating = 0;
		 }
		 if(votes == "all") {
			 votes = 0;
		 }
		 var node = prepareMovie(movietitle)
		 exploreGraph(node, true);
	 } else {
		$('#alertmsg').show();
	 }
 }


	 



$(window).on("resize", function() {
        w = $('.movie_graph').width();
	    h = $('.movie_graph').height();
        if (graph) {
			graph.attr('height', h).attr('width', w);
		}
		if (box) {
			box.attr('height', h).attr('width', w);
		}
		if (layout) {
			layout.size([w, h]);
		}
})




