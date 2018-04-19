const profile = require('./profile');
const k_means = require('./kmeans');
const knn = require('./knn');

if(require.main == module)
    main()



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function euclidianDistance(a, b) 
{
  if (a.length !== b.length) 
  {
    return (new Error('The vectors must have the same length'));
  }
  let d = 0.0;
  for (let i = 0, max = a.length; i < max; ++i) 
  {
  	// d += Math.pow((a[i] - b[i]), 2);
  	if(i <= 8)
  	{
  		d += 0.9*(Math.pow((a[i] - b[i]), 2));	
  	}
  	else
  	{
  		d += 0.1*(Math.pow((a[i] - b[i]), 2));	
  	}
  }
  return Math.sqrt(d);
}

// a.sort(compareSecondColumn);

function sorting(final, callback)
{	console.log("Check 1");
	for(var i=0; i<final.length; i++)
	{
		for(var j =i+1; j<final.length; j++)
		{
			console.log(final_list[i][1] )
			if(final[i][1] > final[j][1])
			{
				var temp = final[i];
				final[i] = final[j];
				final[j] = temp;
			}
		}
		console.log("Check");
	}
	console.log("Check 2");
	callback(final);
}

function compareSecondColumn(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

function inArray(check,arr_check, callback)
{
    var count=arr_check.length;
    for(var i=0;i<count;i++)
    {
        if(arr_check[i]===check)
        {
        	callback(true);
       	}
    }
    callback(false);
}

function generate_randomlist(k, size, callback)
{
	let rand_vector = new Array();
	rand_vector[0] = getRandomInt(size);
	for(var i=1;i<k;i++)
    {
        var temp = getRandomInt(size);
        inArray(temp, rand_vector, function(res)
        {
        	if(res == true)
        	{
        		i--;
        	}
        	else
        	{
        		rand_vector[i] = temp;
        	}
        });
    }
    callback(rand_vector);
}

function profile_array(callback)
{
	// console.log("IN run");
	var res;
	profile.fetch_users(function(res) 
	{
		// console.log(res);
		let vectors = new Array();
		let user_id_list = new Array();
		for (let i = 0 ; i < res.length ; i++) {
			user_id_list[i] = res[i]['google']['id'];
  			vectors[i] = [ (res[i]['age'] -18)/82 , res[i]['gender'], res[i]['dietary'], 
  				res[i]['drinking'], res[i]['smoking'], res[i]['room'], 
  				res[i]['max_budget']-res[i]['min_budget'], res[i]['pet'],res[i]['visitors'],
  				res[i]['openness'], res[i]['conscientiousness'],
  				res[i]['neuroticism'], res[i]['agreeableness'],
  				res[i]['extraversion']];
		}
		// console.log(vectors, user_id_list);
	
		callback(vectors, user_id_list);
	});

}

function kmeans_helper(k_num, callback)
{
	let clusters = new Array();
	profile_array(function(vectors, user_id_list){
		// console.log(vectors, user_id_list);

		k_means.clusterize(vectors, {k: k_num}, (err,res) => {
 		 	if (err) console.error(err);
  			// console.log(res, user_id_list);
  			
  			for(var i = 0; i<res.length; i++)
  			{
  				// console.log(res[i]['centroid']);
  				let user_ids = new Array();
  				for(var j =0; j< res[i]['clusterInd'].length; j++)
  				{
  					// console.log(user_id_list[res[i]['clusterInd'][j]]);
  					user_ids.push(user_id_list[res[i]['clusterInd'][j]]);
  				}
  				// console.log(user_ids);
  				var cluster_json = 
  				{
  					"cluster_number" : i,
  					"centroid" : res[i]['centroid'],
  					"user_list" : user_ids
  				}
  				// console.log(cluster_json);
  				clusters.push(cluster_json);
  			}
  			// console.log(clusters);
  			callback(clusters);
		});

		// console.log(k_num);
		
		// generate_randomlist(k_num, vectors.length, function(rand_vector)
		// {
		// 	console.log(rand_vector);
		// 	// console.log(rand_vector.length);
		// 	let cluster_points = new Array();
		// 	for (var i=0; i<rand_vector.length; i++)
		// 	{
		// 		cluster_points[i] = vectors[rand_vector[i]];
		// 	}
		// 	console.log(cluster_points);
		// })
	});

}

function fetching_clusters(callback)
{
	var res;
	profile.fetch_cluster(function(res) 
	{
		// console.log(res[0]);
		let vectors = new Array();
		for (let i = 0 ; i < res.length ; i++) 
		{
  			vectors.push(res[i]['centroid']);
		}
		callback(vectors, res);
	});

}

function list_user(input_arr, res, help, n, callback)
{
	for(var i =0; i<res.length; i++)
	{
		if(res[i]['cluster_number'] == help)
		{
			var check_list = res[i]['user_list'];
		}
	}
	// console.log(check_list);
	profile_array(function(vectors, user_id_list)
	{
		var temp_array_dist = new Array();
		// console.log(vectors, user_id_list);
		// console.log(check_list);
		for(var j = 0; j< user_id_list.length; j++)
		{
			for(var k =0; k< check_list.length; k++)
			{
				// console.log(user_id_list[j], check_list[k]);
				if(user_id_list[j] == check_list[k])
				{	
					// console.log("Yes")
					// console.log(user_id_list[j][0], check_list[k]);
					var temp_dist = euclidianDistance(input_arr, vectors[j]);
					temp_array_dist.push([check_list[k], temp_dist]);
				}
			}
		}
		// console.log(temp_array_dist);
		callback(temp_array_dist);
	});
	
}

function knn_helper(input_arr, n, callback)
{

	fetching_clusters(function(vectors, res){
		// console.log("IN Helper");
		// console.log(vectors ,res);
		knn.find_knn_cluster(input_arr, vectors, function(help)
		{
			// console.log(help);
			for(var i = 0; i <res.length; i++)
			{
				// console.log(res[i]);
				if(res[i]['cluster_number'] == help)
				{
					// console.log(res[i]['user_list']);
					// return(res[i]['user_list']);
					if(res[i]['user_list'].length < n)
					{
						n = res[i]['user_list'].length;
					}
				}
			}
			// console.log(input_arr, res, help, n);
			list_user(input_arr, res, help, n, function(final_list)
			{

				// console.log(final_list);
				final_list.sort(compareSecondColumn);
				// sorting(final_list, function(sorted_list){
				// 	console.log("Check 3");
					// console.log(final_list);
				// });
				var knn_user_ids = new Array();
				for(var j =0; j< final_list.length; j++)
				{
					knn_user_ids.push(final_list[j][0]);
				}
				// console.log(knn_user_ids);
				callback(knn_user_ids);
			});

		});
	});
}

function basic_knn(input_arr, n, callback)
{
	profile_array(function(vectors, user_id_list){
		// console.log(vectors, user_id_list);

		if(vectors.length < n)
			n = vectors.length;
		
		var temp_array_dist = new Array();
		for(var i = 0; i < vectors.length; i++)
		{

			var temp_dist = euclidianDistance(input_arr, vectors[i]);
			// console.log(input_arr, vectors[i], temp_dist);
			temp_array_dist.push([user_id_list[i], temp_dist]);
		}

		// console.log(temp_array_dist);
		temp_array_dist.sort(compareSecondColumn);
		var final_list = new Array();
		for(var j = 0; j<n; j++)
		{
			final_list.push(temp_array_dist[j][0]);
		}
		callback(final_list);
	});
}

function main()
{
	var start = new Date();
	// kmeans_helper(3, function(clusters){
	// 	console.log(clusters);
	// });
	
	knn_helper([ 0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  1000,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1 ]
, 6, function(temp)
	{
			// console.log(temp);
			var end = new Date() - start;
console.info("Execution time of Kmeans KNN for 10 user profile: %dms", end);
	});

	basic_knn([ 0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  1000,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1,
  0.1 ]
, 6, function(temp)
	{
			// console.log(temp);
			var end = new Date() - start;
console.info("Execution time of Basic KNN for 10 user profile: %dms", end);
	});

}