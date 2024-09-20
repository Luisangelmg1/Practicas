function generarNumeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function busquedaLineal(estructura, valorABuscar) {
    const inicio = performance.now();
    for (let i = 0; i < estructura.length; i++) {
        if (estructura[i] === valorABuscar) {
            const fin = performance.now();
            return { posicion: i, tiempo: fin - inicio };
        }
    }
    const fin = performance.now();
    return { posicion: -1, tiempo: fin - inicio };
}

function busquedaBinariaIterativa(estructura, valorABuscar) {
    let inicio = performance.now();
    let min = 0;
    let max = estructura.length - 1;

    while (min <= max) {
        let mid = Math.floor((min + max) / 2);
        if (estructura[mid] === valorABuscar) {
            let fin = performance.now();
            return { posicion: mid, tiempo: fin - inicio };
        } else if (estructura[mid] < valorABuscar) {
            min = mid + 1;
        } else {
            max = mid - 1;
        }
    }
    let fin = performance.now();
    return { posicion: -1, tiempo: fin - inicio };
}

function busquedaBinariaRecursiva(estructura, valorABuscar, min, max, inicio) {
    if (min > max) {
        let fin = performance.now();
        return { posicion: -1, tiempo: fin - inicio };
    }

    let mid = Math.floor((min + max) / 2);

    if (estructura[mid] === valorABuscar) {
        let fin = performance.now();
        return { posicion: mid, tiempo: fin - inicio };
    } else if (estructura[mid] < valorABuscar) {
        return busquedaBinariaRecursiva(estructura, valorABuscar, mid + 1, max, inicio);
    } else {
        return busquedaBinariaRecursiva(estructura, valorABuscar, min, mid - 1, inicio);
    }
}

function realizarBusqueda(tipo) {
    const resultadosTabla = document.getElementById('resultadosTabla');
    if (resultadosTabla) resultadosTabla.innerHTML = '';  // Limpiar tabla

    const resultados = [];
    const tiemposEncontrados = [];
    const tiemposNoEncontrados = [];

    for (let prueba = 1; prueba <= 10; prueba++) {
        const estructura = [];
        for (let i = 0; i < 1000000; i++) {
            estructura.push(generarNumeroAleatorio(10000000, 100000000));
        }
        estructura.sort((a, b) => a - b);

        const valorMaximo = estructura.reduce((max, actual) => (actual > max ? actual : max), estructura[0]);
        const valorABuscar = Math.random() > 0.5 ? estructura[generarNumeroAleatorio(0, estructura.length - 1)] : generarNumeroAleatorio(10000000, 100000000);

        let resultadoBusqueda;
        if (tipo === 'lineal') {
            resultadoBusqueda = busquedaLineal(estructura, valorABuscar);
        } else if (tipo === 'binariaIterativa') {
            resultadoBusqueda = busquedaBinariaIterativa(estructura, valorABuscar);
        } else if (tipo === 'binariaRecursiva') {
            const inicioRecursiva = performance.now();
            resultadoBusqueda = busquedaBinariaRecursiva(estructura, valorABuscar, 0, estructura.length - 1, inicioRecursiva);
        }

        resultados.push({
            prueba: prueba,
            valorMaximo: valorMaximo,
            valorABuscar: valorABuscar,
            tiempoTomado: resultadoBusqueda.tiempo,
            posicion: resultadoBusqueda.posicion
        });

        if (resultadoBusqueda.posicion !== -1) {
            tiemposEncontrados.push(resultadoBusqueda.tiempo);
        } else {
            tiemposNoEncontrados.push(resultadoBusqueda.tiempo);
        }

        const row = `<tr>
            <td>${prueba}</td>
            <td>${valorMaximo}</td>
            <td>${valorABuscar}</td>
            <td>${resultadoBusqueda.tiempo.toFixed(2)}</td>
            <td>${resultadoBusqueda.posicion}</td>
        </tr>`;
        if (resultadosTabla) resultadosTabla.innerHTML += row;
    }

    graficarTiempos(tiemposEncontrados, tiemposNoEncontrados);
}

function graficarTiempos(tiemposEncontrados, tiemposNoEncontrados) {
    const ctx = document.getElementById('grafica').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Prueba 1', 'Prueba 2', 'Prueba 3', 'Prueba 4', 'Prueba 5', 'Prueba 6', 'Prueba 7', 'Prueba 8', 'Prueba 9', 'Prueba 10'],
            datasets: [
                {
                    label: 'Tiempos Encontrados (ms)',
                    data: tiemposEncontrados,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    borderWidth: 1
                },
                {
                    label: 'Tiempos No Encontrados (ms)',
                    data: tiemposNoEncontrados,
                    borderColor: 'rgba(192, 75, 75, 1)',
                    backgroundColor: 'rgba(192, 75, 75, 0.2)',
                    fill: true,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
