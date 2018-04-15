const profile = require('./profile');
const k_means = require('./kmeans');
const knn = require('./knn');

if(require.main == module)
    knn_helper([0.1,0.1,0.1,0.1,0.1,0.1,1000,0.1,0.1,0.1,0.1,0.1], 1)

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
	profile.fetch_profile(function(res) 
	{
		// console.log("Hello");
		// console.log(res[0]);
		let vectors = new Array();
		let user_id_list = new Array();
		for (let i = 0 ; i < res.length ; i++) {
			user_id_list[i] = [res[i]['user_id']];
  			vectors[i] = [ res[i]['age'] , res[i]['gender'], res[i]['veg'], 
  				res[i]['alcohol'], res[i]['smoke'], res[i]['roomshare'], 
  				res[i]['price'], res[i]['pet_friendly'],res[i]['visitors'],
  				res[i]['openness'],res[i]['aggreeableness'],
  				res[i]['life_satisfaction']];
		}
		callback(vectors, user_id_list);
	});

}

function kmeans_helper(k_num)
{
	profile_array(function(vectors, user_id_list){
		console.log(vectors);

		k_means.clusterize(vectors, {k: k_num}, (err,res) => {
 		 	if (err) console.error(err);
  			// else console.log(res);
  			let clusters = new Array();
  			for(var i = 0; i<res.length; i++)
  			{
  				console.log(res[i]['centroid']);
  				let user_ids = new Array();
  				for(var j =0; j< res[i]['clusterInd'].length; j++)
  				{
  					// console.log(user_id_list[res[i]['clusterInd'][j]]);
  					user_ids.push(user_id_list[res[i]['clusterInd'][j]][0]);
  				}
  				console.log(user_ids);
  				var cluster_json = 
  				{
  					"cluster_number" : i,
  					"centroid" : res[i]['centroid'],
  					"user_list" : user_ids
  				}
  				console.log(cluster_json);
  				clusters.push(cluster_json);
  			}
  			console.log(clusters);
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

function list_user(res, help, n, callback)
{
	for(var i =0; i<res.length; i++)
	{
		if(res[i]['cluster_number'] == help)
		{
			var check_list = res[i]['user_list'];
		}
	}
	profile_array(function(vectors, user_id_list)
	{
		console.log(vectors, user_id_list);
		console.log(check_list);

	});
	
}

function knn_helper(input_arr, n)
{
	// console.log("Hello");
	fetching_clusters(function(vectors, res){
		// console.log("IN Helper");
		// console.log(vectors);
		knn.find_knn_cluster(input_arr, vectors, function(help)
		{
			console.log(help);
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
			list_user(res, help, n, function(final_list)
			{
				console.log(final_list);
			});

		});
	});
}