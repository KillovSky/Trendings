/* Requires */
const fs = require('fs');
const path = require('path');
const https = require('https');

/* Definições padrão do código */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/* Realiza funções de pós finalização */
function postResults(response) {
    /* Verifica se pode resetar a envInfo */
    if ((envInfo.settings.finish.value === true)
        || (envInfo.settings.fail.value === true
            && response.error === true
        )
    ) {
        /* setTimeout para poder retornar */
        setTimeout(() => {
            /* Reseta a envInfo */
            envInfo.functions.reset.value();

            /* Reseta conforme o tempo */
        }, envInfo.settings.wait.value);
    }

    /* Retorna o resultado de uma função */
    return response;
}

/* Insere o erro na envInfo, não reseta pois o erro pode ser na envInfo */
function echoError(error) {
    /* Determina o erro */
    const myError = !(error instanceof Error) ? new Error(`Received a instance of '${typeof error}' in function 'fail', expected an instance of 'Error'.`) : error;

    /* Determina o sucesso */
    envInfo.results.value.nodeDetails.isError = true;

    /* Determina a falha */
    envInfo.results.value.nodeDetails.code = myError.code || '0';

    /* Determina a mensagem de erro */
    envInfo.results.value.nodeDetails.message = myError.message || 'The operation cannot be completed because an unexpected error occurred.';

    /* Define se pode printar erros */
    if (envInfo.settings.error.value === true) {
        /* Printa o erro usando cores */
        console.log('\x1b[31m', `[${path.basename(__dirname)} #${envInfo.parameters.code.value || 0}] →`, `\x1b[33m${envInfo.parameters.message.value}`);
    }

    /* Retorna o erro */
    return envInfo.results.value;
}

/* Função que retorna todo o arquivo */
const ambientDetails = () => envInfo;

/* Função que retorna a package.json */
const packageInfo = () => JSON.parse(fs.readFileSync(`${__dirname}/package.json`));

/* Cria uma função de busca usando os valores da envInfo como padrão */
function getTrendings(
    worldName = envInfo.functions.info.arguments.worldName.value,
) {
    /* Define o valor padrão com base na envInfo */
    const response = envInfo.parameters.stock.value;

    /* Faz uma promise, pois as versões antigas do node não tinham 'await/async' */
    return new Promise((resolve) => {
        /* Try - Catch para caso dê um erro pior */
        try {
            /* Caso seja o modo teste */
            if (worldName === 'TEST#TICKET' || worldName === '') {
                /* Retorna os dados padrão */
                resolve(response);

                /* Caso seja uso real */
            } else {
                /* Define o país padrão */
                let place = envInfo.parameters.alias.value.worldwide;

                /* Verifica se o enviado existe na envInfo */
                if (Object.keys(envInfo.parameters.alias.value).includes(worldName)) {
                    /* Define como o padrão */
                    place = envInfo.parameters.alias.value[worldName.toLowerCase()];
                } else {
                    /* Ajusta a mensagem dev */
                    response.dev_msg = "Region not supported, check available regions at 'locales' function.";
                }

                /* Define as opções do request */
                const options = {
                    hostname: 'trends24.in',
                    method: 'GET',
                    path: place,
                };

                /* Let para obter a chunk da requisição */
                let data = '';

                /* Define a requisição com os detalhes corretos */
                const req = https.get(options, (res) => {
                    /* Insere o código de status do request */
                    response.code = res.statusCode;

                    /* Insere a mensagem de status do request */
                    response.explain = envInfo.parameters.codes.value[res.statusCode];

                    /* Insere os headers */
                    response.headers = res.headers;

                    /* Ao receber a data */
                    res.on('data', (chunk) => {
                        /* Insere a chunk junto ao resto da data */
                        data += chunk;
                    });

                    /* Em caso de falhas */
                    req.on('error', (err) => {
                        /* Define como erro */
                        response.error = true;

                        /* Define o código do erro */
                        response.code = err.code;

                        /* Define a mensagem do erro */
                        response.error_msg = err.message;

                        /* Finaliza a função com o resolve */
                        resolve(postResults(response));
                    });

                    /* Ao receber todo o HTML */
                    res.on('end', () => {
                        /* Define a RegExp */
                        const parseRegExp = /<li><a href="(https:\/\/twitter.com\/search\?q=[^"]+)">([^<]+)<\/a>(?:<br><span class=tweet-count>(\d+)K<\/span>)?<\/li>/g;

                        /* Define os resultados do parse do HTML */
                        let result = [...data.matchAll(parseRegExp)];

                        /* Filtra apenas os resultados que sejam uma trending com URL */
                        result = result.filter((trends) => trends[1].includes('search'));

                        /* Ajusta os resultados para que os sem contadores tenham um valor de 0K */
                        result = result.map((trends) => ({ url: trends[1], trend: trends[2], count: trends[3] || '0' }));

                        /* Remove duplicados */
                        result = [...new Map(result.map((item) => [item.trend, item])).values()];

                        /* Remove os duplicados mantendo as Objects com maior valor */
                        result = result.reduce((acc, item) => {
                            /* Se não tiver ou se tiver mas for um de menos trends */
                            if (!acc[item.trend]
                                || parseInt(item.count, 10) > parseInt(acc[item.trend].count, 10)
                            ) {
                                /* Insere ou substitui pelo novo */
                                acc[item.trend] = item;
                            }

                            /* Retorna os valores */
                            return acc;

                            /* Envia uma Object vazia para ir preenchendo com reduce */
                        }, {});

                        /* Converte em uma Array de Objects */
                        result = Object.values(result);

                        /* Organiza por quantidade de trends feitas */
                        result = result.sort((a, b) => b.count - a.count);

                        /* Insere o 'K' dos counts */
                        result = result.map((trends) => ({ url: trends.url, trend: trends.trend, count: `${trends.count}K` }));

                        /* Define a resposta na envInfo */
                        response.tweet = result;

                        /* Insere a data do dia */
                        response.date = (new Date()).toLocaleString();

                        /* Finaliza o request e retorna o JSON */
                        resolve(postResults(response));
                    });
                });

                /* Em caso de falhas | Check 2 */
                req.on('error', (err) => {
                    /* Insere como erro */
                    response.error = true;

                    /* Insere o código do erro */
                    response.code = err.code;

                    /* Insere a mensagem do erro */
                    response.error_msg = err.message;

                    /* Retorna o resultado padrão final */
                    resolve(postResults(response));
                });

                /* Finaliza a requisição, se chegar aqui */
                req.end();
            }

            /* Caso der erro em alguma coisa, não afeta o resultado e cai no catch abaixo */
        } catch (error) {
            /* Define como erro */
            response.error = true;

            /* Define o código de erro (Node.js dessa vez) */
            response.code = error.code;

            /* Define a mensagem de erro (Node.js dessa vez) */
            response.error_msg = error.message;

            /* Retorna o resultado padrão, mas ainda tem chances de ser algo com defeito */
            resolve(postResults(response));
        }
    });
}

