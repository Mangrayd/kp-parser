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

		return needle('get', parseUrl).then((res) =>{

			// obj filling
			this.$response = cheerio.load(res.body);

			// main info
			this.filmObj['titleRus']   = this.getTitleRus();
			this.filmObj['titleOrig']  = this.getTitleOrig();
			this.filmObj['desc']       = this.getDesc();

			this.filmObj['year']       = this.getYear();
			this.filmObj['countries']  = this.getCountries();
			this.filmObj['genres']     = this.getGenres();

			this.filmObj['directors']  = this.getDirectors();
			this.filmObj['actors']     = this.getActors();

			this.filmObj['ratingKP']   = this.getRatingKP();
			this.filmObj['ratingIMDb'] = this.getRatingIMDb();

			// additional info
			this.filmObj['slogan']        = this.getSlogan();
			this.filmObj['age']           = this.getAge();
			this.filmObj['time']          = this.getTime();
			this.filmObj['screenwriters'] = this.getScreenwriters();
			this.filmObj['producers']     = this.getProducers();
			this.filmObj['composers']     = this.getComposers();
			this.filmObj['artists']       = this.getArtists();
			this.filmObj['operators']     = this.getOperators();
			this.filmObj['mounting']      = this.getMounting();


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
	getGenres(){
		return this.getListElementsValues( this.getTableRowValue(11).find('span a') );
	}
	getDirectors(){
		return this.getListElementsValues( this.getTableRowValue(4).find('a') );
	}
	getActors(){
		return this.getListElementsValues( this.$response('div#actorList ul').first().find('li a').not((i, el) => {
			return this.$response(el).text() === '...';
		}) );
	}
	getRatingKP(){
		return this.$response('div#block_rating span.rating_ball').text();
	}
	getRatingIMDb(){
		return this.$response('div#block_rating').find('div.div1').next().text().split(' ')[1];
	}

	getSlogan(){
		return this.getTableRowValue(3).text();
	}
	getAge(){
		return this.$response('table.info tr').find('td .ageLimit').next().text().split(' / ')[0]
	}
	getTime(){
		return this.$response('table.info tr').find('td.time').text().split(' / ')[0]
	}
	getScreenwriters(){
		return this.getListElementsValues( this.getTableRowValue(5).find('a').not((i, el) => {
			return this.$response(el).text() === '...';
		}) );
	}
	getProducers(){
		return this.getListElementsValues( this.getTableRowValue(6).find('a').not((i, el) => {
			return this.$response(el).text() === '...';
		}) );
	}
	getOperators(){
		return this.getListElementsValues( this.getTableRowValue(7).find('a').not((i, el) => {
			return this.$response(el).text() === '...';
		}) );
	}
	getComposers(){
		return this.getListElementsValues( this.getTableRowValue(8).find('a') );
	}
	getArtists(){
		return this.getListElementsValues( this.getTableRowValue(9).find('a').not((i, el) => {
			return this.$response(el).text() === '...';
		}) );
	}
	getMounting(){
		return this.getListElementsValues( this.getTableRowValue(10).find('a').not((i, el) => {
			return this.$response(el).text() === '...';
		}) );
	}

}

module.exports = KPparser;

