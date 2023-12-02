console.log("hola");

(function(){

    const $form = $('form').eq(0);
    
    const $photoContainer = $('#photoContainer');
    const $fileInput = $('#fileInput');
    const $button = $('#submit');

    // Evento de clic en la foto por defecto
    $photoContainer.on('click', function () {
        $fileInput.click();
    });

    // Evento de cambio en el input de tipo archivo
    $fileInput.on('change', function () {
        const archivoSeleccionado = $fileInput[0].files[0];
        $button.attr('disabled', !archivoSeleccionado);
    });

    $form.on('submit', (e) => {
        e.preventDefault();

        const archivoSeleccionado = $fileInput[0].files[0];
            
        if(archivoSeleccionado){
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
                    
                    // Actualiza la ruta de la imagen
                    $('#imagenPerfil').attr('src', imageUrl);
                },
                error: (err) => {
                    console.log('Error: ', err);
                    alert('Algo salió mal.');
                }
            }).then((res) => {
                
            })

        } else {
            alert('No has seleccionado ningún archivo.');
        }
        
    });
})();