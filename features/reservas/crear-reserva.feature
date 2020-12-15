# language: es
Característica:
    Como huesped
    Quiero poder reservarme en un alojamiento
    Para poder alojarme en el mismo

    Antecedentes:
        Dado que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una billetera con 250 ethers
        Y que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una publicacion con precio 1 eth
        Y que el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' tiene una billetera con 250 ethers

    Escenario: Creación Exitosa
        Cuando el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' crea una reserva del '2020-12-01' al '2020-12-01'
        Entonces se emite un evento para la nueva reserva
