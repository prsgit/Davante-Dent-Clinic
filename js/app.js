class Cita {
    constructor(id, dia, mes, anio, hora, minuto, fechaCompleta, nombre, apellidos, dni, telefono, fechaNacimiento, observaciones){

        this.id = id;
        this.dia = dia;
        this.mes = mes;
        this.anio = anio;
        this.hora = hora;
        this.minuto = minuto;
        this.fechaCompleta = fechaCompleta;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.dni = dni;
        this.telefono = telefono;
        this.fechaNacimiento = fechaNacimiento;
        this.observaciones = observaciones;

    }
}

// Lee las citas del localStorage
function obtenerCitas() {
    const datos = localStorage.getItem("davante_citas");
    return datos ? JSON.parse(datos) : [];  
}

// Guardar las citas en localStorage
function guardarCitas(lista) {
    localStorage.setItem("davante_citas", JSON.stringify(lista));
}

// Agrega las citas guardadas a la tabla de lista_citas.html
function agregarCitaATabla(cita, numero) {
    const tablaBody = document.getElementById("tabla-body");
    if (!tablaBody) return; // si no existe por lo que sea, sale de la función y no hace nada.

    // Crea fila
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${numero}</td>
        <td>${cita.dia}/${cita.mes}/${cita.anio} ${cita.hora}:${cita.minuto}</td>
        <td>${cita.nombre} ${cita.apellidos}</td>
        <td>${cita.dni}</td>
        <td>${cita.telefono}</td>
        <td>${cita.fechaNacimiento}</td>
        <td>${cita.observaciones}</td>
        <td>
            <button class="btn-accion btn-eliminar" data-id="${cita.id}">Eliminar</button>
            <button class="btn-accion btn-modificar" data-id="${cita.id}">Modificar</button>
        </td>
    `;

    tablaBody.appendChild(fila);
}


function eliminarCita(id) {
    // Obtiene todas las citas
    let citas = obtenerCitas();

    // Filtra para crear un nuevo array con todas las citas menos la que tiene ese id, y guarda ese nuevo array en citas
    citas = citas.filter(cita => cita.id != id);

    // Guarda el array actualizado. Sobrescribe en localStorage la lista de citas, pero ahora sin la cita eliminada
    guardarCitas(citas);

    // Actualiza la tabla visualmente
    eliminarFilaDeTabla(id);
}

function eliminarFilaDeTabla(id) {
    const boton = document.querySelector(`button[data-id="${id}"]`);
    if (!boton) return;

    const fila = boton.closest("tr");
    fila.remove();
}

function volverAlIndex() {
    localStorage.removeItem("cita_en_edicion");
    window.location.href = "lista_citas.html";
}


function marcarError(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    campo.classList.add("error");

    const texto = document.createElement("div");
    texto.classList.add("mensaje-error");
    texto.textContent = mensaje;

    campo.insertAdjacentElement("afterend", texto);
}


function manejarEnvioFormulario(e){

    e.preventDefault();

    const idEditar = localStorage.getItem("cita_en_edicion");


    // lee los valores del formulario
    const dia = document.getElementById("dia").value;
    const mes = document.getElementById("mes").value;
    const anio = document.getElementById("anio").value;
    const hora = document.getElementById("hora").value;
    const minuto = document.getElementById("minuto").value;    
    const nombre = document.getElementById("nombre").value;    
    const apellidos = document.getElementById("apellidos").value;    
    const dni = document.getElementById("dni").value;    
    const telefono = document.getElementById("telefono").value;    
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;    
    const observaciones = document.getElementById("observaciones").value;

    // validaciones
    let hayErrores = false; // sirve para saber si hay errores

    // borrar errores anteriores
    document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    document.querySelectorAll(".mensaje-error").forEach(el => el.remove());

    // VALIDAR DÍA VACÍO
    if (dia.trim() === "") {
        marcarError("dia", "El día es obligatorio");
        hayErrores = true;
    }

    // VALIDAR MES VACÍO
    if (mes.trim() === "") {
        marcarError("mes", "El mes es obligatorio");
        hayErrores = true;
    }

    // VALIDAR AÑO VACÍO
    if (anio.trim() === "") {
        marcarError("anio", "El año es obligatorio");
        hayErrores = true;
    }

    // VALIDAR QUE EL DÍA SEA UN NÚMERO ENTRE 1 Y 31
    if (dia !== "" && (isNaN(dia) || dia < 1 || dia > 31)) {
        marcarError("dia", "El día debe estar entre 1 y 31");
        hayErrores = true;
    }

    // VALIDAR QUE EL MES SEA UN NÚMERO ENTRE 1 Y 12
    if (mes !== "" && (isNaN(mes) || mes < 1 || mes > 12)) {
        marcarError("mes", "El mes debe estar entre 1 y 12");
        hayErrores = true;
    }

    // VALIDAR QUE EL AÑO SEA UN NÚMERO RAZONABLE
    if (anio !== "" && (isNaN(anio) || anio < 1900 || anio > 2100)) {
        marcarError("anio", "El año debe estar entre 1900 y 2100");
        hayErrores = true;
    }


    // VALIDAR FECHA REAL
    if (dia && mes && anio) {

        const fecha = new Date(anio, mes - 1, dia);

        // Si JS corrige la fecha → no es válida
        if (
            fecha.getFullYear() != anio ||
            fecha.getMonth() != (mes - 1) ||
            fecha.getDate() != dia
        ) {
            marcarError("dia", "La fecha no existe");
            hayErrores = true;
        }
    }


    // VALIDAR HORA VACÍA
    if (hora.trim() === "") {
        marcarError("hora", "La hora es obligatoria");
        hayErrores = true;
    }

    // VALIDAR MINUTO VACÍO
    if (minuto.trim() === "") {
        marcarError("minuto", "El minuto es obligatorio");
        hayErrores = true;
    }

    // VALIDAR HORA ENTRE 0 Y 23
    if (hora !== "" && (isNaN(hora) || hora < 0 || hora > 23)) {
        marcarError("hora", "La hora debe estar entre 0 y 23");
        hayErrores = true;
    }

    // VALIDAR MINUTO ENTRE 0 Y 59
    if (minuto !== "" && (isNaN(minuto) || minuto < 0 || minuto > 59)) {
        marcarError("minuto", "El minuto debe estar entre 0 y 59");
        hayErrores = true;
    }


    // VALIDAR NOMBRE VACÍO
    if (nombre.trim() === "") {
        marcarError("nombre", "El nombre es obligatorio");
        hayErrores = true;
    }

    // VALIDAR APELLIDOS VACÍO
    if (apellidos.trim() === "") {
        marcarError("apellidos", "Los apellidos son obligatorios");
        hayErrores = true;
    }

    // VALIDAR DNI VACÍO
    if (dni.trim() === "") {
        marcarError("dni", "El DNI es obligatorio");
        hayErrores = true;
    }

    // VALIDAR TELÉFONO VACÍO
    if (telefono.trim() === "") {
        marcarError("telefono", "El teléfono es obligatorio");
        hayErrores = true;
    } 
    // VALIDAR QUE SOLO TENGA NÚMEROS
    else if (!/^[0-9]+$/.test(telefono.trim())) {
        marcarError("telefono", "El teléfono solo puede contener números");
        hayErrores = true;
    }

    // VALIDAR FECHA DE NACIMIENTO VACÍA
    if (fechaNacimiento.trim() === "") {
        marcarError("fechaNacimiento", "La fecha de nacimiento es obligatoria");
        hayErrores = true;
    }


    if (hayErrores) {
        return; // detenemos sin guardar
    }


    // modo EDITAR una cita
    if (idEditar) {

        let citas = obtenerCitas();

        const indice = citas.findIndex(c => c.id == idEditar);

        if (indice !== -1) {

        // Actualiza los valores
            citas[indice].dia = dia;
            citas[indice].mes = mes;
            citas[indice].anio = anio;

            citas[indice].hora = hora;
            citas[indice].minuto = minuto;

            citas[indice].nombre = nombre;
            citas[indice].apellidos = apellidos;

            citas[indice].dni = dni;
            citas[indice].telefono = telefono;

            citas[indice].fechaNacimiento = fechaNacimiento;
            citas[indice].observaciones = observaciones;

            // Guarda cambios
            guardarCitas(citas);

            // Dejamos de estar en modo edición
            localStorage.removeItem("cita_en_edicion");

            // Volvemos a la lista
            window.location.href = "lista_citas.html";
            return; // IMPORTANTE
        }
    }

    // modo CREAR una cita
    const id = Date.now(); // id único 

    // construye la fecha completa
    const fechaCompleta = `${anio}-${mes.padStart(2,'0')}-${dia.padStart(2,'0')}T${hora.padStart(2,'0')}:${minuto.padStart(2,'0')}`;

    // crea una nueva cita
    const nuevaCita = new Cita(id, dia, mes, anio, hora, minuto, fechaCompleta, nombre, apellidos, dni, telefono, fechaNacimiento, observaciones);

    console.log("Cita creada:", nuevaCita);

    // guarda la cita en localStorage
    const citas = obtenerCitas(); // obtiene las citas que ya existen
    citas.push(nuevaCita);  // añade la nueva cita
    guardarCitas(citas); // guarda todo
    alert("La cita se ha guardado correctamente");
    e.target.reset();  // limpia el formulario para poder crear otra cita


    console.log("Guardado en localStorage:", citas);

}


// Esperar a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("form-cita");

    if (form) {
        form.addEventListener("submit", manejarEnvioFormulario);
    }

    // tabla de lista_citas.html
    const tablaBody = document.getElementById("tabla-body");

    if (tablaBody) {
       
        const citas = obtenerCitas();
        console.log("Citas cargadas desde localStorage:", citas);

        // Si no hay citas — se queda "dato vacío"
        if (citas.length === 0) return;

        // Si hay citas — quita la fila "dato vacío"
        const filaVacia = document.querySelector(".fila-vacia");
        if (filaVacia) filaVacia.remove();

        // Añadir cada cita
        citas.forEach((cita, index) => {
            agregarCitaATabla(cita, index + 1);
        });
    }


    document.addEventListener("click", (evento) => {
        // eliminar cita
        if (evento.target.classList.contains("btn-eliminar")) {
            const id = evento.target.dataset.id;
            
            const confirmar = confirm("¿Seguro que quieres eliminar esta cita?");

            if (confirmar) {
                eliminarCita(id);
            }

            return;

        }

        // modificar cita
        if (evento.target.classList.contains("btn-modificar")) {
        const id = evento.target.dataset.id;

        // Guarda el id de la cita que se quiere editar
        localStorage.setItem("cita_en_edicion", id);

        // Redirige al formulario
        window.location.href = "nueva_cita.html";
    }

    });

    const idEditar = localStorage.getItem("cita_en_edicion");

    if (idEditar) {

    const citas = obtenerCitas(); // todas las citas

    // Buscar la cita por su id
    const cita = citas.find(c => c.id == idEditar);

    if (cita) {
        // Rellenamos el formulario
        document.getElementById("dia").value = cita.dia;
        document.getElementById("mes").value = cita.mes;
        document.getElementById("anio").value = cita.anio;

        document.getElementById("hora").value = cita.hora;
        document.getElementById("minuto").value = cita.minuto;

        document.getElementById("nombre").value = cita.nombre;
        document.getElementById("apellidos").value = cita.apellidos;

        document.getElementById("dni").value = cita.dni;
        document.getElementById("telefono").value = cita.telefono;

        document.getElementById("fechaNacimiento").value = cita.fechaNacimiento;

        document.getElementById("observaciones").value = cita.observaciones;
    }

    }

});


