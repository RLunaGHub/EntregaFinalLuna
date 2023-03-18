//Capturo los elementos del Html
let divTortas = document.getElementById("tortas");
let carritoCompra = document.getElementById("botonCarrito");
let offcanvasRender = document.getElementById("offcanvasBody")

//Carrito de productos vacio, para luego llenarlo

let carritoProductos = JSON.parse(localStorage.getItem("carrito")) || [];

//Funcion asincrona
//Creamos el div para mostrar las cards en el Html
const traerProductos = async() => {
    const response = await fetch("productos.json");
    const data = await response.json();
    
    for (let torta of data){
        let nuevaTortaDiv = document.createElement("div")
    nuevaTortaDiv.className = "col-12 col-md-6 col-lg-4 col-xl-2 my-3"
    nuevaTortaDiv.innerHTML = `
        <div id="${torta.id}" class="card" style="width: 18rem;">
            <img class="card-img-top img-fluid" style="height: 390px;"src="img/${torta.imagen}" alt="${torta.titulo} de ${torta.descripcion}">
            <div class="card-body">
                <h4 class="card-title">${torta.titulo}</h4>
                <p>Descripción: ${torta.descripcion}</p>
                <p class="">Precio: $${torta.precio}</p>
                <div class="d-grid gap-2">
                <button id="agregarBtn${torta.id}" class="btn btn-warning fs-5 fw-bolder text-dark">Agregar al carrito</button>
                </div>
            </div>
        </div> 
        `

        divTortas.append(nuevaTortaDiv);
        
        //Agregamos los productos al carrito mediante un boton de añadir
        let agregarBtn = document.getElementById(`${torta.id}`)
        
        agregarBtn.addEventListener("click", () =>{
            carritoProductos.push({
                id : torta.id,
                imagen : torta.imagen,
                titulo : torta.titulo,
                descripcion : torta.descripcion,
                precio : torta.precio
            })
            //Agrego Toastify como método de notificación.
            Toastify({
                text: `El producto ${torta.titulo} se agregó al carrito`,
                duration: 1500,
                newWindow: false,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                  background: "Green",
                  color: "#fff",
                },
              }).showToast();

              guardarProductos()
        })

    }

    //Guardamos los productos en el LocalStorage
    const guardarProductos = () => {
        carritoProductos.length > 0 && localStorage.setItem("carrito", JSON.stringify(carritoProductos))
      };
}

traerProductos();



//offcanvas de carrito

const mostrarCarrito = () => {
    offcanvasBody.innerHTML = "";
    carritoProductos.forEach((torta) => {
        let carritoContent = document.createElement("div")
        carritoContent.innerHTML = `
        <img src="img/${torta.imagen}">
        <h3>${torta.titulo}</h3>
        <p>$${torta.precio}</p>
        <button class="btnEliminar" id="btnEliminar">Eliminar</button>
        <hr>` 
        offcanvasBody.append(carritoContent) 


            let eliminarP = carritoContent.querySelector(".btnEliminar")

            eliminarP.addEventListener("click", () => {
                eliminarProducto(torta.id)
                Toastify({
                    text: `El producto ${torta.titulo} se eliminó del carrito`,
                    duration: 2000,
                    newWindow: false,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                      background: "red",
                      color: "white",
                    },
                  }).showToast();
            })

            
            
    })
        //calculamos el total de los productos usando Reduce
        const total = carritoProductos.reduce((acc, elemento) => acc + elemento.precio, 0);
    
        const totalCompra = document.createElement("div")
        totalCompra.className = "compraTotal"
        totalCompra.innerHTML = `Total a pagar: $${total}`
        offcanvasBody.append(totalCompra)
        
    
        const actions = document.createElement("div")
        actions.className = "botones"
        actions.innerHTML = `<div class="d-grid gap-2 d-md-block">
        <button id="finalizar" class="btn btn-primary" type="button">Comprar</button>
      </div>`
        offcanvasBody.append(actions)
    
        let compra = document.getElementById("finalizar")
        compra.addEventListener("click", (finalizarCompra) )
    
}

carritoCompra.addEventListener("click", (mostrarCarrito))

//Eliminamos un producto, quitándolo también del LocalStorage
const eliminarProducto = (id) => {
    const foundId = carritoProductos.find((data) => data.id === id);
  
    carritoProductos = carritoProductos.filter((carritoId) => {
      return carritoId !== foundId;
    });
    
    localStorage.setItem("carrito", JSON.stringify(carritoProductos))
    mostrarCarrito();
  };



  //finalizamos la compra

  function finalizarCompra(totalCompra)  {
    if(carritoProductos.length === 0){
        Swal.fire({
            title: 'Su carrito se encuentra vacío',
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          })          
    }else
    Swal.fire({
        title: '¿Desea finalizar su compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
    }).then( (result)=> {
            if(result.isConfirmed){
                Swal.fire({
                    title: 'Compra realizada',
                    icon: 'success',
                    confirmButtonColor: '#317f43',
                    text: `Gracias por su compra, vuelva pronto`,
                    })
                carritoProductos = []
                localStorage.removeItem("carrito")    
                offcanvasBody.innerHTML = `<h2>Muchas gracias por su compra, próximamente tendremos más delicias para que disfrute</h2>`;
            }else{
                Swal.fire({
                    title: 'Compra no efectuada',
                    icon: 'info',
                    text: `Compra no efectuada, tus productos seguiran en el carrito`,
                    confirmButtonColor: 'goldenrod',
                    timer:3500
                })
            }
    })

}