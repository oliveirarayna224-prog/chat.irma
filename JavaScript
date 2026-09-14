import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Cole aqui a configuração do seu Firebase:
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const messagesDiv = document.getElementById("messages");

// Nome do usuário (você pode mudar no seu ou no dela)
const user = prompt("Qual o seu nome?") || "Anônimo";

// Função para enviar mensagem ao Firebase
async function sendMessage() {
  const text = messageInput.value.trim();
  if (text === "") return;

  await addDoc(collection(db, "chat_messages"), {
    text: text,
    user: user,
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// "Escuta" as novas mensagens no Firebase em tempo real
const q = query(collection(db, "chat_messages"), orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
  messagesDiv.innerHTML = "";
  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const msgEl = document.createElement("div");
    msgEl.classList.add("message");
    
    if (data.user === user) {
      msgEl.classList.add("sent");
    } else {
      msgEl.classList.add("received");
    }

    msgEl.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    messagesDiv.appendChild(msgEl);
  });
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
