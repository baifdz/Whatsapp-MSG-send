async function enviarScript(scriptText) {
    // Limpia y divide el texto para saltos de linea
    const lines = scriptText
        .split(/[\n\t]+/)
        .map(line => line.trim())
        .filter(line => line);

    // Selector para el nuevo editor Lexical de WhatsApp Web
    const textarea = document.querySelector('div[contenteditable="true"][role="textbox"]') || 
                     document.querySelector('div[contenteditable="true"][data-lexical-editor="true"]');

    if (!textarea) throw new Error("No hay una conversación abierta o no se encontró el cuadro de texto.");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        console.log(`[${i + 1}/${lines.length}] Enviando:`, line);

        // 1. Enfoca el área y escribe el mensaje usando execCommand 
        textarea.focus();
        document.execCommand('insertText', false, line);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));

        // 2. Espera a que React actualice el DOM y cambie el botón de voz por el de enviar
        // (1 ms es insuficiente para el ciclo de renderizado; 250-300 ms es el tiempo adecuado)
        await new Promise(resolve => setTimeout(resolve, 200));

        // 3. Busca el botón de enviar (por etiqueta o por el ícono de envío interior)
        const sendButton = document.querySelector('button[aria-label="Enviar"]') || 
                           document.querySelector('button span[data-icon="send"]')?.closest('button');

        if (sendButton) {
            sendButton.click();
        } else {
            // Si por alguna razón no encuentra el botón, simula presionar la tecla Enter
            console.warn("No se encontró el botón de enviar, intentando enviar con Enter...");
            textarea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true
            }));
        }

        // 4. Espera antes de enviar el siguiente mensaje para evitar bloqueos de spam o desorden
        if (i !== lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 400));
        }
    }

    return lines.length;
}

// Ejecutar con texto de prueba
enviarScript(`
Hola 👋
Este es un mensaje automatizado enviado por JavaScript.
Línea 3 del mensaje.
`).then(e => console.log(`Código finalizado, ${e} mensajes enviados`)).catch(console.error);
