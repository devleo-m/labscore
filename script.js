const getInput = async (title, inputLabel, failmsg, validator) =>
    Swal.fire({
      title,
      input: "text",
      inputLabel,
      showCancelButton: true,
      inputValidator: 
         (value) => {
            if (!value) return failmsg;
            if(validator) return validator(value);
          },
    });
  
  const obterDadosAluno = async () => {
    let nome = (
      await getInput("Qual o seu nome?", "Nome Completo", "Nome não informado!")
    )?.value;
    
    let idade = (
      await getInput(
        "Qual a sua idade?",
        "Idade",
        "Idade não informada!",
        (value) => {
          if (isNaN(value) || value < 0 || value > 140)
            return "Idade não é válida!";
        }
      )
    )?.value;
    
    let serie = (
      await getInput("Qual a sua série?", "Série", "Série não informada!")
    )?.value;
    let escola = (
      await getInput(
        "Qual o nome da sua escola?",
        "Nome da Escola",
        "Nome da escola não informada!"
      )
    )?.value;
    let materia = (
      await getInput(
        "Qual a sua matéria favorita?",
        "Matéria",
        "Matéria não informada!"
      )
    )?.value;
  
    if (!(nome || idade || serie || escola || materia)) return;
  
    Swal.fire({
      title: "Você confirma os dados informados?",
      showDenyButton: true,
      confirmButtonText: "Sim",
      denyButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Confirmado!", "", "success");
        document.getElementById("nome-aluno").innerHTML = nome ?? "Não informado";
        document.getElementById("idade-aluno").innerHTML = idade +" ano"+ (idade>1 ? "s" :"") ?? "Não informada";
        document.getElementById("serie-aluno").innerHTML = serie ?? "Não informada";
        document.getElementById("escola-aluno").innerHTML = escola ?? "Não informada";
        document.getElementById("materia-aluno").innerHTML = materia ?? "Não informada";
      } else if (result.isDenied) {
        Swal.fire("Os dados não foram confirmados.", "", "info");
      }
    });
  };
  
  // calcular a media das notas
  const calcularMedia = (notas) => {
    let soma = notas.reduce(
      (acumulador, valorAtual) => acumulador + valorAtual,
      0
    );
    if(soma == 0) return;
    return (soma / notas.length).toFixed(1);
  }
  
  // adicionar uma nova linha na tabela
  const adicionarMateria = async (event) => {
    event.preventDefault(); // Arruma o bug duplo ao executar a funcao
  
    let materia = (
      await getInput("Qual o nome da materia deseja adicionar?", "Matéria", "Matéria não informada!")
    )?.value;
    if(!materia) return;
  
    let notas = [];
    let nota;
    let i = 0;
  
    while (i < 4) {
      //nota = parseFloat(prompt(`digite a nota ${i + 1} da materia ${materia}:`));
      nota = (
          await getInput(`Digite a nota ${i + 1} da matéria ${materia}:`, "Nota", "Nota não informada!",(value) => {
              if (isNaN(value) || value < 0 || value > 10)
                return "Nota inválida! Insira um valor valido entre 0 e 10.";
            })
        )?.value
      if(!nota) continue;
      nota = parseFloat(nota.replace(",","."));
      notas.push(nota);
      i++;    
    }
  
    let media = calcularMedia(notas);
  
    let tbody = document.getElementById("tbody-notas");
    let htmlnotas = `<tr><th>${materia}</th>`;
    notas.forEach((nota) => htmlnotas += `<td>${nota.toFixed(1).toString().replace(".",",")}</td>`);
    htmlnotas += `<td>${media.toString().replace(".",",")}</td></tr>`;
  
    tbody.innerHTML += htmlnotas;
    // Atualiza a média geral
    atualizarMedias();
  }
  
  const atualizarMedias = () => {
    let todasNotas = [];
    let medias = document.querySelectorAll("#tbody-notas tr td:last-child");
    medias.forEach((td) => todasNotas.push(parseFloat(td.textContent)));
  
    let mediaGeral = calcularMedia(todasNotas)?.toString().replace(".",",");
    document.getElementById("media-geral").textContent = mediaGeral;
  
    let maiorMedia = Math.max(...todasNotas)?.toFixed(1).toString().replace(".",",");
    document.getElementById("maior-media").textContent = maiorMedia;
  }
  
  document
    .querySelector("#addLinha")
    .addEventListener("click", adicionarMateria);
  
  //window.onload = obterDadosAluno; // executa as perguntas ao carregar a pagina
  
  window.onload = () => {
    obterDadosAluno();
  };