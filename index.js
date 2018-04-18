const needle = require('needle');
const cheerio = require('cheerio');

class KPparser {
	constructor (){
		this.baseUrl = 'https://www.kinopoisk.ru/film/';
		this.$response = null;
		this.filmObj = {};
	}
	parseKinopoiskFilm(id){

		const parseUrl = this.baseUrl + id + '/';

		needle('get', parseUrl).then((res) =>{

			// obj filling
			this.$response = cheerio.load(res.body);

			this.filmObj['titleRus']   = this.getTitleRus();
			this.filmObj['titleOrig']  = this.getTitleOrig();
			this.filmObj['desc']       = this.getDesc();

			this.filmObj['year']       = this.getYear();
			this.filmObj['countries']  = this.getCountries();
			this.filmObj['slogan']     = this.getSlogan();
			this.filmObj['directors']  = this.getDirectors();

			this.filmObj['actors']     = this.getActors();

			this.filmObj['ratingKP']   = this.getRatingKP();
			this.filmObj['ratingIMDb'] = this.getRatingIMDb();

			return this.filmObj;
		})
		.catch((err) => {
			console.log(`Error: ${err}`);
		});
	}
	/*
	* $rowNum - number
	*
	* return cheerio object
	*
	* get number of row and return last <td/> element for this row
	*
	* */
	getTableRowValue(rowNum){
		return this.$response('table.info tr').eq(rowNum-1).find('td').last();
	}
	/*
	* $list - cheerio object
	*
	* return array of values
	*
	* get text for all values in $list
	*
	* */
	getListElementsValues($list){
		const resultArr = [];
		$list.each((i, elem) => {
			resultArr.push(this.$response(elem).text());
		});
		return resultArr;
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
		return this.getTableRowValue(1).find('a').text();
	}
	getCountries(){
		return this.getListElementsValues( this.getTableRowValue(2).find('a') );
	}
	getSlogan(){
		return this.getTableRowValue(3).text();
	}
	getDirectors(){
		return this.getListElementsValues( this.getTableRowValue(4).find('a') );
	}
	getActors(){
		return this.getListElementsValues( this.$response('div#actorList ul').first().find('li').not(':last-of-type') );
	}
	getRatingKP(){
		return this.$response('div#block_rating span.rating_ball').text();
	}
	getRatingIMDb(){
		return this.$response('div#block_rating').find('div.div1').next().text().split(' ')[1];
	}
}

module.exports = KPparser;

