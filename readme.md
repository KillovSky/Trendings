<p align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Twitter_Logo.png" width="150" height="150" alt="logo_twitter.png"/></p>  
<h5 align="center"><a href="https://pt.wikipedia.org/wiki/Ficheiro:Twitter_Logo.png">[Source: Wikipédia]</a></h5>  
  
# Para os desenvolvedores do Trends24:  
> Caros desenvolvedores/responsáveis do Trends24, caso este módulo possa ser ofensivo, danoso ou seja ruim para seus sistemas, me contatem usando as [Issues](https://github.com/KillovSky/Trendings/issues), farei a remoção o mais rápido possível, minha intenção neste módulo é apenas trazer uma funcionalidade útil para as pessoas ou seus projetos de desenvolvimento, meu objetivo não é, nunca foi e nunca será, causar danos ao site de vocês.  
  
## Instalação:  
- Rode o código abaixo para instalar via `NPM`:  
  
```bash  
$ npm i @killovsky/trendings  
```  
  
- Rode o código abaixo para instalar via `GIT`:  
```bash  
$ git clone https://github.com/KillovSky/Trendings.git  
```  
  
## O que este módulo faz?  
- Ele utiliza o site [Trends24](https://trends24.in/) para obter as trends, sem necessidade de módulos como `cheerio` ou `puppeteer`.  
  
## O que este módulo tem de especial?  
- Assim como o da [NASA](https://github.com/KillovSky/NASA), muitas coisas, confira abaixo:  
  
------  
> 1. Neste módulo, os erros não afetam o funcionamento, o que significa que apesar de qualquer erro, os valores 'sempre' estarão lá para que você não seja afetado.  
>  
> 2. Os erros serão inseridos na resposta com uma explicação sobre o que causou eles, facilitando para você entender.  
>  
> 3. Os headers estão inseridos na resposta, facilitando para saber detalhes que podem lhe ser uteis.  
>  
> 4. Não existem dependências de módulos de terceiro, tudo é feito usando o puro `Node.js`.  
>  
> 5. Cada linha do código possui uma explicação do que está rodando ou vai rodar, ou seja, o código INTEIRO é explicado, linha por linha.   
>  
> 6. As trends são automaticamente formatadas em ordem decrescente [130, 129, 128...] de acordo com a quantidade de tweets feitos.  
>  
> 7. E muitas outras coisas, confira o código para entender!  
------  
  
## Como testar este módulo:  
- Basta abrir um terminal na pasta do módulo e digitar:  
  
```bash  
$ npm test  
```  
  
## Como utilizar este módulo:  
- Existem diversas formas de utilizar, mas como se trata de um script que faz uso de `Promises`, irei dar dois exemplos que funcionam bem, lembrando, você pode rodar sem especificar nada pois também funciona desta forma. 
- Clique em uma das linhas/setas abaixo para exibir os detalhes!  
  
<details>  
<summary><code>Descrição de cada parâmetro da execução:</code></summary>  
  
```javascript  
// Function especificada  
info('local')  
  
/* ------------------------------------- *  
* 1° - Local  
* Valores: string  
* Padrão: 'worldwide'  
* Locais: "brazil, worldwide, italy..."  
* ------------------------------------- */  
  
// Function sem especificar  
info()  
  
// Retorna os locais  
locales()  
  
// Retorna o JSON das regiões  
regions()  
  
// Retorna o JSON de erros  
defaults()  
  
// Retorna os códigos HTTP  
http()  
  
// Retorna a package JSON  
packages()  
  
// Retorna detalhes do 'ambient'  
ambient()  
```  
  
</details>   
  
<details>  
<summary><code>Exemplos de uso:</code></summary>  
  
```javascript  
// Usando .then | Modo de uso padrão  
const trendings = require('@killovsky/trendings');  
trendings.info('LOCAL').then(data => {  
	// Faça seu código baseado na object 'data' aqui  
	// Exemplo: console.log(data);  
})  
  
// Usando await [async] | Modo de uso padrão  
const trendings = require('@killovsky/trendings');  
const data = await trendings.info('LOCAL');  
// Faça seu código aqui usando a const 'data'  
// Exemplo: console.log(data);  
```  
  
</details>  
  
<details>  
<summary><code>Código já prontos [.then]:</code></summary>  
  
```javascript  
// Código usando .then  
const trendings = require('@killovsky/trendings');  
trendings.info('brazil').then(data => console.log(data));  
```  
  
</details>  
  
<details>  
<summary><code>Código já prontos [async/await]:</code></summary>  
  
```javascript  
// Código usando await 
const trendings = require('@killovsky/trendings');  
const data = await trendings.info('brazil');  
console.log(data);  
  
// Se você não sabe criar uma função async ou ainda não tiver uma, use este código abaixo:  
(async () => {  
	// Cole um código com await aqui dentro  
})();  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo de resultado com explicações:</code></summary>  
  
```JSON  
{  
	"date": "String | Data [YYYY-MM-DD HH:MM:SS]",  
	"error": "true | false",  
	"dev_msg": "String / false | Mensagem adicional de erro",  
	"error_msg": "String / false | Códigos de erros de execução",   
	"locales": "Array | Todos os locais disponíveis",  
	"code": "Number | String | Código de erro HTTP",  
	"explain": {  
		"code": "Number / String | Código escrito de HTTP",  
		"why": "String | Explicação do código HTTP"  
	},  
	"headers": {  
		"date": "String | Data escrita da requisição",  
		"content-type": "String | Tipo de resposta",  
		"content-length": "Number | Tamanho da resposta",  
		"Outros": "E vários outros headers, faça uma requisição para obter todos."  
	},  
	"tweet": [  
		{  
			"count": "String | Quantidade de tweets",  
			"url": "String | URL com o link da trend",  
			"trend": "String | Assunto do momento"  
		}  
	]  
}  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo utilizável de resultado:</code></summary>  
  
```JSON  
{  
	"date": "20/07/2022 23:53:05",  
	"error": false,  
	"dev_msg": false,  
	"error_msg": false,  
	"locales": ["brazil", "worldwide", "paris", "...."],  
	"code": 200,  
	"explain": {  
		"code": "OK",  
		"why": "The request is OK, this response depends on the HTTP method used."  
	},  
	"headers": {  
		"connection": "close",  
		"content-length": "159490",  
		"cache-control": "max-age=3600",  
		"content-type": "text/html; charset=utf-8",  
		"last-modified": "Thu, 21 Jul 2022 02:47:23 GMT",  
		"strict-transport-security": "max-age=31556926",  
		"accept-ranges": "bytes",  
		"date": "Thu, 21 Jul 2022 02:53:04 GMT",  
		"vary": "x-fh-requested-host, accept-encoding"  
	},  
	"tweet": [  
		{  
			"count": "551K",  
			"url": "https://twitter.com/search?q=%23MasterChefBR",  
			"trend": "#MasterChefBR"  
		},  
		{  
			"count": "513K",  
			"url": "https://twitter.com/search?q=%23IlhaRecord",  
			"trend": "#IlhaRecord"  
		},  
		{  
			"count": "403K",  
			"url": "https://twitter.com/search?q=Anitta",  
			"trend": "Anitta"  
		},  
		{  
			"count": "401K",  
			"url": "https://twitter.com/search?q=Slipknot",  
			"trend": "Slipknot"  
		}  
	]  
}  
```  
  
</details>   
  
## Perguntas e Respostas:  
  
- Isso é bem similar ao seu módulo do Projeto APOD da NASA, não é?  
> Sim, é por que quero criar sistemas fáceis de entender e usar, decidi que a melhor forma seria fazendo eles de forma similar, deixando o código bem simples para qualquer um que vier de outros projetos meus.  
>  
- Por que não utiliza o `cheerio` ou `puppeteer` em vez desse sistema?  
> Esse meio de informação exige instalação de módulos de terceiro, porém quero fazer meus sistemas sem dependências, nada além do próprio `Node.js`, pois tenho foco em uma única tarefa: ser simples.  
>  
- O que é proibido ao usar este módulo?  
> Você jamais deve abusar de qualquer programa, sempre crie um limitador de tempo ou armazene a ultima resposta e use ela, evite ficar utilizando um programa deste estilo muitas vezes seguidas sem esperar.  
  
## Suporte  
  
- Se obtiver algum problema, você pode me dizer [Reportando nas Issues](https://github.com/KillovSky/Trendings/issues).  
- Confira outros projetos meus [Acessando Isto](https://github.com/KillovSky).  
- Se gostar, doe para me ajudar a continuar desenvolvendo, mais informações [Clicando Aqui](http://htmlpreview.github.io/?https://github.com/KillovSky/iris/blob/main/.readme/donates/page.html) - [Página do Projeto Íris]  
  