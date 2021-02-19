# language: es
Característica:
  Como administrador
  Quiero poder visualizar la billetera de un usuario
  Para poder suministrarle fondos

  Escenario: Visualizar billetera de usuario existente
    Dado el usuario de id '25906492-9efa-4fdb-af87-3a15986a63b2' tiene una billetera
    Cuando ingreso a la billetera del usuario con id '25906492-9efa-4fdb-af87-3a15986a63b2'
    Entonces veo una billetera a nombre de dicho usuario

  Escenario: Visualizar billetera de usuario inexistente
    Dado que no existen billeteras
    Cuando ingreso a la billetera del usuario con id '25906492-9efa-4fdb-af87-3a15986a63b2'
    Entonces obtengo un error indicando que no existe
