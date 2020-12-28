# language: es
Característica:
  Como anfitrión
  Quiero poder dar de alta una publicación de mi alojamiento
  Para que realicen reservas del mismo y poder cobrar su uso

  Escenario: Creación Exitosa
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers
    Cuando creo una publicación con precio por noche 1.554 eth
    Entonces se emite un evento de confirmación de la nueva publicación

  Escenario: Creación Fallida - Precio nulo
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers
    Cuando creo una publicación con precio por noche 0 eth
    Entonces se emite un evento de rechazo de la publicación

  Escenario: Creación Fallida - Sin fondos
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 0 ethers
    Cuando creo una publicación con precio por noche 1 eth
    Entonces se emite un evento de rechazo de la publicación

  Escenario: Creación Fallida - Fondos insuficientes
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 0.0001 ethers
    Cuando creo una publicación con precio por noche 1 eth
    Entonces se emite un evento de rechazo de la publicación
