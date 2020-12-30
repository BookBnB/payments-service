# language: es
Característica:
  Como huésped
  Quiero poder reservar un alojamiento
  Para poder alojarme en el mismo

  Antecedentes:
    Dado que el usuario con email 'anfitrion@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'anfitrion@book.bnb' tiene una publicación con precio 1 eth

  Escenario: Creación Exitosa
    Dado que soy un usuario con email 'huesped@book.bnb' con una billetera con 100 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de confirmación de la creación de la nueva reserva

  Escenario: Creación Fallida - Sin fondos
    Dado que soy un usuario con email 'huesped@book.bnb' con una billetera con 0 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva

  Escenario: Creación Fallida - Fondos insuficientes para la reserva
    Dado que soy un usuario con email 'huesped@book.bnb' con una billetera con 5 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva

  Escenario: Creación Fallida - Fondos suficientes para la reserva, pero insuficiente para la comisión
    Y que soy un usuario con email 'huesped@book.bnb' con una billetera con 9 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva

  Escenario: Creación Fallida - Cupo alcanzado
    Dado que soy un usuario con email 'huesped_sin_cupo@book.bnb' con una billetera con 100 ethers
    Y que el usuario con email 'huesped1@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped2@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped3@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped4@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped5@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped1@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped2@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped3@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped4@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped5@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva
