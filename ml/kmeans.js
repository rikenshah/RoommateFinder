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

    				
  	}
}

exports.clusterize = (vector, options, callback) => {
  return new Clusterize(vector, options, callback);
};

exports._class = Clusterize;