if (!localStorage.getItem('itensCarrinho')) {
  localStorage.setItem('itensCarrinho', JSON.stringify([]));
}

const areaProdutos = document.querySelector('#produtos');
const areaCarrinho = document.querySelector('#itensCesto');
const totalElemento = document.querySelector('#precoTotal');

function renderCarrinho() {
  areaCarrinho.innerHTML = '';
  const itens = JSON.parse(localStorage.getItem('itensCarrinho')) || [];
  itens.forEach((produto, i) => {
    const card = criarItemCarrinho(produto, i);
    areaCarrinho.appendChild(card);
  });
  atualizarTotal();
}

function atualizarTotal() {
  const itens = JSON.parse(localStorage.getItem('itensCarrinho')) || [];
  const soma = itens.reduce((t, p) => t + p.price, 0);
  totalElemento.textContent = `Custo total: ${soma.toFixed(2)} €`;
}

function gerarProduto(produto) {
  const bloco = document.createElement('article');
  bloco.innerHTML = `
    <h3>${produto.title}</h3>
    <img src="${produto.image}" alt="${produto.title}">
    <p class="preco">Preço: ${produto.price} €</p>
    <p class="descricao">${produto.description}</p>
    <button type="button">Adicionar ao Cesto</button>
  `;
  bloco.querySelector('button').addEventListener('click', () => {
    const lista = JSON.parse(localStorage.getItem('itensCarrinho'));
    lista.push(produto);
    localStorage.setItem('itensCarrinho', JSON.stringify(lista));
    renderCarrinho();
  });
  return bloco;
}

function criarItemCarrinho(produto, indice) {
  const item = document.createElement('article');
  item.classList.add('produtoCesto');
  item.innerHTML = `
    <h3>${produto.title}</h3>
    <img src="${produto.image}" alt="${produto.title}">
    <p class="preco">Preço: ${produto.price} €</p>
    <button type="button">Remover</button>
  `;
  item.querySelector('button').addEventListener('click', () => {
    const lista = JSON.parse(localStorage.getItem('itensCarrinho'));
    lista.splice(indice, 1);
    localStorage.setItem('itensCarrinho', JSON.stringify(lista));
    renderCarrinho();
  });
  return item;
}

function mostrarProdutos(lista) {
  areaProdutos.innerHTML = '';
  lista.forEach(prod => {
    const artigo = gerarProduto(prod);
    areaProdutos.appendChild(artigo);
  });
}

function aplicarFiltros(produtos, categoria, termo, ordem) {
  let filtrados = [...produtos];
  if (categoria) filtrados = filtrados.filter(p => p.category === categoria);
  if (termo) filtrados = filtrados.filter(p => p.title.toLowerCase().includes(termo.toLowerCase()));
  if (ordem === 'asc') filtrados.sort((a, b) => a.price - b.price);
  if (ordem === 'desc') filtrados.sort((a, b) => b.price - a.price);
  mostrarProdutos(filtrados);
}

document.addEventListener('DOMContentLoaded', () => {
  const selCategoria = document.querySelector('#filtroCategoria');
  const selOrdenar = document.querySelector('#ordenarPreco');
  const campoPesquisa = document.querySelector('#inputPesquisa');
  let produtos = [];

  fetch('https://deisishop.pythonanywhere.com/categories')
    .then(r => r.json())
    .then(categorias => {
      categorias.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
        selCategoria.appendChild(opt);
      });
    });

  fetch('https://deisishop.pythonanywhere.com/products')
    .then(r => r.json())
    .then(data => {
      produtos = data;
      mostrarProdutos(produtos);
    });

  const filtrarTudo = () => {
    aplicarFiltros(
      produtos,
      selCategoria.value,
      campoPesquisa.value.trim(),
      selOrdenar.value
    );
  };

  selCategoria.addEventListener('change', filtrarTudo);
  selOrdenar.addEventListener('change', filtrarTudo);
  campoPesquisa.addEventListener('input', filtrarTudo);

  renderCarrinho();
});

const btnComprar = document.querySelector('#botaoComprar');
const chkEstudante = document.querySelector('#verificaEstudante');
const campoCupao = document.querySelector('#inputCupao');
const totalFinal = document.querySelector('#custoTotal');
const refPagamento = document.querySelector('#referencia');

btnComprar.addEventListener('click', () => {
  const itens = JSON.parse(localStorage.getItem('itensCarrinho'));
  const ids = itens.map(p => p.id);
  const payload = {
    products: ids,
    student: chkEstudante.checked,
    coupon: campoCupao.value.trim()
  };

  fetch('https://deisishop.pythonanywhere.com/buy/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(data => {
      totalFinal.textContent = `Valor final a pagar: ${data.totalCost} €`;
      refPagamento.textContent = `Referência de pagamento: ${data.reference}`;
    });
});