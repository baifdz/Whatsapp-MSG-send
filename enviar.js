async function enviarScript(scriptText) {
    // Divide por saltos de línea reales y limpia espacios vacíos
    const lines = scriptText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    const main = document.querySelector("#main");
    const textarea = main?.querySelector('div[contenteditable="true"]');

    if (!textarea) throw new Error("No hay una conversación abierta");

    for (const line of lines) {
        console.log("Enviando:", line);

        textarea.focus();
        
        // REEMPLAZO DE EXECOMMAND: Inserta el texto directamente en el nodo de texto
        textarea.textContent = line;
        
        // Simula la escritura real para que la app detecte el texto introducido
        textarea.dispatchEvent(new InputEvent('input', { bubbles: true }));

        // Espera de seguridad (100ms mínimo recomendados para evitar bloqueos del navegador)
        await new Promise(resolve => setTimeout(resolve, 100));

        const sendButton = main.querySelector('span[data-icon="send"]') || main.querySelector('button[aria-label="Enviar"]');
        
        if (sendButton) {
            sendButton.click();
        } else {
            // Alternativa si el botón falla: Simular la tecla Enter
            textarea.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Enter',
                keyCode: 13,
                code: 'Enter',
                which: 13,
                bubbles: true
            }));
        }

        // Pausa entre mensajes para evitar baneos de spam o saturación del script
        await new Promise(resolve => setTimeout(resolve, 250));
    }

    return lines.length;
}

// Ejecución de prueba
enviarScript(`
Hola 👋
Este es un mensaje automatizado enviado por JavaScript.
Línea 3 del mensaje.
Última línea, ¡chau!
`).then(e => console.log(`Código finalizado, ${e} mensajes enviados`)).catch(console.error);
