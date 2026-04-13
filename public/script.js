const socket = io();

const input = document.getElementById("text");
const btn = document.getElementById("btnEnviar");
const tela = document.querySelector(".telaDeConversa");
const listaUsuarios = document.getElementById("listaUsuarios");

const popup = document.getElementById("popupNome");
const nomeInput = document.getElementById("nomeInput");
const btnEntrar = document.getElementById("btnEntrar");
const digitandoEl = document.getElementById("digitando");

let timeout;
let nome = "";

// entrar no chat
btnEntrar.addEventListener("click", () => {
  if (nomeInput.value === "") return;

  nome = nomeInput.value;

  socket.emit("novoUsuario", nome);

  popup.style.display = "none";
});

// enviar mensagem
btn.addEventListener("click", enviarMensagem);

input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    enviarMensagem();
  }
});

function enviarMensagem() {
  const mensagem = input.value;

  if (mensagem === "") return;

  const agora = new Date();

  const hora =
    agora.getHours().toString().padStart(2, "0") +
    ":" +
    agora.getMinutes().toString().padStart(2, "0");

  socket.emit("chat message", {
    texto: mensagem,
    nome: nome,
    hora: hora,
    id: socket.id,
  });

  input.value = "";
}

// receber mensagem
socket.on("chat message", (dados) => {
  const msg = document.createElement("div");

  if (dados.id === socket.id) {
    msg.classList.add("mensagemEnviada");
  } else {
    msg.classList.add("mensagemRecebida");
  }

 msg.innerHTML = `
    <div style="font-size:14px">
        <strong>${dados.nome}</strong><br>
        ${dados.texto}
    </div>
    <div style="font-size:10px; text-align:right; color:gray">
        ${dados.hora}
    </div>`;

  tela.appendChild(msg);

  tela.scrollTop = tela.scrollHeight;

  const som = document.getElementById("somMensagem");

  if (dados.id !== socket.id) {
    som.play();
  }
});

// lista de usuarios
socket.on("listaUsuarios", (usuarios) => {
  listaUsuarios.innerHTML = "";

  usuarios.forEach((u) => {
    const li = document.createElement("li");

    li.textContent = u.nome;

    listaUsuarios.appendChild(li);
  });
});

// detectar digitação
input.addEventListener("input", () => {
  socket.emit("digitando", nome);

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    digitandoEl.textContent = "";
  }, 1000);
});

// receber aviso
socket.on("digitando", (nome) => {
  digitandoEl.textContent = nome + " está digitando...";

  setTimeout(() => {
    digitandoEl.textContent = "";
  }, 1000);
});
