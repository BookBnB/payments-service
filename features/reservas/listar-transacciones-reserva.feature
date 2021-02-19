# language: es
Característica:
  Como administrador
  Quiero poder listar las transacciones de una reserva
  Para controlar su uso en la plataforma

  Antecedentes:
    Dado que soy un usuario con email 'anfitrion@book.bnb' con una billetera con 100 ethers
    Y que tengo una publicación con precio 1 eth
    Y que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers

  Escenario: Listado de transacciones para reserva inexistente
    Cuando listo las transacciones de una reserva inexistente
    Entonces obtengo un listado vacío

  Escenario: Listado de transacciones para reserva creada con éxito
    Dado que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Cuando listo las transacciones de la reserva de 'huesped@book.bnb'
    Entonces obtengo un listado con:
    | evento   | exito |
    | creacion | true  |

  Escenario: Listado de transacciones para reserva creada sin éxito
    Dado que al usuario con email 'huesped@book.bnb' le quedan 0 ethers en su billetera
    Y que el usuario con email 'huesped@book.bnb' crea una reserva del '2020-12-01' al '2020-12-10'
    Y se emite un evento de creación de la reserva fallida
    Cuando listo las transacciones de la reserva de 'huesped@book.bnb'
    Entonces obtengo un listado con:
    | evento   | exito |
    | creacion | false |

  Escenario: Listado de transacciones para reserva aprobada
    Dado que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y se aprueba con éxito la reserva del usuario con email 'huesped@book.bnb'
    Cuando listo las transacciones de la reserva de 'huesped@book.bnb'
    Entonces obtengo un listado con:
    | evento     | exito |
    | creacion   | true  |
    | aprobacion | true  |

  Escenario: Listado de transacciones para reserva rechazada
    Dado que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y se rechaza con éxito la reserva del usuario con email 'huesped@book.bnb'
    Cuando listo las transacciones de la reserva de 'huesped@book.bnb'
    Entonces obtengo un listado con:
    | evento   | exito |
    | creacion | true  |
    | rechazo  | true  |

  Escenario: Listado de transacciones para reserva creada sin éxito por alcanzarse el cupo
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
    Y que creo una reserva del '2020-12-01' al '2020-12-10'
    Y se emite un evento de creación de la reserva fallida
    Cuando listo las transacciones de la reserva de 'huesped_sin_cupo@book.bnb'
    Entonces obtengo un listado con:
    | evento   | exito |
    | creacion | false |

  Escenario: Listado de transacciones para reserva creada y aprobada con éxito entre varias otras
    Dado que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped1@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped2@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped3@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped4@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped1@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped2@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped3@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped4@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y se aprueba con éxito la reserva del usuario con email 'huesped@book.bnb'
    Cuando listo las transacciones de la reserva de 'huesped@book.bnb'
    Entonces obtengo un listado con:
    | evento     | exito |
    | creacion   | true  |
    | aprobacion | true  |

  Escenario: Listado de transacciones para reserva creada y aprobada cuando ya se aprobó otra
    Dado que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped1@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped1@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y se aprueba con éxito la reserva del usuario con email 'huesped@book.bnb'
    Y se aprueba sin éxito la reserva del usuario con email 'huesped1@book.bnb'
    Cuando listo las transacciones de la reserva de 'huesped1@book.bnb'
    Entonces obtengo un listado con:
    | evento     | exito |
    | creacion   | true  |
    | aprobacion | false  |

  Escenario: Listado de transacciones para reserva creada y rechazada cuando ya se aprobó otra
    Dado que el usuario con email 'huesped@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped1@book.bnb' tiene una billetera con 100 ethers
    Y que el usuario con email 'huesped@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y que el usuario con email 'huesped1@book.bnb' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
    Y se aprueba con éxito la reserva del usuario con email 'huesped@book.bnb'
    Y se rechaza sin éxito la reserva del usuario con email 'huesped1@book.bnb'
    Cuando listo las transacciones de la reserva de 'huesped1@book.bnb'
    Entonces obtengo un listado con:
    | evento   | exito |
    | creacion | true  |
    | rechazo  | false  |
