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

function find_knn_cluster(input_arr, cluster_arr, callback)
{
	var minn = 1000;
	var loc = -1;
	for(var i=0; i<cluster_arr.length; i++)
	{	
		// console.log(cluster_arr[i]);
		var temp = euclidianDistance(cluster_arr[i], input_arr);
		if(temp < minn)
		{
			minn = temp;
			loc = i;
		}
	}
	callback(loc);
}

module.exports = 
{ 
    find_knn_cluster
};