# language: es
Característica:
  Como anfitrión
  Quiero poder aprobar una reserva
  Para recibir el pago del huésped

  Antecedentes:
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers
    Y que tengo una publicación con precio 1 eth
    Y que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'

  Escenario: Aprobación exitosa
    Cuando apruebo la reserva del usuario con email 'huesped@book.bnb'
    Entonces se emite un evento de aceptación de la reserva

  Escenario: Aprobación fallida - Anfitrión sin fondos
    Dado que me quedan 0 ethers en mi billetera
    Cuando apruebo la reserva del usuario con email 'huesped@book.bnb'
    Entonces se emite un evento de aprobación de reserva fallida

  Escenario: Aprobación fallida - Anfitrión con fondos insuficientes
    Dado que me quedan 0.0001 ethers en mi billetera
    Cuando apruebo la reserva del usuario con email 'huesped@book.bnb'
    Entonces se emite un evento de aprobación de reserva fallida

  @wip
  Escenario: Aprobación exitosa - Huesped sin fondos
    Dado que al usuario con email 'huesped@book.bnb' le quedan 0 ethers en su billetera
    Cuando apruebo la reserva del usuario con email 'huesped@book.bnb'
    Entonces se emite un evento de aceptación de la reserva
