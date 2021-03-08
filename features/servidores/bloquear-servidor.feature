# language: es
Característica:
  Como administrador del sistema
  Quiero poder dar de alta un nuevo servidor
  Para que pueda acceder a los distintos servicios del sistema

  Antecedentes:
    Dado que soy administrador del sistema
    Y que existe un servidor con nombre "servidor de pagos"

  @only
  Escenario: Bloqueo de servidor
    Cuando bloqueo el servidor de nombre "servidor de pagos"
    Entonces veo que el servidor está bloqueado

  @only
  Escenario: Desbloqueo de servidor
    Dado que bloqueo el servidor de nombre "servidor de pagos"
    Cuando desbloqueo el servidor de nombre "servidor de pagos"
    Entonces veo que el servidor está desbloqueado
