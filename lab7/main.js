/* Carregar Produtos */

document.addEventListener("DOMContentLoaded", () => {

    // Carrego as categorias que estao disponiveis pela API
    fetch("https://deisishop.pythonanywhere.com/categories/")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao obter categorias da API");
      }
      return response.json();
    })
    .then(data => {
      categorias = data; // Guarda o array no variável global
      console.log("Categorias carregadas:", categorias);
    })
    .catch(err => {
      console.error("Erro:", err);
    });

    // Coloco as categorias no select "filtros"
    const select_filtros = document.getElementById("filtros");

    for (let c in categorias) {
        
    }


    // Carrego os produtos pela API

    // Adiciono os produto ao section "produtos"

    produtos.forEach(p => {

        const container = document.getElementById("produtos");

        // Criamos o article
        const article = document.createElement("article");

        // Criamos o titulo (h3)
        const h3 = document.createElement("h3");
        h3.textContent = p.title;

        // Criamos a imagem
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.title;

        // Criamos o custo <p>
        const preco = document.createElement("p");
        preco.classList.add("artigo_custo");
        preco.textContent = `Custo total: ${p.price.toFixed(2)} €`;

        // Criamos a descricao <p?
        const descricao = document.createElement("p");
        descricao.classList.add("artigo_descricao");
        descricao.textContent = p.description;

        // Cria o botão
        const btn = document.createElement("button");
        btn.textContent = "+ Adicionar ao cesto";

        // Quando o botão é clicado, chama a função adiciona(id)
        btn.addEventListener("click", () => adiciona(p.id));

        // Adicionamos elementos ao article
        article.appendChild(h3);
        article.appendChild(img);
        article.appendChild(preco);
        article.appendChild(descricao);
        article.appendChild(btn);
        
        // Adicionamos este article a seccao
        container.appendChild(article);
    });

});

function adiciona(id) {
    
}