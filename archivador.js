const fs = require("fs");

class Archivador {
    constructor(filename) {
        (this.filename = `${filename}.lmfao`), (this.mensajes = []);
    }

    async cargarMensajes() {
        try {
            console.log("Cargando mensajes...");
            const mensajesJson = await fs.promises.readFile(`./src/${this.filename}`, "utf-8");
            console.log(mensajesJson);
            this.mensajes = JSON.parse(mensajesJson);
            return mensajesJson;
        } catch (e) {
            console.log("Error leyendo el archivo, cargando mensajes", e);
        }
    }

    async guardarMensaje(mensaje) {
        try {
            this.mensajes.push(mensaje);
            console.log("Guardando datos en archivo...");
            await fs.promises.writeFile(`./src/${this.filename}`, JSON.stringify(this.mensajes));
        } catch (e) {
            console.log("Error guardando mensaje", e);
        }
    }

    async borrarMensajes() {
        try {
             await fs.promises.writeFile(`./src/${this.filename}`, '[]');
             console.log("Chat borrado");
        } catch (e) {
            console.log("Error borrando mensajes!", e);
        }
    }
}

module.exports = Archivador;
