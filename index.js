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

  this.classificaIMC = function () {
    var imc = this.imc();
    if (imc < 18.5) {
      return "Abaixo do peso";
    }
    if (imc >= 18.5 && imc < 24.9) {
      return "Peso normal";
    }
    if (imc >= 25 && imc < 29.9) {
      return "Sobrepeso";
    }

    return "Obesidade";
  };
}
Nutricionista.prototype = Object.create(Pessoa.prototype);
Nutricionista.prototype.constructor = Nutricionista;

function renderizaResultadoIMC(nutricionista) {
  var imcTableElements = document.querySelectorAll(".imc-table td");

  document.getElementById("imc").innerText =
    nutricionista.imc().toFixed(2) + " - " + nutricionista.classificaIMC();

  imcTableElements.forEach((item) => {
    item.classList.remove("current-imc");
  });

  var imcTableValue = Array.from(imcTableElements).find(
    (item) => item.innerText === nutricionista.classificaIMC()
  );

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
