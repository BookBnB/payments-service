# language: es
Característica:
  Como anfitrión
  Quiero poder dar de alta una publicación de mi alojamiento
  Para que realicen reservas del mismo y poder cobrar su uso

  Antecedentes:
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers

  Escenario: Creación Exitosa
    Cuando creo una publicación con precio por noche 1.554 eth
    Entonces se emite un evento para la nueva publicación

  Escenario: Creación Fallida - Precio nulo
    Cuando creo una publicación con precio por noche 0 eth
    Entonces no se emite ningún evento
