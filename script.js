// Função para obter entrada do usuário usando SweetAlert
const getInput = async (title, inputLabel, failmsg, validator) => {
  return Swal.fire({
    title,
    input: "text",
    inputLabel,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) return failmsg;
      if (validator) return validator(value);
    },
  });
};

// Função para obter dados do aluno armazenados no localStorage e exibir na página
const obterDadosAluno = async () => {
  let formData = localStorage.getItem("formData");
  if (!formData) return;
  let objData = JSON.parse(formData);

  document.getElementById("nome-aluno").innerHTML = objData.nome ?? "Não informado";
  document.getElementById("idade-aluno").innerHTML = (objData.idade ? `${objData.idade} ano${objData.idade > 1 ? 's' : ''}` : "Não informada");
  document.getElementById("serie-aluno").innerHTML = objData.serie ?? "Não informada";
  document.getElementById("escola-aluno").innerHTML = objData.escola ?? "Não informada";
  document.getElementById("materia-aluno").innerHTML = objData.materia ?? "Não informada";
};

// Função para calcular a média das notas
const calcularMedia = (notas) => {
  let soma = notas.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
  if (soma == 0) return;
  return (soma / notas.length).toFixed(1);
};

// Função para adicionar uma nova matéria e suas notas
const adicionarMateria = async (event) => {
  event.preventDefault(); // Previne o comportamento padrão do formulário

  let materia = (await getInput("Qual o nome da matéria deseja adicionar?", "Matéria", "Matéria não informada!"))?.value;
  if (!materia) return;

  let storageNotas = JSON.parse(localStorage.getItem("notas")) || [];
  let notas = [];
  let i = 0;

  while (i < 4) {
    let nota = (await getInput(`Digite a nota ${i + 1} da matéria ${materia}:`, "Nota", "Nota não informada!", (value) => {
      if (isNaN(value) || value < 0 || value > 10) return "Nota inválida! Insira um valor válido entre 0 e 10.";
    }))?.value;
    if (!nota) continue;
    nota = parseFloat(nota.replace(",", "."));
    notas.push(nota);
    i++;
  }

  storageNotas.push({ nome: materia, notas });
  localStorage.setItem("notas", JSON.stringify(storageNotas));

  updateGrade(); // Atualiza a tabela de notas
  atualizarMedias(); // Atualiza a média geral
};

// Função para atualizar as médias gerais e a maior média
const atualizarMedias = () => {
  let storageData = JSON.parse(localStorage.getItem("notas")) || [];
  let todasNotas = storageData.map((item) => parseFloat(calcularMedia(item.notas)));
  let mediaGeral = calcularMedia(todasNotas)?.toString().replace(".", ",");
  document.getElementById("media-geral").textContent = mediaGeral;

  let maiorMedia = Math.max(...todasNotas)?.toFixed(1).toString().replace(".", ",");
  document.getElementById("maior-media").textContent = maiorMedia;
};

// Função para adicionar uma linha na tabela com as notas da matéria
const setGrade = (item) => {
  let media = calcularMedia(item.notas);

  let tbody = document.getElementById("tbody-notas");
  let htmlNotas = `<tr><th>${item.nome}</th>`;
  item.notas.forEach((nota) => {
    htmlNotas += `<td>${nota.toFixed(1).toString().replace(".", ",")}</td>`;
  });
  htmlNotas += `<td>${media.toString().replace(".", ",")}</td></tr>`;

  tbody.innerHTML += htmlNotas;
};

// Função para atualizar a tabela de notas
const updateGrade = () => {
  document.getElementById("tbody-notas").innerHTML = "";
  let storageNotas = JSON.parse(localStorage.getItem("notas")) || [];
  storageNotas.forEach((item) => setGrade(item));
};

// Função para inicializar a tabela com uma matéria padrão
const initGrades = () => {
  let gradeArray = [{ nome: "Matemática", notas: [7.5, 8, 6, 9] }];
  localStorage.setItem("notas", JSON.stringify(gradeArray));
  gradeArray.forEach((item) => setGrade(item));
};

// Função para buscar e exibir a lista de alunos
const getAlunos = () => {
  const url = "http://localhost:3000/alunos";
  fetch(url)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("Ocorreu um erro ao consultar os Alunos");
    })
    .then((data) => {
      let alunosField = document.getElementById("lista-alunos");
      alunosField.innerHTML = "";
      data.forEach((aluno) => {
        alunosField.innerHTML += `<li>${aluno.nome}</li>`;
      });
    })
    .catch((error) => {
      if (error.message !== "Failed to fetch") {
        Swal.fire(error.message, "", "error");
      }
    });
};

// Adiciona o evento de clique ao botão para adicionar uma nova matéria
document.querySelector("#addLinha").addEventListener("click", adicionarMateria);

// Inicializa a aplicação ao carregar a página
window.onload = () => {
  initGrades();
  obterDadosAluno();
  getAlunos();
};
