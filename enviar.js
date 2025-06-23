async function enviarScript(scriptText) {
    // Limpia y divide el texto en líneas válidas
    const lines = scriptText
        .split(/[\n\t]+/)
        .map(line => line.trim())
        .filter(line => line);

    // Selecciona el área principal del chat y el campo de texto
    const main = document.querySelector("#main");
    const textarea = main?.querySelector('div[contenteditable="true"]');

    if (!textarea) throw new Error("No hay una conversacion abierta");

    for (const line of lines) {
        console.log("Enviando:", line);

        // Escribe el mensaje
        textarea.focus();
        document.execCommand('insertText', false, line);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        // Espera un poco y envía el mensaje
        await new Promise(resolve => setTimeout(() => {
            const sendButton = main.querySelector('button[aria-label="Enviar"]');
            if (sendButton) {
                sendButton.click();
            } else {
                console.warn("No se encontró el botón de enviar");
            }
            resolve();
        }, 1));//Espera 1 milisegundos (0.001s) antes de hacer clic en el botón de enviar (antes 100)

        // Espera antes de enviar el siguiente mensaje (excepto el último)
        if (lines.indexOf(line) !== lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1));// espera 1 milisegundos (0.001s) antes de pasar al siguiente mensaje. (antes 250)
        }
    }

    return lines.length;
}

// Ejecutar con texto de prueba
enviarScript(`
Hola 👋
Este es un mensaje automatizado enviado por JavaScript.
Línea 3 del mensaje.
Última línea, ¡chau!
`).then(e => console.log(`Código finalizado, ${e} mensajes enviados`)).catch(console.error);
