exports.index = function (req, res) {
  res.render('userProfile/index');
};

exports.registersuccess=function(req,res){
  res.render('userProfile/registersuccess');
};

exports.landing = function (req, res) {
  res.render('landing/landing');
};
