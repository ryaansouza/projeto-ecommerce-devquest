// Função para enviar POST ao n8n com async/await
const SELECTORS = {
    htmlBotoesAdicionar: '.adicionar-ao-carrinho',
    htmlContadorCarrinho: '#contador-carrinho',
    htmlCorpoTabela: '#modal-1-content table tbody',
    htmlTotalCarrinho: '#total-carrinho',
    htmlSubTotalPedidos: '#subtotal-pedidos .valor',
    htmlBotaoCalcularFrete: '#btn-calcular-frete',
    htmlInputCep: '#input-cep',
    htmlErroCep: '.erro-cep',
};

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}

function atualizarContadorDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const totalDeProdutos = produtos.reduce((total, produto) => total + produto.quantidade, 0);
    document.querySelector(SELECTORS.htmlContadorCarrinho).textContent = totalDeProdutos;
}

function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector(SELECTORS.htmlCorpoTabela);
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
    document.querySelector(SELECTORS.htmlTotalCarrinho).textContent = `Total: R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
    document.querySelector(SELECTORS.htmlSubTotalPedidos).textContent = ` R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
}

function atualizarCarrinhoETabela() {
    atualizarContadorDoCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalDoCarrinho();
}

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

function removerProdutoDoCarrinho(id) {
    let carrinho = obterProdutosDoCarrinho();
    carrinho = carrinho.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

function atualizarQuantidadeProduto(id, novaQuantidade) {
    let carrinho = obterProdutosDoCarrinho();
    const produto = carrinho.find(produto => produto.id === id);
    if (!produto) return;
    produto.quantidade = novaQuantidade;
    salvarProdutosNoCarrinho(carrinho);
    atualizarCarrinhoETabela();
}

function validarCep(cep) {
    const regexCep = /^[0-9]{5}-?[0-9]{3}$/;
    return regexCep.test(cep);
}

async function calcularFrete(cep) {
    btnCalcularFrete.disabled = true;
    const textoOriginalDoBotaoDeFrete = btnCalcularFrete.textContent;
    btnCalcularFrete.textContent = "Calculando frete...";


    const url = 'https://ryansouza.app.n8n.cloud/webhook/f2ce82e6-9767-49eb-812e-086e735c09fe';
    try {
        const medidasResponse = await fetch('./js/medidas-produtos.json');
        const medidas = await medidasResponse.json();

        const produtos = obterProdutosDoCarrinho();
        const products = produtos.map(produto => {
            const medida = medidas.find(medida => medida.id === produto.id);
            return {
                quantity: produto.quantidade,
                height: medida ? medida.height : 0,
                length: medida ? medida.length : 0,
                width: medida ? medida.width : 0,
                weight: medida ? medida.weight : 0,
            };
        });

        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cep, products })
        });

        if (!resposta.ok) throw new Error('Erro ao calcular frete');
        const resultado = await resposta.json();
        console.log(resultado);
        console.log(resultado.price);
        return resultado.price;

    } catch (error) {
        console.error('Erro ao calcular frete:', error);
        return null;
    } finally {
        btnCalcularFrete.disabled = false;
        btnCalcularFrete.textContent = textoOriginalDoBotaoDeFrete;
    }
}

// EVENTOS

document.querySelectorAll(SELECTORS.htmlBotoesAdicionar).forEach(botao => {
    botao.addEventListener('click', evento => {
        const elementoProduto = evento.target.closest('.produto');
        if (!elementoProduto) return;
        adicionarProdutoAoCarrinho(elementoProduto);
    });
});


const corpoTabela = document.querySelector(SELECTORS.htmlCorpoTabela);
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

const inputCep = document.querySelector(SELECTORS.htmlInputCep);
inputCep.addEventListener("keydown", () => {
    if(event.key === "Enter") {
        btnCalcularFrete.click();
    }
});

const btnCalcularFrete = document.querySelector(SELECTORS.htmlBotaoCalcularFrete);
btnCalcularFrete.addEventListener('click', async () => {
    const erroCep = document.querySelector(SELECTORS.htmlErroCep);

    const cep = inputCep.value.trim();

    if(!validarCep(cep)){
        erroCep.textContent = "CEP inválido.";
        erroCep.style.display = "block";
        return
    }
    erroCep.style.display = "none";

    const valorFrete = await calcularFrete(cep);
    const precoFreteFormatado = valorFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	document.querySelector("#valor-frete .valor").textContent = precoFreteFormatado;
	document.querySelector("#valor-frete").style.display = "flex";

    const totalCarrinhoElemento = document.querySelector(SELECTORS.htmlTotalCarrinho);
	const valorTotalCarrinho = parseFloat(totalCarrinhoElemento.textContent.replace("Total: R$ ", "").replace('.', ',').replace(',', '.'));

    const totalComFrete = valorTotalCarrinho + valorFrete;
	const totalComFreteFormatado = totalComFrete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
	totalCarrinhoElemento.textContent = `Total: R$ ${totalComFreteFormatado}`;
});

// Inicialização
atualizarCarrinhoETabela();