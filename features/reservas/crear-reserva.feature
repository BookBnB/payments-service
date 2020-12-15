# language: es
Característica:
    Como huesped
    Quiero poder reservarme en un alojamiento
    Para poder alojarme en el mismo

    Antecedentes:
        Dado que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una billetera con 100 ethers
        Y que el usuario '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una publicacion con precio 1 eth

    Escenario: Creación Exitosa
        Dado que el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' tiene una billetera con 100 ethers
        Cuando el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' crea una reserva del '2020-12-01' al '2020-12-10'
        Entonces se emite un evento para la nueva reserva

    Escenario: Creación fallida - Cupo alcanzado
        Dado que el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' tiene una billetera con 100 ethers
        Y que el usuario '8e590c31-8bbc-4fae-80ea-77e3a4cfc628' tiene una billetera con 100 ethers
        Y que el usuario '94728c1c-6972-44eb-926a-54fa9be50f22' tiene una billetera con 100 ethers
        Y que el usuario 'c7bd0e91-8052-4725-94eb-e5e85d969e1c' tiene una billetera con 100 ethers
        Y que el usuario '1dc34545-83d9-4e80-96cc-b58585b8fac7' tiene una billetera con 100 ethers
        Y que el usuario 'bfd35377-ff03-4c6f-81f9-0d69069e3060' tiene una billetera con 100 ethers
        Y el usuario '8e590c31-8bbc-4fae-80ea-77e3a4cfc628' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
        Y el usuario '94728c1c-6972-44eb-926a-54fa9be50f22' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
        Y el usuario 'c7bd0e91-8052-4725-94eb-e5e85d969e1c' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
        Y el usuario '1dc34545-83d9-4e80-96cc-b58585b8fac7' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
        Y el usuario 'bfd35377-ff03-4c6f-81f9-0d69069e3060' crea exitosamente una reserva del '2020-12-01' al '2020-12-10'
        Cuando el usuario '149d79bf-39e0-4acb-8ac5-aa3d3006e49a' crea una reserva del '2020-12-01' al '2020-12-10'
        Entonces no se emite un evento para la nueva reserva
