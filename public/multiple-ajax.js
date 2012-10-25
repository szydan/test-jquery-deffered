$(document).ready(function(){

	var args = [
		$.ajax({
			url:"http://localhost:8080/200/%7B%22param1%22%3A%22value1%22%7D",
			type:"get",
			dataType:"jsonp"
		}),
		$.ajax({
			url:"http://localhost:8080/200/%7B%22param2%22%3A%22value2%22%7D",
			type:"get",
			dataType:"jsonp"
		}),
		$.ajax({
			url:"http://localhost:8080/404",
			type:"get",
			dataType:"jsonp",
		}),
		$.ajax({
			url:"http://localhost:8080/500",
			type:"get",
			dataType:"jsonp",
		})
	];

	$.extend({
		when2: function( subordinate /* , ..., subordinateN */ ) {
			var i = 0,
				resolveValues = Array.prototype.slice.call( arguments ),
				length = resolveValues.length,

				// the count of uncompleted subordinates
				remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

				// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
				deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

				// Update function for both resolve and progress values
				updateFunc = function( i, contexts, values ) {
					return function( value ) {
						contexts[ i ] = this;
						values[ i ] = arguments.length > 1 ? Array.prototype.slice.call( arguments ) : value;
						if( values === progressValues ) {
							deferred.notifyWith( contexts, values );
						} else if ( !( --remaining ) ) {
							deferred.resolveWith( contexts, values );
						}
					};
				},
				
				progressValues, progressContexts, resolveContexts;
				
			// add listeners to Deferred subordinates; treat others as resolved
			if ( length > 1 ) {
				progressValues = new Array( length );
				progressContexts = new Array( length );
				resolveContexts = new Array( length );
				for ( ; i < length; i++ ) {
					if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
						resolveValues[ i ].promise()
							.done( updateFunc( i, resolveContexts, resolveValues ) )
							//.fail( deferred.reject )
							// here is the modified line
							.fail( updateFunc( i, resolveContexts, resolveValues ) )
							.progress( updateFunc( i, progressContexts, progressValues ) );
					} else {
						--remaining;
					}
				}
			}

			// if we're not waiting on anything, resolve the master
			if ( !remaining ) {
				deferred.resolveWith( resolveContexts, resolveValues );
			}

			return deferred.promise();
		}
	});

	jQuery.when2.apply(this, args)
		 .then(function(){
			var combinedResults = {};
			for (var i = 0; i < arguments.length; i++) {
				var singleResult = arguments[i]; 
				console.log(singleResult);
				if(singleResult[1]==="success"){
					for(var serviceName in singleResult[0]){
						combinedResults[serviceName] = singleResult[0][serviceName];
					}
				}
			}
			console.log("then");
			console.log(combinedResults);
		});
});