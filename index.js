const needle = require('needle');
const cheerio = require('cheerio');

const URL = 'https://www.kinopoisk.ru/film/otstupniki-2006-81314/';

class KPparser {
	constructor (){
		this.baseUrl = 'https://www.kinopoisk.ru/film/';
		this.$response = null;
		this.filmObj = {};
	}
	parseKinopoiskFilm(id){

		const parseUrl = this.baseUrl + id + '/';

		console.log(parseUrl);

		needle.get(parseUrl, (err, res) => {


			// errors processing
			console.log(res);
			console.log(res.statusCode);
			console.log(res.statusMessage);
			if (err) {
				console.log(err);
			}

			// obj filling
			this.$response = cheerio.load(res.body);

			this.filmObj['titleRus']  = this.getTitleRus();
			this.filmObj['titleOrig'] = this.getTitleOrig();
			this.filmObj['desc']      = this.getDesc();
			this.filmObj['year']      = this.getYear();
			this.filmObj['countries'] = this.getCountries();
			this.filmObj['slogan']    = this.getSlogan();
			this.filmObj['directors'] = this.getDirectors();

			console.log(this.filmObj);

		});
	}
	// return cheerio parsed object
	getTableRowValue(rowNum){
		return this.$response('table.info tr').eq(rowNum-1).find('td').last();
	}
	getTitleRus(){
		return this.$response('h1.moviename-big').text();
	}
	getTitleOrig(){
		return this.$response('h1.moviename-big + span').text();
	}
	getDesc(){
		return this.$response('div.film-synopsys').text();
	}
	getYear(){
		return this.getTableRowValue(1).text();
	}
	getCountries(){
		const contries = [];
		this.getTableRowValue(2).find('a').each((i, elem) => {
			contries.push(this.$response(elem).text());
		});
		return contries;
	}
	getSlogan(){
		return this.getTableRowValue(3).text();
	}
	getDirectors(){
		const directors = [];
		this.getTableRowValue(4).find('a').each((i, elem) => {
			directors.push(this.$response(elem).text());
		});
		return directors;
	}
}

const myParser = new KPparser();
	myParser.parseKinopoiskFilm('troya-2004-3442');

