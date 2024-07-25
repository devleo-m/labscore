// Seleciona o formulário de cadastro
const form = document.getElementsByClassName("fCadastro")[0];

// Adiciona um ouvinte de evento para o envio do formulário
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita o comportamento padrão de envio do formulário
    
    // Converte os dados do formulário em um objeto JSON
    const formEntries = new FormData(e.target).entries();
    const json = Object.assign(...Array.from(formEntries, ([key, value]) => ({ [key]: value })));
    
    // Adiciona os valores de cidade, UF e rua ao objeto JSON
    json["cidade"] = document.getElementById('fCadastroCidade').value;
    json["uf"] = document.getElementById('fCadastroUf').value;
    json["rua"] = document.getElementById('fCadastroRua').value;
    
    // Armazena os dados no localStorage
    localStorage.setItem('formData', JSON.stringify(json));
    
    // Redireciona para a página inicial
    window.location.href = "index.html";
});

// Seleciona o campo de input do CEP
const cepInput = document.getElementsByClassName("cepinput")[0];

// Adiciona um ouvinte de evento para aplicar a máscara de CEP ao digitar
cepInput.addEventListener("keyup", (e) => {
    e.preventDefault();
    e.target.value = cepMask(e.target.value);
});

// Adiciona um ouvinte de evento para buscar o CEP ao perder o foco do campo
cepInput.addEventListener("blur", (e) => {
    e.preventDefault();
    pesquisacep(e.target.value);
});

// Função para aplicar a máscara de CEP
const cepMask = (value) => {
    return !value ? "" : value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
};

// Função para buscar informações do CEP na API
const pesquisacep = (valor) => {
    // Remove caracteres não numéricos
    var cep = valor.replace(/\D/g, '');
    if (!cep) return; // Se o CEP estiver vazio, não faz nada
    
    // Valida o formato do CEP
    var validacep = /^[0-9]{8}$/;
    if (!validacep.test(cep)) {
        alert("Formato de CEP inválido.");
        return;
    }

    // Define a URL da API para buscar o CEP
    let url = 'https://viacep.com.br/ws/' + cep + '/json/';

    // Faz a requisição para a API
    fetch(url)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Ocorreu um erro ao consultar o CEP');
        })
        .then((data) => {
            // Preenche os campos de cidade, UF e rua com os dados retornados pela API
            document.getElementById('fCadastroCidade').value = data.localidade;
            document.getElementById('fCadastroUf').value = data.uf;
            document.getElementById('fCadastroRua').value = data.logradouro;
        })
        .catch((error) => {
            // Exibe uma mensagem de erro usando SweetAlert
            Swal.fire(error.message, "", "error");
        });
};
