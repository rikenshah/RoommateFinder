/*npm*/

'use strict';
const _ = require('underscore');

class Clusterize 
{

}

exports.clusterize = (vector, options, callback) => {
  return new Clusterize(vector, options, callback);
};

exports._class = Clusterize;