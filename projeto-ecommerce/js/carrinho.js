/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - pegar os botões de adicionar ao carrinho do html
    - adicionar um evento de escuta nos botões para disparar um evento de clique
    - pegar as informações do produto clicado e adicionar no localStorage
    - atualizar o contador do carrinho de compras
    - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho:
    - pegar botão de deletar do html
    - adicionar evento de escuta no botão para disparar um evento de clique
    - remover do localStorage
    - atualizar o html do carrinho, retirando o produto deletado
    - atualizar o valor total

Objetivo 3 - atualizar valores do carrinho:
    - pegar os inputs de quantidade do carrinho
    - adicionar evento de escuta nesses inputs
    - atualizar o valor total do produto
    - atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
//    - pegar os botões de adicionar ao carrinho do html
//    - adicionar um evento de escuta nos botões para disparar um evento de clique
//    - pegar as informações do produto clicado e adicionar no localStorage
//    - atualizar o contador do carrinho de compras
//    - renderizar a tabela do carrinho de compras

// OBJETIVO 1
// - pegar os botões de adicionar ao carrinho do html
const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');

// - adicionar um evento de escuta nos botões para disparar um evento de clique
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        // - pegar as informações do produto e adicionar no localStorage
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
        atualizarContadorDoCarrinho();
        renderizarTabelaDoCarrinho();
    });
});

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// - atualizar o contador do carrinho de compras
function atualizarContadorDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let totalDeProdutos = 0;

    produtos.forEach(produto => {
        totalDeProdutos += produto.quantidade;
    });

    document.getElementById('contador-carrinho').textContent = totalDeProdutos;
}

atualizarContadorDoCarrinho();

//  - renderizar a tabela do carrinho de compras
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');
    corpoTabela.innerHTML = ''; // Limpa o conteúdo atual da tabela

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="td-produto">
                            <img src="${produto.imagem}" 
                            alt="${produto.nome}"/>
                        </td>
                        <td>${produto.nome}</td>
                        <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
                        <td class="td-quantidade">
                            <input type="number" value="${produto.quantidade}" min="1" />
                        </td>
                        <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
                        <td><button class="btn-deletar" data-id="${produto.id}" id="deletar"></button></td>`;
        corpoTabela.appendChild(tr);
    });
}

renderizarTabelaDoCarrinho();