/* Faz a injeção das outras funções, não use com obj-in-obj a menos que realmente queira! */
function resetAmbient(
    changeKey = {},
) {
    /* Define o valor padrão */
    let exporting = {
        reset: resetAmbient,
    };

    /* Try-Catch para casos de erro */
    try {
        /* Define a envInfo padrão */
        envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

        /* Caso tenha enviado uma Object customizada */
        if (Object.keys(changeKey).length !== 0) {
            /* Faz a listagem das keys */
            Object.keys(changeKey).forEach((key) => {
                /* Edita se a key existir */
                if (Object.keys(envInfo).includes(key) && key !== 'developer') {
                    /* Baseado na enviada */
                    envInfo[key] = changeKey[key];
                }
            });
        }

        /* Insere a postResults na envInfo */
        envInfo.functions.dump.value = postResults;

        /* Insere a ambientDetails na envInfo */
        envInfo.functions.ambient.value = ambientDetails;

        /* Insere a echoError na envInfo */
        envInfo.functions.fail.value = echoError;

        /* Insere a resetAmbient na envInfo */
        envInfo.functions.reset.value = resetAmbient;

        /* Insere a getTrendings na envInfo */
        envInfo.functions.info.value = getTrendings;

        /* Insere a package.json na envInfo */
        envInfo.functions.packs.value = packageInfo;

        /* Define o local completo para usos externos */
        envInfo.parameters.location.value = __filename;

        /* Define o resultado padrão */
        envInfo.results.value = envInfo.parameters.stock.value;

        /* Define as funções do arquivo */
        module.exports = {
            [envInfo.exports.env]: envInfo.functions.ambient.value,
            [envInfo.exports.fail]: envInfo.functions.fail.value,
            [envInfo.exports.dump]: envInfo.functions.dump.value,
            [envInfo.exports.reset]: envInfo.functions.reset.value,
            [envInfo.exports.info]: envInfo.functions.info.value,
            [envInfo.exports.packs]: envInfo.functions.packs.value,
        };

        /* Define o valor retornado */
        exporting = module.exports;

        /* Caso de algum erro */
    } catch (error) {
        /* Insere tudo na envInfo */
        echoError(error);
    }

    /* Retorna o exports */
    return exporting;
}

/* Roda a injeção de funções a 1° vez */
resetAmbient();
