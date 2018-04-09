const profile = require('./profile');
const k_means = require('./kmeans');

if(require.main == module)
    run_main(2)

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
		for (let i = 0 ; i < res.length ; i++) {
  			vectors[i] = [ res[i]['age'] , res[i]['gender'], res[i]['veg'], 
  				res[i]['alcohol'], res[i]['smoke'], res[i]['roomshare'], 
  				res[i]['price'], res[i]['pet_friendly'],res[i]['visitors'],
  				res[i]['openness'],res[i]['aggreeableness'],
  				res[i]['life_satisfaction']];
		}
		callback(vectors);
	});

}

function run_main(k_num)
{
	run(function(vectors){
		console.log(vectors);

		k_means.clusterize(vectors, {k: k_num}, (err,res) => {
 		 	if (err) console.error(err);
  			// else console.log(res);

  			for(var i = 0; i<res.length; i++)
  			{
  				console.log("-------------------------");
  				console.log(res[i]['centroid']);
  				console.log(res[i]['clusterInd']);
  				for(var j =0; j< res[i]['clusterInd'].length; j++)
  				{
  					console.log(res[i]['clusterInd'][j]);
  					console.log(vectors[res[i]['clusterInd'][j]]);
  				}

  			}
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