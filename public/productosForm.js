const socket = io();

const agregar = document.getElementById("agregar");

const title = document.getElementById("title");
const price = document.getElementById("price");
const thumbnail = document.getElementById("thumbnail");

const mensajeForm = document.getElementById("mensaje-form");
const tabla = document.getElementById("tabla");

const mail = document.getElementById("mail");
const mensajeChat = document.getElementById("mensaje-chat");
const enviar = document.getElementById("enviar");
const chat = document.getElementById("chat");

agregar.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("productoAgregado", {
        title: title.value,
        price: price.value,
        thumbnail: thumbnail.value,
    });
});

mail.addEventListener("change", (e) => {
    if (!mail.value || mail.value.trim() == "") {
        // console.log(mail.value, true)
        enviar.setAttribute("disabled", true);
    } else {
        // console.log(mail.value, false)
        enviar.removeAttribute("disabled");
    }
});

enviar.addEventListener("click", (e) => {
    e.preventDefault();
    const d = new Date();
    const timestamp = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    // console.log(timestamp);
    socket.emit("mensajeEnviado", {
        mail: mail.value,
        timestamp: timestamp,
        message: mensajeChat.value
    });
    mensajeChat.value = '';
});

socket.on('chatRefresh', (mensaje) => {
    chat.innerHTML += `<p>
    <strong style="color: #77f">${mensaje.mail}</strong>
    | ${mensaje.timestamp} :
    <em style="color: green">${mensaje.message}</em>
</p>`;
})

socket.on("productosRefresh", (productos) => {
    mensajeForm.innerText = "";
    let tablaInfo = tabla.lastElementChild.innerHTML;
    const producto = productos[productos.length - 1];
    tablaInfo += `
                    <tr>
                        <td>${producto.title}</td>
                        <td>${producto.price}</td>
                        <td><img src='${producto.thumbnail}' /></td>
                    </tr>`;
    tabla.lastElementChild.innerHTML = tablaInfo;
});

socket.on("productoInvalido", (e) => {
    mensajeForm.innerText = e.error;
});
