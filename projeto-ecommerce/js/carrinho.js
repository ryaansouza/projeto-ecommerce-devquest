/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
//     - atualizar o contador
//     - adicionar o produto no localStorage
//     - atualizar a tabela HTML do carrinho

//      Parte 1 - atualizar o contador
//         - selecionar os botões de adicionar ao carrinho
const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

//         - adicionar um evento de escuta nesses botões
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        // -- pegar as informações do produto e adicionar no localStorage
        const elementoProduto = evento.target.closest('.produto');
        const produtoId = elementoProduto.dataset.id;
        const produtoNome = elementoProduto.querySelector('.nome').textContent;
        const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
        const produtoPreco = parseFloat(elementoProduto.querySelector('.preco').textContent.replace("R$ ", "").replace(".", "").replace(",", "."));

        //buscar a lista de produtos do localStorage
        const carrinho = obterProdutosDoCarrinho();
        //testar se o produto ja existe no carrinho
        const existeProduto = carrinho.find(produto => produto.id === produtoId);
        if (existeProduto) {
            existeProduto.quantidade += 1;
        } else {
            const produto = {
                id: produtoId,
                nome: produtoNome,
                imagem: produtoImagem,
                preco: produtoPreco,
                quantidade: 1
            };
            carrinho.push(produto);
        }

        salvarProdutosNoCarrinho(carrinho);
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}