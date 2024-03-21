//       ---------- PREENCHIMENTO AUTOMÁTICO - API - CEP ----------

document.getElementById('CEP').addEventListener('change', function () {
    var cep = this.value.replace(/\D/g, '');
    if (cep.length !== 8) {
        alert('CEP inválido. Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    fetch('https://viacep.com.br/ws/' + cep + '/json/')
        .then(response => response.json())
        .then(data => {
            if (data.erro) {
                alert('CEP não encontrado. Por favor, verifique o CEP digitado.');
                return;
            }
            document.getElementById('Endereco').value = `${data.logradouro}, ${data.bairro}, ${data.localidade}, ${data.uf}`;
        })
        .catch(error => console.error('Erro ao obter o endereço:', error));
});

//   ---------- VALOR UNI X QUANTIDADE ESTOQUE = VALOR TOTAL ----------

function calcularValorTotal(numeroProduto) {
    var estoque = parseFloat(document.getElementById(`Estoque${numeroProduto}`).value) || 0;
    var valorUnitario = parseFloat(document.getElementById(`ValorUni${numeroProduto}`).value) || 0;
    var valorTotal = estoque * valorUnitario;
    document.getElementById(`ValorTotal${numeroProduto}`).value = `R$ ${valorTotal.toFixed(2)}`;
}



// ---------- Array para armazenar os documentos ----------

let documentos = [];

//  ---------- Função para incluir anexo ----------

function incluirAnexo() {
    const numDocumentos = documentos.length + 1;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.name = 'file';
    fileInput.accept = '.pdf, .doc, .docx';

    const deleteIcon = document.createElement('i');
    deleteIcon.className = 'fas fa-trash-alt';
    deleteIcon.onclick = () => excluirDocumento(numDocumentos);

    const viewIcon = document.createElement('i');
    viewIcon.className = 'fas fa-eye';
    viewIcon.onclick = () => visualizarDocumento(numDocumentos);

    const label = document.createElement('label');
    label.htmlFor = `file${numDocumentos}`;
    label.textContent = `Documento Anexo ${numDocumentos}`;

    const br = document.createElement('br');

    const container = document.createElement('div');
    container.className = 'file-container';
    container.appendChild(deleteIcon);
    container.appendChild(viewIcon);
    container.appendChild(fileInput);
    container.appendChild(label);
    container.appendChild(br);

    documentos.push(fileInput);
    document.getElementById('documentos').appendChild(container);
}

//  ---------- Função para excluir documento ----------

function excluirDocumento(index) {
    documentos.splice(index - 1, 1);
    atualizarListaDocumentos();
}

//  ---------- Função para visualizar documento ----------

function visualizarDocumento(index) {
    const file = documentos[index - 1].files[0];
    if (file) {
        const blobURL = URL.createObjectURL(file);
        window.open(blobURL);
    }
}

//  ---------- Função para atualizar a lista de documentos ----------

function atualizarListaDocumentos() {
    const documentosContainer = document.getElementById('documentos');
    documentosContainer.innerHTML = '';
    documentos.forEach((fileInput, index) => {
        const numDocumentos = index + 1;
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash-alt';
        deleteIcon.onclick = () => excluirDocumento(numDocumentos);

        const viewIcon = document.createElement('i');
        viewIcon.className = 'fas fa-eye';
        viewIcon.onclick = () => visualizarDocumento(numDocumentos);

        const label = document.createElement('label');
        label.htmlFor = `file${numDocumentos}`;
        label.textContent = `Documento Anexo ${numDocumentos}`;

        const br = document.createElement('br');

        const container = document.createElement('div');
        container.className = 'file-container';
        container.appendChild(deleteIcon);
        container.appendChild(viewIcon);
        container.appendChild(fileInput);
        container.appendChild(label);
        container.appendChild(br);

        documentosContainer.appendChild(container);
    });
}

//  ---------- Manipular o envio do formulário ----------

document.getElementById('formEnviar').addEventListener('submit', function (event) {
    event.preventDefault();
    // Enviar os documentos armazenados conforme necessário
    console.log('Documentos a serem enviados:', documentos);
});

let numProdutos = 1;

function adicionarProduto() {
    numProdutos++;

    const novoProdutoHTML = `
    <fieldset class="prod" id="produto${numProdutos}">
      <legend class="legend">Produto - ${numProdutos}</legend>

      <div class="form-content">
        <label for="Produto${numProdutos}">Produto</label>
        <input type="text" id="Produto${numProdutos}" required />
      </div>

      <div class="form-content">
        <label for="UndMed${numProdutos}">UND. Medida</label>
        <select id="UndMed${numProdutos}" required>
          <option value="Kg">Kg</option>
          <option value="g">g</option>
        </select>
      </div>

      <div class="form-content">
        <label for="Estoque${numProdutos}">QTDE. Em Estoque</label>
        <input type="number" id="Estoque${numProdutos}" oninput="calcularValorTotal(${numProdutos})" required />
      </div>

      <div class="form-content">
        <label for="ValorUni${numProdutos}">Valor Unitário</label>
        <input type="number" id="ValorUni${numProdutos}" oninput="calcularValorTotal(${numProdutos})" required />
      </div>

      <div class="form-content">
        <label for="ValorTotal${numProdutos}">Valor Total</label>
        <input class="inputTotal" type="text" id="ValorTotal${numProdutos}" readonly required />
      </div>
    </fieldset>
  `;

    const form = document.getElementById('form');

    // Inserir o novo produto antes do formulário
    form.parentNode.insertBefore(document.createRange().createContextualFragment(novoProdutoHTML), form);
}

function excluirProduto(numeroProduto) {
    const produtoParaExcluir = document.getElementById(`produto${numeroProduto}`);
    if (produtoParaExcluir) {
        produtoParaExcluir.parentNode.removeChild(produtoParaExcluir);
    } else {
        console.error(`Produto ${numeroProduto} não encontrado.`);
    }
}

//  ---------- Função para abrir o Modal de Loading ----------

function abrirModalLoading() {
    const modal = document.getElementById('modalLoading');
    modal.style.display = 'block';
}

//  ---------- Função para fechar o Modal de Loading ----------

function fecharModalLoading() {
    const modal = document.getElementById('modalLoading');
    modal.style.display = 'none';
}

//  ---------- Função para formatar os dados do formulário em JSON ----------

function formatarDadosParaJSON() {
    const fornecedor = {
      razaoSocial: document.getElementById('RazaoSocial').value,
      nomeFantasia: document.getElementById('NomeFantasia').value,
      cnpj: document.getElementById('CNPJ').value,
      inscricaoEstadual: document.getElementById('InscricaoEstadual').value,
      inscricaoMunicipal: document.getElementById('InscricaoMunicipal').value,
      nomeContato: document.getElementById('PessoaContato').value,
      telefoneContato: document.getElementById('Telefone').value,
      emailContato: document.getElementById('Email').value,
      produtos: [],
      anexos: [] // Se desejar, adicione o suporte para anexos aqui
    };

    const produtosFieldset = document.getElementById('produtosFieldset');
    const produtosInputs = produtosFieldset.querySelectorAll('.prod');

    produtosInputs.forEach((produtoInput, index) => {
        const produto = {
            indice: index + 1, // Índice baseado em 1
            descricaoProduto: produtoInput.querySelector('input[id^="Produto"]').value,
            unidadeMedida: produtoInput.querySelector('select[id^="UndMed"]').value,
            qtdeEstoque: produtoInput.querySelector('input[id^="Estoque"]').value,
            valorUnitario: produtoInput.querySelector('input[id^="ValorUni"]').value,
            valorTotal: produtoInput.querySelector('input[id^="ValorTotal"]').value
        };
        fornecedor.produtos.push(produto);
    });

    return JSON.stringify(fornecedor, null, 2);
}

// Função para lidar com o envio do formulário
function enviarFormulario(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Abre o modal de loading
    abrirModalLoading();

    // Simula um tempo de espera para o envio dos dados (2 segundos)
    setTimeout(() => {
        // Fecha o modal de loading
        fecharModalLoading();

        // Formata os dados em JSON
        const dadosJSON = formatarDadosParaJSON();
        console.log('JSON formatado:', dadosJSON); // Exibe o JSON no console

        // Implemente a lógica para enviar os dados para o servidor aqui

        // Você pode realizar o envio dos dados para o servidor utilizando fetch(), XMLHttpRequest(), ou outra abordagem de sua preferência
    }, 2000); // 2 segundos de espera simulada
}

// Event listener para o formulário de envio
const formEnviar = document.getElementById('formEnviar');
formEnviar.addEventListener('submit', enviarFormulario);














