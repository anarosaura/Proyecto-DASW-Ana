$(document).ready(function () {
    const $fileInput = $('#fileInput');
    const $imagenPerfil = $('#imagenPerfil');
    const $contenedorRecorte = $('#contenedorRecorte');
    const $confirmarRecorteBtn = $('#confirmarRecorte');

    let cropper;

    $fileInput.on('change', function () {
        const archivoSeleccionado = $fileInput[0].files[0];

        if (!archivoSeleccionado) {
            alert('No has seleccionado ningún archivo.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function (e) {
            if (cropper) {
                cropper.destroy();
            }

            $contenedorRecorte.empty().append(
                '<img id="imagenRecortada" src="' + e.target.result + '">' +
                '<button id="confirmarRecorte">Confirmar Recorte</button>'
            );

            const $imagenRecortada = $('#imagenRecortada');
            $imagenRecortada.one('load', function () {
                cropper = new Cropper($imagenRecortada[0], {
                    aspectRatio: 1,
                    viewMode: 1,
                });

                // Mostrar el contenedor de recorte al iniciar el recorte
                $contenedorRecorte.show();

                // Asignar el evento de clic al botón de confirmación después de iniciar el recorte
                $('#confirmarRecorte').on('click', function () {
                    if (cropper) {
                        const croppedCanvas = cropper.getCroppedCanvas();
                        const croppedBlob = croppedCanvas.toDataURL('image/jpeg').split(',')[1];
                        const formData = new FormData();
                        formData.append('croppedImage', croppedBlob);

                        // Enviar la imagen recortada al servidor
                        $.ajax({
                            url: 'http://localhost:3000/upload',
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: (res) => {
                                alert('Se subió el archivo.');
                                console.log(res);

                                // Puedes manejar la respuesta del servidor aquí si es necesario
                            },
                            error: (err) => {
                                console.log('Error: ', err);
                                alert('Algo salió mal.');
                            }
                        });

                        cropper.destroy();

                        // Ocultar el contenedor de recorte y el botón de confirmación después de establecer la nueva imagen
                        $contenedorRecorte.hide();
                    } else {
                        alert('No se ha seleccionado ninguna imagen para recortar.');
                    }

                    $contenedorRecorte.empty();
                });
            });
        };

        reader.readAsDataURL(archivoSeleccionado);
    });

    $imagenPerfil.on('click', function () {
        $fileInput.click();
    });
});
