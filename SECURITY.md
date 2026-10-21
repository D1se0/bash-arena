# Política de seguridad — bash-arena

## Reportar una vulnerabilidad
Abre una issue marcada `security` o escribe al email en el perfil del repo.
**No publiques exploits en issues públicas** hasta que se publique el fix.

## Modelo de amenazas (resumen)

| Amenaza | Mitigación |
|---|---|
| Escape de contenedor / acceso al socket Docker | Los contenedores de usuario **nunca** montan `/var/run/docker.sock`; solo el backend lo usa |
| Red del entorno real | Contenedor por sesión con `--network none` (no hay salida a internet ni a redes internas), `dig`/`curl` solo contra loopback simulado |
| Escalada de privilegios | `--cap-drop ALL` + subconjunto mínimo (`CHOWN,DAC_OVERRIDE,FOWNER,SETUID,SETGID`), `no-new-privileges` salvo niveles que requieren `sudo` de forma explícita |
| Fork bomb / DoS | `--pids-limit 128`, límite de memoria 256 MB, límite de CPU 0.5, timeout idle y duración máxima de sesión |
| Exfiltrar flags de otras sesiones | Flags generadas **por sesión** con HMAC-SHA256 (session + level + nonce, secreto en el servidor); validez solo del backend |
| Trucos del cliente | La validación de flags sucede **siempre en el servidor**; el cliente nunca conoce la flag hasta que el entorno la divulga |
| Brute-force del backend | Rate limiting por IP (token bucket) en REST y WS; límite de sesiones simultáneas por IP y global |
| Abuso de recursos del host | Un contenedor por sesión, límites duros, recolección al desconectar y al expirar sesiones |
| Secretos en el repo | Ningún secreto en el código; el secreto HMAC vive en variables de entorno (`ARENA_FLAG_SECRET`) |

## Decisiones justificadas (completas)
Ver `docs/threat-model.md` en el repositorio.
