# language: es
Característica:
  Como administrador del sistema
  Quiero poder dar de alta un nuevo servidor
  Para que pueda acceder a los distintos servicios del sistema

  Antecedentes:
    Dado que soy administrador del sistema

  Escenario: Creación Exitosa
    Cuando creo un servidor con nombre "servidor de pagos"
    Entonces veo un nuevo servidor con nombre "servidor de pagos", token y id

  Escenario: Creación Exitosa
    Cuando creo un servidor con nombre ""
    Entonces veo un error indicado en el campo "nombre"
