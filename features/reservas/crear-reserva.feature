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

  Escenario: Creación fallida - Sin fondos
    Dado que soy un usuario con email 'huesped@book.bnb' con una billetera con 0 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva

  Escenario: Creación fallida - Fondos insuficientes
    Dado que soy un usuario con email 'huesped@book.bnb' con una billetera con 0.5 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva

  Escenario: Creación fallida - Fondos insuficientes por comisión
    Dado que soy un usuario con email 'huesped@book.bnb' con una billetera con 1 ethers
    Cuando creo una reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de rechazo de la reserva

  Escenario: Creación fallida - Cupo alcanzado
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

