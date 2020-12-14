# language: es
Característica:
    Como anfitrion
    Quiero poder dar de alta una publicacion de mi alojamiento
    Para que realicen reservas del mismo y poder cobrar su uso

    Antecedentes:
        Dado que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una billetera con 100 ethers
    
    Escenario: Creación Exitosa
        Cuando creo una publicacion con precio por noche 1.554 eth
        Entonces se emite un evento para la nueva publicacion

    Escenario: Creación Fallida - Precio nulo
        Cuando creo una publicacion con precio por noche 0 eth
        Entonces no se emite ningún evento
