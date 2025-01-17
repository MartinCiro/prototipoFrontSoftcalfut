export function insertHtml(html, nomId = null) {
    if (nomId === null) nomId = html

    fetch(`prototipoFrontSoftcalfut/components/${html}.html`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
            return response.text();
        })
        .then(data => {
            const element = document.getElementById(nomId);
            element ? element.innerHTML = data : null;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

export function actualizarModal(modal, titulo, texto, btnTexto) {
    // Definir valores predeterminados en caso de que falten
    let formattedText = '';
    const defaultTitle = "Titulo de la ventana";
    const defaultText = "Text ";
    const defaultBtnText = "Cerrar";

    // Usar los valores pasados o los valores por defecto
    const title = titulo || defaultTitle;
    const text = texto || defaultText;
    const btnText = btnTexto || defaultBtnText;

    // Obtener el contenido actual del modal y reemplazar los placeholders
    let modalContent = modal.innerHTML;

    formattedText = typeof text === 'string' && text.includes('\n') ? `<ul class="list-disc pl-5">${text.split('\n').map(line => `<li>${line}</li>`).join('')}</ul>` : `<p>${text}</p>`;

    formattedText = formattedText.replace(/<strong>(.*?)<\/strong>/g, (match) => match);
    modalContent = modalContent.replace('$TITULO$', title)
        .replace('$TEXTO$', formattedText)
        .replace('$BTN$', btnText);
    // Actualizar el contenido del modal
    modal.innerHTML = modalContent;

    // Re-agregar el evento de cierre después de actualizar el contenido
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function () {
            modal.classList.add('hidden');
        });
    });
}

export function openModal(trigger, modal) {
    trigger.addEventListener('click', function () {
        modal.classList.remove('hidden');
    });
}

export function closeModal(trigger, modal) {
    // Si trigger es un array (o NodeList), iteramos sobre él
    if (trigger instanceof NodeList || Array.isArray(trigger)) {
        trigger.forEach(button => {
            button.addEventListener('click', function () {
                modal.classList.add('hidden');
            });
        });
    } else if (trigger instanceof HTMLElement) {
        // Si es un único elemento
        trigger.addEventListener('click', function () {
            modal.classList.add('hidden');
        });
    }
}

export function handleModal({
    link, modal, closeModalButtons, contentIndex, contentModal, link2 = null
}) {
    if (link && modal && closeModalButtons.length > 0) {
        // Verificar si el modal ya está abierto
        if (!modal.classList.contains('hidden')) return;

        // Abrir el modal
        openModal(link, modal);
        if (link2) openModal(link2, modal);

        // Control de cierre con botones
        closeModal(closeModalButtons, modal);

        const closeOnClickOutside = (event) => {
            if (event.target === modal) {
                modal.classList.add('hidden');
                window.removeEventListener('click', closeOnClickOutside);
            }
        };
        window.addEventListener('click', closeOnClickOutside);

        if (contentModal && contentModal[contentIndex]) actualizarModal(modal, contentModal[contentIndex].title, contentModal[contentIndex].text, contentModal[contentIndex].btn);
    }
}

