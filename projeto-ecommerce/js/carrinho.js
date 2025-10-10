import { removerProdutoDoCarrinho, adicionarProdutoAoCarrinho, atualizarQuantidadeProduto, atualizarCarrinhoETabela } from './services/carrinhoService.js';
import { calcularFrete } from './services/freteService.js';
import { validarCep } from './utils/utils.js';

const SELECTORS = {
    htmlBotoesAdicionar: '.adicionar-ao-carrinho',
    htmlCorpoTabela: '#modal-1-content table tbody',
    htmlTotalCarrinho: '#total-carrinho',
    htmlBotaoCalcularFrete: '#btn-calcular-frete',
    htmlInputCep: '#input-cep',
    htmlErroCep: '.erro-cep',
};
const corpoTabela = document.querySelector(SELECTORS.htmlCorpoTabela);
const inputCep = document.querySelector(SELECTORS.htmlInputCep);
const btnCalcularFrete = document.querySelector(SELECTORS.htmlBotaoCalcularFrete);

document.querySelectorAll(SELECTORS.htmlBotoesAdicionar).forEach(botao => {
    botao.addEventListener('click', evento => {
        const elementoProduto = evento.target.closest('.produto');
        if (!elementoProduto) return;
        adicionarProdutoAoCarrinho(elementoProduto);
    });
});

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

inputCep.addEventListener("keydown", () => {
    if (event.key === "Enter") {
        btnCalcularFrete.click();
    }
});

btnCalcularFrete.addEventListener('click', async () => {
    const erroCep = document.querySelector(SELECTORS.htmlErroCep);

    const cep = inputCep.value.trim();

    if (!validarCep(cep)) {
        erroCep.textContent = "CEP inválido.";
        erroCep.style.display = "block";
        return
    } else {
        erroCep.style.display = "none";
    }

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

atualizarCarrinhoETabela();