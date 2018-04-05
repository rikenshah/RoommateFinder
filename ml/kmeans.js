const profile = require('./profile');

if(require.main == module)
    run()

function run()
{
	var res;
	profile.fetch_profile(function(res) 
	{
		console.log(res);
	});
}