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
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
        
        form.append('userId', userId);
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
                const imageUrl = `/public/uploads/${fileName}`;

                console.log(imageUrl);
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

// Agregar el evento change al input de archivo
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    console.log('Evento de cambio ejecutado');
    const fileInput = event.target;
    const imagenPerfil = document.getElementById('imagenPerfil');

    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        form.append('archivo', file);

        // Realizar la carga del archivo al servidor
        fetch('http://localhost:3000/upload', {
            method: 'POST',
            mimeType: 'multipart/form-data',
            processData: false,
            contentType: false,
            data: form,
        })
        .then(response => response.text())
        .then(filename => {
            const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;
            form.append('userId', userId);
            // Actualizar la fuente de la imagen en el perfil
            imagenPerfil.src = `/public/uploads/${filename}`;
        })
        .catch(error => {
            console.error('Error al cargar el archivo:', error);
        });
    }
}


        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId;

        const rutaImagenUsuario = `/public/uploads/${userId}/${userId}.jpeg`;

// Verifica si la imagen específica para el usuario existe
verificarExistenciaDeImagen(rutaImagenUsuario)
    .then(existe => {
        // Si existe, utiliza la imagen específica para el usuario
        const rutaImagen = existe ? rutaImagenUsuario : '../..//images/perfil.webp';

        // Actualiza la ruta de la imagen en el elemento img
        document.getElementById('imagenPerfil').src = rutaImagen;
    });

// Función para obtener el ID del usuario (puedes ajustar esto según cómo obtengas el ID)
function obtenerIdDelUsuario() {
    // Puedes obtener el ID del usuario desde el backend, cookies, etc.
    // En este ejemplo, devolvemos un ID de usuario estático (debes ajustar esto según tu implementación)
    return 'idUsuarioEjemplo';
}

// Función para verificar la existencia de una imagen
async function verificarExistenciaDeImagen(rutaImagen) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(true); // La imagen existe
        img.onerror = () => resolve(false); // La imagen no existe
        img.src = rutaImagen;
    });
}