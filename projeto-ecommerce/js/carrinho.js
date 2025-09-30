/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - pegar os botões de adicionar ao carrinho do html
    - adicionar um evento de escuta nos botões para disparar um evento de clique
    - pegar as informações do produto clicado e adicionar no localStorage
    - atualizar o contador do carrinho de compras
    - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho:
    - pegar botão de deletar do html
    - adicionar evento de escuta no tbody para disparar um evento de clique quando clicado no botão de deletar (filho)
    - remover do localStorage
    - atualizar o html do carrinho, retirando o produto deletado

Objetivo 3 - atualizar valores do carrinho:
    - adicionar evento de escuta no input do tbody
    - atualizar o valor total do produto
    - atualizar o valor total do carrinho
*/


// Refatoração: organização em funções pequenas, nomes claros, early return, DRY, comentários explicativos

// Utiliza const para elementos que não mudam, e let apenas quando necessário
const SELECTORS = {
    botoesAdicionar: '.adicionar-ao-carrinho',
    contadorCarrinho: '#contador-carrinho',
    corpoTabela: '#modal-1-content table tbody',
    totalCarrinho: '#total-carrinho',
};

// Utiliza funções puras para manipulação do localStorage
function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}

// Atualiza o contador de produtos no carrinho
function atualizarContadorDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Refatoração: uso de reduce para somar quantidades
    const totalDeProdutos = produtos.reduce((total, produto) => total + produto.quantidade, 0);
    document.querySelector(SELECTORS.contadorCarrinho).textContent = totalDeProdutos;
}

// Renderiza a tabela do carrinho
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector(SELECTORS.corpoTabela);
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}"/>
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1" />
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
            <td><button class="btn-deletar" data-id="${produto.id}" id="deletar"></button></td>
        `;
        corpoTabela.appendChild(tr);
    });
}

// Atualiza o valor total do carrinho
function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Refatoração: uso de reduce para somar valores
    const valorTotal = produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
    document.querySelector(SELECTORS.totalCarrinho).textContent = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

// Atualiza todas as partes do carrinho
function atualizarCarrinhoETabela() {
    atualizarContadorDoCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

// Adiciona produto ao carrinho
function adicionarProdutoAoCarrinho(elementoProduto) {
    const produtoId = elementoProduto.dataset.id;
    const produtoNome = elementoProduto.querySelector('.nome').textContent;
    const produtoImagem = elementoProduto.querySelector('img').getAttribute('src');
    const produtoPreco = parseFloat(
        elementoProduto.querySelector('.preco').textContent
            .replace('R$ ', '')
            .replace('.', '')
            .replace(',', '.')
    );

    let carrinho = obterProdutosDoCarrinho();
    const produtoExistente = carrinho.find(produto => produto.id === produtoId);

    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: produtoId,
            nome: produtoNome,
            imagem: produtoImagem,
            preco: produtoPreco,
            quantidade: 1
        });
    }

    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Remove produto do carrinho
function removerProdutoDoCarrinho(id) {
    let carrinho = obterProdutosDoCarrinho();
    carrinho = carrinho.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// Atualiza quantidade de um produto
function atualizarQuantidadeProduto(id, novaQuantidade) {
    let carrinho = obterProdutosDoCarrinho();
    const produto = carrinho.find(produto => produto.id === id);
    if (!produto) return;
    produto.quantidade = novaQuantidade;
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

// EVENTOS

// Evento: adicionar ao carrinho
document.querySelectorAll(SELECTORS.botoesAdicionar).forEach(botao => {
    botao.addEventListener('click', evento => {
        const elementoProduto = evento.target.closest('.produto');
        if (!elementoProduto) return;
        adicionarProdutoAoCarrinho(elementoProduto);
    });
});

// Evento: remover produto ou atualizar quantidade
const corpoTabela = document.querySelector(SELECTORS.corpoTabela);
corpoTabela.addEventListener('click', evento => {
    if (evento.target.classList.contains('btn-deletar')) {
        removerProdutoDoCarrinho(evento.target.dataset.id);
    }
});

corpoTabela.addEventListener('input', evento => {
    if (evento.target.classList.contains('input-quantidade')) {
        const id = evento.target.dataset.id;
        let novaQuantidade = parseInt(evento.target.value, 10);
        if (isNaN(novaQuantidade) || novaQuantidade < 1) novaQuantidade = 1;
        atualizarQuantidadeProduto(id, novaQuantidade);
    }
});

// Inicialização
atualizarCarrinhoETabela();

// MELHORIAS:
// - Modularização: cada função tem uma responsabilidade clara.
// - Early return: evita execuções desnecessárias.
// - DRY: evita repetição de código.
// - Uso de reduce para somas, tornando o código mais limpo e performático.
// - Nomes de funções e variáveis mais claros e padronizados.
// - Comentários explicando cada melhoria.