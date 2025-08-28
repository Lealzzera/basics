function Pessoa(altura, peso) {
  if (!altura || !peso) {
    throw new Error("Altura e peso são obrigatórios");
  }

  this.altura = altura;
  this.peso = peso;
}

function Nutricionista(altura, peso) {
  Pessoa.call(this, altura, peso);
  this.imc = function () {
    return this.peso / (this.altura * this.altura);
  };

  this.classificaIMC = async function () {
    console.log(altura, peso);
    var response = await fetch("http://localhost:3000/imc/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        height: altura,
        weight: peso,
      }),
    });
    var resJson = await response.json();

    return resJson.imcDescription;
  };
}
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

async function renderizaResultadoIMC(nutricionista) {
  var imcTableElements = document.querySelectorAll(".imc-table td");
  var resultadoImc = await nutricionista.classificaIMC();

  document.getElementById("imc").innerText =
    nutricionista.imc().toFixed(2) + " - " + resultadoImc;

  imcTableElements.forEach((item) => {
    item.classList.remove("current-imc");
  });

  var imcTableValue = Array.from(imcTableElements).find((item) => {
    return item.innerText.toLowerCase() === resultadoImc.toLowerCase();
  });

  imcTableValue.classList.add("current-imc");
  imcTableValue.nextElementSibling.classList.add("current-imc");
}

function actionCalcularIMCBuilder() {
  var alturaEl = document.getElementById("altura");
  var pesoEl = document.getElementById("peso");

  return function actionCalcularIMC(evt) {
    evt.preventDefault();

    var nutricionista = new Nutricionista(
      parseFloat(alturaEl.value),
      parseFloat(pesoEl.value)
    );
    console.log(Nutricionista.prototype.constructor);
    console.log(nutricionista instanceof Pessoa);

    renderizaResultadoIMC(nutricionista);
  };
}

window.onload = function () {
  document
    .getElementById("calcular")
    .addEventListener("click", actionCalcularIMCBuilder());
};
