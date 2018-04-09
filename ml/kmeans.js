/*npm*/

'use strict';
const _ = require('underscore');

class Clusterize 
{
	constructor(vector, options, callback) 
	{
    	if (!callback || !options || !vector) 
    	{
      		throw new Error('Provide 3 arguments: vector, options, callback');
    	}
	    if (typeof callback !== 'function') 
	    {
	      throw new Error('Provide a callback function');
	    }
	    if (!options || !options.k || options.k < 1) 
	    {
	      return callback(new Error('Provide a correct number k of clusters'));
	    }
	    if (options.distance && (typeof options.distance !== 'function' || options.distance.length !== 2)) 
	    {
	      return callback(new Error('options.distance must be a function with two arguments'));
	    }
	    if (!_.isArray(vector)) 
	    {
	      return callback(new Error('Provide an array of data'));
	    }

    	this.options = options;
    	this.v = this.checkV(vector);
    	this.k = this.options.k;
    	this.distanceFunction = this.options.distance || euclidianDistance;
    	if (this.v.length < this.k) 
    	{
    	  const errMessage = `The number of points must be greater than the number k of clusters`;
      	return callback(new Error(errMessage));
    	}

    	this.initialize(); 

	    const self = this;
    	let moved = -1;

	    function iterate() 
	    {
      		if (moved === 0) 
      		{
        		return callback(null, self.output()); 
      		}
      		moved = 0;
	      for (let i = 0, max = self.groups.length; i < max; ++i) 
	      {
	        self.groups[i].defineCentroid(self); 
	        self.groups[i].distanceObjects(self); 
	      }
	      self.clustering(); 
	      for (let i = 0, max = self.groups.length; i < max; ++i) 
	      {
	        
	        if (self.groups[i].centroidMoved) 
	        {
	          moved++;
	        }
	      }
	      return process.nextTick(iterate);
	    }
	    return iterate();			
  	}

  	checkV(v) 
  	{
    	let dim = 1;
    	if (_.isArray(v[0])) 
    	{
      		dim = v[0].length;
    	}
    	for (let i = 0, max = v.length; i < max; ++i) 
    	{
      		if (!_.isArray(v[i])) 
      		{
        		if (dim !== 1) 
        		{
          			throw new Error('All the elements must have the same dimension');
        		}
        		v[i] = Number(v[i]);
        		if (isNaN(v[i])) 
        		{
		        	throw new Error('All the elements must be float type');
		        }
      		}
      		else 
      		{
        		if (v[i].length !== dim) 
        		{
          			throw new Error('All the elements must have the same dimension');
        		}
        		for (let j = 0, max2 = v[i].length; j < max2; ++j) 
        		{
          			v[i][j] = Number(v[i][j]);
          			if (isNaN(v[i][j])) 
          			{
            			throw new Error('All the elements must be float type');
          			}
        		}
      		}
    	}
    	return v;
  	}
}

exports.clusterize = (vector, options, callback) => {
  return new Clusterize(vector, options, callback);
};

exports._class = Clusterize;