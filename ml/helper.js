const profile = require('./profile');
const k_means = require('./kmeans');

if(require.main == module)
    knn_helper()

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
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

function run(callback)
{
	// console.log("IN run");
	var res;
	profile.fetch_profile(function(res) 
	{
		// console.log("Hello");
		console.log(res[0]);
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

function run_main(k_num)
{
	run(function(vectors, user_id_list){
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
		console.log(res[0]);
		// let vectors = new Array();
		// let user_id_list = new Array();
		// for (let i = 0 ; i < res.length ; i++) {
		// 	user_id_list[i] = [res[i]['user_id']];
  // 			vectors[i] = [ res[i]['age'] , res[i]['gender'], res[i]['veg'], 
  // 				res[i]['alcohol'], res[i]['smoke'], res[i]['roomshare'], 
  // 				res[i]['price'], res[i]['pet_friendly'],res[i]['visitors'],
  // 				res[i]['openness'],res[i]['aggreeableness'],
  // 				res[i]['life_satisfaction']];
		// }
		callback(res);
	});

}

function knn_helper(k_num)
{
	console.log("Hello");
	fetching_clusters(function(vectors){
		console.log("IN Helper");
		console.log(vectors);
	});
}