# Changelog

## [v1.0.4] - 22/07/2024

### Corrigido
- Corrigido erro na obtenção dos Trendings devido a mudanças na estrutura do site Trends 24 que afetaram a extração dos dados.

### Melhorias
- Inserção de JSDoc para documentação simples das funções.
- Reajuste dos arquivos JSON para melhor clareza e eficiência.
- Ajuste na documentação extra do módulo.
- Outras melhorias gerais de código para otimização, redução de complexidade e legibilidade.

## [v1.0.3] - 26/03/2023

### Adicionado
- Sistema de ambiente `in-memory` para permitir edição e injeção de função em tempo real.

### Melhorado
- Reduzido a quantidade de `RegExp` e demais códigos de `parse` para apenas 1 `match`.
- Resolvido problema com as trendings que não tinham contador de tweets.
- Resolvido problema do `JSON.parse` e demais funções.
- Incrementado os comentários de código para fins de aprendizado sobre o uso.
- Unificado os JSON's para reduzir seus tamanhos.
- Código recriado com base nas normas do `EsLint` com regras de `AirBNB`.

### Removido
- Códigos, arquivos e comentários antigos.
