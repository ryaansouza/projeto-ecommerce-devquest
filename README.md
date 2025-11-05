# E-commerce Master

Este é um projeto de e-commerce desenvolvido para estudos e demonstração de funcionalidades modernas de uma loja virtual.

## Funcionalidades
- Listagem de produtos (camisetas e canecas)
- Adição de produtos ao carrinho
- Remoção e alteração de quantidade de produtos no carrinho
- Modal de carrinho com tabela dinâmica
- Cálculo de frete via integração com n8n
- Layout responsivo para desktop e mobile
- Acessibilidade com atributos ARIA

## Estrutura do Projeto
```
index.html
assets/
  images/
css/
  base.css
  cabecalho.css
  modal-carrinho.css
  produtos.css
  reset.css
  rodape.css
js/
  carrinho.js
  medidas-produtos.json
  menu.js
  modal.js
  services/
    carrinhoService.js
    freteService.js
  utils/
    utils.js
```

## Como rodar o projeto
1. Clone este repositório
2. Abra o arquivo `index.html` em seu navegador
3. Adicione produtos ao carrinho e utilize o modal para visualizar e calcular o frete

## Detalhes Técnicos
- O cálculo de frete é feito via requisição POST para um endpoint n8n, enviando o CEP e as medidas dos produtos do carrinho
- As medidas dos produtos estão em `js/medidas-produtos.json` e são utilizadas dinamicamente
- O projeto utiliza apenas HTML, CSS e JavaScript puro

## Personalização
- Para adicionar novos produtos, edite o HTML e, se necessário, inclua as medidas no arquivo JSON
- Para alterar o endpoint do frete, modifique a URL em `carrinho.js`

## Créditos
- Projeto criado por Ryan Souza no curso DevQuest Starter com IA
- Ícones e imagens: Dev em Dobro

## Licença
Este projeto é apenas para fins educacionais e não possui licença comercial.
