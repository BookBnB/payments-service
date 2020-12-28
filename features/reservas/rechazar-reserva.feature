# language: es
Característica:
  Como anfitrión
  Quiero poder rechazar una reserva
  Para impedir que un huésped se aloje en mi propiedad

  Antecedentes:
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers
    Y que tengo una publicación con precio 1 eth
    Y que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'

  Escenario: Rechazo exitoso
    Cuando rechazo la reserva del usuario con email 'huesped@book.bnb'
    Entonces se emite un evento de rechazo de la reserva

  @wip
  Escenario: Rechazo fallido - Fondos insuficientes del anfitrión
    Dado que me quedan 0 ethers en mi billetera
    Cuando rechazo la reserva del usuario con email 'huesped@book.bnb'
    Entonces se emite un evento de rechazo de la reserva
