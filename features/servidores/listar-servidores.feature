# language: es
Característica:
  Como administrador del sistema
  Quiero poder listar todos los servidores que se encuentren dentro del sistema
  Para controlar su uso

  Antecedentes:
    Dado que soy administrador del sistema

  Escenario: Listar sin servidores
    Cuando listo los servidores
    Entonces no veo "servidores"

  Escenario: Listar servidores
    Cuando creo un servidor con nombre "servidor de pagos"
    Y creo un servidor con nombre "servicio extra"
    Y listo los servidores
    Entonces obtengo un listado con:
      | nombre            |
      | servidor de pagos |
      | servicio extra    |
