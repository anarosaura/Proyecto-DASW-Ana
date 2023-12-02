console.log("hola");

(function () {

    const $fileInput = $('#fileInput');
    const $imagenPerfil = $('#imagenPerfil');

    // Evento de cambio en el input de tipo archivo
    $fileInput.on('change', function () {
        const archivoSeleccionado = $fileInput[0].files[0];

        // Verifica si hay un archivo seleccionado antes de continuar con la lógica de subir la imagen
        if (!archivoSeleccionado) {
            alert('No has seleccionado ningún archivo.');
            return; // Salir del evento si no hay archivo seleccionado
        }

        // Continuar con la lógica de subir la imagen
        const form = new FormData();
        form.append('archivo', archivoSeleccionado);

        $.ajax({
            url: 'http://localhost:3000/upload',
            type: 'POST',
            mimeType: 'multipart/form-data',
            processData: false,
            contentType: false,
            data: form,
            success: (res) => {
                alert('Se subió el archivo.');
                console.log(res);
                const fileName = res;
                const imageUrl = `http://localhost:3000/uploads/${fileName}`;

                // Actualiza la ruta de la imagen en el elemento img
                $imagenPerfil.attr('src', imageUrl);
            },
            error: (err) => {
                console.log('Error: ', err);
                alert('Algo salió mal.');
            }
        });
    });

    // Evento de clic en la foto por defecto
    $imagenPerfil.on('click', function () {
        $fileInput.click();
    });

})();
