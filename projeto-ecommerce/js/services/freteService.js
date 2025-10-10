import { obterProdutosDoCarrinho } from "./carrinhoService.js";

export async function calcularFrete(cep) {
    const btnCalcularFrete = document.querySelector('#btn-calcular-frete');
    
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