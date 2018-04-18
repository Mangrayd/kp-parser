const KPparser = require('./index');

const myParser = new KPparser();
myParser.parseKinopoiskFilm('chudo-na-gudzone-2016-805650')
	.then((res)=>{
		console.log(res);
	}).catch((err)=>{
		console.log(`err: ${err}`);
	});