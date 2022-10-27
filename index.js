"use strict";
const default_trends = require("./default.json");
const httpcodes = require("./codes.json");
const https = require("https");
const mopack = require("./package.json");
const regions = require("./region.json");

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
#   MIT License
#
#   Copyright (c) 2022 KillovSky - Lucas R.
#
#   Permission is hereby granted, free of charge, to any person obtaining a copy
#   of this software and associated documentation files (the "Software"), to deal
#   in the Software without restriction, including without limitation the rights
#   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
#   copies of the Software, and to permit persons to whom the Software is
#   furnished to do so, subject to the following conditions:
#
#   The above copyright notice and this permission notice shall be included in all
#   copies or substantial portions of the Software.
#
#   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
#   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
#   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
#   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
#   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
#   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
#   SOFTWARE.
#
######################################################################################*/

/* Função para remover trends duplicadas */
const uniqueObject = (array, key) => [...new Map(array.map((item) => [item[key], item])).values()];

/* Modo de uso da uniqueObject e detalhes */
const Utilization = {
    "functions": {
        "uniqueObject": {
            "arguments": {
                "array": "An array with duplicate objects inside.",
                "key": "The main key of the object to be filtered."
            },
            "example": "uniqueObject(array, key)",
            "use": uniqueObject
        }
    },
    "last": "Brazil",
    "licence": "MIT",
    "madeBy": "KillovSky",
    "name": "Trendings",
    "usage": "info('place')"
};

/* Cria a exports para atuar como função */
exports.info = function (
    local = ""
) {

    /* Faz uma promise com a função para funcionar perfeitamente */
    return new Promise(function (resolve) {

        /* Cria a object de return em casos de erros, não afetando o usuário mas permitindo que ele saiba quando der erro */
        let response = default_trends[Math.floor(Math.random() * default_trends.length)];

        /* Cria a place */
        let place = false;

        /* Define os locais válidos */
        response.locales = regions.Array_List;

        /* Caso o local esteja OK */
        if (local !== "" || local !== null) {
            place = local.toLowerCase();
        }

        /* Corrige a local */
        if (place === "" || place === null) {
            place = regions.worldwide;
        } else if (!response.locales.includes(place)) {
            response.dev_msg = "Region not supported, check available regions in 'locales' key.";
            place = regions.worldwide;
        } else {
            place = regions[place];
        }

        /* Define o local na 'ambient' */
        Utilization.last = place;

        /* Opções de acesso */
        const options = {
            hostname: "trends24.in",
            method: "GET",
            path: place
        };

        /* Try - Catch para caso dê um erro pior */
        try {

            /* Let para obter a chunk da requisição */
            let data = "";

            /* Faz a requisição */
            const req = https.get(options, function (res) {

                /* Edita a object padrão de casos de erro */
                response.code = res.statusCode;
                response.explain = httpcodes[res.statusCode];
                response.headers = res.headers;

                /* Recebe a chunk */
                res.on("data", function (chunk) {
                    data += chunk;
                });

                /* Em caso de falhas */
                req.on("error", function (err) {
                    response.error = true;
                    response.code = err.code;
                    response.error_msg = err.message;
                    return resolve(response);
                });

                /* Finaliza pois o resultado foi completamente recebido */
                res.on("end", function () {

                    /* Formata a página usando as tags de HTML */
                    /* Dica: Evite fazer programas neste estilo, são confusos, complexos e não tem uma boa 'qualidade' */
                    const Trendings = [];

                    /* Extrai as informações do HTML usando regex */
                    /* Por que não usou cheerio? Por que este módulo visa ser totalmente livre do uso de módulos externos */
                    let body = data.match(/class=(.*?tweet-count)(.*?)(?=<\/a>)/g);

                    /* Edita as informações extraídas a ponto de poder editar com regex */
                    body = body.toString();
                    body = body.replace(/class=/gim, "\n");
                    body = body.replace("\",", "\n");
                    body = body.replace("</span", "\n");

                    /* Extrai somente as linhas com contagem de tweets */
                    body = body.match(/tweet-count.*$/gim);
                    body = body.filter((g) => g.includes("tweet-count"));

                    /* Formata todas as linhas recebidas acima */
                    body.forEach(function (tread) {
                        tread = tread.replace("target=", ", \"trend\": ");
                        tread = tread.replace("\">", "\", \"trend\": \"");
                        tread = tread.replace("\" \"tw\">", "\"");
                        tread = tread.replace(/,$/, "\" }");
                        tread = tread.replace(/^/, "{ \"");
                        tread = tread.replace("</span></li><li title=", ", \"trend\": ");
                        tread = tread.replace("t\">", "t\": \"");
                        tread = tread.replace("K, \"", "K\", \"");
                        tread = tread.replace("K</span></li><li", "K\"");
                        tread = tread.replace("tweet-count", "count");
                        tread = tread.replace("\"count>", "\"count\": \"");
                        tread = tread.replace("><a href=", ", \"url\": ");
                        tread = tread.replace("</span></li><li><a href=", ", \"url\": ");
                        Trendings.push(tread);
                    });

                    /* Zera a body para receber a nova Object */
                    body = [];

                    /* Transforma o HTML na Object, ignora se der erro, não afetando o funcionamento */
                    Trendings.map(function (g) {
                        try {
                            body.push(JSON.parse(g));
                        } catch (err) {
                            response.dev_msg = err.message;
                        }
                    });

                    /* Formata a Object para ter apenas resultados sem repetição */
                    body = uniqueObject(body, "trend");

                    /* Formata com encodeURI qualquer parâmetro ainda não formatado */
                    body.forEach(function (g) {
                        try {
                            g.trend = encodeURIComponent(g.trend);
                            g.count = encodeURIComponent(g.count);
                        } catch (err) {
                            response.dev_msg = err.message;
                        }
                    });

                    /* Formata as strings das keys, afim de evitar encode URI fora da URL */
                    body.forEach(function (g) {
                        try {
                            g.url = `https://twitter.com/search?q=${g.trend}`;
                            g.trend = decodeURIComponent(g.trend);
                            g.count = decodeURIComponent(g.count);
                        } catch (err) {
                            response.dev_msg = err.message;
                        }
                    });

                    /* Formata a Object de acordo com quantidade de tweets */
                    body = body.sort((a, b) => Number(b.count.replace(/[a-z]/gim, "")) - Number(a.count.replace(/[a-z]/gim, "")));

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
            req.on("error", function (err) {
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
exports.locales = () => regions.Array_List;

/* Retorna o JSON da regions */
exports.regions = () => regions;

/* Retorna o JSON da default */
exports.defaults = () => default_trends;

/* Retorna os códigos HTTP */
exports.http = () => httpcodes;

/* Retorna a package.json */
exports.packages = () => mopack;

/* Retorna a uniqueObject */
exports.ambient = () => Utilization;