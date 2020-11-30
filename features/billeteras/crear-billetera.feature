# language: es
Característica:
    Como usuario
    Quiero poder crear una billetera a mi nombre
    Para poder pagar futuras reservas

    Escenario: Creación Exitosa
        Dado que no existen billeteras
        Cuando creo una billetera para el usuario de id '25906492-9efa-4fdb-af87-3a15986a63b2'
        Entonces veo una billetera a nombre de dicho usuario

    Escenario: Creación fallida - Id inválido
        Dado que no existen billeteras
        Cuando creo una billetera para el usuario de id 'un-id-invalido'
        Entonces veo un error indicado en el campo 'id'

    Escenario: Creación fallida - Billetera ya existe
        Dado el usuario de id '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una billetera
        Cuando creo una billetera para el usuario de id '25906492-9efa-4fdb-af87-3a15986a63b2'
        Entonces obtengo un error indicando que ya existe
