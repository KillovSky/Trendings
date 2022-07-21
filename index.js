"use strict";
const https = require('https');
const httpcodes = require('./codes.json');
const default_trends = require('./default.json');
const regions = require('./region.json');

/*######################################################################################
#
# Por que fiz a linguagem em inglês? 
# R: Pois eu gosto deste idioma e quis seguir o padrão como quase todos os outros devs.
#
# Esse código pode ser copiado para criar algo diferente, novo, superior ou etc?
# R: É claro! Mas você >PRECISA< manter o copyright, leia mais da licença abaixo.
#
# Por que este código parece igual ao seu outro da NASA?
# R: Por que eu quis fazer algo confortável para quem veio de outros projetos meus.
# R: Ou seja, quis manter o mesmo formato para facilitar, e vou continuar fazendo isso.
#
########################################################################################
#
#	MIT License
#
#	Copyright (c) 2022 KillovSky - Lucas R.
#
#	Permission is hereby granted, free of charge, to any person obtaining a copy
#	of this software and associated documentation files (the "Software"), to deal
#	in the Software without restriction, including without limitation the rights
#	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#	copies of the Software, and to permit persons to whom the Software is
#	furnished to do so, subject to the following conditions:
#
#	The above copyright notice and this permission notice shall be included in all
#	copies or substantial portions of the Software.
#
#	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#	SOFTWARE.
#
######################################################################################*/

/* Função para remover trends duplicadas */
const uniqueObject = (array, key) => [...new Map(array.map(item => [item[key], item])).values()];

