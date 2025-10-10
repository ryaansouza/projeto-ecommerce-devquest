export function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}

export function removerProdutoDoCarrinho(id) {
    let carrinho = obterProdutosDoCarrinho();
    carrinho = carrinho.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

export function adicionarProdutoAoCarrinho(elementoProduto) {
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

export function atualizarQuantidadeProduto(id, novaQuantidade) {
    let carrinho = obterProdutosDoCarrinho();
    const produto = carrinho.find(produto => produto.id === id);
    if (!produto) return;
    produto.quantidade = novaQuantidade;
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

export function atualizarCarrinhoETabela() {
    atualizarContadorDoCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarContadorDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const totalDeProdutos = produtos.reduce((total, produto) => total + produto.quantidade, 0);
    document.querySelector('#contador-carrinho').textContent = totalDeProdutos;
}

function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');
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

function atualizarValorTotalDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const valorTotal = produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
    document.querySelector('#total-carrinho').textContent = `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    document.querySelector('#subtotal-pedidos .valor').textContent = ` R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}