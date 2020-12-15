# language: es
Característica:
    Como anfitrion
    Quiero poder aprobar una reserva
    Para recibir el pago del huesped

    Antecedentes:
        Dado que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una billetera con 100 ethers
        Y que el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' tiene una billetera con 100 ethers
        Y que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una publicacion con precio 1 eth
        Y el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' crea una reserva del '2020-12-01' al '2020-12-10'

    Escenario: Aprobación exitosa
        Cuando el anfitrion '25906492-9efa-4fdb-af87-3a15986a63b2' aprueba la reserva del usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a'
        Entonces se emite un evento de aceptacion de la reserva