/* Cria a exports para atuar como função */
exports.info = (
	local = ''
) => {

	/* Faz uma promise com a função para funcionar perfeitamente */
	return new Promise((resolve, reject) => {

		/* Cria a object de return em casos de erros, não afetando o usuário mas permitindo que ele saiba quando der erro */
		let response = default_trends[Math.floor(Math.random() * default_trends.length)];

		/* Define os locais válidos */
		response.locales = Object.keys(regions).map(g => g);

		/* Corrige a local */
		var place = local == '' || local == null ? regions.worldwide : local.toLowerCase();
		if (place == '' || place == null) {
			place = regions.worldwide;
		} else if (!response.locales.includes(place)) {
			response.dev_msg = "Region not supported, check available regions in 'locales' key.";
			place = regions.worldwide;
		} else {
			place = regions[place];
		}

		/* Opções de acesso */
		let options = {
			hostname: 'trends24.in',
			path: place,
			method: 'GET'
		};

		/* Try - Catch para caso dê um erro pior */
		try {

			/* Let para obter a chunk da requisição */
			let data = '';

			/* Faz a requisição */
			const req = https.get(options, function(res) {

				/* Edita a object padrão de casos de erro */
				response.code = res.statusCode;
				response.explain = httpcodes[res.statusCode];
				response.headers = res.headers;

				/* Recebe a chunk */
				res.on('data', function(chunk) {
					data += chunk;
				});

				/* Em caso de falhas */
				req.on("error", function(err) {
					response.error = true;
					response.code = err.code;
					response.error_msg = err.message;
					return resolve(response);
				});

				/* Finaliza pois o resultado foi completamente recebido */
				res.on('end', function() {

					/* Formata a página usando as tags de HTML */
					/* Dica: Evite fazer programas neste estilo, são confusos, complexos e não tem uma boa 'qualidade' */
					const Trendings = [];

					/* Extrai as informações do HTML usando regex */
					/* Por que não usou cheerio? Por que este módulo visa ser totalmente livre do uso de módulos externos */
					var body = data.match(/class=(.*?tweet-count)(.*?)(?=<\/a>)/g);

					/* Edita as informações extraídas a ponto de poder editar com regex */
					body = body.toString();
					body = body.replace(/class=/gim, '\n');
					body = body.replace('",', '\n');
					body = body.replace('</span', '\n');

					/* Extrai somente as linhas com contagem de tweets */
					body = body.match(/tweet-count.*$/gim);
					body = body.filter(g => g.includes('tweet-count'));

					/* Formata todas as linhas recebidas acima */
					body.forEach(tread => {
						tread = tread.replace('target=', ', "trend": ');
						tread = tread.replace('">', '", "trend": "');
						tread = tread.replace(' "tw">', '"');
						tread = tread.replace(/,$/, '" }');
						tread = tread.replace(/^/, '{ "');
						tread = tread.replace('</span></li><li title=', ', "trend": ');
						tread = tread.replace('t">', 't": "');
						tread = tread.replace('K, "', 'K", "');
						tread = tread.replace('K</span></li><li', 'K"');
						tread = tread.replace('tweet-count', 'count');
						tread = tread.replace('"count>', '"count": "');
						tread = tread.replace('><a href=', ', "url": ');
						tread = tread.replace('</span></li><li><a href=', ', "url": ');
						Trendings.push(tread);
					});

					/* Zera a body para receber a nova Object */
					body = [];

					/* Transforma o HTML na Object, ignora se der erro, não afetando o funcionamento */
					Trendings.map(g => {
						try {
							body.push(JSON.parse(g));
						} catch (err) {
							response.dev_msg = err.message;
						}
					});

					/* Formata a Object para ter apenas resultados sem repetição */
					body = uniqueObject(body, 'trend');

					/* Formata as strings das keys, afim de evitar encode URI */
					body.forEach(g => {
						g.url = `https://twitter.com/search?q=${encodeURIComponent(g.trend)}`;
						g.trend = decodeURIComponent(g.trend);
						g.count = decodeURIComponent(g.count);
					});

					/* Formata a Object de acordo com quantidade de tweets */
					body = body.sort((a, b) => Number(b.count.replace(/[a-z]/gim, '')) - Number(a.count.replace(/[a-z]/gim, '')));

					/* Define a resposta na Object */
					response.tweet = body;

					/* Insere a data do dia */
					let today = new Date();
					response.date = today.toLocaleString();

					/* Finaliza o request e retorna o JSON */
					return resolve(response);
					
				});
				
			});

			/* Em caso de falhas 2x */
			req.on("error", function(err) {
				response.error = true;
				response.code = err.code;
				response.error_msg = err.message;
				return resolve(response);
			});

			/* Finaliza a requisição */
			req.end();

			/* Caso der erro em alguma coisa, não afeta o resultado e cai no catch abaixo */
		} catch (error) {
			response.error = true;
			response.code = error.code;
			response.error_msg = error.message;
			return resolve(response);
		}
		
	});

};

