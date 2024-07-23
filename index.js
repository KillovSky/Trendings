/* eslint-disable max-len */

/* Requires */
const fs = require('fs');
const path = require('path');
const https = require('https');

/**
 * Informações de configuração para a execução da função, carregadas a partir de um arquivo JSON.
 * @type {Object}
 * @property {string} name - O nome do módulo.
 * @property {string} version - A versão atual do módulo.
 * @property {string} description - A descrição detalhada do módulo e sua funcionalidade.
 * @property {string} developer - O nome do desenvolvedor responsável pelo módulo.
 * @property {string} projects - O link para o repositório do projeto no GitHub.
 * @property {string} license - A licença sob a qual o módulo é distribuído.
 * @property {Object} usage - Informações sobre como utilizar o módulo.
 * @property {string} usage.general - Exemplo genérico de uso do módulo.
 * @property {string[]} usage.examples - Exemplos específicos de utilização do módulo.
 * @property {Object[]} helps - Orientações e dicas para utilizar o módulo de forma eficaz.
 * @property {Object} exports - Métodos e funcionalidades exportadas pelo módulo.
 * @property {Object} files - Arquivos relevantes associados ao módulo.
 * @property {Object} modules - Dependências externas necessárias para o funcionamento do módulo.
 * @property {Object} settings - Configurações e opções personalizáveis do módulo.
 * @property {Object} functions - Funções disponíveis para interação com o módulo.
 * @property {Object} parameters - Parâmetros e configurações adicionais para personalização do módulo.
 * @property {Object} results - Resultados e saídas esperadas da função do módulo.
 */
let envInfo = JSON.parse(fs.readFileSync(`${__dirname}/utils.json`));

/**
 * Realiza operações de pós-processamento e retorna os dados.
 * @param {Object} response - Objeto contendo os resultados da operação.
 * @returns {Object} O mesmo objeto de resposta recebido.
 */
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

/**
 * Registra um erro no objeto de informações na envInfo.
 * @param {Error} error - O erro a ser registrado.
 * @returns {Object} O objeto de erro formatado.
 */
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

/**
 * Retorna o objeto de informações do envInfo.
 * @returns {Object} O objeto de informações do ambiente.
 */
const ambientDetails = () => envInfo;

/**
 * Retorna o conteúdo do arquivo package.json.
 * @returns {Object} O conteúdo do arquivo package.json como objeto.
 */
const packageInfo = () => JSON.parse(fs.readFileSync(`${__dirname}/package.json`));

/**
 * Obtém os trending topics de um determinado país ou estado.
 * @param {string} [worldName=envInfo.functions.info.arguments.worldName.value] - Nome do local para obter os trendings.
 * @returns {Promise<Object>} Uma Promise que resolve com os resultados da busca de Trendings.
 */
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
                        const parseRegExp = /<a\s+href="([^"]+)"\s+class=trend-link>([^<]+)<\/a>(?:<span\s+class=tweet-count\s+data-count=(\d*)>([^<]*)<\/span>)?/gi;

                        /* Realiza o matchAll na string HTML */
                        let result = [...data.matchAll(parseRegExp)];

                        /* Mapeia os resultados para o formato desejado */
                        result = result.map((match) => ({
                            url: match[1],
                            trend: match[2],
                            count: match[4] || '0K',
                            countraw: match[3] || '0',
                        }));

                        /* Ordena os resultados por count (countraw) de forma decrescente */
                        result.sort((a, b) => parseInt(b.countraw, 10) - parseInt(a.countraw, 10));

                        /* Remove duplicados mantendo o de maior count */
                        result = Object.values(result.reduce((acc, item) => {
                            /* Se o valor do duplicado for maior que o original */
                            if (
                                !acc[item.trend]
                                || parseInt(acc[item.trend].countraw, 10) < parseInt(item.countraw, 10)
                            ) {
                                /* Seleciona ele como object correta */
                                acc[item.trend] = item;
                            }

                            /* Se não, retorna sem assimilar nada, mantendo o original */
                            return acc;

                            /* Inicializa com uma object vazia */
                        }, {}));

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

/**
 * Reinicia as informações do ambiente para o estado inicial e exporta de forma módular.
 * @param {Object} [changeKey={}] - Objeto opcional para alterar chaves específicas no ambiente.
 * @returns {Object} O objeto exportado com as funções atualizadas.
 */
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
