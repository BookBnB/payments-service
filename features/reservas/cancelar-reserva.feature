# language: es
Característica:
  Como huesped
  Quiero poder cancelar una reserva
  Para recuperar mis fondos

  Antecedentes:
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers
    Y que tengo una publicación con precio 1 eth
    Y que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'

  Escenario: Cancelación exitosa
    Cuando el usuario con email 'huesped@book.bnb' cancela su reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de cancelación de reserva

  Escenario: Aprobación exitosa - Huésped sin fondos
    Dado que al usuario con email 'huesped@book.bnb' le quedan 0 ethers en su billetera
    Cuando el usuario con email 'huesped@book.bnb' cancela su reserva del '2020-12-01' al '2020-12-10'
    Entonces se emite un evento de cancelación de reserva fallida