/* Retorna os locais disponíveis */
exports.locales = () => [
	"worldwide",
	"algeria",
	"algiers",
	"argentina",
	"buenos-aires",
	"cordoba",
	"mendoza",
	"rosario",
	"australia",
	"adelaide",
	"brisbane",
	"canberra",
	"darwin",
	"melbourne",
	"perth",
	"sydney",
	"austria",
	"vienna",
	"bahrain",
	"belarus",
	"brest",
	"gomel",
	"grodno",
	"minsk",
	"belgium",
	"brazil",
	"belem",
	"belo-horizonte",
	"brasilia",
	"campinas",
	"curitiba",
	"fortaleza",
	"goiania",
	"guarulhos",
	"manaus",
	"porto-alegre",
	"recife",
	"rio-de-janeiro",
	"salvador",
	"sao-luis",
	"sao-paulo",
	"canada",
	"calgary",
	"edmonton",
	"montreal",
	"ottawa",
	"quebec",
	"toronto",
	"vancouver",
	"winnipeg",
	"chile",
	"concepcion",
	"santiago",
	"valparaiso",
	"colombia",
	"barranquilla",
	"bogota",
	"cali",
	"medellin",
	"denmark",
	"dominican-republic",
	"santo-domingo",
	"ecuador",
	"guayaquil",
	"quito",
	"egypt",
	"alexandria",
	"cairo",
	"giza",
	"france",
	"bordeaux",
	"lille",
	"lyon",
	"marseille",
	"montpellier",
	"nantes",
	"paris",
	"rennes",
	"strasbourg",
	"toulouse",
	"germany",
	"berlin",
	"bremen",
	"cologne",
	"dortmund",
	"dresden",
	"dusseldorf",
	"essen",
	"frankfurt",
	"hamburg",
	"leipzig",
	"munich",
	"stuttgart",
	"ghana",
	"accra",
	"kumasi",
	"greece",
	"athens",
	"thessaloniki",
	"guatemala",
	"guatemala-city",
	"india",
	"ahmedabad",
	"amritsar",
	"bangalore",
	"bhopal",
	"chennai",
	"delhi",
	"hyderabad",
	"indore",
	"jaipur",
	"kanpur",
	"kolkata",
	"lucknow",
	"mumbai",
	"nagpur",
	"patna",
	"pune",
	"rajkot",
	"ranchi",
	"srinagar",
	"surat",
	"thane",
	"indonesia",
	"bandung",
	"bekasi",
	"depok",
	"jakarta",
	"makassar",
	"medan",
	"palembang",
	"pekanbaru",
	"semarang",
	"surabaya",
	"tangerang",
	"ireland",
	"cork",
	"dublin",
	"galway",
	"israel",
	"haifa",
	"jerusalem",
	"tel-aviv",
	"italy",
	"bologna",
	"genoa",
	"milan",
	"naples",
	"palermo",
	"rome",
	"turin",
	"japan",
	"chiba",
	"fukuoka",
	"hamamatsu",
	"hiroshima",
	"kawasaki",
	"kitakyushu",
	"kobe",
	"kumamoto",
	"kyoto",
	"nagoya",
	"niigata",
	"okayama",
	"okinawa",
	"osaka",
	"sagamihara",
	"saitama",
	"sapporo",
	"sendai",
	"takamatsu",
	"tokyo",
	"yokohama",
	"jordan",
	"amman",
	"kenya",
	"mombasa",
	"nairobi",
	"korea",
	"ansan",
	"bucheon",
	"busan",
	"changwon",
	"daegu",
	"daejeon",
	"goyang",
	"gwangju",
	"incheon",
	"seongnam",
	"seoul",
	"suwon",
	"ulsan",
	"yongin",
	"kuwait",
	"latvia",
	"riga",
	"lebanon",
	"malaysia",
	"hulu-langat",
	"ipoh",
	"johor-bahru",
	"kajang",
	"klang",
	"kuala-lumpur",
	"petaling",
	"mexico",
	"acapulco",
	"aguascalientes",
	"chihuahua",
	"ciudad-juarez",
	"culiacan",
	"ecatepec-de-morelos",
	"guadalajara",
	"hermosillo",
	"leon",
	"merida",
	"mexicali",
	"mexico-city",
	"monterrey",
	"morelia",
	"naucalpan-de-juarez",
	"nezahualcoyotl",
	"puebla",
	"queretaro",
	"saltillo",
	"san-luis-potosi",
	"tijuana",
	"toluca",
	"zapopan",
	"netherlands",
	"amsterdam",
	"den-haag",
	"rotterdam",
	"utrecht",
	"new-zealand",
	"auckland",
	"nigeria",
	"benin-city",
	"ibadan",
	"kaduna",
	"kano",
	"lagos",
	"port-harcourt",
	"norway",
	"bergen",
	"oslo",
	"oman",
	"muscat",
	"pakistan",
	"faisalabad",
	"karachi",
	"lahore",
	"multan",
	"rawalpindi",
	"panama",
	"peru",
	"lima",
	"philippines",
	"antipolo",
	"cagayan-de-oro",
	"calocan",
	"cebu-city",
	"davao-city",
	"makati",
	"manila",
	"pasig",
	"quezon-city",
	"taguig",
	"zamboanga-city",
	"poland",
	"gdansk",
	"krakow",
	"lodz",
	"poznan",
	"warsaw",
	"wroclaw",
	"portugal",
	"puerto-rico",
	"qatar",
	"russia",
	"chelyabinsk",
	"irkutsk",
	"kazan",
	"khabarovsk",
	"krasnodar",
	"krasnoyarsk",
	"moscow",
	"nizhny-novgorod",
	"novosibirsk",
	"omsk",
	"perm",
	"rostov-on-don",
	"saint-petersburg",
	"samara",
	"ufa",
	"vladivostok",
	"volgograd",
	"voronezh",
	"yekaterinburg",
	"saudi-arabia",
	"ahsa",
	"dammam",
	"jeddah",
	"mecca",
	"medina",
	"riyadh",
	"singapore",
	"south-africa",
	"cape-town",
	"durban",
	"johannesburg",
	"port-elizabeth",
	"pretoria",
	"soweto",
	"spain",
	"barcelona",
	"bilbao",
	"las-palmas",
	"madrid",
	"malaga",
	"murcia",
	"palma",
	"seville",
	"valencia",
	"zaragoza",
	"sweden",
	"gothenburg",
	"stockholm",
	"switzerland",
	"geneva",
	"lausanne",
	"zurich",
	"thailand",
	"bangkok",
	"turkey",
	"adana",
	"ankara",
	"antalya",
	"bursa",
	"diyarbakir",
	"eskisehir",
	"gaziantep",
	"istanbul",
	"izmir",
	"kayseri",
	"konya",
	"mersin",
	"ukraine",
	"dnipropetrovsk",
	"donetsk",
	"kharkiv",
	"kyiv",
	"lviv",
	"odesa",
	"zaporozhye",
	"united-arab-emirates",
	"abu-dhabi",
	"dubai",
	"sharjah",
	"united-kingdom",
	"belfast",
	"birmingham",
	"blackpool",
	"bournemouth",
	"brighton",
	"bristol",
	"cardiff",
	"coventry",
	"derby",
	"edinburgh",
	"glasgow",
	"hull",
	"leeds",
	"leicester",
	"liverpool",
	"london",
	"manchester",
	"middlesbrough",
	"newcastle",
	"nottingham",
	"plymouth",
	"portsmouth",
	"preston",
	"sheffield",
	"stoke-on-trent",
	"swansea",
	"united-states",
	"albuquerque",
	"atlanta",
	"austin",
	"baltimore",
	"baton-rouge",
	"boston",
	"charlotte",
	"chicago",
	"cincinnati",
	"cleveland",
	"colorado-springs",
	"columbus",
	"dallas-ft.-worth",
	"denver",
	"detroit",
	"el-paso",
	"fresno",
	"greensboro",
	"harrisburg",
	"honolulu",
	"houston",
	"indianapolis",
	"jackson",
	"jacksonville",
	"kansas-city",
	"las-vegas",
	"long-beach",
	"los-angeles",
	"louisville",
	"memphis",
	"mesa",
	"miami",
	"milwaukee",
	"minneapolis",
	"nashville",
	"new-haven",
	"new-orleans",
	"new-york",
	"norfolk",
	"oklahoma-city",
	"omaha",
	"orlando",
	"philadelphia",
	"phoenix",
	"pittsburgh",
	"portland",
	"providence",
	"raleigh",
	"richmond",
	"sacramento",
	"salt-lake-city",
	"san-antonio",
	"san-diego",
	"san-francisco",
	"san-jose",
	"seattle",
	"st.-louis",
	"tallahassee",
	"tampa",
	"tucson",
	"virginia-beach",
	"washington",
	"venezuela",
	"barquisimeto",
	"caracas",
	"ciudad-guayana",
	"maracaibo",
	"maracay",
	"maturin",
	"turmero",
	"vietnam",
	"can-tho",
	"da-nang",
	"hai-phong",
	"hanoi",
	"ho-chi-minh-city"
];