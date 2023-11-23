<p align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Twitter_Logo.png" width="150" height="150" alt="logo_twitter.png"/></p>  
<h5 align="center"><a href="https://pt.wikipedia.org/wiki/Ficheiro:Twitter_Logo.png">[Source: Wikipédia]</a></h5>  
<p align="center">  
    <a href="https://hits.seeyoufarm.com">  
        <img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FKillovSky%2FTrendings&count_bg=%233D89C8&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=Views&edge_flat=true)](https://hits.seeyoufarm.com"/>  
    </a>  
    <a href="https://github.com/KillovSky/Trendings/blob/master/LICENSE">  
        <img alt="GitHub License" src="https://img.shields.io/github/license/KillovSky/Trendings?color=blue&label=Licence&style=flat-square">  
    </a>  
	<a href="https://github.com/KillovSky/Trendings/blob/master/package.json">  
        <img alt="GitHub Version" src="https://img.shields.io/github/package-json/v/KillovSky/Trendings?label=Build&style=flat-square">  
	</a>  
	<a href="https://github.com/KillovSky/Trendings/commits/main">  
        <img alt="GitHub Updates" src="https://img.shields.io/github/commit-activity/y/KillovSky/Trendings?label=Updates&style=flat-square">  
	</a>  
	<a href="https://github.com/KillovSky/Trendings/stargazers/">  
        <img title="GitHub Stars" src="https://img.shields.io/github/stars/KillovSky/Trendings?label=Stars&style=flat-square">  
	</a>  
	<a href="https://github.com/KillovSky/Trendings/network/members">  
        <img title="GitHub Forks" src="https://img.shields.io/github/forks/KillovSky/Trendings?label=Forks&style=flat-square">  
	</a>  
	<a href="https://github.com/KillovSky/Trendings/watchers">  
        <img title="GitHub Watch" src="https://img.shields.io/github/watchers/KillovSky/Trendings?label=Watchers&style=flat-square">  
	</a>  
	<a href="https://www.codefactor.io/repository/github/KillovSky/Trendings">  
        <img alt="Codefactor" src="https://www.codefactor.io/repository/github/KillovSky/Trendings/badge">  
	</a>  
	<a href="http://isitmaintained.com/project/KillovSky/Trendings">  
        <img alt="Is maintained" src="http://isitmaintained.com/badge/resolution/KillovSky/Trendings.svg">  
	</a>  
</p>  
  
------ 
  
## Introdução  
- Detalhes importantes que estão em outros arquivos:  
  
1. [Reportar segurança, problemas e demais](https://github.com/KillovSky/Trendings/blob/master/.github/SECURITY.md)  
2. [Contribuir com o código](https://github.com/KillovSky/Trendings/blob/master/.github/CONTRIBUTING.md)  
3. [Ver o código de conduta](https://github.com/KillovSky/Trendings/blob/master/.github/CODE_OF_CONDUCT.md)  
4. [Ver a changelog](https://github.com/KillovSky/Trendings/blob/master/.github/CHANGELOG.md)  
5. [Ver mais projetos](https://github.com/KillovSky)  
6. [Fazer uma donate](https://github.com/KillovSky#-fundings)  
  
------ 
  
## O que este módulo faz?  
- Ele utiliza o site [Trends24](https://trends24.in/) para obter as trends, sem necessidade de módulos como `cheerio` ou `puppeteer`.  
  
------ 
  
## Instalação:  
- Rode o código abaixo para instalar via `NPM`:  
  
```bash  
$ npm i @killovsky/trendings  
```  
  
- Rode o código abaixo para instalar via `GIT`:  
```bash  
$ git clone https://github.com/KillovSky/Trendings.git  
```  
  
------ 
  
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
> 7. Os sistemas são como um jogo de exploração, eles podem ser usados de infinitas formas, como um sandbox, divirta-se!  
>  
> 8. E muitas outras coisas, confira o código para entender!  
------  
  
## Como testar este módulo:  
- Basta abrir um terminal na pasta do módulo e digitar:  
  
```bash  
$ npm test  
```  
  
------ 
  
## Como utilizar este módulo:  
- Existem diversas formas de utilizar, mas como se trata de um script que faz uso de `Promises`, irei dar dois exemplos que funcionam bem, lembrando, você pode rodar sem especificar nada pois também funciona desta forma.   
- Clique em uma das linhas/setas abaixo para exibir os detalhes!  
- Clique [aqui](https://github.com/KillovSky/Trendings/blob/master/utils.json) para ver detalhes do ambiente de código e suas funções.  
  
<details>  
<summary><code>Descrição de cada parâmetro da execução:</code></summary>  
  
```javascript  
// Função responsável por todo o código  
info('local')  
  
/* ------------------------------------- *  
* 1° - Local  
* Valores: string  
* Padrão: 'worldwide'  
* Locais: "brazil, worldwide, italy..."  
* Test Mode: "TEST#TICKET", ""  
* ------------------------------------- */  
  
// Retorna o valor padrão e detalhes do erro  
fail('Error')  
  
// Retorna o resultado e roda funções adicionais  
dump('*')  
  
// Reseta o ambiente dos códigos  
reset()  
  
// Retorna a package JSON  
packs()  
  
// Retorna o ambiente de códigos  
env()  
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
	"error": "Boolean | Determina se houve erro no request",  
	"dev_msg": "String / Boolean | Mensagem adicional de erro",  
	"error_msg": "String / false | Mensagem de erro do request",   
	"code": "Number | String | Código de erro HTTP",  
	"nodeDetails": {  
		"isError": "Boolean | Determina se houve erro no Node",  
		"code": "Number / Boolean | Código de erro do Node",  
		"message": "String / Boolean | Detalhes da mensagem de erro"  
	},  
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
			"url": "String | URL da Trending",  
			"trend": "String | Assunto do momento",  
			"count": "String | Quantidade de tweets"  
		}  
	]  
}  
```  
  
</details>  
  
<details>  
<summary><code>Exemplo utilizável de resultado:</code></summary>  
  
```JSON  
{  
    "date":"3/25/2023, 2:03:05 PM",  
    "error":false,  
    "dev_msg":false,  
    "error_msg":false,  
    "code":200,  
    "nodeDetails":{  
        "isError":false,  
        "code":false,  
        "message":false  
    },  
    "explain":{  
        "code":"OK",  
        "why":"The request is OK, this response depends on the HTTP method used."  
    },  
    "headers":{  
        "connection":"close",  
        "date":"Sat, 25 Mar 2023 17:03:05 GMT",  
        "last-modified":"Sat, 25 Mar 2023 16:59:19 GMT"  
    },  
    "tweet":[  
        {  
            "count":"1266K",  
            "url":"https://twitter.com/search?q=Messi",  
            "trend":"Messi"  
        }  
    ]  
}  
```  
  
</details>   
  
------ 
  
## Perguntas e Respostas:  
  
- Isso é bem similar ao seu módulo do Projeto APOD da NASA, não é?  
> Sim, é por que quero criar sistemas fáceis de entender e usar, decidi que a melhor forma seria fazendo eles de forma similar, deixando o código bem simples para qualquer um que vier de outros projetos meus.  
>  
- Por que não utiliza o `cheerio` ou `puppeteer` em vez desse sistema?  
> Esse meio de informação exige instalação de módulos de terceiro, porém quero fazer meus sistemas sem dependências, nada além do próprio `Node.js`, pois tenho foco em uma única tarefa: ser simples.  
>  
- O que é proibido ao usar este módulo?  
> Você jamais deve abusar de qualquer programa, sempre crie um limitador de tempo ou armazene a ultima resposta e use ela, evite ficar utilizando um programa deste estilo muitas vezes seguidas sem esperar.  
  
------ 
  
## Para os desenvolvedores do Trends24:  
> Caros desenvolvedores/responsáveis do Trends24, caso este módulo possa ser ofensivo, danoso ou seja ruim para seus sistemas, me contatem usando as [Issues](https://github.com/KillovSky/Trendings/issues), farei a remoção o mais rápido possível, minha intenção neste módulo é apenas trazer uma funcionalidade útil para as pessoas ou seus projetos de desenvolvimento, meu objetivo não é, nunca foi e nunca será, causar danos ao site de vocês.  