/*
 * GENERADO — NO EDITAR A MANO. regenerar con: node scripts/gen-walkthroughs.mjs
 * Fuente de verdad: levels/*.yaml.
 */
export interface StepCmd { cmd: string; args: string; why: string; flags: { flag: string; meaning: string }[]; }
export interface Step { raw: string; cmds: StepCmd[]; }
export interface WalkthroughData {
  id: string; track: string; index: number; title: string; subtitle: string | null;
  xp: number; difficulty: number; brief: string; goal: string; keywords: string[];
  hints: string[]; cheatsheet: { cmd: string; desc: string }[]; teach: string;
  examples: { title: string; content: string }[];
  steps: Step[]; raw: string;
}
export const WALKTHROUGHS: WalkthroughData[] = [
  {
    "id": "fundamentos-l1",
    "track": "fundamentos",
    "index": 0,
    "title": "Primer contacto",
    "subtitle": "ls, cat y ficheros ocultos",
    "xp": 25,
    "difficulty": 1,
    "brief": "Acabas de aterrizar en el dojo. Un instructor dejó algo en tu home… pero discretamente. Los buenos agentes siempre revisan lo que no se ve.",
    "goal": "Localiza el fichero oculto de tu home que contiene la flag y muéstrala en pantalla.",
    "keywords": [
      "ls",
      "cat",
      "hidden"
    ],
    "hints": [
      "ls solo muestra lo visible: -a desvela lo oculto.",
      "El fichero empieza por punto: .secreto",
      "cat ~/.secreto lo imprime."
    ],
    "cheatsheet": [
      {
        "cmd": "ls",
        "desc": "lista ficheros del directorio actual"
      },
      {
        "cmd": "ls -a",
        "desc": "incluye ocultos (los que empiezan por .)"
      },
      {
        "cmd": "cat fichero",
        "desc": "muestra el contenido de un fichero"
      },
      {
        "cmd": "pwd",
        "desc": "muestra tu ruta actual"
      }
    ],
    "teach": "`ls -a` muestra ficheros cuyo nombre empieza por `.` — ocultos para `ls` normal. `cat` volca el contenido. Para explorar directorios usa `pwd` (dónde estás) y `cd` (para moverte).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat ~/.secreto",
        "cmds": [
          {
            "cmd": "cat",
            "args": "~/.secreto",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat ~/.secreto"
  },
  {
    "id": "fundamentos-l2",
    "track": "fundamentos",
    "index": 0,
    "title": "Rutas y navegación",
    "subtitle": "cd, pwd, rutas absolutas y relativas",
    "xp": 30,
    "difficulty": 1,
    "brief": "Un mensaje cifrado quedó enterrado en una estructura de carpetas con trampas: carpetas con nombres parecidos (misi0n, mision, MISION…).",
    "goal": "Navega por la estructura de /home/agent/empresa, encuentra el único fichero llamado nota.txt dentro de la carpeta correcta (la real, no las señuelos que contienen trampas) y muéstralo.",
    "keywords": [
      "cd",
      "pwd",
      "rutas"
    ],
    "hints": [
      "Compara el nombre de cada carpeta octavo a octavo: eres imperfecto como nadie.",
      "Compara el nombre exacto letra a letra con ls /home/agent/empresa.",
      "cat /home/agent/empresa/mision/nota.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "cd ruta",
        "desc": "cambia de directorio (absoluta con /"
      },
      {
        "cmd": "pwd",
        "desc": "muestra la ruta actual"
      },
      {
        "cmd": "cd ..",
        "desc": "sube un nivel"
      }
    ],
    "teach": "Una ruta absoluta (/home/…) empieza en la raíz; una relativa empieza en tu posición actual. `cd ~` te lleva a home y `cd ..` sube un nivel. Verifica dónde estás con `pwd` antes de fiarte de las rutas relativas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "Código de la misión: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/empresa/mision/nota.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/empresa/mision/nota.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /home/agent/empresa/mision/nota.txt"
  },
  {
    "id": "fundamentos-l3",
    "track": "fundamentos",
    "index": 0,
    "title": "Evidencias",
    "subtitle": "mkdir, cp, mv",
    "xp": 35,
    "difficulty": 2,
    "brief": "El equipo de intrusión dejó un paquete de evidencias dispersas en /var/dojo/. Necesitas juntarlas: crea una carpeta de trabajo, copia las evidencias y renombra la pieza clave para que el equipo pueda procesarla.",
    "goal": "1) Crea ~/evidencias   2) Copia ahí todos los /var/dojo/evidencias/*.png 3) Renombra (mv) la copia de pieza-clave.png → pieza-clave-final.png 4) Muéstralo y recupera la flag escondida dentro de pieza-clave-final.png.",
    "keywords": [
      "cp",
      "mv",
      "mkdir",
      "glob"
    ],
    "hints": [
      "mkdir ~/evidencias crea tu carpeta de trabajo.",
      "cp /var/dojo/evidencias/*.png ~/evidencias/ copia todas de golpe.",
      "mv ~/evidencias/pieza-clave.png ~/evidencias/pieza-clave-final.png"
    ],
    "cheatsheet": [
      {
        "cmd": "mkdir -p ruta",
        "desc": "crea carpetas (con rutas anidadas)"
      },
      {
        "cmd": "cp a b",
        "desc": "copia ficheros o carpetas (-r para recursivo)"
      },
      {
        "cmd": "mv a b",
        "desc": "mueve o renombra"
      }
    ],
    "teach": "`cp` copia, `mv` mueve o renombra (segundo argumento define destino), `mkdir` crea directorios y `-p` los crea anidados. El asterisco `*` es un comodín de expansión de nombre (globbing) manejado por el shell.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "PNG falsa con texto dentro:\nClave interna: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "mkdir -p ~/evidencias\ncp /var/dojo/evidencias/*.png ~/evidencias/\nmv ~/evidencias/pieza-clave.png ~/evidencias/pieza-clave-final.png\ncat ~/evidencias/pieza-clave-final.png",
        "cmds": [
          {
            "cmd": "mkdir",
            "args": "-p ~/evidencias cp /var/dojo/evidencias/*.png ~/evidencias/ mv ~/evidencias/pieza-clave.png ~/evidencias/pieza-clave-final.png cat ~/evidencias/pieza-clave-final.png",
            "why": "crea directorios",
            "flags": [
              {
                "flag": "-p",
                "meaning": "crea los niveles intermedios que falten y no da error si ya existen"
              }
            ]
          }
        ]
      }
    ],
    "raw": "mkdir -p ~/evidencias\ncp /var/dojo/evidencias/*.png ~/evidencias/\nmv ~/evidencias/pieza-clave.png ~/evidencias/pieza-clave-final.png\ncat ~/evidencias/pieza-clave-final.png"
  },
  {
    "id": "fundamentos-l4",
    "track": "fundamentos",
    "index": 0,
    "title": "Limpieza quirúrgica",
    "subtitle": "globbing, for, rm seguro",
    "xp": 40,
    "difficulty": 2,
    "brief": "En /var/dojo/ruido hay 40 ficheros .trash que ensucian el disco. Entre ellos hay uno que NO es basura: .importantísimo con la clave de cifrado. Tienes que limpiar los .trash SIN borrar la clave.",
    "goal": "Elimina todos los ficheros *.trash de /var/dojo/ruido, deja intactos los demás y muéstrame por pantalla el único que queda con contenido.",
    "keywords": [
      "rm",
      "globbing",
      "ls",
      "-a"
    ],
    "hints": [
      "El rm acepta comodines: rm /ruta/*.trash solo toca los .trash.",
      "Las claves ocultas empiezan por punto (ls -a)."
    ],
    "cheatsheet": [
      {
        "cmd": "rm fichero",
        "desc": "borra (-r para carpetas"
      },
      {
        "cmd": "ls -a",
        "desc": "lista también los ocultos con punto"
      },
      {
        "cmd": "echo \"texto con espacios\"",
        "desc": "comillas dobles para preservar espacios"
      }
    ],
    "teach": "El shell expande `*` antes de que rm lo vea, así que /ruido/*.trash es una lista explícita de ficheros. `rm -i` pide confirmación uno a uno: útil cuando dudas. Cuidado con `rm -rf` en rutas mal escritas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "clave FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "rm -f /var/dojo/ruido/*.trash\ncat /var/dojo/ruido/.importantísimo",
        "cmds": [
          {
            "cmd": "rm",
            "args": "-f /var/dojo/ruido/*.trash cat /var/dojo/ruido/.importantísimo",
            "why": "borra ficheros (¡irrecuperable!)",
            "flags": [
              {
                "flag": "-f",
                "meaning": "sin preguntar ni avisar de inexistentes"
              }
            ]
          }
        ]
      }
    ],
    "raw": "rm -f /var/dojo/ruido/*.trash\ncat /var/dojo/ruido/.importantísimo"
  },
  {
    "id": "fundamentos-l5",
    "track": "fundamentos",
    "index": 0,
    "title": "Laberinto de ficheros",
    "subtitle": "boss — cd profundo, ls, cat, rutas",
    "xp": 60,
    "difficulty": 3,
    "brief": "El instructor ha escondido una flag en lo más profundo de un laberinto de carpetas. Cada nivel del laberinto tiene un aviso que te orienta (o te despista). Confía solo en lo que veas: lee los avisos con cat.",
    "goal": "Sigue los avisos que hay en cada aviso.txt, encuentra el fichero pentagram que contiene la flag y muéstralo completo.",
    "keywords": [
      "boss",
      "cd",
      "ls",
      "cat"
    ],
    "hints": [
      "Empieza por el aviso de tu home y ve siguiendo los aviso.txt con cat.",
      "La carpeta objetivo es .caldera (empieza por punto), dentro de .oculto/nivel1."
    ],
    "cheatsheet": [
      {
        "cmd": "cat ruta",
        "desc": "muestra ficheros"
      },
      {
        "cmd": "ls -la",
        "desc": "listar los ficheros ilegibles/completos"
      },
      {
        "cmd": "cd carpeta/.sub",
        "desc": "navegar subcarpetas ocultas"
      }
    ],
    "teach": "En Linux los ficheros ocultos empiezan por punto y las rutas anidadas se escriben — no hay mágia real: cat + cd + ls resuelven laberintos. `cat fichero` solo funciona si el fichero existe y puedes leerlo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "No aquí. La pista real está DOS niveles más abajo, en .oculto.\nAvanza hacia .caldera: el código te espera.\nClave: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat ~/aviso.txt\ncat ~/lab/.oculto/aviso.txt\ncat ~/lab/.oculto/nivel1/bodegon/.caldera/pentagram",
        "cmds": [
          {
            "cmd": "cat",
            "args": "~/aviso.txt cat ~/lab/.oculto/aviso.txt cat ~/lab/.oculto/nivel1/bodegon/.caldera/pentagram",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat ~/aviso.txt\ncat ~/lab/.oculto/aviso.txt\ncat ~/lab/.oculto/nivel1/bodegon/.caldera/pentagram"
  },
  {
    "id": "fundamentos-l6",
    "track": "fundamentos",
    "index": 6,
    "title": "Nombres traicioneros",
    "subtitle": "espacios, paréntesis y comillas",
    "xp": 30,
    "difficulty": 2,
    "brief": "Un informe quedó guardado con un nombre casi imposible: espacios, paréntesis y una palabra final que lo delata.",
    "goal": "Muestra el contenido del fichero \"informe (copia) final.txt\" que está en tu home.",
    "keywords": [
      "cat",
      "espacios",
      "comillas",
      "quoting"
    ],
    "hints": [
      "ls /home/agent te enseña los nombres EXACTOS: los espacios y paréntesis cuentan.",
      "Un nombre con espacios debe ir entrecomillado para que la shell no lo parta.",
      "cat \"/home/agent/informe (copia) final.txt\""
    ],
    "cheatsheet": [
      {
        "cmd": "cat \"archivo con espacios\"",
        "desc": "lee rutas con espacios"
      },
      {
        "cmd": "cat 'archivo (uno).txt'",
        "desc": "comillas simples evitan expansiones"
      }
    ],
    "teach": "Cuando un nombre contiene espacios o paréntesis, la shell lo parte en palabras: hay que protegerlo con comillas. El tabulador (autocompletado) te salva de escribirlo mal.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "secreto del informe: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat '/home/agent/informe (copia) final.txt'",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/informe (copia) final.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat '/home/agent/informe (copia) final.txt'"
  },
  {
    "id": "fundamentos-l7",
    "track": "fundamentos",
    "index": 7,
    "title": "El historial delator",
    "subtitle": "bash_history como pista forense",
    "xp": 30,
    "difficulty": 2,
    "brief": "El operador anterior tecleó el comando exacto que revela la sala secreta… y quedó anotado en su historial de bash.",
    "goal": "Descubre el fichero secreto a partir de /home/agent/.bash_history y muestra su contenido.",
    "keywords": [
      "history",
      "bash_history",
      "grep -o"
    ],
    "hints": [
      "Los comandos del usuario anterior están en .bash_history (fichero oculto, empieza por punto).",
      "En el historial hay una ruta /etc/arena/…: extráela con grep -oE.",
      "secret=$(grep -oE \"/etc/arena/[^ ]+\" /home/agent/.bash_history | head -n1); cat \"$secret\""
    ],
    "cheatsheet": [
      {
        "cmd": "cat ~/.bash_history",
        "desc": "mira el historial de comandos"
      },
      {
        "cmd": "grep -oE 'patron' f",
        "desc": "imprime solo lo que casa"
      }
    ],
    "teach": "El historial (~/.bash_history) es memoria forense: sirve para reconstruir lo que otro hizo. Y es el motivo por el que NUNCA debes teclear secretos: quedan grabados.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "secret=$(grep -oE '/etc/arena/[^ ]+' /home/agent/.bash_history | head -n1)",
        "cmds": [
          {
            "cmd": "secret=$(grep",
            "args": "-oE /etc/arena/[^ ]+ /home/agent/.bash_history",
            "why": "comando secret=$(grep — revisa «man secret=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man secret=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat \"$secret\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$secret",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "secret=$(grep -oE '/etc/arena/[^ ]+' /home/agent/.bash_history | head -n1); cat \"$secret\""
  },
  {
    "id": "fundamentos-l8",
    "track": "fundamentos",
    "index": 8,
    "title": "Wildcards en la fábrica",
    "subtitle": "globbing: * y ? sobre rutas",
    "xp": 35,
    "difficulty": 2,
    "brief": "En exports/ hay años y meses mezclados. Solo el CSV de octubre de 2024 lleva la clave dentro.",
    "goal": "Muestra el contenido del fichero llamado data_2024_10.csv dentro de /home/agent/exports.",
    "keywords": [
      "globbing",
      "wildcards",
      "ls",
      "cat"
    ],
    "hints": [
      "Con ls /home/agent/exports comparas los nombres letra a letra.",
      "Los comodines ahorran tecleado: * casa cualquier texto, ? casa un solo carácter.",
      "cat /home/agent/exports/data_*_10.csv (y fija la mirada en la fila de 2024)"
    ],
    "cheatsheet": [
      {
        "cmd": "ls exports/data*",
        "desc": "previsualiza qué expande el *"
      },
      {
        "cmd": "cat data_2024_10.csv",
        "desc": "nombre exacto, cero sorpresas"
      }
    ],
    "teach": "El globbing (* y ?) lo expande la shell ANTES de ejecutar el comando; sirve para filtrar por nombre sin abrir ficheros. Verifica siempre con ls qué va a casar.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "clave del trimestre: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/exports/data_2024_10.csv",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/exports/data_2024_10.csv",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /home/agent/exports/data_2024_10.csv"
  },
  {
    "id": "fundamentos-l9",
    "track": "fundamentos",
    "index": 9,
    "title": "Línea 111",
    "subtitle": "recortar líneas sin editor",
    "xp": 30,
    "difficulty": 2,
    "brief": "La agenda tiene 120 compromisos. La marca quedó caída en la línea 111: ni antes, ni después.",
    "goal": "Imprime exactamente la línea 111 de /home/agent/agenda.txt.",
    "keywords": [
      "head",
      "tail",
      "wc",
      "líneas"
    ],
    "hints": [
      "wc -l /home/agent/agenda.txt confirma el tamaño del fichero.",
      "Puedes cortar por el principio con head y por la cola con tail; encadenados recortan una ventana.",
      "head -n 111 agenda.txt | tail -n 1"
    ],
    "cheatsheet": [
      {
        "cmd": "head -n N f | tail -n 1",
        "desc": "línea N exacta"
      },
      {
        "cmd": "wc -l f",
        "desc": "cuenta líneas"
      }
    ],
    "teach": "head y tail encadenados recortan cualquier ventana de líneas: primeras N y últimas M. wc -l y nl te ayudan a localizar la que buscas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "linea 111 hallazgo clave: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "head -n 111 /home/agent/agenda.txt | tail -n 1",
        "cmds": [
          {
            "cmd": "head",
            "args": "-n 111 /home/agent/agenda.txt",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 111",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 111)"
              }
            ]
          },
          {
            "cmd": "tail",
            "args": "-n 1",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "head -n 111 /home/agent/agenda.txt | tail -n 1"
  },
  {
    "id": "fundamentos-l10",
    "track": "fundamentos",
    "index": 10,
    "title": "La bandeja de entrada",
    "subtitle": "cp: copiar sin perder el original",
    "xp": 35,
    "difficulty": 2,
    "brief": "El aviso urgente está enterrado en bandeja/entrada/2024/urgente/. El protocolo exige copia en tu home antes de leerlo.",
    "goal": "Copia aviso.txt a tu home con el nombre aviso-copia.txt y muéstralo.",
    "keywords": [
      "cp",
      "mv",
      "rutas",
      "bandeja"
    ],
    "hints": [
      "Navega con cd y comprueba con ls cada tramo de la ruta.",
      "cp ORIGEN DESTINO copia sin tocar el original.",
      "cp bandeja/entrada/2024/urgente/aviso.txt ~/aviso-copia.txt && cat ~/aviso-copia.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "cp a b",
        "desc": "copia un fichero"
      },
      {
        "cmd": "mv a b",
        "desc": "mueve o renombra"
      }
    ],
    "teach": "cp copia, mv mueve (y renombra); rm borra y no tiene marcha atrás. Las rutas relativas se apoyan en tu cwd: confirma dónde estás con pwd si dudas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "aviso critico: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cp /home/agent/bandeja/entrada/2024/urgente/aviso.txt /home/agent/aviso-copia.txt",
        "cmds": [
          {
            "cmd": "cp",
            "args": "/home/agent/bandeja/entrada/2024/urgente/aviso.txt /home/agent/aviso-copia.txt",
            "why": "copia ficheros",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/aviso-copia.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/aviso-copia.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cp /home/agent/bandeja/entrada/2024/urgente/aviso.txt /home/agent/aviso-copia.txt && cat /home/agent/aviso-copia.txt"
  },
  {
    "id": "fundamentos-l11",
    "track": "fundamentos",
    "index": 11,
    "title": "Leer la leeme",
    "subtitle": "seguir una pista escrita a mano",
    "xp": 35,
    "difficulty": 2,
    "brief": "Alguien dejó instrucciones en un fichero oculto .leeme que apunta al escondite de la clave.",
    "goal": "Lee el fichero oculto .leeme de tu home, sigue la ruta que anota y muestra ese fichero.",
    "keywords": [
      "ocultos",
      "ls -a",
      "sustitución de comandos"
    ],
    "hints": [
      "Los ficheros que empiezan por punto no aparecen en un ls normal: usa ls -a.",
      "La nota menciona una ruta absoluta; extráela con grep -oE.",
      "cat \"$(grep -oE \"/home/agent/[^ ]+\" .leeme | head -n1)\""
    ],
    "cheatsheet": [
      {
        "cmd": "ls -a",
        "desc": "lista incluidos los ocultos"
      },
      {
        "cmd": "cat $(comando)",
        "desc": "salida como argumento"
      }
    ],
    "teach": "Los ficheros ocultos (punto inicial) guardan configuraciones y notas. La sustitución $(…) mete la salida de un comando dentro de otro: el patrón «localiza → actúa» que usarás todos los días.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "secuencia valida: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(grep -oE '/home/agent/[^ ]+' /home/agent/.leeme | head -n1)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(grep -oE '/home/agent/[^ ]+' /home/agent/.leeme | head -n1)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(grep -oE '/home/agent/[^ ]+' /home/agent/.leeme | head -n1)\""
  },
  {
    "id": "fundamentos-l12",
    "track": "fundamentos",
    "index": 12,
    "title": "Una clave en dos mitades",
    "subtitle": "cat multiplica argumentos",
    "xp": 40,
    "difficulty": 3,
    "brief": "Por protocolo administrativo la clave se guardó partida: la primera mitad en parte_a.txt y el resto en parte_b.txt.",
    "goal": "Imprime las dos mitades en orden (primero A, luego B) formando una sola línea.",
    "keywords": [
      "cat",
      "concatenar",
      "redirección"
    ],
    "hints": [
      "cat acepta varios ficheros y los imprime en el orden que los des.",
      "Ojo: la primera mitad NO termina en salto de línea, por eso ambas mitades se pegan.",
      "cat parte_a.txt parte_b.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "cat a b c",
        "desc": "une ficheros en orden"
      },
      {
        "cmd": "cat a b > unido",
        "desc": "redirige la unión a otro fichero"
      }
    ],
    "teach": "cat concatena todos sus argumentos en el orden dado. Si un fichero no termina en salto de línea, la salida se pega al siguiente: así las mitades forman una sola línea.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/parte_a.txt /home/agent/parte_b.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/parte_a.txt /home/agent/parte_b.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /home/agent/parte_a.txt /home/agent/parte_b.txt"
  },
  {
    "id": "fundamentos-l13",
    "track": "fundamentos",
    "index": 13,
    "title": "El más reciente",
    "subtitle": "ordenar por fecha con ls -t",
    "xp": 30,
    "difficulty": 2,
    "brief": "En ~/registro hay fichas con fechas distintas. Solo la ficha modificada más recientemente lleva la marca del dojo.",
    "goal": "Descubre qué ficha de ~/registro se tocó por última vez y muéstrala.",
    "keywords": [
      "ls",
      "touch",
      "orden"
    ],
    "hints": [
      "ls -t ordena por fecha de modificación (la más nueva primero).",
      "Combina: cat $(ls -t | head -n1) dentro del directorio.",
      "cat /home/agent/registro/$(ls -t /home/agent/registro | head -n1)"
    ],
    "cheatsheet": [
      {
        "cmd": "ls -t",
        "desc": "ordena por fecha (nuevo→viejo)"
      },
      {
        "cmd": "ls -rt",
        "desc": "orden cronológico inverso"
      }
    ],
    "teach": "ls -t es el modo cronológico de ls; con -t | head tienes el último fichero tocado en una sola tubería. Perfecto para \"¿qué cambió aquí hace un rato?\".",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "última entrada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/registro/$(ls -t /home/agent/registro | head -n1)",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/registro/$(ls -t /home/agent/registro",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": [
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man cat»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat /home/agent/registro/$(ls -t /home/agent/registro | head -n1)"
  },
  {
    "id": "fundamentos-l14",
    "track": "fundamentos",
    "index": 14,
    "title": "La séptima marca",
    "subtitle": "dirigirse a una línea exacta",
    "xp": 30,
    "difficulty": 2,
    "brief": "salas.txt tiene una marca por línea, tantas como salas. La de la séptima línea es la buena; el resto son señuelos.",
    "goal": "Muestra únicamente la séptima línea de /home/agent/salas.txt.",
    "keywords": [
      "sed",
      "lineas",
      "wc"
    ],
    "hints": [
      "sed -n Np fichero imprime exactamente la línea N.",
      "También vale: head -n7 | tail -n1.",
      "sed -n 7p /home/agent/salas.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "sed -n 7p f",
        "desc": "imprime la línea 7"
      },
      {
        "cmd": "head -n7 f | tail -n1",
        "desc": "lo mismo con head/tail"
      }
    ],
    "teach": "Dirigirse a una línea exacta evita imprimir ficheros enormes: sed -n 12p, head | tail o NR==7 de awk son tres caminos al mismo punto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "sala 7: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sed -n 7p /home/agent/salas.txt",
        "cmds": [
          {
            "cmd": "sed",
            "args": "-n 7p /home/agent/salas.txt",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": [
              {
                "flag": "-n",
                "meaning": "suprime la impresión automática (útil con el comando p)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sed -n 7p /home/agent/salas.txt"
  },
  {
    "id": "fundamentos-l15",
    "track": "fundamentos",
    "index": 15,
    "title": "Variable heredada",
    "subtitle": "source y variables de entorno",
    "xp": 35,
    "difficulty": 2,
    "brief": "Un fichero de entorno guarda la ruta de la bóveda en la variable DOJO_PATH. Cárgalo en tu shell y usa la variable.",
    "goal": "Carga /home/agent/.login_env y usa $DOJO_PATH para mostrar el contenido de la bóveda.",
    "keywords": [
      "source",
      "env",
      "variables"
    ],
    "hints": [
      "source (o el punto .) ejecuta un fichero en TU shell actual: las variables quedan cargadas.",
      "Después, la ruta vive en $DOJO_PATH: cat \"$DOJO_PATH\".",
      "source /home/agent/.login_env; cat \"$DOJO_PATH\""
    ],
    "cheatsheet": [
      {
        "cmd": "source f",
        "desc": "carga variables en el shell"
      },
      {
        "cmd": ". f",
        "desc": "equivalente corto"
      }
    ],
    "teach": "source NO abre un subshell: las variables quedan en tu sesión. Es la diferencia entre \"ejecutar\" (fork: variables efímeras) y \"cargar\" (dot). Clásico de .bashrc y .env.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "clave de la bóveda: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "source /home/agent/.login_env",
        "cmds": [
          {
            "cmd": "source",
            "args": "/home/agent/.login_env",
            "why": "comando interno de bash: interpreta un script EN el shell actual (no en un hijo)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat \"$DOJO_PATH\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$DOJO_PATH",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "source /home/agent/.login_env; cat \"$DOJO_PATH\""
  },
  {
    "id": "fundamentos-l16",
    "track": "fundamentos",
    "index": 16,
    "title": "Cara o cruz",
    "subtitle": "file: el tipo verdadero",
    "xp": 35,
    "difficulty": 2,
    "brief": "En ~/cofre hay tres ficheros .txt, pero uno miente: internamente es otro formato. file revela la verdad.",
    "goal": "Identifica el fichero de ~/cofre cuyo contenido REAL es gzip y muestralo descomprimido.",
    "keywords": [
      "file",
      "gzip",
      "magic"
    ],
    "hints": [
      "file fichero dice el tipo por su contenido, no por su nombre.",
      "Filtra los que salgan como gzip y descomprímelos al stdout con zcat.",
      "f=$(file /home/agent/cofre/* | grep gzip | cut -d: -f1); zcat \"$f\""
    ],
    "cheatsheet": [
      {
        "cmd": "file *",
        "desc": "tipo real de cada fichero"
      },
      {
        "cmd": "zcat f.gz",
        "desc": "gzip al stdout sin descomprimir a disco"
      }
    ],
    "teach": "file Lee los \"magic bytes\" del principio del fichero: la extensión se puede fingir, los primeros bytes no. Útil cuando algo \"debería ser X\" y no abre.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la pieza real: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "f=$(file /home/agent/cofre/* | grep gzip | cut -d: -f1)",
        "cmds": [
          {
            "cmd": "f=$(file",
            "args": "/home/agent/cofre/*",
            "why": "comando f=$(file — revisa «man f=$(file»",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "gzip",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "cut",
            "args": "-d: -f1)",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "zcat \"$f\"",
        "cmds": [
          {
            "cmd": "zcat",
            "args": "$f",
            "why": "comando zcat — revisa «man zcat»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "f=$(file /home/agent/cofre/* | grep gzip | cut -d: -f1); zcat \"$f\""
  },
  {
    "id": "fundamentos-l17",
    "track": "fundamentos",
    "index": 17,
    "title": "La letra pequeña",
    "subtitle": "leer instrucciones y seguirlas",
    "xp": 40,
    "difficulty": 3,
    "brief": "El README del dojo da una ruta absoluta \"-donde está la pieza\". Leer y OBEDECER: la ruta está impresa en el propio fichero.",
    "goal": "Lee /home/agent/README, extrae la ruta que menciona y muestra ese fichero.",
    "keywords": [
      "cat",
      "grep",
      "rutas"
    ],
    "hints": [
      "grep -oE con una regex de ruta saca la ruta sin el resto del texto.",
      "Las rutas absolutas del README empiezan por /etc/arena/.",
      "p=$(grep -oE '/etc/arena/[a-z.-]+' /home/agent/README); cat \"$p\""
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE '/ruta/[a-z.-]+' f",
        "desc": "extrae rutas de un texto"
      },
      {
        "cmd": "cat README",
        "desc": "obvio, pero se olvida"
      }
    ],
    "teach": "Leer documentación ES una habilidad de terminal: grep -oE \"\\w+\\.\\w+|/ruta\" sobre README y man página el salto de \"se que existo\" a \"hago lo que pide\".",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(grep -oE '/etc/arena/[a-z.-]+' /home/agent/README | head -n1)",
        "cmds": [
          {
            "cmd": "p=$(grep",
            "args": "-oE /etc/arena/[a-z.-]+ /home/agent/README",
            "why": "comando p=$(grep — revisa «man p=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man p=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat \"$p\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$p",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "p=$(grep -oE '/etc/arena/[a-z.-]+' /home/agent/README | head -n1); cat \"$p\""
  },
  {
    "id": "fundamentos-l18",
    "track": "fundamentos",
    "index": 18,
    "title": "Historia reciente",
    "subtitle": "bash_history como pista forense",
    "xp": 40,
    "difficulty": 3,
    "brief": "Alguien dejó su .bash_history sin limpiar: entre comandos rutinarios quedó impresa la ruta del fichero con la pieza.",
    "goal": "Encuentra en /home/agent/.bash_history la única ruta bajo /var que aparece y muestra ese fichero.",
    "keywords": [
      "history",
      "grep",
      "forense"
    ],
    "hints": [
      "history y cat ~/.bash_history muestran lo mismo; el fichero es lo greppable.",
      "grep -oE con regex de ruta deja solo la ruta; sort -u la desduplica.",
      "p=$(grep -oE '/var/[a-z/.]+' ~/.bash_history); cat \"$p\""
    ],
    "cheatsheet": [
      {
        "cmd": "history",
        "desc": "comandos de la sesión"
      },
      {
        "cmd": "grep -oE 'patrón' ~/.bash_history",
        "desc": "extraer datos del history"
      }
    ],
    "teach": ".bash_history es oro forense: comandos, rutas y hasta errores revelan lo que pasó. grep -oE sobre history es una receta de incident response de verdad.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(grep -oE '/var/[a-z/.]+' /home/agent/.bash_history | sort -u | head -n1)",
        "cmds": [
          {
            "cmd": "p=$(grep",
            "args": "-oE /var/[a-z/.]+ /home/agent/.bash_history",
            "why": "comando p=$(grep — revisa «man p=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man p=$(grep»"
              }
            ]
          },
          {
            "cmd": "sort",
            "args": "-u",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-u",
                "meaning": "elimina duplicados tras ordenar"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat \"$p\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$p",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "p=$(grep -oE '/var/[a-z/.]+' /home/agent/.bash_history | sort -u | head -n1); cat \"$p\""
  },
  {
    "id": "fundamentos-l19",
    "track": "fundamentos",
    "index": 19,
    "title": "Vecindad sin nombre",
    "subtitle": "find por nombre (n Go a buscar sin extensión)",
    "xp": 30,
    "difficulty": 2,
    "brief": "> El barrio \"barrio\" está lleno de vecinos con apellidos (extensiones). > Pero el contrabando viaja en el único vecino SIN apellido: un fichero > cuyo nombre no lleva ningún punto. Encuéntralo y lee su contenido.",
    "goal": "Muestra el contenido del único fichero del árbol ~/barrio cuyo nombre NO contiene punto (los demás son señuelos con extensiones).",
    "keywords": [
      "find",
      "!",
      "-exec"
    ],
    "hints": [
      "find recorre árboles: find ~/barrio -type f lista todos los ficheros.",
      "El patrón ! -name '*.*' niega nombres con punto.",
      "find permite ejecutar sobre los resultados: -exec cat {} +"
    ],
    "cheatsheet": [
      {
        "cmd": "find DIR -name PATRÓN",
        "desc": "busca por nombre dentro de DIR"
      },
      {
        "cmd": "! -name ...",
        "desc": "niega el patrón (lo que NO coincide)"
      },
      {
        "cmd": "-exec cmd {} +",
        "desc": "ejecuta cmd con los resultados"
      }
    ],
    "teach": "find busca ficheros en un árbol. Con `-name '*.*'` fichas los que llevan punto (una \"extensión\"); el `!` delante niega la condición. Los múltiples {}` de `-exec ... {}` se llenan con cada resultado y el `+` agrupa en un solo cat.\n\n    find ~/barrio -type f ! -name '*.*' -exec cat {} +",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find ~/barrio -type f ! -name '*.*' -exec cat {} +",
        "cmds": [
          {
            "cmd": "find",
            "args": "~/barrio -type f ! -name *.* -exec cat {} +",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man find»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find ~/barrio -type f ! -name '*.*' -exec cat {} +"
  },
  {
    "id": "fundamentos-l20",
    "track": "fundamentos",
    "index": 20,
    "title": "La guía invertida",
    "subtitle": "tac + rev: leer al revés",
    "xp": 30,
    "difficulty": 2,
    "brief": "> Un vendedor callejero te entrega su libreta de contactos, pero está > escrita al revés: las líneas van de abajo a arriba y cada línea está > volteada letra a letra. La única línea con :FLAGVEZ: al secundar > (con su contenido también volteado) es la que buscas.",
    "goal": "Muestra la flag del fichero ~/guia.txt tal como se escribió originalmente (deshaz el orden de líneas y el de letras de cada línea).",
    "keywords": [
      "tac",
      "rev"
    ],
    "hints": [
      "tac imprime las líneas en orden inverso (cat al revés).",
      "rev invierte los caracteres de cada línea.",
      "Encadena ambos: tac fichero | rev — y observa qué línea queda limpia."
    ],
    "cheatsheet": [
      {
        "cmd": "tac",
        "desc": "imprime el fichero con las líneas invertidas"
      },
      {
        "cmd": "rev",
        "desc": "invierte los caracteres de cada línea"
      }
    ],
    "teach": "tac es cat con las líneas en orden inverso; rev voltea los caracteres de cada línea. Combinados deshacen cualquier \"escritura al revés\":\n\n    tac ~/guia.txt | rev\n\nLa línea que contiene el texto de la flag quedará legible en la salida.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "señuelo del sótano\nFLAG{d3b09a4f7c2e1b8d6041a5f3}\nseñuelo del tejado"
      }
    ],
    "steps": [
      {
        "raw": "tac ~/guia.txt | rev",
        "cmds": [
          {
            "cmd": "tac",
            "args": "~/guia.txt",
            "why": "invierte el ORDEN de las líneas (cat al revés)",
            "flags": []
          },
          {
            "cmd": "rev",
            "args": "",
            "why": "invierte cada línea carácter a carácter",
            "flags": []
          }
        ]
      }
    ],
    "raw": "tac ~/guia.txt | rev"
  },
  {
    "id": "filtrado-l1",
    "track": "filtrado",
    "index": 0,
    "title": "Primeras líneas",
    "subtitle": "head",
    "xp": 30,
    "difficulty": 1,
    "brief": "Un volcado de telemetría de 5.000 líneas empieza con una cabecera administrativa. La primera línea útil del volcado lleva la flag.",
    "goal": "El fichero /var/log/telemetry.log tiene 5000 líneas; el código está en las 5 primeras. Solo usa head para verlas.",
    "keywords": [
      "head"
    ],
    "hints": [
      "head muestra el principio: head fichero (10 líneas por defecto).",
      "head -n 5 fichero limita el número de líneas."
    ],
    "cheatsheet": [
      {
        "cmd": "head -n 5 fichero",
        "desc": "muestra las primeras N líneas"
      },
      {
        "cmd": "head -c 100 fichero",
        "desc": "primeros N bytes"
      }
    ],
    "teach": "`head -n N fichero` te ahorra leer megas cuando el dato está al principio. `head -c N` limita por bytes. El complemento natural es `tail`.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "CABECERA — registro sensible. NO difundir.\norigen: equipo dojo · fecha: hoy\ncódigo maestro: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nresto de telemetría repetitiva:\n evento 1"
      }
    ],
    "steps": [
      {
        "raw": "head -n 5 /var/log/telemetry.log",
        "cmds": [
          {
            "cmd": "head",
            "args": "-n 5 /var/log/telemetry.log",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 5",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "head -n 5 /var/log/telemetry.log"
  },
  {
    "id": "filtrado-l2",
    "track": "filtrado",
    "index": 0,
    "title": "Último rastro",
    "subtitle": "tail y tail -f",
    "xp": 30,
    "difficulty": 1,
    "brief": "Un demonio de ficción fue escribiendo su diario hasta el instante exacto en que fue asesinado. La flag está en su última confesión.",
    "goal": "Lee el final de /var/log/daemon.log: la super-flag está entre las últimas 4 líneas.",
    "keywords": [
      "tail",
      "tail-f"
    ],
    "hints": [
      "tail fichero por defecto enseña 10 líneas del final.",
      "tail -n 4 /var/log/daemon.log",
      "tail -f entra en modo streaming (útil con logs que crecen)."
    ],
    "cheatsheet": [
      {
        "cmd": "tail fichero",
        "desc": "últimas 10 líneas"
      },
      {
        "cmd": "tail -n 4 fichero",
        "desc": "últimas N líneas"
      },
      {
        "cmd": "tail -f fichero",
        "desc": "sigue el fichero en tiempo real"
      }
    ],
    "teach": "`tail` es el complemento de `head`. Con `tail -f fichero` sigues en vivo un log que crece; termina con Ctrl+C. `tail -n +N fichero` imprime desde la línea N hasta el final.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "día 2998: rutina sin novedades\ndía 2999: rutina sin novedades\ndía 3000: rutina sin novedades\nconfesión final: contraseña FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tail -n 4 /var/log/daemon.log",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-n 4 /var/log/daemon.log",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              },
              {
                "flag": "-n 4",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 4)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tail -n 4 /var/log/daemon.log"
  },
  {
    "id": "filtrado-l3",
    "track": "filtrado",
    "index": 0,
    "title": "La columna olvidada",
    "subtitle": "wc, cut",
    "xp": 35,
    "difficulty": 2,
    "brief": "Una exportación CSV del personal guarda en una columna plants secreta el token de la cúpula. Solo lo sabe quien sea capaz de extraer columnas.",
    "goal": "En /var/dojo/personal.csv hay una fila que empieza por sysadmin; recupera la columna secreta (última) de esa fila. Necesitas cut.",
    "keywords": [
      "cut",
      "wc"
    ],
    "hints": [
      "cut -d, -f4 fichero saca la 4ª columna separada por comas.",
      "Combina cut con grep si prefieres: grep sysadmin fichero | cut -d, -f4.",
      "Si el CSV se te resiste, wc -l te dice cuántas filas mirar."
    ],
    "cheatsheet": [
      {
        "cmd": "cut -d, -f4 fichero",
        "desc": "saca la 4ª columna separada por comas"
      },
      {
        "cmd": "cut -f2- fichero",
        "desc": "desde el 2º campo (por defecto tabulación)"
      },
      {
        "cmd": "wc -l fichero",
        "desc": "cuenta líneas"
      }
    ],
    "teach": "`cut -d SEP -f N` recorta campos de texto delimitado. Con -f3-4 pides varios y range 5- hasta el final. `cut` no entiende comillas dentro de campo con espacios: para CSVs con comillas usa awk.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep sysadmin /var/dojo/personal.csv | cut -d, -f4",
        "cmds": [
          {
            "cmd": "grep",
            "args": "sysadmin /var/dojo/personal.csv",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "cut",
            "args": "-d, -f4",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep sysadmin /var/dojo/personal.csv | cut -d, -f4"
  },
  {
    "id": "filtrado-l4",
    "track": "filtrado",
    "index": 0,
    "title": "El saldo outlier",
    "subtitle": "sort, uniq (y -u)",
    "xp": 40,
    "difficulty": 2,
    "brief": "Un volcado de 200O registros duplicados contiene UNA entrada que solo aparece una vez: es la clave. Encontrarla a ojo es imposible.",
    "goal": "En /var/dojo/dupes.txt hay líneas idénticas repetidas y una sola única. Extrae esa línea: contiene la flag.",
    "keywords": [
      "sort",
      "uniq"
    ],
    "hints": [
      "sort -u solo muestra cada línea única (elimina repetidos).",
      "La línea de la flag jamás se repetía: sort -u la destruye y uniq -d marca repetidos."
    ],
    "cheatsheet": [
      {
        "cmd": "sort fichero",
        "desc": "ordena alfabético"
      },
      {
        "cmd": "sort -u fichero",
        "desc": "ordena eliminando repetidos"
      },
      {
        "cmd": "sort fichero | uniq -c | sort -rn",
        "desc": "cuenta frecuencias"
      }
    ],
    "teach": "`sort` ordena alfabético/numéricamente (-n, -r, -u sin repetidos). `uniq` solo es útil después de sort (compara líneas adyacentes): `uniq -d` enseña los repetidos y `uniq -c` los cuenta.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}\nhash-estándar-0\nhash-estándar-1\nhash-estándar-10\nhash-estándar-11\nhash-estándar-2\nhash-estándar-3\nhash-estándar-4\nhash-estándar-5\nhash-estándar-6\nhash-estándar-7\nhash-estándar-8\nhash-estándar-9\nregistro-repetido-0\nregistro-repetido-1\nregistro-repetido-2\nregistro-repetido-3\nregistro-repetido-4\nregistro-repetido-5\nregistro-repetido-6"
      }
    ],
    "steps": [
      {
        "raw": "sort -u /var/dojo/dupes.txt",
        "cmds": [
          {
            "cmd": "sort",
            "args": "-u /var/dojo/dupes.txt",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-u",
                "meaning": "elimina duplicados tras ordenar"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sort -u /var/dojo/dupes.txt"
  },
  {
    "id": "filtrado-l5",
    "track": "filtrado",
    "index": 0,
    "title": "Codificado a mano",
    "subtitle": "tr",
    "xp": 45,
    "difficulty": 2,
    "brief": "Un agente paranoico escribió la contraseña separando cada letra con espacios y añadiendo otro tanto de relleno. La buena noticia: el comando tr sabe borrar caracteres como quien barre el suelo.",
    "goal": "En /var/dojo/ofuscado.txt la flag está con espacios entre cada carácter. Convierte a la flag original y muéstrala.",
    "keywords": [
      "tr"
    ],
    "hints": [
      "tr pasa conjuntos: tr -d elimina un conjunto de caracteres.",
      "tr -d ' ' borra espacios… casi todo el trabajo."
    ],
    "cheatsheet": [
      {
        "cmd": "tr conjunto otro",
        "desc": "traduce conjuntos de stdin"
      },
      {
        "cmd": "tr -d ' '",
        "desc": "borra espacios"
      },
      {
        "cmd": "cat f | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "desc": "rot13 móvil"
      }
    ],
    "teach": "`tr` traduce/borra conjuntos de un stream: `tr a-z A-Z` capitaliza, `tr -d ' ' ` limpia. Recuerda: tr no acepta ficheros, necesita stdin (pipe o redirección). Ofuscaciones simples como rot13 también son tr.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /var/dojo/ofuscado.txt | tr -d ' '",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/var/dojo/ofuscado.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "tr",
            "args": "-d  ",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "elimina los caracteres del conjunto dado"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat /var/dojo/ofuscado.txt | tr -d ' '"
  },
  {
    "id": "filtrado-l6",
    "track": "filtrado",
    "index": 6,
    "title": "La cola de la bitácora",
    "subtitle": "tail -n +N y recortes con head",
    "xp": 35,
    "difficulty": 2,
    "brief": "La bitácora acumula cientos de líneas de latidos. El incidente quedó anotado en la cola: desde la línea 360.",
    "goal": "Imprime las 20 primeras líneas a partir del renglón 360 de /home/agent/bitacora.log.",
    "keywords": [
      "tail",
      "head",
      "ventana",
      "logs"
    ],
    "hints": [
      "tail -n +360 incluye la línea 360 como primera de la salida.",
      "Encadena con head -n 20 para recortar la ventana.",
      "tail -n +360 bitacora.log | head -n 20"
    ],
    "cheatsheet": [
      {
        "cmd": "tail -n +N f",
        "desc": "desde la línea N al final"
      },
      {
        "cmd": "tail -n 20 f",
        "desc": "últimas 20 líneas"
      }
    ],
    "teach": "tail -n +N lee DESDE la línea N hasta el final; head -n M corta. La combinación «desde + recorte» es el patrón estándar para inspeccionar tramos de logs enormes.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "linea 360 anomalia detectada: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nlinea 365 latido\nlinea 366 latido\nlinea 367 latido\nlinea 368 latido\nlinea 369 latido\nlinea 370 latido\nlinea 371 latido\nlinea 372 latido\nlinea 373 latido\nlinea 374 latido\nlinea 375 latido\nlinea 376 latido\nlinea 377 latido\nlinea 378 latido\nlinea 379 latido\nlinea 380 latido\nlinea 381 latido\nlinea 382 latido\nlinea 383 latido"
      }
    ],
    "steps": [
      {
        "raw": "tail -n +360 /home/agent/bitacora.log | head -n 20",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-n +360 /home/agent/bitacora.log",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 20",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 20",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 20)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tail -n +360 /home/agent/bitacora.log | head -n 20"
  },
  {
    "id": "filtrado-l7",
    "track": "filtrado",
    "index": 7,
    "title": "CSV de servidores",
    "subtitle": "grep fila + cut columna",
    "xp": 35,
    "difficulty": 2,
    "brief": "servidores.csv guarda notas por columnas: nombre, rol, comentario. Las filas de backup traen un comentario especial.",
    "goal": "De las filas cuyo ROL sea \"backup\", imprime solo el COMENTARIO (tercera columna).",
    "keywords": [
      "cut",
      "csv",
      "delimitador",
      "grep"
    ],
    "hints": [
      "Primero selecciona filas: grep backup servidores.csv.",
      "Luego corta la tercera columna: cut -d, -f3 (el delimitador es la coma).",
      "grep backup servidores.csv | cut -d, -f3"
    ],
    "cheatsheet": [
      {
        "cmd": "cut -d, -f3 f",
        "desc": "tercera columna separada por comas"
      },
      {
        "cmd": "grep patron f",
        "desc": "filtra líneas"
      }
    ],
    "teach": "cut descuartiza cada línea por un delimitador (-d) y elige campos con -f. Encadenar grep (filas) + cut (columnas) resuelve la mayoría de tablas CSV del mundo real.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "nota de boveda: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nnas secundario"
      }
    ],
    "steps": [
      {
        "raw": "grep ',backup,' /home/agent/servidores.csv | cut -d, -f3",
        "cmds": [
          {
            "cmd": "grep",
            "args": ",backup, /home/agent/servidores.csv",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "cut",
            "args": "-d, -f3",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep ',backup,' /home/agent/servidores.csv | cut -d, -f3"
  },
  {
    "id": "filtrado-l8",
    "track": "filtrado",
    "index": 8,
    "title": "Ranking de puntuaciones",
    "subtitle": "sort numérico descendente",
    "xp": 35,
    "difficulty": 2,
    "brief": "puntuaciones.txt lista jugadores y puntos desordenados. El campeón (el que más suma) lleva un premio especial en su renglón.",
    "goal": "Ordena por puntos de mayor a menor y muestra la primera línea.",
    "keywords": [
      "sort",
      "ranking",
      "numérico"
    ],
    "hints": [
      "sort necesita saber que la columna 2 es numérica.",
      "-k2 elige el campo, -n lo trata por valor y -r invierte el orden.",
      "sort -k2 -nr puntuaciones.txt | head -n 1"
    ],
    "cheatsheet": [
      {
        "cmd": "sort -k2 -nr f",
        "desc": "mayor a menor por columna 2"
      },
      {
        "cmd": "sort -u f",
        "desc": "ordena y quita repetidos"
      }
    ],
    "teach": "sort ordena líneas completas por defecto; -k2 -nr ordena por el segundo campo numéricamente y en descenso. head -n 1 toma el campeón.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "campeon 1600 nota del orgullo: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sort -k2 -nr /home/agent/puntuaciones.txt | head -n 1",
        "cmds": [
          {
            "cmd": "sort",
            "args": "-k2 -nr /home/agent/puntuaciones.txt",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-k",
                "meaning": "ordena por columna concreta (k2 = segunda)"
              },
              {
                "flag": "-n",
                "meaning": "orden numérico"
              },
              {
                "flag": "-r",
                "meaning": "inverso (descendente)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sort -k2 -nr /home/agent/puntuaciones.txt | head -n 1"
  },
  {
    "id": "filtrado-l9",
    "track": "filtrado",
    "index": 9,
    "title": "El visitante solitario",
    "subtitle": "uniq -c: contar repetidos",
    "xp": 40,
    "difficulty": 3,
    "brief": "Un usuario accedió solo UNA vez al sistema: los demás repiten decenas de veces. El solitario dejó su marca.",
    "goal": "Encuentra la línea que aparece exactamente una vez en /home/agent/accesos.txt (tras quitar repetidos) y muéstrala.",
    "keywords": [
      "uniq",
      "sort",
      "frecuencia"
    ],
    "hints": [
      "uniq solo agrupa repetidos CONSECUTIVOS: antes pásalo por sort.",
      "uniq -c antepone el contador a cada línea.",
      "sort accesos.txt | uniq -c | grep \" 1 \""
    ],
    "cheatsheet": [
      {
        "cmd": "sort f | uniq -c",
        "desc": "cuenta repeticiones"
      },
      {
        "cmd": "uniq -c | grep ' 1 '",
        "desc": "solo únicos"
      }
    ],
    "teach": "El tándem sort | uniq -c es la herramienta de frecuencias: cuenta cuántas veces aparece cada valor. El contador ocupa la primera columna: úsalo para filtrar.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "      1 firma única: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sort /home/agent/accesos.txt | uniq -c | grep ' 1 '",
        "cmds": [
          {
            "cmd": "sort",
            "args": "/home/agent/accesos.txt",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": []
          },
          {
            "cmd": "uniq",
            "args": "-c",
            "why": "comprime líneas duplicadas ADYACENTES (por eso casi siempre va tras sort)",
            "flags": [
              {
                "flag": "-c",
                "meaning": "prefija cada línea con su nº de repeticiones"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": " 1 ",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sort /home/agent/accesos.txt | uniq -c | grep ' 1 '"
  },
  {
    "id": "filtrado-l10",
    "track": "filtrado",
    "index": 10,
    "title": "El eco de la palabra",
    "subtitle": "rev + paste para detectar espejos",
    "xp": 45,
    "difficulty": 3,
    "brief": "En frases.txt una línea es un espejo perfecto (palíndromo). La marca no está EN el espejo: está en la línea siguiente.",
    "goal": "Encuentra la línea palíndromo de /home/agent/frases.txt e imprime la línea CONSECUTIVA (la que va después).",
    "keywords": [
      "rev",
      "paste",
      "palindromo",
      "awk"
    ],
    "hints": [
      "rev le da la vuelta a cada línea; paste une dos ficheros columna a columna (el guión es stdin).",
      "Compara la original con su invertida: solo el palíndromo coincide. awk marca el número de esa línea.",
      "n linde=$(rev frases.txt | paste frases.txt - | awk -F\"\\t\" \"$1==$2{print NR; exit}\"); sed -n \"$((n+1))p\" frases.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "rev f",
        "desc": "invierte cada línea"
      },
      {
        "cmd": "paste a -",
        "desc": "une fichero y stdin en columnas"
      }
    ],
    "teach": "rev invierte el texto y paste fusiona columnas (el símbolo - representa stdin). La comparación por campos de awk localiza el espejo; una vez localizado, el sigiente renglón esconde el premio: primero ENCOTRRA, luego MUEVE.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "marca espejada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sed -n \"$(rev /home/agent/frases.txt | paste /home/agent/frases.txt - | awk -F'\\t' '$1==$2{print NR+1; exit}')p\" /home/agent/frases.txt",
        "cmds": [
          {
            "cmd": "sed",
            "args": "-n $(rev /home/agent/frases.txt | paste /home/agent/frases.txt - | awk -F'\\t' '$1==$2{print NR+1; exit}')p /home/agent/frases.txt",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": [
              {
                "flag": "-n",
                "meaning": "suprime la impresión automática (útil con el comando p)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sed -n \"$(rev /home/agent/frases.txt | paste /home/agent/frases.txt - | awk -F'\\t' '$1==$2{print NR+1; exit}')p\" /home/agent/frases.txt"
  },
  {
    "id": "filtrado-l11",
    "track": "filtrado",
    "index": 11,
    "title": "La franja horaria",
    "subtitle": "grep -E con regex de hora",
    "xp": 40,
    "difficulty": 3,
    "brief": "El registro de intentos usa formato HH:MM. Todo lo salido entre las 15:00 y las 15:59 es investigación legítima.",
    "goal": "Imprime las líneas cuyo campo de hora empiece por \"15:\".",
    "keywords": [
      "grep -E",
      "regex",
      "ancla",
      "log"
    ],
    "hints": [
      "El ancla ^ fija el patrón al principio de cada línea.",
      "grep -E activa expresiones regulares extendidas.",
      "grep -E '^15:' intentos.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E '^17:' f",
        "desc": "filtra por prefijo"
      },
      {
        "cmd": "grep -c patron f",
        "desc": "solo cuenta ocurrencias"
      }
    ],
    "teach": "grep -E abre el repertorio de regex: ^ ancla al inicio, $ al final, [] clases de caracteres. Anclar evita falsos positivos en cualquier parte del texto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "15:20 baliza registrada: FLAG{d3b09a4f7c2e1b8d6041a5f3}\n15:47 segunda baliza confirmada"
      }
    ],
    "steps": [
      {
        "raw": "grep -E '^15:' /home/agent/intentos.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E ^15: /home/agent/intentos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E '^15:' /home/agent/intentos.log"
  },
  {
    "id": "filtrado-l12",
    "track": "filtrado",
    "index": 12,
    "title": "Basura de Windows",
    "subtitle": "tr: limpiar CR y espacios repetidos",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un fichero importado de Windows trae retornos de carro (\\\\r) y espacios dobles; la línea de la clave está enterrada ahí, deformada.",
    "goal": "Limpia /home/agent/importado.txt (quita \\\\r y comprime espacios múltiples a uno) y muestra la línea de la clave.",
    "keywords": [
      "tr",
      "CRLF",
      "normalizar"
    ],
    "hints": [
      "La \\\\r (retorno de carro de Windows) se borra con tr -d '\\\\r'.",
      "tr -s ' ' aprieta las repeticiones del espacio a una sola.",
      "tr -d '\\\\r' < importado.txt | tr -s ' ' | grep clave"
    ],
    "cheatsheet": [
      {
        "cmd": "tr -d '\\\\r'",
        "desc": "borra retorno de carro"
      },
      {
        "cmd": "tr -s ' '",
        "desc": "aprieta espacios repetidos"
      }
    ],
    "teach": "tr traduce o borra caracteres de stdin: -d borra, -s comprime repeticiones. Normalizar la entrada (CRLF, espacios, mayúsculas) antes de filtrar evita falsos negativos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "clave maestra: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tr -d '\\r' < /home/agent/importado.txt | tr -s ' ' | grep 'clave'",
        "cmds": [
          {
            "cmd": "tr",
            "args": "-d \\r < /home/agent/importado.txt",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "elimina los caracteres del conjunto dado"
              }
            ]
          },
          {
            "cmd": "tr",
            "args": "-s  ",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man tr»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "clave",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "tr -d '\\r' < /home/agent/importado.txt | tr -s ' ' | grep 'clave'"
  },
  {
    "id": "filtrado-l13",
    "track": "filtrado",
    "index": 13,
    "title": "Veinte bytes",
    "subtitle": "head -c: cortar por bytes",
    "xp": 35,
    "difficulty": 2,
    "brief": "data.bin empieza exactamente con la pieza (y luego basura de relleno). El flag completo cabe en los primeros 40 bytes.",
    "goal": "Muestra los primeros 40 bytes de /home/agent/data.bin.",
    "keywords": [
      "head",
      "bytes",
      "binario"
    ],
    "hints": [
      "-n cuenta LÍNEAS; -c cuenta BYTES: para binarios usa -c.",
      "La pieza (30 caracteres) más relleno: 40 bytes bastan.",
      "head -c 40 /home/agent/data.bin"
    ],
    "cheatsheet": [
      {
        "cmd": "head -c 40 f",
        "desc": "primeros 40 bytes"
      },
      {
        "cmd": "tail -c +10 f",
        "desc": "desde el byte 10 al final"
      }
    ],
    "teach": "head -c es la navaja para binarios y logs binarios mezclados: cortas por bytes sin cortar líneas imposibles. Combinado con tail -c +S lees \"ventanas\" de ficheros gigantes.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3} RELLENO R"
      }
    ],
    "steps": [
      {
        "raw": "head -c 40 /home/agent/data.bin",
        "cmds": [
          {
            "cmd": "head",
            "args": "-c 40 /home/agent/data.bin",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man head»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "head -c 40 /home/agent/data.bin"
  },
  {
    "id": "filtrado-l14",
    "track": "filtrado",
    "index": 14,
    "title": "Desde la línea doce",
    "subtitle": "tail -n +N: leer desde una línea",
    "xp": 35,
    "difficulty": 2,
    "brief": "bitacora.txt tiene una cabecera de once líneas de rutina. La primera línea ÚTIL (la doce) lleva la marca.",
    "goal": "Muestra únicamente la línea 12 de /home/agent/bitacora.txt (desde la 12, una sola).",
    "keywords": [
      "tail",
      "head",
      "lineas"
    ],
    "hints": [
      "tail -n +12 imprime DESDE la línea 12 hasta el final (¡el + cambia el significado!).",
      "Encadena con head -n1 para quedarte solo la primera.",
      "tail -n +12 /home/agent/bitacora.txt | head -n1"
    ],
    "cheatsheet": [
      {
        "cmd": "tail -n +12 f",
        "desc": "desde la línea 12"
      },
      {
        "cmd": "sed -n 12p f",
        "desc": "exactamente la 12"
      }
    ],
    "teach": "tail -n +N es \"desde la línea N\": el + invierte el papel de tail. La pareja tail -n +N | head -nM es la ventana de lectura clásica de logs gigantes.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "entrada útil: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tail -n +12 /home/agent/bitacora.txt | head -n1",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-n +12 /home/agent/bitacora.txt",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tail -n +12 /home/agent/bitacora.txt | head -n1"
  },
  {
    "id": "filtrado-l15",
    "track": "filtrado",
    "index": 15,
    "title": "El menor de todos",
    "subtitle": "sort -n sobre números",
    "xp": 35,
    "difficulty": 2,
    "brief": "cuenta.csv lista codigosnuméricos desordenados. La fila con el número más pequeño lleva la pieza.",
    "goal": "Ordena numéricamente /home/agent/cuenta.csv y muestra la primera fila (el menor).",
    "keywords": [
      "sort",
      "numericos",
      "head"
    ],
    "hints": [
      "sort sin flags ordena LEXICOGRÁFICAMENTE: 1500 quedará antes que 87.",
      "sort -n compara la cabecera numérica de cada línea.",
      "sort -n /home/agent/cuenta.csv | head -n1"
    ],
    "cheatsheet": [
      {
        "cmd": "sort -n f",
        "desc": "orden numérico"
      },
      {
        "cmd": "sort -u f",
        "desc": "ordenado y sin duplicados"
      }
    ],
    "teach": "sort -n ordena por valor numérico (sort -h entiende sufijos 2K/3M). Sin -n, \"10\" < \"9\": el bug clásico de los informes mal ordenados.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "3 nota: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sort -n /home/agent/cuenta.csv | head -n1",
        "cmds": [
          {
            "cmd": "sort",
            "args": "-n /home/agent/cuenta.csv",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-n",
                "meaning": "orden numérico"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sort -n /home/agent/cuenta.csv | head -n1"
  },
  {
    "id": "filtrado-l16",
    "track": "filtrado",
    "index": 16,
    "title": "El eco repetido",
    "subtitle": "uniq -d: solo las repetidas",
    "xp": 40,
    "difficulty": 3,
    "brief": "visitas.log registra líneas sueltas. Una sola línea aparece repetida (dos veces) y esa esconde la pieza; todas las demás son únicas.",
    "goal": "Extrae la ÚNICA línea repetida de /home/agent/visitas.log.",
    "keywords": [
      "uniq",
      "sort",
      "duplicados"
    ],
    "hints": [
      "uniq solo compara LÍNEAS ADYACENTES: primero sort, después uniq.",
      "uniq -d muestra únicamente las líneas que aparecen más de una vez.",
      "sort /home/agent/visitas.log | uniq -d"
    ],
    "cheatsheet": [
      {
        "cmd": "sort f | uniq -d",
        "desc": "líneas repetidas"
      },
      {
        "cmd": "sort f | uniq -c",
        "desc": "cuenta de cada línea"
      }
    ],
    "teach": "uniq exige adyacencia: sort | uniq es la pareja inseparable. -d (duplicadas), -u (únicas) y -c (contar) cubren el 90 % de los análisis de logs rápidos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "marca FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sort /home/agent/visitas.log | uniq -d",
        "cmds": [
          {
            "cmd": "sort",
            "args": "/home/agent/visitas.log",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": []
          },
          {
            "cmd": "uniq",
            "args": "-d",
            "why": "comprime líneas duplicadas ADYACENTES (por eso casi siempre va tras sort)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "muestra solo las repetidas"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sort /home/agent/visitas.log | uniq -d"
  },
  {
    "id": "filtrado-l17",
    "track": "filtrado",
    "index": 17,
    "title": "El dominio único",
    "subtitle": "cut -d@ + sort -u",
    "xp": 40,
    "difficulty": 3,
    "brief": "correo.txt lista direcciones del mismo proveedor… salvo una. Ese dominio único lleva la pieza en la propia dirección.",
    "goal": "Extrae los dominios (lo que va tras @) de /home/agent/correo.txt y muestra el que solo aparece una vez.",
    "keywords": [
      "cut",
      "dominios",
      "sort"
    ],
    "hints": [
      "cut -d@ -f2 corta por el separador @ y se queda con el segundo campo.",
      "sort -u deja solo los valores únicos; habrá exactamente uno.",
      "cut -d@ -f2 /home/agent/correo.txt | sort -u"
    ],
    "cheatsheet": [
      {
        "cmd": "cut -d@ -f2 f",
        "desc": "campo tras el @"
      },
      {
        "cmd": "sort -u",
        "desc": "desduplicar"
      }
    ],
    "teach": "cut es el cortador de columnas por delimitador (-d) y por campo (-f); awk $2 hace lo mismo con más músculo. Para listas enormes, cut es más barato que awk.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cut -d@ -f2 /home/agent/correo.txt | sort -u | head -n1",
        "cmds": [
          {
            "cmd": "cut",
            "args": "-d@ -f2 /home/agent/correo.txt",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          },
          {
            "cmd": "sort",
            "args": "-u",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-u",
                "meaning": "elimina duplicados tras ordenar"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cut -d@ -f2 /home/agent/correo.txt | sort -u | head -n1"
  },
  {
    "id": "filtrado-l18",
    "track": "filtrado",
    "index": 18,
    "title": "Espacios dobles",
    "subtitle": "tr -s: exprimir espacios",
    "xp": 40,
    "difficulty": 3,
    "brief": "folleto.txt tiene la pieza pixelada por espacios múltiples entre palabra y palabra. Al exprimirlos, la marca reaparece.",
    "goal": "Exprime los espacios (tr -s (squeeze) repetidos) de /home/agent/folleto.txt y extrae la marca con grep.",
    "keywords": [
      "tr",
      "squeeze",
      "grep"
    ],
    "hints": [
      "tr -s \" \" sustituye cada racha de espacios por UNO solo (squeeze).",
      "Después grep -oE con la forma de la marca extrae solo el trozo importante.",
      "tr -s ' ' < /home/agent/folleto.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "tr -s ' ' < f",
        "desc": "un espacio por racha"
      },
      {
        "cmd": "tr 'a-z' 'A-Z' < f",
        "desc": "mayúsculas"
      }
    ],
    "teach": "tr -s exprime repeticiones (espacios, tabs, saltos): limpiar columnas desalineadas antes de cut/awk es su hora de gloria. tr NO acepta ficheros como argumento: redirige con <.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tr -s ' ' < /home/agent/folleto.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "tr",
            "args": "-s   < /home/agent/folleto.txt",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man tr»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tr -s ' ' < /home/agent/folleto.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "filtrado-l19",
    "track": "filtrado",
    "index": 19,
    "title": "El evento único",
    "subtitle": "sort + uniq: cazar lo no repetido",
    "xp": 35,
    "difficulty": 2,
    "brief": "> El radar del dojo registró cientos de eventos... y todos se repiten > salvo uno. Regla del dojo: lo que ocurre una sola vez es lo que > importa. Y esa única aparición es la flag.",
    "goal": "Extrae de ~/eventos.txt la única línea que NO está repetida (todas las demás aparecen 2 o más veces).",
    "keywords": [
      "sort",
      "uniq"
    ],
    "hints": [
      "sort necesita ordenar antes de uniq: uniq solo agrupa líneas adyacentes.",
      "uniq -d deja las REPETIDAS; uniq -u se queda con las ÚNICAS.",
      "sort ~/eventos.txt | uniq -u"
    ],
    "cheatsheet": [
      {
        "cmd": "sort fich",
        "desc": "ordena líneas"
      },
      {
        "cmd": "uniq -u",
        "desc": "muestra solo líneas sin repetición"
      },
      {
        "cmd": "uniq -c",
        "desc": "cuenta cuántas veces aparece cada línea"
      }
    ],
    "teach": "uniq compara solo con la línea anterior, así que antes se ordena con sort. -u (unique) imprime únicamente las líneas que no se repiten (descarta copias).\n\n    sort ~/eventos.txt | uniq -u\n\nLa línea del evento exclusivo —conteniendo la flag— es la que sobrevive.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sort ~/eventos.txt | uniq -u",
        "cmds": [
          {
            "cmd": "sort",
            "args": "~/eventos.txt",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": []
          },
          {
            "cmd": "uniq",
            "args": "-u",
            "why": "comprime líneas duplicadas ADYACENTES (por eso casi siempre va tras sort)",
            "flags": [
              {
                "flag": "-u",
                "meaning": "muestra solo las únicas (nunca repetidas)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sort ~/eventos.txt | uniq -u"
  },
  {
    "id": "filtrado-l20",
    "track": "filtrado",
    "index": 20,
    "title": "La fracción exacta",
    "subtitle": "head + tail apilados",
    "xp": 35,
    "difficulty": 2,
    "brief": "> La coral del dojo ensaya una canción de 12 trenzas. El maestro dice: > \"El secreto está en el compás final, pero solo en su primer verso\". > Si sabes cortar por el final y luego por el principio, lo tendrás.",
    "goal": "Muestra la única línea que contiene la flag: es la 10.ª línea del fichero ~/cancion.txt (cuenta desde el final: la tercera contando desde atrás, pero la primera del tramo final).",
    "keywords": [
      "tail",
      "head"
    ],
    "hints": [
      "tail -n N fichero entrega las N últimas líneas.",
      "alto ahí: con head -n 1 te quedas con la primera de ese tramo.",
      "tail -n 3 ~/cancion.txt | head -n 1"
    ],
    "cheatsheet": [
      {
        "cmd": "tail -n N",
        "desc": "últimas N líneas"
      },
      {
        "cmd": "head -n M",
        "desc": "primeras M líneas"
      }
    ],
    "teach": "Se combinan dos \"tijeras\": tail corta por el final y head por el principio.\n\n    tail -n 3 fichero     # el tramo de las 3 últimas líneas\n    | head -n 1           # de ese tramo, la primera\n\nEse es el verso escondido —donde vive la flag—.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tail -n 3 ~/cancion.txt | head -n 1",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-n 3 ~/cancion.txt",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              },
              {
                "flag": "-n 3",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 3)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tail -n 3 ~/cancion.txt | head -n 1"
  },
  {
    "id": "busqueda-l1",
    "track": "busqueda",
    "index": 0,
    "title": "La aguja",
    "subtitle": "grep básico",
    "xp": 35,
    "difficulty": 1,
    "brief": "Una pila de 2000 líneas de acceso al servidor contiene exactamente una línea con la palabra clave del agente. Nadie la va a leer a ojo.",
    "goal": "El fichero /var/log/access.log tiene 2000 líneas. Usa grep para localizar la única línea que empieza por \"FLAG{\" y muéstrala.",
    "keywords": [
      "grep"
    ],
    "hints": [
      "grep PATRÓN fichero imprime las líneas que casan.",
      "grep '^FLAG{' /var/log/access.log ancla al inicio de línea."
    ],
    "cheatsheet": [
      {
        "cmd": "grep patrón fichero",
        "desc": "muestra líneas que contienen el patrón"
      },
      {
        "cmd": "grep -i patrón",
        "desc": "ignora mayúsculas/minúsculas"
      },
      {
        "cmd": "grep -v patrón",
        "desc": "líneas que NO casan"
      }
    ],
    "teach": "`grep` busca en ficheros y streams. Con '^' anclas al principio, '$' al final, '.' vale por cualquier carácter. Añade --color=auto y serás feliz.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3} 200"
      }
    ],
    "steps": [
      {
        "raw": "grep '^FLAG{' /var/log/access.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "^FLAG{ /var/log/access.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep '^FLAG{' /var/log/access.log"
  },
  {
    "id": "busqueda-l2",
    "track": "busqueda",
    "index": 0,
    "title": "Bosque de ficheros",
    "subtitle": "grep -r",
    "xp": 40,
    "difficulty": 2,
    "brief": "Un directorio con decenas de subcarpetas esconde un fichero con la palabra clave. Nadie sabe en cuál: buscar fichero a fichero es perder el día.",
    "goal": "Busca RECURSIVAMENTE en /var/dojo/proyecto la línea que contiene FLAG{ y muestra el resultado completo (fichero y línea).",
    "keywords": [
      "grep-r",
      "recursivo"
    ],
    "hints": [
      "grep -r busca en todos los ficheros de un árbol de carpetas.",
      "grep -rn añade número de línea: tú decides, simplemente -r basta."
    ],
    "cheatsheet": [
      {
        "cmd": "grep -r patrón carpeta",
        "desc": "búsqueda recursiva"
      },
      {
        "cmd": "grep -rn patrón",
        "desc": "incluye número de línea"
      }
    ],
    "teach": "`grep -r patrón carpeta` recorre el árbol completo. Con `grep -rl` puedes listar solo los nombres de fichero. Para combinar con find considera xargs en el nivel 5.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/var/dojo/proyecto/tools/scripts/deploy-notes.txt:código: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -r FLAG /var/dojo/proyecto",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r FLAG /var/dojo/proyecto",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r FLAG /var/dojo/proyecto"
  },
  {
    "id": "busqueda-l3",
    "track": "busqueda",
    "index": 0,
    "title": "Patrón dubitante",
    "subtitle": "regex extendida",
    "xp": 45,
    "difficulty": 2,
    "brief": "El operador trimó la flag entre paréntesis y corchetes, paralelo a un montón de textos de relleno. La regex es la herramienta del detective.",
    "goal": "En /var/dojo/correspondencia.txt cada línea es una frase. La única que contiene FLAG{ seguido de hex y } es la buena. Extrae SOLO la parte FLAG{...} (sin el resto de la frase) usando grep -oE.",
    "keywords": [
      "grep",
      "regex",
      "-oE"
    ],
    "hints": [
      "grep -oE imprime SOLO la parte que casa con la regex (no la línea entera).",
      "Regex: FLAG\\{[0-9a-f]{24}\\}  (escapa la llave con barra invertida)."
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE \"regex\" f",
        "desc": "solo muestra la parte que casa"
      },
      {
        "cmd": "grep -E \"a{2,4}\"",
        "desc": "límites de repetición"
      },
      {
        "cmd": "grep \"\\\\[ficheros\\\\]\"",
        "desc": "escapar especiales con barra invertida"
      }
    ],
    "teach": "`-E` activa regex extendida: {24} significa «24 repeticiones», [0-9a-f] es la clase de dígitos hex. `-o` (only-matching) imprime únicamente el match: perfecto para extraer datos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE 'FLAG\\{[0-9a-f]+\\}' /var/dojo/correspondencia.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[0-9a-f]+\\} /var/dojo/correspondencia.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -oE 'FLAG\\{[0-9a-f]+\\}' /var/dojo/correspondencia.txt"
  },
  {
    "id": "busqueda-l4",
    "track": "busqueda",
    "index": 0,
    "title": "El fichero invisible",
    "subtitle": "find por tamaño y nombre",
    "xp": 45,
    "difficulty": 2,
    "brief": "Un agente minucioso dejó la clave en un fichero cuyo nombre es revelador, pero el árbol es enorme y se llenó de isotopos de directorios con otros ficheros .flag falsos. Los criterios de find son tus binoculares.",
    "goal": "En /var/dojo/archivo hay MÚLTIPLES ficheros llamados .flag (trampas vacías); solo uno pesa 700 bytes cerca del patrón discour. Encuéntralo con find y muéstralo.",
    "keywords": [
      "find"
    ],
    "hints": [
      "find carpeta -name '*.flag' -size +400c lista candidatos."
    ],
    "cheatsheet": [
      {
        "cmd": "find /ruta -name \"*.flag\"",
        "desc": "búsqueda por nombre"
      },
      {
        "cmd": "find /ruta -size +1k",
        "desc": "tamaño en bloques (c=bytes"
      },
      {
        "cmd": "find /ruta -type d",
        "desc": "solo directorios"
      }
    ],
    "teach": "`find carpeta -name X -size +Nc` te filtra por tamaño exacto + nombre. Los criterios se combinan y actúan sobre la salida con `-exec cmd {} \\\\;`; para pipes más libres usa xargs.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FICHERO REAL  cooldown del agente Skywalker.\\nCódigo entregable: FLAG{d3b09a4f7c2e1b8d6041a5f3}\\ncomentario viajero 1\\ncomentario viajero 2\\ncomentario viajero 3\\ncomentario viajero 4\\ncomentario viajero 5\\ncomentario viajero 6\\ncomentario viajero 7\\ncomentario viajero 8\\ncomentario viajero 9\\ncomentario viajero 10\\ncomentario viajero 11\\ncomentario viajero 12\\ncomentario viajero 13\\ncomentario viajero 14\\ncomentario viajero 15\\ncomentario viajero 16\\ncomentario viajero 17\\ncomentario viajero 18\\ncomentario viajero 19\\ncomentario viajero 20\\ncomentario viajero 21\\ncomentario viajero 22\\ncomentario viajero 23\\ncomentario viajero 24\\ncomentario viajero 25\\ncomentario viajero 26\\ncomentario viajero 27\\ncomentario viajero 28\\ncomentario viajero 29\\ncomentario viajero 30\\ncomentario viajero 31\\ncomentario viajero 32\\ncomentario viajero 33\\ncomentario viajero 34\\ncomentario viajero 35\\ncomentario viajero 36\\ncomentario viajero 37\\ncomentario viajero 38\\ncomentario viajero 39\\ncomentario viajero 40\\ncomentario viajero 41\\ncomentario viajero 42\\ncomentario viajero 43\\ncomentario viajero 44\\ncomentario viajero 45\\ncomentario viajero 46\\ncomentario viajero 47\\ncomentario viajero 48\\ncomentar\n  … (+8389 caracteres más — la forma es idéntica)"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(find /var/dojo/archivo -name '*.flag' -size +400c)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(find /var/dojo/archivo -name '*.flag' -size +400c)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(find /var/dojo/archivo -name '*.flag' -size +400c)\""
  },
  {
    "id": "busqueda-l5",
    "track": "busqueda",
    "index": 0,
    "title": "Pipeline forense",
    "subtitle": "find + xargs (boss)",
    "xp": 60,
    "difficulty": 3,
    "brief": "Un parche con nombres raros (espacios y acentos) esconde el momento en que la clave llegó a /var/dojo/cartera. Tienes que find it + xargs o grep -r; elige tu arma.",
    "goal": "En algún fichero del árbol /var/dojo/cartera hay una línea con la marca FLAG{. Localiza el fichero con find/grep -r y muestra la línea completa con el contenido.",
    "keywords": [
      "find",
      "xargs",
      "boss"
    ],
    "hints": [
      "grep -r FLAG{ /var/dojo/cartera muestra fichero y línea de golpe."
    ],
    "cheatsheet": [
      {
        "cmd": "find ruta | xargs cmd",
        "desc": "aplica cmd a los resultados"
      },
      {
        "cmd": "xargs -0",
        "desc": "separador nulo (nombres con espacios)"
      }
    ],
    "teach": "La combinación `find … | xargs command` canaliza resultados a otros comandos; con nombres raros usa `find … -print0 | xargs -0 cmd`. `grep -r` ya hace esto por ti si buscas PATRÓN en un árbol.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/var/dojo/cartera/asuntos pendientes/dir dos/nota reservada.txt:transacción aprobada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -r FLAG /var/dojo/cartera",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r FLAG /var/dojo/cartera",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r FLAG /var/dojo/cartera"
  },
  {
    "id": "busqueda-l6",
    "track": "busqueda",
    "index": 6,
    "title": "Recorrer el árbol",
    "subtitle": "grep -r recursivo",
    "xp": 35,
    "difficulty": 2,
    "brief": "En proyecto/ hay subcarpetas y subcarpetas de subcarpetas. La clave está en UN fichero cualquiera del árbol.",
    "goal": "Encuentra y muestra la línea que contiene la clave en todo /home/agent/proyecto.",
    "keywords": [
      "grep -r",
      "recursivo",
      "arbol"
    ],
    "hints": [
      "Una búsqueda en una sola carpeta NO basta: el tesoro está en un subnivel.",
      "grep -r desciende por todo el árbol de directorios.",
      "grep -r 'FLAG{' /home/agent/proyecto"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -rn 'x' dir/",
        "desc": "busca e indica línea"
      },
      {
        "cmd": "grep -r --include='*.md' x dir",
        "desc": "restringe por extensión"
      }
    ],
    "teach": "grep -r busca recursivamente en todos los ficheros de un árbol; combinado con -n indica fichero y línea del hallazgo. Es la linterna para cuando no sabes dónde está.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/proyecto/docs/dev/secretos.md:-> FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -r 'FLAG{' /home/agent/proyecto",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r FLAG{ /home/agent/proyecto",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r 'FLAG{' /home/agent/proyecto"
  },
  {
    "id": "busqueda-l7",
    "track": "busqueda",
    "index": 7,
    "title": "Sospechosos de root",
    "subtitle": "find -user (y su negación)",
    "xp": 40,
    "difficulty": 3,
    "brief": "En vault/ casi todo es del agente, pero alguien dejó objetos propiedad de root. El propietario delata el escondite.",
    "goal": "Hallar los ficheros de /home/agent/vault que NO pertenecen a agent y mostrar su contenido.",
    "keywords": [
      "find",
      "-user",
      "-exec",
      "propietario"
    ],
    "hints": [
      "find -user agent lista lo suyo; con ! lo inviertes.",
      "-type f limita a ficheros; -exec cat {} \\\\; imprime cada hallazgo.",
      "find vault ! -user agent -type f -exec cat {} \\\\;"
    ],
    "cheatsheet": [
      {
        "cmd": "find dir ! -user agent",
        "desc": "ficheros de otros dueños"
      },
      {
        "cmd": "find dir -type f -exec cat {} \\\\;",
        "desc": "imprime todos"
      }
    ],
    "teach": "find filtra por usuario (-user), tipo, tamaño, tiempo… y ejecuta acciones con -exec. La negación ! invierte cualquier criterio: aquí, porque el testigo es lo que NO es tuyo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "etiqueta cambiada\ntesoro de root: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /home/agent/vault ! -user agent -type f -exec cat {} ;",
        "cmds": [
          {
            "cmd": "find",
            "args": "/home/agent/vault ! -user agent -type f -exec cat {} ;",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-u",
                "meaning": "flag u del comando — revisa «man find»"
              },
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man find»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /home/agent/vault ! -user agent -type f -exec cat {} \\;"
  },
  {
    "id": "busqueda-l8",
    "track": "busqueda",
    "index": 8,
    "title": "Purga de basura",
    "subtitle": "find -name + -delete",
    "xp": 35,
    "difficulty": 2,
    "brief": "work/ está lleno de ficheros .tmp que ocultan los reales a simple vista. Limpia primero, busca después.",
    "goal": "Borra todos los .tmp de /home/agent/work y muestra la línea de la clave que queda.",
    "keywords": [
      "find -delete",
      "limpieza",
      "xargs"
    ],
    "hints": [
      "find -name \"*.tmp\" selecciona por patrón de nombre.",
      "La acción -delete elimina lo que casa (haz un ls antes para confirmar).",
      "find work -name '*.tmp' -delete && grep -r FLAG work"
    ],
    "cheatsheet": [
      {
        "cmd": "find d -name '*.tmp'",
        "desc": "previsualiza qué borrarás"
      },
      {
        "cmd": "find d -name '*.tmp' -delete",
        "desc": "borra lo casado"
      }
    ],
    "teach": "find + -delete es la escoba quirúrgica: muy potente, así que previsualiza el listado sin ella antes. Tras la limpieza, los nombres verdaderos emergen.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/work/nota-real-01.txt:el resto no es basura: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /home/agent/work -name '*.tmp' -delete",
        "cmds": [
          {
            "cmd": "find",
            "args": "/home/agent/work -name *.tmp -delete",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man find»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-d",
                "meaning": "flag d del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-l",
                "meaning": "flag l del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep -r 'FLAG{' /home/agent/work",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r FLAG{ /home/agent/work",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /home/agent/work -name '*.tmp' -delete; grep -r 'FLAG{' /home/agent/work"
  },
  {
    "id": "busqueda-l9",
    "track": "busqueda",
    "index": 9,
    "title": "Contraseña sospechosa",
    "subtitle": "grep -E con prefijos compuestos",
    "xp": 40,
    "difficulty": 3,
    "brief": "logins.txt anota intentos con formato user=… pass=…. Solo las passwords que empiezan por el prefijo s3cr3t delatan al intruso.",
    "goal": "Muestra las líneas cuya contraseña empiece por s3cr3t.",
    "keywords": [
      "grep -E",
      "logins",
      "prefijo"
    ],
    "hints": [
      "El patrón debe fijarse al literal pass= para no casar nada más.",
      "grep -E soporta prefijos textuales y clases a la vez.",
      "grep -E 'pass=s3cr3t' logins.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E 'k=v' f",
        "desc": "casa campo=valor"
      },
      {
        "cmd": "grep -v 'descarto' f",
        "desc": "excluye líneas"
      }
    ],
    "teach": "Incluir contexto en la regex (pass=s3cr3t) evita sacar coincidencias sueltas: la fuerza de grep -E está en describir la ESTRUCTURA de la línea, no solo un trozo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "user=intruso pass=s3cr3t-clave: FLAG{d3b09a4f7c2e1b8d6041a5f3} desde=tor"
      }
    ],
    "steps": [
      {
        "raw": "grep -E 'pass=s3cr3t' /home/agent/logins.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E pass=s3cr3t /home/agent/logins.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E 'pass=s3cr3t' /home/agent/logins.txt"
  },
  {
    "id": "busqueda-l10",
    "track": "busqueda",
    "index": 10,
    "title": "Mindepth: el pozo",
    "subtitle": "solo ficheros en niveles profundos",
    "xp": 45,
    "difficulty": 3,
    "brief": "El maze/ reparte ficheros en todos los niveles, pero el tesoro está solo en la capa 3 o más profunda.",
    "goal": "Muestra los ficheros que están a profundidad 3 o más dentro de /home/agent/maze.",
    "keywords": [
      "find",
      "mindepth",
      "profundidad"
    ],
    "hints": [
      "find gradúa la profundidad con -mindepth N (la carpeta raíz cuenta con el nivel 0).",
      "-type f deja solo ficheros, no directorios.",
      "find maze -mindepth 3 -type f -exec cat {} \\\\;"
    ],
    "cheatsheet": [
      {
        "cmd": "find d -mindepth 2 -name x",
        "desc": "desde el nivel 2 hacia abajo"
      },
      {
        "cmd": "find d -maxdepth 1 -type d",
        "desc": "solo capas directas"
      }
    ],
    "teach": "-mindepth/-maxdepth acotan la profundidad de la búsqueda: imprescindible cuando el árbol tiene capas de señuelos. La raíz cuenta como nivel 0.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "otra sombra\nnivel intermedio\nen el fondo del pozo: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /home/agent/maze -mindepth 3 -type f -exec cat {} ;",
        "cmds": [
          {
            "cmd": "find",
            "args": "/home/agent/maze -mindepth 3 -type f -exec cat {} ;",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man find»"
              },
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man find»"
              },
              {
                "flag": "-d",
                "meaning": "flag d del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-h",
                "meaning": "flag h del comando — revisa «man find»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /home/agent/maze -mindepth 3 -type f -exec cat {} \\;"
  },
  {
    "id": "busqueda-l11",
    "track": "busqueda",
    "index": 11,
    "title": "Pesados con escondite",
    "subtitle": "find -size + la cola del fichero",
    "xp": 45,
    "difficulty": 3,
    "brief": "En block/ hay ficheros gordos de relleno; en la cola de uno de ellos se guarda la clave.",
    "goal": "Localiza los ficheros de más de 100 KB y muestra los últimos 90 bytes de cada uno.",
    "keywords": [
      "find -size",
      "tail -c",
      "bytes"
    ],
    "hints": [
      "find -size +100k filtra por tamaño (k=kilobytes) y descarta lotes menores.",
      "La cola del fichero se lee con tail -c N (número de bytes).",
      "for f in $(find block -size +100k); do tail -c 90 \"$f\"; echo; done"
    ],
    "cheatsheet": [
      {
        "cmd": "find d -size +100k",
        "desc": "ficheros de más de 100 KB"
      },
      {
        "cmd": "tail -c 90 f",
        "desc": "últimos 90 bytes"
      }
    ],
    "teach": "find -size clasifica por tamaño real (c, k, M…); tail -c lee bytes, no líneas. Muchos troyanos anexan su carga al final de ficheros legítimos: mirar la cola es rutina forense.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz\nwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww\nclave final: FLAG{d3b09a4f7c2e1b8d6041a5f3}\n\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy"
      }
    ],
    "steps": [
      {
        "raw": "for f in $(find /home/agent/block -size +100k)",
        "cmds": [
          {
            "cmd": "for",
            "args": "f in $(find /home/agent/block -size +100k)",
            "why": "comando for — revisa «man for»",
            "flags": [
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man for»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man for»"
              },
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man for»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man for»"
              }
            ]
          }
        ]
      },
      {
        "raw": "do tail -c 90 \"$f\"",
        "cmds": [
          {
            "cmd": "do",
            "args": "tail -c 90 $f",
            "why": "comando do — revisa «man do»",
            "flags": [
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man do»"
              }
            ]
          }
        ]
      },
      {
        "raw": "echo",
        "cmds": [
          {
            "cmd": "echo",
            "args": "",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      },
      {
        "raw": "done",
        "cmds": [
          {
            "cmd": "done",
            "args": "",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "for f in $(find /home/agent/block -size +100k); do tail -c 90 \"$f\"; echo; done"
  },
  {
    "id": "busqueda-l12",
    "track": "busqueda",
    "index": 12,
    "title": "Configuración filtrada",
    "subtitle": "grep -r --include",
    "xp": 50,
    "difficulty": 4,
    "brief": "En /etc/arena/ hay ficheros .conf, .log y .bak mezclados. Solo los .conf cuentan para la validación.",
    "goal": "Busca la clave SOLO dentro de los ficheros *.conf de /etc/arena.",
    "keywords": [
      "grep",
      "include",
      "exclude",
      "conf"
    ],
    "hints": [
      "grep -r recorre el árbol; --include=\"*.conf\" acota los nombres que inspecciona.",
      "La marca puede estar en cualquier fichero: el include evita confusiones.",
      "grep -rn 'FLAG{' /etc/arena --include='*.conf'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -rn x d --include='*.conf'",
        "desc": "solo .conf, indicando línea"
      },
      {
        "cmd": "grep -rn x d --exclude='*.log'",
        "desc": "descarta ruido"
      }
    ],
    "teach": "--include (y su contrario --exclude) en grep -r filtra POR NOMBRE de fichero mientras el -r recorre el árbol: la pareja ideal para auditorías de configuración.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/etc/arena/llave.conf:1:nitro = FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -rn 'FLAG{' /etc/arena --include='*.conf'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-rn FLAG{ /etc/arena --include=*.conf",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              },
              {
                "flag": "-n",
                "meaning": "numera las líneas coincidentes"
              },
              {
                "flag": "--include=*.conf",
                "meaning": "patrones de ficheros a incluir en la búsqueda"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -rn 'FLAG{' /etc/arena --include='*.conf'"
  },
  {
    "id": "busqueda-l13",
    "track": "busqueda",
    "index": 13,
    "title": "Recorrido recursivo",
    "subtitle": "grep -r en un árbol",
    "xp": 40,
    "difficulty": 3,
    "brief": "El árbol ~/proyecto tiene archivos .js, .md y .txt anidados en profundidad. La pieza está en UNO, en cualquier nivel.",
    "goal": "Busca recursivamente la marca en todo /home/agent/proyecto y extráela.",
    "keywords": [
      "grep",
      "find",
      "recursivo"
    ],
    "hints": [
      "grep -r recorre directorios en profundidad sin que tengas que listarlos.",
      "Añade -oE con la forma de la marca para quedarte solo el trozo útil.",
      "grep -r -oE 'FLAG\\{[a-f0-9]+\\}' /home/agent/proyecto"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -r patrón dir",
        "desc": "busca recursiva"
      },
      {
        "cmd": "grep -rn patrón dir",
        "desc": "con línea y fichero"
      }
    ],
    "teach": "grep -r es el \"buscar en todo el árbol\" de un repo: con -nñades números de línea y con -E patrones. En proyectos reales es la primera pasada del code review forense.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/proyecto/src/lib/legacy/core.js:FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -r -oE 'FLAG\\{[a-f0-9]+\\}' /home/agent/proyecto | head -n1",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r -oE FLAG\\{[a-f0-9]+\\} /home/agent/proyecto",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              },
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r -oE 'FLAG\\{[a-f0-9]+\\}' /home/agent/proyecto | head -n1"
  },
  {
    "id": "busqueda-l14",
    "track": "busqueda",
    "index": 14,
    "title": "Caso y forma",
    "subtitle": "grep -i contra el ruido",
    "xp": 40,
    "difficulty": 3,
    "brief": "auditoria.log escribe el rastreador con mayúsculas y minúsculas dentro de la marca a lo bestia: el grep sensible a la caja se le pierde.",
    "goal": "Encuentra en /home/agent/auditoria.log la marca aunque su caja sea desordenada.",
    "keywords": [
      "grep",
      "logs",
      "ruido"
    ],
    "hints": [
      "grep -i ignora el caso de las letras.",
      "La marca correcta lleva 24 caracteres hex exactos; los señuelos (A9B) se quedan fuera con {24}.",
      "grep -ioE 'FLAG\\{[a-f0-9]{24}\\}' /home/agent/auditoria.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -i p f",
        "desc": "sin distinción de caja"
      },
      {
        "cmd": "grep -ioE 'pat.{3}' f",
        "desc": "extrae por forma"
      }
    ],
    "teach": "-i cuesta algo de rendimiento pero salva la vida en logs donde el emisor escribe a capricho. La regex con {24} exactos discrimina señuelos de verdad sin grep -v.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -ioE 'FLAG\\{[a-f0-9]{24}\\}' /home/agent/auditoria.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-ioE FLAG\\{[a-f0-9]{24}\\} /home/agent/auditoria.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              },
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -ioE 'FLAG\\{[a-f0-9]{24}\\}' /home/agent/auditoria.log"
  },
  {
    "id": "busqueda-l15",
    "track": "busqueda",
    "index": 15,
    "title": "Tocado el mismo día",
    "subtitle": "find -mtime: buscar por fecha",
    "xp": 40,
    "difficulty": 3,
    "brief": "En ~/archivo hay decenas de fichas. Solo UNA se tocó en las últimas 24 horas — y esa, la fresca, es la que importa.",
    "goal": "Localiza con find los ficheros de /home/agent/archivo modificados hoy y muestra el .txt de entre ellos.",
    "keywords": [
      "find",
      "mtime",
      "fecha"
    ],
    "hints": [
      "find -mtime -1 = modificado hace MENOS de 1 día; -mtime +1 en cambio es hace más de 1 día.",
      "Solo un .txt pasará el filtro.",
      "cat $(find /home/agent/archivo -name \"*.txt\" -mtime -1)"
    ],
    "cheatsheet": [
      {
        "cmd": "find dir -mtime -1",
        "desc": "modificado hoy"
      },
      {
        "cmd": "find dir -mmin -60",
        "desc": "última hora"
      }
    ],
    "teach": "find opera por fecha real del fingerprint: -mtime (días), -mmin (minutos) y -newer (frente a otro fichero). Útil para \"¿qué cambió desde el backup?\" de verdad.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "ficha fresca: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat $(find /home/agent/archivo -name '*.txt' -mtime -1)",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(find /home/agent/archivo -name *.txt -mtime -1)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": [
              {
                "flag": "-n",
                "meaning": "numera las líneas al mostrarse"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man cat»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man cat»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man cat»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man cat»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man cat»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man cat»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man cat»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man cat»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat $(find /home/agent/archivo -name '*.txt' -mtime -1)"
  },
  {
    "id": "busqueda-l16",
    "track": "busqueda",
    "index": 16,
    "title": "Mi rastro en /srv",
    "subtitle": "find -user: ficheros por dueño",
    "xp": 40,
    "difficulty": 3,
    "brief": "/srv/repo mezcla ficheros tuyos y de otros usuarios. La tuya de entre todas lleva la pieza — el resto está sin permiso.",
    "goal": "Encuentra en /srv/repo los ficheros propiedad del usuario agent y muestra el que sea legible.",
    "keywords": [
      "find",
      "user",
      "duenos"
    ],
    "hints": [
      "find -user agent devuelve solo lo tuyo.",
      "El nombre del fichero está limpio: cat $(find ... ) lo muestra después.",
      "cat $(find /srv/repo -user agent)"
    ],
    "cheatsheet": [
      {
        "cmd": "find dir -user agent",
        "desc": "por titular"
      },
      {
        "cmd": "find dir -user agent -ls",
        "desc": "con detalles"
      }
    ],
    "teach": "find -user/-group filtran por titular: el \"quién tocó esto\" del audit forense. Los permisos de los demás te acusan también: el sistema te guía hacia lo correcto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "del agent: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /srv/repo/$(find /srv/repo -user agent | head -n1 | xargs basename)",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/srv/repo/$(find /srv/repo -user agent",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": [
              {
                "flag": "-u",
                "meaning": "flag u del comando — revisa «man cat»"
              },
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man cat»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man cat»"
              },
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man cat»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          },
          {
            "cmd": "xargs",
            "args": "basename)",
            "why": "convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /srv/repo/$(find /srv/repo -user agent | head -n1 | xargs basename)"
  },
  {
    "id": "busqueda-l17",
    "track": "busqueda",
    "index": 17,
    "title": "Después del aviso",
    "subtitle": "grep -A: contexto tras la línea",
    "xp": 40,
    "difficulty": 3,
    "brief": "enlace.txt tiene una marca escondida justo tras el aviso \"-AVERIA: cobre-7-\" y dos líneas más abajo. El contexto es el selectret.",
    "goal": "Extrae de /home/agent/enlace.txt la marca que está a 2 líneas de distancia ABAJO del aviso \"AVERIA: cobre-7\".",
    "keywords": [
      "grep",
      "contexto",
      "A"
    ],
    "hints": [
      "grep -A2 muestra las 2 líneas siguientes (After); -B son las previas y -C el contexto por ambas partes.",
      "A la salida puedes re-grepear la forma de la marca para limpiar el aviso.",
      "grep -A2 'AVERIA' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -A2 p f",
        "desc": "2 línas después"
      },
      {
        "cmd": "grep -C2 p f",
        "desc": "por ambos lados"
      }
    ],
    "teach": "Contexto (-A/-B/-C) sustituye \"leerte el log entero\": los sistemas de alerta te llevan a la línea exacta y -A/B te dáan el resto gratis.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -A2 'AVERIA: cobre-7' /home/agent/enlace.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-A2 AVERIA: cobre-7 /home/agent/enlace.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -A2 'AVERIA: cobre-7' /home/agent/enlace.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "busqueda-l18",
    "track": "busqueda",
    "index": 18,
    "title": "Configuraciones escondidas",
    "subtitle": "find -name + -exec",
    "xp": 45,
    "difficulty": 3,
    "brief": "El árbol /etc/dojo está lleno de subdirectorios con ficheros .conf. Uno de ellos lleva la pieza en una línea de comentario.",
    "goal": "Recorre los .conf de /etc/dojo con find y muestra la marca que hay en alguno de ellos.",
    "keywords": [
      "find",
      "exec",
      "conf"
    ],
    "hints": [
      "find -exec corre un comando por cada fichero que pasa el filtro: {} es el nombre del fichero.",
      "grep -h NO imprime el nombre del fichero, solo la línea con la marca.",
      "find /etc/dojo -name '*.conf' -exec grep -hoE 'FLAG\\{[a-f0-9]+\\}' {} \\;"
    ],
    "cheatsheet": [
      {
        "cmd": "find d -name \"*.conf\" -exec cmd {} \\;",
        "desc": "por fichero"
      },
      {
        "cmd": "find d -type f -exec cat {} +",
        "desc": "agrupado"
      }
    ],
    "teach": "find -exec te ahorra el bucle for: cada hallazgo es un {} al cimiento del comando. Con ; ejecuta por fichero y con + los agrupa: ambos son legítimos, el + es más barato.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /etc/dojo -name '*.conf' -exec grep -hoE 'FLAG\\{[a-f0-9]+\\}' {} ;",
        "cmds": [
          {
            "cmd": "find",
            "args": "/etc/dojo -name *.conf -exec grep -hoE FLAG\\{[a-f0-9]+\\} {} ;",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man find»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              },
              {
                "flag": "-h",
                "meaning": "flag h del comando — revisa «man find»"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /etc/dojo -name '*.conf' -exec grep -hoE 'FLAG\\{[a-f0-9]+\\}' {} \\;"
  },
  {
    "id": "busqueda-l19",
    "track": "busqueda",
    "index": 19,
    "title": "La talla exacta",
    "subtitle": "find -size con bytes",
    "xp": 40,
    "difficulty": 3,
    "brief": "> Los archivos del armario \"medidas\" son todos de tallas sospechosas > (2 KiB, 4 KiB...) porque el chapucero que los creó los rellenó con > basura. Solo uno escapó a la hinchazón: ocupa JUSTO 512 bytes. > Ese es el contrabando.",
    "goal": "Encuentra dentro de ~/medidas el fichero cuyo tamaño es EXACTAMENTE 512 bytes (los demás son más grandes) y muestra su contenido.",
    "keywords": [
      "-size"
    ],
    "hints": [
      "find acepta tamaños: -size Nc interpreta N como bytes (\"c\" de chars).",
      "Los señuelos ocupan más (relleno con head -c y /dev/zero).",
      "find ~/medidas -type f -size 512c"
    ],
    "cheatsheet": [
      {
        "cmd": "-size 512c",
        "desc": "tamaño exacto en bytes"
      },
      {
        "cmd": "-size +2k",
        "desc": "mayor que 2 KiB"
      },
      {
        "cmd": "-size -1M",
        "desc": "menor que 1 MiB"
      }
    ],
    "teach": "Con `-size` find filtra por tamaño. El sufijo importa: `c` = bytes exactos, `k` = kibibytes, `M` = mebibytes (y sin sufijo redondea a bloques de 512).\n\n    find ~/medidas -type f -size 512c\n\nY con -exec se lee al vuelo:\n\n    find ~/medidas -type f -size 512c -exec cat {} +",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la joya del gabinete: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd"
      }
    ],
    "steps": [
      {
        "raw": "find ~/medidas -type f -size 512c -exec cat {} +",
        "cmds": [
          {
            "cmd": "find",
            "args": "~/medidas -type f -size 512c -exec cat {} +",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man find»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man find»"
              },
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find ~/medidas -type f -size 512c -exec cat {} +"
  },
  {
    "id": "busqueda-l20",
    "track": "busqueda",
    "index": 20,
    "title": "La colmena silenciosa",
    "subtitle": "find por mtime: el fichero más reciente",
    "xp": 40,
    "difficulty": 3,
    "brief": "> La colmena guarda panales con fechas de fabricación distintas (algunas > desde hace meses). La abeja reina dejó su mensaje en el panal MÁS > NOVEDOSO: el único marcado con fecha de hoy.",
    "goal": "Encuentra en ~/colmena el fichero modificado más recientemente (los demás tienenfechas antiguas) y muestra su contenido.",
    "keywords": [
      "ls",
      "find"
    ],
    "hints": [
      "ls -t ordena por fecha de modificación (la más nueva primero).",
      "find permite probar antigüedad: -mmin -1 son los tocados hace menos de 1 minuto.",
      "jj: ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}"
    ],
    "cheatsheet": [
      {
        "cmd": "ls -t",
        "desc": "ordena por fecha de modificación"
      },
      {
        "cmd": "find -mmin -N",
        "desc": "modificado hace menos de N minutos"
      },
      {
        "cmd": "find -newer FICHERO",
        "desc": "modificado después que otro fichero"
      }
    ],
    "teach": "ls -t reordena por mtime (modificación): el primero es el más reciente. Combinando con head/xargs se lee directamente:\n\n    ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}\n\nO con find, para árboles grandes:\n\n    find ~/colmena -mmin -1 -type f -exec cat {} +\n\n(-mmin -1 = modificado hace menos de 1 minuto).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}",
        "cmds": [
          {
            "cmd": "ls",
            "args": "-t ~/colmena",
            "why": "lista el contenido de un directorio",
            "flags": [
              {
                "flag": "-t",
                "meaning": "ordena por fecha de modificación"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          },
          {
            "cmd": "xargs",
            "args": "-I{} cat ~/colmena/{}",
            "why": "convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)",
            "flags": [
              {
                "flag": "-I",
                "meaning": "marcador de sustitución {}: cada línea va ahí"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ls -t ~/colmena | head -n 1 | xargs -I{} cat ~/colmena/{}"
  },
  {
    "id": "procesado-l1",
    "track": "procesado",
    "index": 0,
    "title": "Awkwarea",
    "subtitle": "awk por columnas",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un servidor registreó intentos de acceso con usuario, IP y mensaje. La única fila del usuario 'root' contiene la clave, pero ocupando la última columna en una línea larga.",
    "goal": "En /var/dojo/accesos.db cada línea tiene 4 campos separados por espacio. Busca con awk la línea cuyo primer campo es \"root\" e imprime SOLO el último campo (contiene FLAG{...}).",
    "keywords": [
      "awk"
    ],
    "hints": [
      "En awk, $1 es el primer campo y $NF el último campo de la línea.",
      "$1 == \"root\" {print $NF} /var/dojo/accesos.db"
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F: '{print $1}' f",
        "desc": "primer campo"
      },
      {
        "cmd": "awk '$1==\"root\"{print}' f",
        "desc": "filtra por condición en awk"
      },
      {
        "cmd": "awk '{print $NF}' f",
        "desc": "último campo de cada línea"
      }
    ],
    "teach": "`awk '{print $N}'` imprime el campo N de cada línea. `$NF` es el último campo y `NR` el número de línea. Con `-F:` cambias el separador de campo (los registros * WTF * con espacios se separan por defecto con espacios).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$1==\"root\"{print $NF}' /var/dojo/accesos.db",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$1==\"root\"{print $NF} /var/dojo/accesos.db",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$1==\"root\"{print $NF}' /var/dojo/accesos.db"
  },
  {
    "id": "procesado-l2",
    "track": "procesado",
    "index": 0,
    "title": "Cirugía de líneas",
    "subtitle": "sed de sustitución",
    "xp": 50,
    "difficulty": 3,
    "brief": "Un informe redactado con spam alrededor de la frase clave. La clave está envuelta en unos corchetes con un delimitador raro que la separa del contexto.",
    "goal": "En /var/dojo/informe.md la única línea con la frase EXTRAIDO ### FLAG{...} ### es la buena. Con sed, extrae SOLO lo que está entre los delimitadores ### ... ### (sin incluirlos) y muéstralo.",
    "keywords": [
      "sed"
    ],
    "hints": [
      "Con sed puedes: sed 's/EXTRAIDO ### \\(.*\\) ###.*/\\1/' coge solo el grupo \\1.",
      "Alternativa moderna: grep -oE '### [^#]+ ###' y recortes con cut."
    ],
    "cheatsheet": [
      {
        "cmd": "sed 's/a/b/' f",
        "desc": "sustituye primera aparición por línea"
      },
      {
        "cmd": "sed 's/a/b/g' f",
        "desc": "sustituye todas (g de global)"
      },
      {
        "cmd": "sed -n '5,10p' f",
        "desc": "imprime líneas 5 a 10"
      }
    ],
    "teach": "La sintaxis documentada de sed `s/PATRON/REEMPLAZO/` es la base de la sustitución. `\\\\(...\\\\)` captura grupos que luego se referencian como `\\\\1` en el reemplazo. Para cortes simples también sirve `cut -d#`.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "# Informe diario de novedades\\nTodo en orden. Rotaciones ejecutadas correctamente.\\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep EXTRAIDO /var/dojo/informe.md | sed 's/EXTRAIDO ### \\(.*\\) ###.*/\\1/'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "EXTRAIDO /var/dojo/informe.md",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "sed",
            "args": "s/EXTRAIDO ### \\(.*\\) ###.*/\\1/",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep EXTRAIDO /var/dojo/informe.md | sed 's/EXTRAIDO ### \\(.*\\) ###.*/\\1/'"
  },
  {
    "id": "procesado-l3",
    "track": "procesado",
    "index": 0,
    "title": "La llave partida",
    "subtitle": "pipes, cat entre ficheros y tee",
    "xp": 45,
    "difficulty": 2,
    "brief": "Por seguridad, la clave se partió en dos mitades que se distribuyeron en dos ficheros. Un buen regresador las une con la tubería adecuada, el mismo flujo… antes de que se pierdan.",
    "goal": "Reconstruye la flag concatenando la 1ª y 2ª mitad de /var/dojo/mitad-a y mitad-b en el orden correcto (sin salto de línea entre ambas) y muéstralo.",
    "keywords": [
      "pipe",
      "tee"
    ],
    "hints": [
      "cat mitada-a mitad-b no funciona bien: mitad-a no acaba en salto de línea, mitad-b sí.",
      "Solución simple: tr -d '\\n' < <(cat mitad-a mitad-b)  — o printf '%s%s\n' \"$(cat mitad-a)\" \"$(cat mitad-b)\"."
    ],
    "cheatsheet": [
      {
        "cmd": "cat a b",
        "desc": "concatena ficheros en salida"
      },
      {
        "cmd": "cmd | tee fichero",
        "desc": "muestra y guarda a la vez"
      },
      {
        "cmd": "cmd > fichero",
        "desc": "sobrescribe; >> añade al final"
      }
    ],
    "teach": "El operador pipe `|` sirve de frente común de los comandos; `tee` duplica un stream hacia fichero y pantalla. Recuerda que cada redirección `>` trunca y `>>` añade (append).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /var/dojo/mitad-a /var/dojo/mitad-b",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/var/dojo/mitad-a /var/dojo/mitad-b",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /var/dojo/mitad-a /var/dojo/mitad-b"
  },
  {
    "id": "procesado-l4",
    "track": "procesado",
    "index": 0,
    "title": "Anomalía en la réplica",
    "subtitle": "diff, comm y sort -u",
    "xp": 50,
    "difficulty": 3,
    "brief": "Un replicador escribió el mismo catálogo en dos ficheros, pero en uno de ellos se escapó una línea con la clave. La sincronización está rota y solo el diff la revela.",
    "goal": "En /var/dojo/replica-a y replica-b hay catálogos idénticos excepto una línea que solo está en replica-a y que empieza por \"CLAVE\". Muéstrala.",
    "keywords": [
      "diff"
    ],
    "hints": [
      "diff fichero-a fichero-b enseña las diferencias; `>` marca lo añadido en el 2º…",
      "Cuando solo existe en el 1º, la línea sale con el prefijo 'a ' en modo diff normal."
    ],
    "cheatsheet": [
      {
        "cmd": "diff a b",
        "desc": "diferencias entre dos ficheros"
      },
      {
        "cmd": "diff -u a b",
        "desc": "formato unificado"
      },
      {
        "cmd": "comm -12 a b",
        "desc": "líneas comunes (ficheros ordenados)"
      }
    ],
    "teach": "`diff` muestra qué cambia de un fichero a otro; `diff -u` muestra con contexto y `comm` compara ficheros ordenados con columnas por único en cada uno. Ambos huelen a UNIX clásicos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "61d60\n< CLAVE FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "diff /var/dojo/replica-a /var/dojo/replica-b",
        "cmds": [
          {
            "cmd": "diff",
            "args": "/var/dojo/replica-a /var/dojo/replica-b",
            "why": "compara dos ficheros línea a línea; -u produce el formato de remiendo (contexto + marcadores)",
            "flags": []
          }
        ]
      },
      {
        "raw": "true",
        "cmds": [
          {
            "cmd": "true",
            "args": "",
            "why": "comando true — revisa «man true»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "diff /var/dojo/replica-a /var/dojo/replica-b || true"
  },
  {
    "id": "procesado-l5",
    "track": "procesado",
    "index": 0,
    "title": "Banco de crudos",
    "subtitle": "boss — awk, sed, cut combinados",
    "xp": 70,
    "difficulty": 4,
    "brief": "El servicio de logística procesa registros con formato esquizofrénico: parte clave:valor separada por \" | \" y parte con delimitador \"#\".",
    "goal": "En /var/dojo/mixto cada línea es \"id | clave:VALOR-secreto|respaldo\". El único con id=tres contiene la FLAG en el campo clave:VALOR. Extrae SOLO la flag y enséñala.",
    "keywords": [
      "awk",
      "cut",
      "boss"
    ],
    "hints": [
      "awk -F'\\\\|' divide columnas por |: $3 contiene clave:...|respaldo,",
      "con cut -d: -f2- en la 2ª columna accederás a 'valor|respaldo'… recorta con cut -d'\"|' o pipeline."
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F'\\\\|' '{print $2}'",
        "desc": "campo N con separador especial"
      },
      {
        "cmd": "cut -d: -f2- ",
        "desc": "desde campo N hasta el final"
      },
      {
        "cmd": "grep -oE \"FLAG\\\\{[^}]+\\\\}\"",
        "desc": "extraer la flag directamente"
      }
    ],
    "teach": "Combina awk + cut + tr para casos donde el separador anida. Cuando encaje, `-F'|'` de awk es la opción elegante. La clave es atacar el formato capa a capa sin intentar resolverlo todo de golpe.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep tres /var/dojo/mixto | awk -F'|' '{print $2}' | cut -d: -f2",
        "cmds": [
          {
            "cmd": "grep",
            "args": "tres /var/dojo/mixto",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "awk",
            "args": "-F| {print $2}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          },
          {
            "cmd": "cut",
            "args": "-d: -f2",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep tres /var/dojo/mixto | awk -F'|' '{print $2}' | cut -d: -f2"
  },
  {
    "id": "procesado-l6",
    "track": "procesado",
    "index": 6,
    "title": "Campos exactos",
    "subtitle": "awk NF: contar columnas",
    "xp": 40,
    "difficulty": 3,
    "brief": "En inventario.txt casi todas las filas están mal formadas; solo las filas de 7 campos son válidas y UNA de ellas trae la marca.",
    "goal": "Imprime las filas de inventario.txt que tienen exactamente 7 campos.",
    "keywords": [
      "awk",
      "NF",
      "campos"
    ],
    "hints": [
      "awk cuenta los campos de cada línea en la variable NF.",
      "El patrón se escribe sin / /: NF == 7 es una comparación numérica.",
      "awk 'NF == 7' inventario.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'NF == 7' f",
        "desc": "líneas de 7 campos"
      },
      {
        "cmd": "awk '{print $1}' f",
        "desc": "primera columna"
      }
    ],
    "teach": "awk evalúa un patrón por línea y ejecuta la acción por defecto (imprimir la línea) si casa. NF, NR, $1… son variables internas que hacen del awk un mini-lenguaje de relatórios.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "estante puente hierro roble pintura barniz cinta\ncofre llave marca FLAG{d3b09a4f7c2e1b8d6041a5f3} zinc cobre tornillo"
      }
    ],
    "steps": [
      {
        "raw": "awk 'NF == 7' /home/agent/inventario.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "NF == 7 /home/agent/inventario.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'NF == 7' /home/agent/inventario.txt"
  },
  {
    "id": "procesado-l7",
    "track": "procesado",
    "index": 7,
    "title": "Movimientos gordos",
    "subtitle": "awk -F, con filtro numérico",
    "xp": 40,
    "difficulty": 3,
    "brief": "movs.txt anota conceptos e importes separados por comas. Los movimientos mayores de 900 llevan una nota en la primera columna.",
    "goal": "Imprime el CONCEPTO (columna 1) de las filas cuyo IMPORTE (columna 2) supere 900.",
    "keywords": [
      "awk",
      "campo",
      "filtro numérico"
    ],
    "hints": [
      "awk -F, define la coma como separador de campos.",
      "El patrón compara $2 con un número; la acción imprime $1.",
      "awk -F, '$2 > 900 {print $1}' movs.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F, '$2>900 {print $1}'",
        "desc": "concepto de filas caras"
      },
      {
        "cmd": "awk '{s+=$2} END{print s}'",
        "desc": "suma de una columna"
      }
    ],
    "teach": "El bloque patrón→acción de awk (patrón { acción }) filtra y transforma en un solo paso: filas con -F, campos con $n, salida con print. Es el sustituto ligero de mil scripts.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "entrada-liquidos\nnota-especial: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk -F, '$2 > 900 {print $1}' /home/agent/movs.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "-F, $2 > 900 {print $1} /home/agent/movs.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk -F, '$2 > 900 {print $1}' /home/agent/movs.txt"
  },
  {
    "id": "procesado-l8",
    "track": "procesado",
    "index": 8,
    "title": "Captura de grupo",
    "subtitle": "sed -n s/…/\\\\1/p",
    "xp": 45,
    "difficulty": 3,
    "brief": "datos.txt mezcla frases normales con pares clave=VALOR. El válido es único y está en mitad de una línea cualquiera.",
    "goal": "Imprime únicamente el valor del par que empieza por clave= (sin el prefijo), solo de la marca real.",
    "keywords": [
      "grep -o",
      "captura",
      "par clave"
    ],
    "hints": [
      "grep -o imprime solo la parte casada, no la línea entera.",
      "El patrón clave=FLAG con la clase [^}]* acota la marca de principio a fin.",
      "grep -oE 'clave=FLAG\\{[^}]*\\}' datos.txt | grep -oE 'FLAG\\{[^}]*\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE 'k=v' f",
        "desc": "extrae pares campo=valor"
      },
      {
        "cmd": "sed 's/viejo/nuevo/g' f",
        "desc": "sustitución global"
      }
    ],
    "teach": "La extracción en dos pasos (casa el CONTEXTO, luego casa solo el TROZO) es la alternativa sin sed a la captura de grupos: primero delimita, luego purifica. práctica forense de cada día.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE 'clave=FLAG\\{[^}]*\\}' /home/agent/datos.txt | grep -oE 'FLAG\\{[^}]*\\}'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE clave=FLAG\\{[^}]*\\} /home/agent/datos.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -oE 'clave=FLAG\\{[^}]*\\}' /home/agent/datos.txt | grep -oE 'FLAG\\{[^}]*\\}'"
  },
  {
    "id": "procesado-l9",
    "track": "procesado",
    "index": 9,
    "title": "Dos ficheros emparejados",
    "subtitle": "paste + grep",
    "xp": 45,
    "difficulty": 3,
    "brief": "ids.txt y secretos.txt están alineados línea a línea. La ficha «0042» guarda una relación con el donante.",
    "goal": "Junta ambas fichas por líneas y muestra la fila cuyo ID es 0042 (ID y su secreto).",
    "keywords": [
      "paste",
      "alinear",
      "join"
    ],
    "hints": [
      "paste coloca fichero 1 y fichero 2 en columnas separadas por tabulador.",
      "El ancla ^0042 evita casar el 042 de otra ficha.",
      "paste ids.txt secretos.txt | grep '^0042'"
    ],
    "cheatsheet": [
      {
        "cmd": "paste a b",
        "desc": "une ficheros por líneas"
      },
      {
        "cmd": "paste a b | awk '$1==42'",
        "desc": "elige por columna"
      }
    ],
    "teach": "paste une ficheros en columnas; cuando dos ficheros están alineados por filas, el índice de una línea ES la clave. El grep con ancla evita hallazgos falsos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "0042\tficha especial: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "paste /home/agent/ids.txt /home/agent/secretos.txt | grep '^0042'",
        "cmds": [
          {
            "cmd": "paste",
            "args": "/home/agent/ids.txt /home/agent/secretos.txt",
            "why": "comando paste — revisa «man paste»",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "^0042",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "paste /home/agent/ids.txt /home/agent/secretos.txt | grep '^0042'"
  },
  {
    "id": "procesado-l10",
    "track": "procesado",
    "index": 10,
    "title": "Servicios por puerto",
    "subtitle": "awk -F: con cadena",
    "xp": 45,
    "difficulty": 3,
    "brief": "servicios.conf usa formato svc:puerto:dueño. La fila del puerto 8081 guarda el alias y su marca.",
    "goal": "Imprime la línea completa cuya segunda columna sea exactamente 8081.",
    "keywords": [
      "awk",
      "F:",
      "puerto"
    ],
    "hints": [
      "El separador aquí son los DOS PUNTOS.",
      "Con awk puedes comparar cadenas: $2 == \"8081\" (o por número, sin comillas).",
      "awk -F: '$2 == 8081' servicios.conf"
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F: '$2==22' f",
        "desc": "fila cuyo campo 2 es 22"
      },
      {
        "cmd": "awk -F: '{print $2,$3}' f",
        "desc": "dos columnas"
      }
    ],
    "teach": "awk funciona igual de bien con : , ; o espacios como separador: -F define tu mundo tabular. La comparación == funciona con números y cadenas sin drama.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "puente-defensa:8081:FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk -F: '$2 == 8081' /home/agent/servicios.conf",
        "cmds": [
          {
            "cmd": "awk",
            "args": "-F: $2 == 8081 /home/agent/servicios.conf",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk -F: '$2 == 8081' /home/agent/servicios.conf"
  },
  {
    "id": "procesado-l11",
    "track": "procesado",
    "index": 11,
    "title": "Partición de un gigante",
    "subtitle": "split + grep en trozos",
    "xp": 50,
    "difficulty": 4,
    "brief": "grande.log es demasiado para editores: dividir por trozos y filtrar es más rápido que abrirlo entero.",
    "goal": "Divide grande.log en 5 trozos por líneas con prefijo trozo_ y muestra las líneas de la clave entre todos.",
    "keywords": [
      "split",
      "grande.log",
      "trozo"
    ],
    "hints": [
      "Hazlo en tu home: cd ~ antes de dividir (los trozos se quedan junto a ti).",
      "split -n l/5 divide en 5 trozos por líneas (sin romper líneas).",
      "grep -h busca en los trozos sin mostrar el nombre de fichero."
    ],
    "cheatsheet": [
      {
        "cmd": "split -n l/5 f pre_",
        "desc": "cinco trozos por líneas"
      },
      {
        "cmd": "grep -h x pre_*",
        "desc": "busca sin nombres de fichero"
      }
    ],
    "teach": "split trocea ficheros gigantes por tamaño (-b) o por líneas (-n l/K). Filtrar en trozos es lo que hacen las herramientas de streaming: menos memoria, más paralelismo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "linea 333 ancla: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "split -n l/5 /home/agent/grande.log trozo_",
        "cmds": [
          {
            "cmd": "split",
            "args": "-n l/5 /home/agent/grande.log trozo_",
            "why": "comando split — revisa «man split»",
            "flags": [
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man split»"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep -h 'FLAG{' trozo_*",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-h FLAG{ trozo_*",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-h",
                "meaning": "flag h del comando — revisa «man grep»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "split -n l/5 /home/agent/grande.log trozo_ && grep -h 'FLAG{' trozo_*"
  },
  {
    "id": "procesado-l12",
    "track": "procesado",
    "index": 12,
    "title": "Solo lo nuevo",
    "subtitle": "comm: diferencia de listas ordenadas",
    "xp": 50,
    "difficulty": 4,
    "brief": "v1.sorted y v2.sorted son inventarios ordenados. Todo lo que añadimos en v2 merece revisión, y una de esas altas es la marca.",
    "goal": "Muestra las líneas presentes SOLO en v2.sorted (que no están en v1.sorted).",
    "keywords": [
      "comm",
      "diferencia",
      "orden",
      "sets"
    ],
    "hints": [
      "comm compara DOS ficheros ya ordenados y saca 3 columnas: solo-1, solo-2, ambos.",
      "Las banderas -1 -2 -3 ocultan columnas: -13 deja solo la 2.",
      "comm -13 v1.sorted v2.sorted"
    ],
    "cheatsheet": [
      {
        "cmd": "comm -12 a b",
        "desc": "elementos comunes"
      },
      {
        "cmd": "comm -13 a b",
        "desc": "solo en el segundo"
      }
    ],
    "teach": "comm es el hermano fino de diff para LISTAS: sus columnas son solo-A, solo-B y común, y cada una se suprime con -1/-2/-3. Requiere ficheros ordenados con el mismo orden.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "insignia nueva con marca: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nmartillo\nreloj"
      }
    ],
    "steps": [
      {
        "raw": "comm -13 /home/agent/v1.sorted /home/agent/v2.sorted",
        "cmds": [
          {
            "cmd": "comm",
            "args": "-13 /home/agent/v1.sorted /home/agent/v2.sorted",
            "why": "comando comm — revisa «man comm»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "comm -13 /home/agent/v1.sorted /home/agent/v2.sorted"
  },
  {
    "id": "procesado-l13",
    "track": "procesado",
    "index": 13,
    "title": "El máximo con awk",
    "subtitle": "acumulador con if >",
    "xp": 45,
    "difficulty": 3,
    "brief": "ventas.csv tiene zona,importe. La fila con el importe más alto esconde la pieza en su primera columna.",
    "goal": "Encuentra la fila con mayor importe en /home/agent/ventas.csv y muéstrala entera.",
    "keywords": [
      "awk",
      "max",
      "csv"
    ],
    "hints": [
      "awk con -F, separa por comas: $1 es la zona y $2 el importe.",
      "El truco del acumulador: if ($2 > max) {max = $2; line = $0}, luego en END print line.",
      "awk -F, '{if ($2 > max) {max=$2; line=$0}} END {print line}' /home/agent/ventas.csv"
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F, '$2>max{max=$2; li=$0} END{print li}' f",
        "desc": "máximo con contexto"
      },
      {
        "cmd": "sort -t, -k2 -r f | head -1",
        "desc": "lo mismo con sort"
      }
    ],
    "teach": "awk mantiene variables entre líneas: el patrón \"if ($n > max) {max=$n; line=$0} END {print line}\" es el modo awk canónica de \"máximo con su contexto\" — sin sort de por medio.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la clave: FLAG{d3b09a4f7c2e1b8d6041a5f3},3111"
      }
    ],
    "steps": [
      {
        "raw": "awk -F, '{if ($2+0 > max) {max=$2+0; line=$0}} END {print line}' /home/agent/ventas.csv",
        "cmds": [
          {
            "cmd": "awk",
            "args": "-F, {if ($2+0 > max) {max=$2+0; line=$0}} END {print line} /home/agent/ventas.csv",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk -F, '{if ($2+0 > max) {max=$2+0; line=$0}} END {print line}' /home/agent/ventas.csv"
  },
  {
    "id": "procesado-l14",
    "track": "procesado",
    "index": 14,
    "title": "Informe censurado",
    "subtitle": "sed de sustitución",
    "xp": 45,
    "difficulty": 3,
    "brief": "El censor pasó por informe.txt y tachó lo que importa con la palabra REDACTADO justo delante. Quita los tachones.",
    "goal": "Elimina todas las ocurrencias de REDACTADO (con sus espacios) de /home/agent/informe.txt y extrae la marca que reaparece.",
    "keywords": [
      "sed",
      "censura",
      "sustitucion"
    ],
    "hints": [
      "sed s/viejo/nuevo/ cambia la 1ª ocurrencia por línea; /g lo hace en todas.",
      "Cambia REDACTADO+espacio por vacío, luego grep -oE con la forma de la marca.",
      "sed 's/REDACTADO //g' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "sed 's/viejo/nuevo/g' f",
        "desc": "reemplaza todas"
      },
      {
        "cmd": "sed -i 's/v/n/g' f",
        "desc": "edita en sitio"
      }
    ],
    "teach": "sed s/viejo/nuevo/g es el reemplazo de texto por excelencia. Para informes censurados, quitar la máscara revela lo que quedó detrás: el censor borra palabras, no datos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sed 's/REDACTADO //g' /home/agent/informe.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "sed",
            "args": "s/REDACTADO //g /home/agent/informe.txt",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sed 's/REDACTADO //g' /home/agent/informe.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "procesado-l15",
    "track": "procesado",
    "index": 15,
    "title": "El último campo",
    "subtitle": "awk NF y $(NF)",
    "xp": 45,
    "difficulty": 3,
    "brief": "registro.log tiene líneas con NÚMERO de campos variable. La marca está en el ÚLTIMO campo de la línea del envío.",
    "goal": "Filtra las líneas con \"envio\" en /home/agent/registro.log e imprime su último campo.",
    "keywords": [
      "awk",
      "NF",
      "logs"
    ],
    "hints": [
      "awk NF es el número de campos de la línea actual; $NF es el último.",
      "Primero grep \"envio confidencial\", luego awk \"{print $NF}\".",
      "grep 'envio confidencial' f | awk '{print $NF}'"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{print $NF}' f",
        "desc": "último campo"
      },
      {
        "cmd": "awk '{print $(NF-1)}' f",
        "desc": "penúltimo"
      }
    ],
    "teach": "$NF es la joya de awk para logs con anchura variable: da igual que mida 3 o 13 campos; el último es SIEMPRE el último. awk NR es el número de línea, NF es el de campos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep 'envio confidencial' /home/agent/registro.log | awk '{print $NF}' | head -n1",
        "cmds": [
          {
            "cmd": "grep",
            "args": "envio confidencial /home/agent/registro.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "awk",
            "args": "{print $NF}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep 'envio confidencial' /home/agent/registro.log | awk '{print $NF}' | head -n1"
  },
  {
    "id": "procesado-l16",
    "track": "procesado",
    "index": 16,
    "title": "El bloque de la copia",
    "subtitle": "sed -n con rango de patrones",
    "xp": 45,
    "difficulty": 3,
    "brief": "inventario.txt es un registro largo. Entre las líneas del inciso COPIA-INTERNA y FIN-COPIA escondió la marca.",
    "goal": "Imprime solo el bloque entre COPIA-INTERNA y FIN-COPIA de /home/agent/inventario.txt y extrae la marca.",
    "keywords": [
      "sed",
      "rango",
      "bloque"
    ],
    "hints": [
      "sed -n '/inicio/,/fin/p' imprime el rango entre ambos patrones (el -n silencia el resto).",
      "El bloque incluye las delimitadoras; grep -oE con la forma de la marca limpia todo.",
      "sed -n '/COPIA/,/FIN/p' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "sed -n '/a/,/b/p' f",
        "desc": "rango a→b"
      },
      {
        "cmd": "awk '/a/,/b/' f",
        "desc": "rango con awk"
      }
    ],
    "teach": "El rango de patrones de sed es la \"zona de interés en extracto\":/logs de configuración con bloques BEGIN/END son su habitat natural. awk entre triviales /pat/,/pat/ hace lo mismo con gsub…",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sed -n '/COPIA-INTERNA/,/FIN-COPIA/p' /home/agent/inventario.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "sed",
            "args": "-n /COPIA-INTERNA/,/FIN-COPIA/p /home/agent/inventario.txt",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": [
              {
                "flag": "-n",
                "meaning": "suprime la impresión automática (útil con el comando p)"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sed -n '/COPIA-INTERNA/,/FIN-COPIA/p' /home/agent/inventario.txt | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "procesado-l17",
    "track": "procesado",
    "index": 17,
    "title": "Coincidencia awk",
    "subtitle": "regex con ~ en awk",
    "xp": 45,
    "difficulty": 3,
    "brief": "schemas.txt lista esquemas con su versión. El registro cuyo segundo campo empieza por 9 esconde la pieza.",
    "goal": "Encuentra en /home/agent/schemas.txt la línea cuyo segundo campo empieza por 9 y muéstrala.",
    "keywords": [
      "awk",
      "regex",
      "campo"
    ],
    "hints": [
      "El operador ~ de awk es \"encaje de patrón\": $2 ~ /^9/ significa \"el 2º campo empieza por 9\".",
      "El ^ ancla al inicio del campo.",
      "awk '$2 ~ /^9/ {print}' /home/agent/schemas.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$1 ~ /^9/ {print}' f",
        "desc": "regex sobre campo"
      },
      {
        "cmd": "awk '$2 !~ /b/ {print}' f",
        "desc": "negación con !~"
      }
    ],
    "teach": "awk permite regex per columna: '/pat/' filtra por la línea completa pero $n ~ /pat/ es selectivo por field: precisión quirúrgica en logs anchos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "subtotal 9-esquema: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 ~ /^9/ {print}' /home/agent/schemas.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 ~ /^9/ {print} /home/agent/schemas.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 ~ /^9/ {print}' /home/agent/schemas.txt"
  },
  {
    "id": "procesado-l18",
    "track": "procesado",
    "index": 18,
    "title": "Solo en la segunda",
    "subtitle": "comm -13 sin sort visible",
    "xp": 45,
    "difficulty": 3,
    "brief": "Dos listas casi idénticas: listas.txt y firmadas.txt. La única línea que está SOLO en la segunda esconde la pieza.",
    "goal": "Compara /home/agent/listas.txt y /home/agent/firmadas.txt y muestra la línea que aparece solo en la segunda (comm -13).",
    "keywords": [
      "comm",
      "diff",
      "sets"
    ],
    "hints": [
      "comm exige ambos ficheros ordenados: pasa por sort si hace falta.",
      "comm -13 oculta la 1ª y la 3ª columna: deja las líneas exclusivas de la 2ª.",
      "comm -13 <(sort a) <(sort b)"
    ],
    "cheatsheet": [
      {
        "cmd": "comm -12 a b",
        "desc": "intersección"
      },
      {
        "cmd": "comm -13 a b",
        "desc": "solo en b"
      }
    ],
    "teach": "comm es el comparador de SETS con columnas: -1, -2 y -3 esconden columnas; -13 = \"solo en la 2ª\". diff muestra diferencias CONTEXTUALES; comm muestra diferencias de PERTENENCIA.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": " comun4: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "comm -13 <(sort /home/agent/listas.txt) <(sort /home/agent/firmadas.txt)",
        "cmds": [
          {
            "cmd": "comm",
            "args": "-13 <(sort /home/agent/listas.txt) <(sort /home/agent/firmadas.txt)",
            "why": "comando comm — revisa «man comm»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "comm -13 <(sort /home/agent/listas.txt) <(sort /home/agent/firmadas.txt)"
  },
  {
    "id": "procesado-l19",
    "track": "procesado",
    "index": 19,
    "title": "El titular del día",
    "subtitle": "awk: estadística de máximos",
    "xp": 45,
    "difficulty": 3,
    "brief": "> La redacción del dojo midió cuántas veces sonó el teléfono de cada > periodista... perdón, de cada \"fuente\". El que más SONÓ es el que > guarda la carta: su nombre es,a la vez, el nombre de un fichero .log > en el mismo armario.",
    "goal": "Lee resumen.txt (columnas: nombre y recuento) y muestra el contenido del fichero <nOMBRE>.log del压力大 número de llamadas.",
    "keywords": [
      "awk",
      "xargs"
    ],
    "hints": [
      "awk recorre línea a línea guardando el máximo: $2>m{m=$2;n=$1}",
      "En el bloque END{} se imprime lo acumulado: print n",
      "Ese texto es un nombre de fichero: pasa por xargs -I{}."
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$2>m{m=$2;n=$1} END{print n}'",
        "desc": "nombre de la fila con la columna 2 máxima"
      },
      {
        "cmd": "xargs -I{} CMD {}",
        "desc": "incrusta la salida en el comando (el {} es el hueco)"
      }
    ],
    "teach": "awk guarda estado entre líneas. Este patrón busca el máximo:\n\n    awk '$2>m{m=$2;n=$1} END{print n}' resumen.txt\n\nCada vez que la columna 2 supera el máximo guardado, el nombre ($1) pasa a ser \"el líder\". En END se imprime. Como el líder es el nombre de un fichero:\n\n    awk '$2>m{m=$2;n=$1} END{print n}' resumen.txt | xargs -I{} cat ~/prensa/{}.log",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2>m{m=$2;n=$1} END{print n}' ~/prensa/resumen.txt | xargs -I{} cat ~/prensa/{}.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2>m{m=$2;n=$1} END{print n} ~/prensa/resumen.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "xargs",
            "args": "-I{} cat ~/prensa/{}.log",
            "why": "convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)",
            "flags": [
              {
                "flag": "-I",
                "meaning": "marcador de sustitución {}: cada línea va ahí"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk '$2>m{m=$2;n=$1} END{print n}' ~/prensa/resumen.txt | xargs -I{} cat ~/prensa/{}.log"
  },
  {
    "id": "procesado-l20",
    "track": "procesado",
    "index": 20,
    "title": "La carta desenmascarada",
    "subtitle": "sed con varias sustituciones",
    "xp": 45,
    "difficulty": 3,
    "brief": "> El espía disfrazó la flag en ~/carta.txt: puso ( y ) donde iban las > llaves { } y guiones donde iban los subrayados. Un solo sed con tres > sustituciones la recompone tal como se escribió originalmente.",
    "goal": "Transforma ~/carta.txt para que la flag vuelva a su formato (llaves { } y subrayados _ sustituyendo los paréntesis y guiones actuales). La salida debe mostrar FLAG{...} con el interior correcto.",
    "keywords": [
      "sed"
    ],
    "hints": [
      "sed admite varias expresiones separadas por ; dentro de las mismas comillas.",
      "El patrón s/(/{/g cambia TODOS los paréntesis abiertos por llaves.",
      "Tres pasos en una invocación: sed \"s/(/{/g;s/)/}/g;s/-/_/g\" ~/carta.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "sed 's/a/b/g'",
        "desc": "sustituye todas las apariciones de a por b"
      },
      {
        "cmd": "sed -e '…' -e '…'",
        "desc": "encadena varias expresiones"
      }
    ],
    "teach": "sed acepta varios comandos en cadena (separados por ;) en una sola pasada:\n\n    sed 's/(/{/g;s/)/}/g;s/-/_/g' ~/carta.txt\n\nCada s/a/b/g sustituye TODAS las apariciones de a por b: - ( → {  ·  ) → }  ·  - → _\nLa salida desvela la flag con su formato correcto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "Estimado agente: la clave es FLAG{d3b09a4f7c2e1b8d6041a5f3}. Sigue así."
      }
    ],
    "steps": [
      {
        "raw": "sed 's/(/{/g;s/)/}/g;s/-/_/g' ~/carta.txt",
        "cmds": [
          {
            "cmd": "sed",
            "args": "s/(/{/g;s/)/}/g;s/-/_/g ~/carta.txt",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sed 's/(/{/g;s/)/}/g;s/-/_/g' ~/carta.txt"
  },
  {
    "id": "permisos-l1",
    "track": "permisos",
    "index": 0,
    "title": "Cerrado con todo",
    "subtitle": "chmod y sudo",
    "xp": 50,
    "difficulty": 3,
    "brief": "El dueño anterior dejó un fichero con la clave pero con permisos 0600 y propietario root. Un admin legítimo corrige permisos, no fuerza.",
    "goal": "El fichero /home/agent/bóveda.txt es de root con permiso 600. Dale permiso de lectura al agente (chmod) de forma correcta y léelo.",
    "keywords": [
      "chmod",
      "sudo"
    ],
    "hints": [
      "sudo chmod 0644 /home/agent/bóveda.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "chmod 644 f",
        "desc": "dueño rw"
      },
      {
        "cmd": "chmod u+x f",
        "desc": "añade ejecución al dueño"
      },
      {
        "cmd": "sudo chmod …",
        "desc": "eleva permisos con sudo"
      }
    ],
    "teach": "`chmod 644 fichero` = dueño escribe/lee, grupo lee, otros leen. `chmod u+x` activa ejecución del dueño. Cambiar permisos de ficheros ajenos exige root (sudo). En el dojo tienes sudo de confianza.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo chmod 0644 /home/agent/bóveda.txt\ncat /home/agent/bóveda.txt",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "chmod 0644 /home/agent/bóveda.txt cat /home/agent/bóveda.txt",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sudo chmod 0644 /home/agent/bóveda.txt\ncat /home/agent/bóveda.txt"
  },
  {
    "id": "permisos-l2",
    "track": "permisos",
    "index": 0,
    "title": "Propiedad heredada",
    "subtitle": "chown y sudo",
    "xp": 50,
    "difficulty": 3,
    "brief": "Otro clásico: el fichero es de root y el agente no debe forzarlo, sino reclamar la propiedad legítima. chown es la herramienta del dueño.",
    "goal": "Cambia la propiedad del fichero /home/agent/config-premium.conf de root a agent y muéstralo (contiene la flag).",
    "keywords": [
      "chown",
      "sudo"
    ],
    "hints": [
      "sudo chown agent:agent /home/agent/config-premium.conf",
      "tras el chown los permisos 600 ya te dejan leer como dueño."
    ],
    "cheatsheet": [
      {
        "cmd": "chown user f",
        "desc": "cambia propietario"
      },
      {
        "cmd": "chown user:grupo f",
        "desc": "cambia propietario y grupo"
      },
      {
        "cmd": "ls -l f",
        "desc": "muestra permisos y dueños"
      }
    ],
    "teach": "`chown usuario:grupo fichero` transfiere propiedad; solo root puede quitar/poner dueños ajenos. La forma `chown :grupo` cambia solo grupo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo chown agent:agent /home/agent/config-premium.conf\ncat /home/agent/config-premium.conf",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "chown agent:agent /home/agent/config-premium.conf cat /home/agent/config-premium.conf",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sudo chown agent:agent /home/agent/config-premium.conf\ncat /home/agent/config-premium.conf"
  },
  {
    "id": "permisos-l3",
    "track": "permisos",
    "index": 0,
    "title": "El clan del dojo",
    "subtitle": "grupos, chgrp y /etc/group",
    "xp": 55,
    "difficulty": 3,
    "brief": "La clave es de un grupo concreto: 'dojo'. El fichero se lee solo si perteneces al grupo correcto (y el login lo refresca).",
    "goal": "El fichero /var/dojo/gimnasio.txt es del grupo doorkeeper con modo 640. Añádete al grupo con sudo (usermod -aG), WARN: los grupos solo aplican en la SESIÓN SIGUIENTE; verifica cómo te ves con id y recupera el contenido por la vía admin (sudo cat).",
    "keywords": [
      "grupos",
      "usermod",
      "login"
    ],
    "hints": [
      "sudo usermod -aG doorkeeper agent   (el -a evita que borres los grupos previos).",
      "Con id ves uid/gid; groups lista los tuyos — nota que NO aparecen hasta nueva sesión.",
      "vía admin inmediata: sudo cat /var/dojo/gimnasio.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "id",
        "desc": "uid y grupos actuales"
      },
      {
        "cmd": "sudo usermod -aG grupo usu",
        "desc": "añade al grupo (efectivo próxima sesión)"
      },
      {
        "cmd": "sudo cat fichero",
        "desc": "lectura admin inmediata"
      }
    ],
    "teach": "`id` muestra uids/gids; `usermod -aG grupo usu` añade a un grupo — `-a` evita reemplazar los existentes. IMPORTANTE: la pertenencia nueva solo aplica en la siguiente sesión (login); en un contenedor efímero cada exec es una sesión. Para trabajo inmediato, el admin usa sudo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "uid=1000(agent) gid=1000(agent) groups=1000(agent)\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "id\nsudo usermod -aG doorkeeper agent\nsudo cat /var/dojo/gimnasio.txt",
        "cmds": [
          {
            "cmd": "id",
            "args": "sudo usermod -aG doorkeeper agent sudo cat /var/dojo/gimnasio.txt",
            "why": "uid, gid y grupos del usuario actual (o del dado)",
            "flags": [
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man id»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "id\nsudo usermod -aG doorkeeper agent\nsudo cat /var/dojo/gimnasio.txt"
  },
  {
    "id": "permisos-l4",
    "track": "permisos",
    "index": 0,
    "title": "El binario que actúa como root",
    "subtitle": "SUID",
    "xp": 60,
    "difficulty": 4,
    "brief": "Un operador decidió de manera causal: marcó /bin/cat como SUID con chmod u+s. Eso hará que cat se ejecute con los poderes de su dueño (root)… y ahora cualquiera puede leer ficheros privados. Suid es escalofriante: este nivel te lo demuestra.",
    "goal": "Usa el binario con el bit SUID activado para leer el fichero /etc/dojo/confidencial — solo root leía ese fichero (chmod 600).",
    "keywords": [
      "suid",
      "setuid"
    ],
    "hints": [
      "Nada especial: cat simplemente ya corre como root (su euid es root)."
    ],
    "cheatsheet": [
      {
        "cmd": "chmod u+s binario",
        "desc": "activa SUID"
      },
      {
        "cmd": "find / -perm -4000 2>/dev/null",
        "desc": "lista binarios SUID"
      }
    ],
    "teach": "El bit SUID da al ejecutable los permisos de SU DUEÑO (no del que lo lanza). Es la base de utilidades como `su` o `passwd`. Demasiados SUID/sudoers sin control = hueco de seguridad. Busca los binarios SUID del sistema con `find / -perm -u+s -type f 2>/dev/null`.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /etc/dojo/confidencial",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/etc/dojo/confidencial",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /etc/dojo/confidencial"
  },
  {
    "id": "permisos-l5",
    "track": "permisos",
    "index": 0,
    "title": "Bóveda del admin",
    "subtitle": "boss — sudo + find + permisos repartidos",
    "xp": 75,
    "difficulty": 4,
    "brief": "El admin protegió su bóveda con directorios sin permiso de lectura y ficheros solo para root. Un buen admin lo sabe rodear: como root via sudo, puedes mirar dentro sin cambiar NADA de permisos (cat sí puede, o bien find con el ojo del root).",
    "goal": "En /etc/dojo/bóveda hay una estructura de directorios sin permiso +x y ficheros exclusivamente de root con modo 0600. Con sudo, localiza el fichero atajo.notes y muéstralo: contiene la clave.",
    "keywords": [
      "sudo",
      "find",
      "boss"
    ],
    "hints": [
      "sudo find /etc/dojo/bóveda -name 'atajo.notes'",
      "sudo cat /etc/dojo/bóveda/cajónsurdos/.profunda/atajo.notes"
    ],
    "cheatsheet": [
      {
        "cmd": "sudo find /ruta -name f",
        "desc": "buscar como root"
      },
      {
        "cmd": "chmod 0700 dir",
        "desc": "solo el dueño puede entrar (rwx)"
      }
    ],
    "teach": "Para LEER dentro de un directorio se necesita permiso de ejecución (x) — no basta con r. El admin cerró x, así que ni ls ni cd; pero root siempre puede. Guarda el principio de menor privilegio: sin permisos de más y con sudo solo cuando toque.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/etc/dojo/bóveda/cajon/.profunda/atajo.notes\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo find /etc/dojo/bóveda -name 'atajo.notes'\nsudo cat /etc/dojo/bóveda/cajon/.profunda/atajo.notes",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "find /etc/dojo/bóveda -name atajo.notes sudo cat /etc/dojo/bóveda/cajon/.profunda/atajo.notes",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": [
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man sudo»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man sudo»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man sudo»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man sudo»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sudo find /etc/dojo/bóveda -name 'atajo.notes'\nsudo cat /etc/dojo/bóveda/cajon/.profunda/atajo.notes"
  },
  {
    "id": "permisos-l6",
    "track": "permisos",
    "index": 6,
    "title": "El script dormido",
    "subtitle": "chmod +x: dar permiso de ejecución",
    "xp": 35,
    "difficulty": 2,
    "brief": "llave.sh tiene la ejecución prohibida. Sin el bit de ejecución, ./llave.sh se niega a arrancar.",
    "goal": "Dale permiso de ejecución al propietario y ejecútalo con ./llave.sh.",
    "keywords": [
      "chmod",
      "ejecución",
      "+x"
    ],
    "hints": [
      "El error esperado es Permission denied y el diagnóstico está en ls -l (falta la x).",
      "chmod u+x da ejecución solo al dueño.",
      "chmod u+x llave.sh && ./llave.sh"
    ],
    "cheatsheet": [
      {
        "cmd": "chmod +x script.sh",
        "desc": "ejecutable para todos"
      },
      {
        "cmd": "./script.sh",
        "desc": "ejecuta el local"
      }
    ],
    "teach": "El bit x convierte un fichero en ejecutable: sin él el núcleo no lo lanza directamente. u/g/o definen a quién se toca el permiso; ls -l es tu espejo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la llave gira y revela: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "chmod u+x /home/agent/llave.sh",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "u+x /home/agent/llave.sh",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "/home/agent/llave.sh",
        "cmds": [
          {
            "cmd": "/home/agent/llave.sh",
            "args": "",
            "why": "comando /home/agent/llave.sh — revisa «man /home/agent/llave.sh»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "chmod u+x /home/agent/llave.sh && /home/agent/llave.sh"
  },
  {
    "id": "permisos-l7",
    "track": "permisos",
    "index": 7,
    "title": "Copias contenidas",
    "subtitle": "umask: permisos por defecto al crear",
    "xp": 45,
    "difficulty": 3,
    "brief": "El protocolo interno exige que TODO lo copiado en tu home sea privado (600). El secreto está en la umask del proceso.",
    "goal": "Copia credencial.txt a tu home con umask 077 y muéstrala (la copia debe quedar como -rw-------).",
    "keywords": [
      "umask",
      "cp",
      "permisos privados"
    ],
    "hints": [
      "umask define qué permisos se QUITAN al crear ficheros.",
      "Con umask 077 los ficheros nuevos quedan 600.",
      "umask 077; cp credencial.txt ~/ ; cat ~/credencial.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "umask 077",
        "desc": "creación privada"
      },
      {
        "cmd": "umask",
        "desc": "muestra la actual"
      }
    ],
    "teach": "umask ENMASCARA los permisos de creación (0666 & ~umask en ficheros). En un subshell (paréntesis) la cambia solo para ese comando: el entorno decide la herencia de permisos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "credencial del operador: FLAG{d3b09a4f7c2e1b8d6041a5f3}\n600"
      }
    ],
    "steps": [
      {
        "raw": "umask 077",
        "cmds": [
          {
            "cmd": "umask",
            "args": "077",
            "why": "comando umask — revisa «man umask»",
            "flags": []
          }
        ]
      },
      {
        "raw": "cp /home/agent/credencial.txt /home/agent/credencial-copia.txt",
        "cmds": [
          {
            "cmd": "cp",
            "args": "/home/agent/credencial.txt /home/agent/credencial-copia.txt",
            "why": "copia ficheros",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/credencial-copia.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/credencial-copia.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      },
      {
        "raw": "stat -c '%a' /home/agent/credencial-copia.txt",
        "cmds": [
          {
            "cmd": "stat",
            "args": "-c %a /home/agent/credencial-copia.txt",
            "why": "metadatos de fichero: tamaño, permisos en octal, dueño, timestamps de acceso/modificación",
            "flags": [
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man stat»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "umask 077; cp /home/agent/credencial.txt /home/agent/credencial-copia.txt; cat /home/agent/credencial-copia.txt; stat -c '%a' /home/agent/credencial-copia.txt"
  },
  {
    "id": "permisos-l8",
    "track": "permisos",
    "index": 8,
    "title": "Bóveda cerrada a cal y canto",
    "subtitle": "recuperar un directorio con chmod",
    "xp": 45,
    "difficulty": 3,
    "brief": "vault/ quedó sin ningún permiso (000): ni listar, ni entrar. Eres el dueño; el remedio está en tus manos.",
    "goal": "Recupera el acceso a /home/agent/vault (permisos 700) y muestra llave.txt.",
    "keywords": [
      "chmod",
      "directorio",
      "x",
      "700"
    ],
    "hints": [
      "Aun con permisos 000, el DUEÑO puede cambiarlos (chmod es del propietario).",
      "Los directorios necesitan x para ENTRAR y r para LISTAR; 700 cubre ambos.",
      "chmod 700 vault && chmod 600 vault/llave.txt && cat vault/llave.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "chmod 700 dir",
        "desc": "solo el dueño entra"
      },
      {
        "cmd": "chmod 600 f",
        "desc": "privado total"
      }
    ],
    "teach": "Un directorio sin x no se puede recorrer aunque los ficheros dentro sean legibles. El dueño puede SIEMPRE cambiar permisos: por eso los fallos de permisos propios no necesitan sudo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la boveda se abre: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "chmod 700 /home/agent/vault",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "700 /home/agent/vault",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "chmod 600 /home/agent/vault/llave.txt",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "600 /home/agent/vault/llave.txt",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/vault/llave.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/vault/llave.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "chmod 700 /home/agent/vault && chmod 600 /home/agent/vault/llave.txt && cat /home/agent/vault/llave.txt"
  },
  {
    "id": "permisos-l9",
    "track": "permisos",
    "index": 9,
    "title": "Escalada honrada",
    "subtitle": "sudo: actuar como root cuando toca",
    "xp": 50,
    "difficulty": 3,
    "brief": "En este dojo el agente tiene sudo. El tesoro está en /root/tesoro.txt, inaccesible para el agente normal.",
    "goal": "Lee /root/tesoro.txt usando sudo.",
    "keywords": [
      "sudo",
      "root",
      "escalada"
    ],
    "hints": [
      "cat /root/tesoro.txt devuelve Permission denied: es del root.",
      "El sudo concede privilegios elevados para UN comando.",
      "sudo cat /root/tesoro.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "sudo cat /root/x",
        "desc": "lee fichero de root"
      },
      {
        "cmd": "sudo -l",
        "desc": "qué te permite el sudoers"
      }
    ],
    "teach": "sudo ejecuta un comando como root validando contra /etc/sudoers. Potencia enorme, responsabilidad idéntica: mínimo privilegio, comando a comando.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "tesoro real: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo cat /root/tesoro.txt",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "cat /root/tesoro.txt",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sudo cat /root/tesoro.txt"
  },
  {
    "id": "permisos-l10",
    "track": "permisos",
    "index": 10,
    "title": "Mundo escribible",
    "subtitle": "find -perm: cazar ficheros expuestos",
    "xp": 50,
    "difficulty": 3,
    "brief": "Alguien dejó ficheros con permiso de escritura para TODOS (666): una de esas exposiciones esconde la marca.",
    "goal": "Encuentra los ficheros world-writable de /home/agent/reinado y muestra su contenido.",
    "keywords": [
      "find -perm",
      "world writable",
      "auditoría"
    ],
    "hints": [
      "find -perm -o+w casa ficheros que al menos tienen escritura para otros.",
      "La acción pueden combinarse: ! -perm daría lo contrario.",
      "find dir -perm -o+w -type f -exec cat {} \\\\;"
    ],
    "cheatsheet": [
      {
        "cmd": "find d -perm -o+w",
        "desc": "world-writable"
      },
      {
        "cmd": "find d -perm -u+s",
        "desc": "SUID (aviso de riesgo)"
      }
    ],
    "teach": "Los ficheros escribibles por el mundo son una vulnerabilidad clásica: cualquiera puede modificarlos. find -perm te los caza sin abrirlos uno a uno.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "exposicion: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /home/agent/reinado -perm -o+w -type f -exec cat {} ;",
        "cmds": [
          {
            "cmd": "find",
            "args": "/home/agent/reinado -perm -o+w -type f -exec cat {} ;",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man find»"
              },
              {
                "flag": "-w",
                "meaning": "flag w del comando — revisa «man find»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /home/agent/reinado -perm -o+w -type f -exec cat {} \\;"
  },
  {
    "id": "permisos-l11",
    "track": "permisos",
    "index": 11,
    "title": "El escritor sin permiso",
    "subtitle": "copiar requiere permisos del directorio",
    "xp": 50,
    "difficulty": 3,
    "brief": "salida/ existe pero es de solo lectura (555): ni cp ni touch pueden escribir en ella. La salvación es devolverle la w al dueño.",
    "goal": "Recupera permisos de salida/, copia hito.txt dentro y muestra la copia.",
    "keywords": [
      "permisos",
      "directorio",
      "cp"
    ],
    "hints": [
      "El Permission denied al copiar sale del DIRECTORIO, no del fichero.",
      "La creación dentro de un directorio requiere w en el propio directorio.",
      "chmod u+w salida && cp hito.txt salida/"
    ],
    "cheatsheet": [
      {
        "cmd": "chmod u+w dir",
        "desc": "permite crear dentro"
      },
      {
        "cmd": "ls -ld dir",
        "desc": "permisos del directorio"
      }
    ],
    "teach": "Los permisos que importan al COPIAR son los del DIRECTORIO destino (w) y los del FICHERO origen (r). Si cp falla escribiendo, mira el directorio, no el fichero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "hito de auditoria: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "chmod u+w /home/agent/salida",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "u+w /home/agent/salida",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cp /home/agent/hito.txt /home/agent/salida/",
        "cmds": [
          {
            "cmd": "cp",
            "args": "/home/agent/hito.txt /home/agent/salida/",
            "why": "copia ficheros",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/salida/hito.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/salida/hito.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "chmod u+w /home/agent/salida && cp /home/agent/hito.txt /home/agent/salida/ && cat /home/agent/salida/hito.txt"
  },
  {
    "id": "permisos-l12",
    "track": "permisos",
    "index": 12,
    "title": "Corrección masiva",
    "subtitle": "chmod -R y la X mayúscula",
    "xp": 55,
    "difficulty": 4,
    "brief": "cadena/ es un árbol de scripts donde TODOS perdieron el permiso de ejecución. La restauración es recursiva.",
    "goal": "Devuelve ejecución al dueño en TODO el árbol de /home/agent/cadena y ejecuta el último paso.",
    "keywords": [
      "chmod -R",
      "arbol",
      "script"
    ],
    "hints": [
      "chmod -R recorre el árbol entero.",
      "Distingue: +x lo da a TODO fichero; +X (mayúscula) solo a directorios y ficheros ya ejecutables.",
      "chmod -R u+x cadena && ./cadena/paso1/paso2/paso3/final.sh"
    ],
    "cheatsheet": [
      {
        "cmd": "chmod -R u+x d",
        "desc": "recursivo para el dueño"
      },
      {
        "cmd": "chmod u+X -R d",
        "desc": "x solo a directorios"
      }
    ],
    "teach": "chmod -R es la restauración en bloque de un árbol maltratado. +X (mayúscula) es la variante fina: x solo en directorios y en los ficheros que YA la tenían.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "eslabon 3\nfin realmente: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "chmod -R u+x /home/agent/cadena",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "-R u+x /home/agent/cadena",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": [
              {
                "flag": "-R",
                "meaning": "recursivo"
              }
            ]
          }
        ]
      },
      {
        "raw": "/home/agent/cadena/paso1/paso2/paso3/final.sh",
        "cmds": [
          {
            "cmd": "/home/agent/cadena/paso1/paso2/paso3/final.sh",
            "args": "",
            "why": "comando /home/agent/cadena/paso1/paso2/paso3/final.sh — revisa «man /home/agent/cadena/paso1/paso2/paso3/final.sh»",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/cadena/paso1/paso2/paso3/realfinal.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/cadena/paso1/paso2/paso3/realfinal.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "chmod -R u+x /home/agent/cadena && /home/agent/cadena/paso1/paso2/paso3/final.sh; cat /home/agent/cadena/paso1/paso2/paso3/realfinal.txt"
  },
  {
    "id": "permisos-l13",
    "track": "permisos",
    "index": 13,
    "title": "El despacho cerrado",
    "subtitle": "chmod +x para ejecutar",
    "xp": 40,
    "difficulty": 2,
    "brief": "El run del despacho está congelado (sin permiso de ejecución). Reapuningo con el bit x y córrelo.",
    "goal": "Da permiso de ejecución a /home/agent/despacho.sh y ejecútalo.",
    "keywords": [
      "chmod",
      "ejecutar",
      "script"
    ],
    "hints": [
      "chmod u+x añade el bit de ejecución al propietario; chmod +x lo añade a todos.",
      "Es un script de shell: bash despacho.sh también correría… pero el nivel pide ejecutarlo como program.",
      "chmod +x /home/agent/despacho.sh && /home/agent/despacho.sh"
    ],
    "cheatsheet": [
      {
        "cmd": "chmod u+x f",
        "desc": "ejecución del dueño"
      },
      {
        "cmd": "chmod +x f",
        "desc": "todos: dueño/grupo/otros"
      }
    ],
    "teach": "Sin x, un script es texto (así lo trata bash y el kernel). El bit x + el shebang lo convierten en comando utilizable. Diferencia entre \"bash script\" (interénte del corazón de bash) y \"./script\" (proceso propio).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "el despacho confirma: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "chmod u+x /home/agent/despacho.sh",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "u+x /home/agent/despacho.sh",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "/home/agent/despacho.sh",
        "cmds": [
          {
            "cmd": "/home/agent/despacho.sh",
            "args": "",
            "why": "comando /home/agent/despacho.sh — revisa «man /home/agent/despacho.sh»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "chmod u+x /home/agent/despacho.sh && /home/agent/despacho.sh"
  },
  {
    "id": "permisos-l14",
    "track": "permisos",
    "index": 14,
    "title": "El 777 del dojo",
    "subtitle": "find -perm: buscar por permisos",
    "xp": 40,
    "difficulty": 2,
    "brief": "En ~/caja hay ficheros con permisos tripatas. Solo uno tiene modo 777 — y es ejecutable por cualquiera… como tú (es tuyo).",
    "goal": "Encuentra el fichero 777 de /home/agent/caja y ejecútalo.",
    "keywords": [
      "find",
      "perm",
      "777"
    ],
    "hints": [
      "find -perm 777 casco exacto con todos los bits rwx para todos.",
      "Ejecutalo llamándolo con su ruta tal cual.",
      "f=$(find /home/agent/caja -perm 777 | head -n1); \"$f\""
    ],
    "cheatsheet": [
      {
        "cmd": "find d -perm 777",
        "desc": "modo exacto"
      },
      {
        "cmd": "find d -perm -777",
        "desc": "al menos"
      }
    ],
    "teach": "find -perm busca por bits de permisos te los ordena: /777 (cualquiera de los bits), -777 (al menos los bits) y 777 (exacto). Útil en auditoría: \"¿qué es 777 por ahí?\"",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "lo ejecutable: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "f=$(find /home/agent/caja -perm 777 | head -n1)",
        "cmds": [
          {
            "cmd": "f=$(find",
            "args": "/home/agent/caja -perm 777",
            "why": "comando f=$(find — revisa «man f=$(find»",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man f=$(find»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "\"$f\"",
        "cmds": [
          {
            "cmd": "$f",
            "args": "",
            "why": "expansión de variable: el shell sustituye $VAR por su valor antes de ejecutar",
            "flags": []
          }
        ]
      }
    ],
    "raw": "f=$(find /home/agent/caja -perm 777 | head -n1); \"$f\""
  },
  {
    "id": "permisos-l15",
    "track": "permisos",
    "index": 15,
    "title": "Gremio con llave",
    "subtitle": "usermod -aG: entrar en el grupo",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un fichero es rw para el grupo solegado (ronda) y root le pertenece. Ya Formisteas pero no activó tu afiliación.",
    "goal": "Apunta al usuario agent al grupo ronda y muestra /var/local/gremio/llave.txt.",
    "keywords": [
      "groupadd",
      "usermod",
      "grupo"
    ],
    "hints": [
      "El sudo del dojo está sin contraseña: usermod -aG ronda agent.",
      "La lectura del fichero solo exige que el grupo sea ronda: usa sudo -g ronda para el cat.",
      "sudo usermod -aG ronda agent; sudo -g ronda cat /var/local/gremio/llave.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "usermod -aG grupo u",
        "desc": "añadir usuario al grupo"
      },
      {
        "cmd": "groups",
        "desc": "tus grupos de esta sesión"
      }
    ],
    "teach": "El grupo segundo de acceso parte del usuario: /etc/group manda; en ejecución (proc eco), el agente solo pega si su sesida tiene RONDA en el libro: newgrp re-arrastré la sesión con el GRUPO nuevo sin cerrar la terminal.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la llave del gremio: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo usermod -aG ronda agent",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "usermod -aG ronda agent",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": [
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man sudo»"
              }
            ]
          }
        ]
      },
      {
        "raw": "sudo -g ronda cat /var/local/gremio/llave.txt",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "-g ronda cat /var/local/gremio/llave.txt",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": [
              {
                "flag": "-g",
                "meaning": "flag g del comando — revisa «man sudo»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "sudo usermod -aG ronda agent; sudo -g ronda cat /var/local/gremio/llave.txt"
  },
  {
    "id": "permisos-l16",
    "track": "permisos",
    "index": 16,
    "title": "El espejo sin ventana",
    "subtitle": "chmod u+r: escribir sin leer",
    "xp": 45,
    "difficulty": 3,
    "brief": "llave.txt es -w- para ti: puedes escribir, no leer (raro, pero es el buen test de bits). Dá por transferérse la lectura y místralo.",
    "goal": "Restaura los permisos de /home/agent/caja-negra/llave.txt (dueño puede leer) y muéstralo.",
    "keywords": [
      "chmod",
      "octal",
      "dueño"
    ],
    "hints": [
      "chmod 644 = dueño r+w (4+2), grupo y otros r (4).",
      "Es tu fichero: puedes cambiar los permisos libremente.",
      "chmod 644 f && cat f"
    ],
    "cheatsheet": [
      {
        "cmd": "stat -c %a f",
        "desc": "permisos en octal"
      },
      {
        "cmd": "chmod 644 f",
        "desc": "estándar legible"
      }
    ],
    "teach": "w sin r es un modo aníritu: como dueño puedes autocorregirte. chown SIEMPRE requiere root — chmod no. La cuadrícula octal: 4=r, 2=w, 1=x.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la llave de espejo: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "chmod 644 /home/agent/caja-negra/llave.txt",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "644 /home/agent/caja-negra/llave.txt",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/caja-negra/llave.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/caja-negra/llave.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "chmod 644 /home/agent/caja-negra/llave.txt && cat /home/agent/caja-negra/llave.txt"
  },
  {
    "id": "permisos-l17",
    "track": "permisos",
    "index": 17,
    "title": "La pila congelada",
    "subtitle": "find -perm 000: ficheros muertos",
    "xp": 45,
    "difficulty": 3,
    "brief": "En ~/redactar todos los ficheros menos uno tienen por cerrado (000). Dáles lectura a los muertos y extrae la pieza del que hasta ahora estaba blanco.",
    "goal": "Encuentra en /home/agent/redactar el fichero con permisos 000, restáura su lectura para el dueño y muéstralo.",
    "keywords": [
      "perm",
      "000",
      "chmod"
    ],
    "hints": [
      "find -perm 000 encuentra exactamente los ficheros sin ningún permiso.",
      "chmod 600 los deja r+w para el dueño (o 644).",
      "f=$(find d -perm 000); chmod 600 \"$f\"; cat \"$f\""
    ],
    "cheatsheet": [
      {
        "cmd": "find d -perm 000",
        "desc": "ficheros soldados"
      },
      {
        "cmd": "chmod 600 f",
        "desc": "dueño r+w"
      }
    ],
    "teach": "Un 000 es un fichero invisible para el contenido y visible por nombre. find -perm 000 es su buscador idóneo — igual que -perm 400 desenmáscara esos \"solo lectura\" que confunden.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "acta 6: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "f=$(find /home/agent/redactar -perm 000 -type f)",
        "cmds": [
          {
            "cmd": "f=$(find",
            "args": "/home/agent/redactar -perm 000 -type f)",
            "why": "comando f=$(find — revisa «man f=$(find»",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man f=$(find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man f=$(find»"
              }
            ]
          }
        ]
      },
      {
        "raw": "chmod 600 \"$f\"",
        "cmds": [
          {
            "cmd": "chmod",
            "args": "600 $f",
            "why": "cambia los permisos de un fichero (mod declarativo u=propietario g=grupo o=otros, octal 644 = rw-r--r--)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat \"$f\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$f",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "f=$(find /home/agent/redactar -perm 000 -type f); chmod 600 \"$f\"; cat \"$f\""
  },
  {
    "id": "permisos-l18",
    "track": "permisos",
    "index": 18,
    "title": "El par prohibido",
    "subtitle": "sudo: escalamiento básico",
    "xp": 50,
    "difficulty": 4,
    "brief": "En /root vive un fichero al que un usuario normal no llega. El dojo confía en ti: sube un peldaño con sudo.",
    "goal": "Lee /root/paneles/llave.txt con el sudo que tiene el agent habilitado.",
    "keywords": [
      "sudo",
      "root",
      "escalada"
    ],
    "hints": [
      "El agent del dojo tiene sudo sin contraseña (sudoers.d_pending): sudo comando corre como root.",
      "sudo cat fichero basta; no uses sudo -i (abre otra shell entera).",
      "sudo cat /root/paneles/llave.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "sudo -l",
        "desc": "qué te permiten"
      },
      {
        "cmd": "sudo cmd",
        "desc": "comando como root"
      }
    ],
    "teach": "sudo es la franquicia contemplada de elevación: comando a comando, sin sesión completa. ¿Por qué \"sudo cat\" y no \"sudo sh\"? Menos superficie, auditoría línea a línea.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "acceso al panel: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo cat /root/paneles/llave.txt",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "cat /root/paneles/llave.txt",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sudo cat /root/paneles/llave.txt"
  },
  {
    "id": "permisos-l19",
    "track": "permisos",
    "index": 19,
    "title": "El sello del grupo",
    "subtitle": "chmod con sudo para el dueño root",
    "xp": 50,
    "difficulty": 4,
    "brief": "> El acta del consejo (/var/dojo/acta.txt) es de root y su grupo > \"auditores\" —del que tú formas parte, pero no es tu grupo primario. > Con los permisos 640 actuales, el grupo debería poder leerla... y > aunque ERES miembro del grupo, el fichero está sellado: faltan los > bits correctos. Solo un superpoder la abrirá.",
    "goal": "Haz legible el acta para el grupo (o para todos) con sudo y muestra la flag.",
    "keywords": [
      "sudo",
      "chmod",
      "id"
    ],
    "hints": [
      "sudo ejecuta el comando como root: sudo chmod …",
      "El 6 en 640 son lectura+escritura del DUEÑO; el grupo tiene un 4 (leer)… ¿o no?",
      "Los bits se pueden dar numéricos (644) o simbólicos (g+r / a+r)."
    ],
    "cheatsheet": [
      {
        "cmd": "sudo chmod 644 F",
        "desc": "da permisos de lectura a todos"
      },
      {
        "cmd": "chmod g+r F",
        "desc": "variante simbólica: grupo puede leer"
      },
      {
        "cmd": "id",
        "desc": "revisa a qué grupos perteneces"
      }
    ],
    "teach": "Un fichero root:auditores con -rw-r----- debería dejar leer al grupo… pero si el sello se puso en 600 (grupo sin permisos), el miembro del grupo no lee. Como agente (miembro del grupo pero SIN ser root), no puedes chmod; para ello está sudo:\n\n    sudo chmod 644 /var/dojo/acta.txt\n    cat /var/dojo/acta.txt\n\n644 = dueño lee/escribe, grupo y otros leen.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "sudo chmod 644 /var/dojo/acta.txt",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "chmod 644 /var/dojo/acta.txt",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /var/dojo/acta.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/var/dojo/acta.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sudo chmod 644 /var/dojo/acta.txt && cat /var/dojo/acta.txt"
  },
  {
    "id": "permisos-l20",
    "track": "permisos",
    "index": 20,
    "title": "La maleta del inspector",
    "subtitle": "chown con sudo",
    "xp": 50,
    "difficulty": 4,
    "brief": "> El inspector invitado dejó su maletín en tu cueva… pero lo cerró con > llave: el fichero es DE ÉL (propietario inspector) y tú no puedes > leerlo. Tienes sudo: recupera la propiedad y la lee.",
    "goal": "Cambia el propietario de ~/cueva/maletin.txt para que seas tú y muestra su contenido.",
    "keywords": [
      "sudo",
      "ls"
    ],
    "hints": [
      "ls -l muestra el propietario en la 3.ª columna.",
      "sudo chown agent FICHERO transfiere la propiedad.",
      "Después de apropiarte, cat ya funciona."
    ],
    "cheatsheet": [
      {
        "cmd": "sudo chown user F",
        "desc": "transfiere la propiedad a user"
      },
      {
        "cmd": "ls -l",
        "desc": "ve quién es el dueño y los permisos"
      }
    ],
    "teach": "chown cambia el dueño; solo root (o sudo) puede dárselo a otro. Después de apropiarte del maletín, leer es trivial:\n\n    ls -l ~/cueva/maletin.txt          # quien es el dueño\n    sudo chown agent ~/cueva/maletin.txt\n    cat ~/cueva/maletin.txt",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "-rw------- 1 inspector inspector 39 Oct 23 11:34 /home/agent/cueva/maletin.txt\nFLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ls -l ~/cueva/maletin.txt",
        "cmds": [
          {
            "cmd": "ls",
            "args": "-l ~/cueva/maletin.txt",
            "why": "lista el contenido de un directorio",
            "flags": [
              {
                "flag": "-l",
                "meaning": "formato largo (permisos, dueño, tamaño, fecha)"
              }
            ]
          }
        ]
      },
      {
        "raw": "sudo chown agent ~/cueva/maletin.txt",
        "cmds": [
          {
            "cmd": "sudo",
            "args": "chown agent ~/cueva/maletin.txt",
            "why": "ejecuta el siguiente comando con privilegios de root (requiere permiso sudoers)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat ~/cueva/maletin.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "~/cueva/maletin.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "ls -l ~/cueva/maletin.txt && sudo chown agent ~/cueva/maletin.txt && cat ~/cueva/maletin.txt"
  },
  {
    "id": "procesos-l1",
    "track": "procesos",
    "index": 0,
    "title": "El proceso bocazas",
    "subtitle": "ps aux + grep",
    "xp": 45,
    "difficulty": 2,
    "brief": "Un demonio despistado fue arrancado con su secreto en la propia línea de comando. Los argumentos de un proceso son públicos para quien sepa mirar.",
    "goal": "Encuentra el proceso cuyo comando contiene FLAG{ y muestra su full commandline (la línea completa del ps aux).",
    "keywords": [
      "ps",
      "pgrep"
    ],
    "hints": [
      "ps aux | grep FLAG"
    ],
    "cheatsheet": [
      {
        "cmd": "ps aux | grep patrón",
        "desc": "busca un proceso concreto"
      },
      {
        "cmd": "pgrep -f patrón",
        "desc": "solo PIDs que casan"
      },
      {
        "cmd": "ps -ef",
        "desc": "formato alternativo con PPID"
      }
    ],
    "teach": "`ps aux` lista todos los procesos con PID, CPU, usuario y el commandline completo — que es público: cualquiera puede verlo con `ps -ef` o leyendo /proc/PID/cmdline. NUNCA pongas secretos en la línea de comandos de un proceso real: ese es el educativo punto. `pgrep -f 'patrón'` te devuelve los PIDs que casan directamente.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "root          18  4.6  0.1  15112  9232 ?        Ss   11:35   0:00 python3 -c import time time.sleep(30000) FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ps aux | grep 'FLAG{' | grep -v grep",
        "cmds": [
          {
            "cmd": "ps",
            "args": "aux",
            "why": "lista procesos",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "FLAG{",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-v grep",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ps aux | grep 'FLAG{' | grep -v grep"
  },
  {
    "id": "procesos-l2",
    "track": "procesos",
    "index": 0,
    "title": "Apagar la radio",
    "subtitle": "kill, señales y demonios",
    "xp": 50,
    "difficulty": 3,
    "brief": "Una radio pirata (proceso hunterd) emite un fragmento de los datos cada pocos segundos, alterando el log. Hay que apagarla con la señal correcta y luego ordenar el menú: el log guarda la clave sectorizada.",
    "goal": "Mata el proceso emisor (hunterd) con la señal TERM, espera 2 segundos, y luego lee /var/log/hunter.log completo. Contiene la clave completa.",
    "keywords": [
      "kill",
      "pkill",
      "señales"
    ],
    "hints": [
      "pgrep -f hunterd para concretar el PID; kill PID para TERM.",
      "killall hunterd o pkill -f hunterd también van.",
      "después: cat /var/log/hunter.log"
    ],
    "cheatsheet": [
      {
        "cmd": "kill PID",
        "desc": "envía TERM"
      },
      {
        "cmd": "kill -9 PID",
        "desc": "fuerza SIGKILL"
      },
      {
        "cmd": "pkill -f nombre",
        "desc": "mata por patrón de cmdline"
      }
    ],
    "teach": "`kill -TERM PID` pide finalización limpia (la señal por omisión de kill). `-KILL` (9) es el «espadón» que no puede ser ignorado. `killall` y `pkill -f` apuntan por nombre. Verifica procesos al acecho con `ps`.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "1792755338 emit:: FLAG{d3b09a4f7c2e1b8d6041a5f3} fragmento-32592"
      }
    ],
    "steps": [
      {
        "raw": "pkill -f '[h]unterd$'",
        "cmds": [
          {
            "cmd": "pkill",
            "args": "-f [h]unterd$",
            "why": "comando pkill — revisa «man pkill»",
            "flags": [
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man pkill»"
              }
            ]
          }
        ]
      },
      {
        "raw": "true\nsleep 2\ncat /var/log/hunter.log",
        "cmds": [
          {
            "cmd": "true",
            "args": "sleep 2 cat /var/log/hunter.log",
            "why": "comando true — revisa «man true»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "pkill -f '[h]unterd$' || true\nsleep 2\ncat /var/log/hunter.log"
  },
  {
    "id": "procesos-l3",
    "track": "procesos",
    "index": 0,
    "title": "Bytes van al cielo",
    "subtitle": "du, df y find por tamaño",
    "xp": 50,
    "difficulty": 2,
    "brief": "Alguien llenó /var/dojo/silo con dat ficheros de ruido de tamaños absurdos. El más grande conserva, como no, el secuestro.",
    "goal": "En /var/dojo/silo hay ficheros de distintos tamaños; el fichero MAYOR contiene la flag. Encuéntralo con du + sort + tail y muéstralo con cat.",
    "keywords": [
      "du",
      "df"
    ],
    "hints": [
      "find /var/dojo/silo -type f -printf '%s %p\\n' | sort -n | tail -3 saca los mayores (por bytes).",
      "cat $(find /var/dojo/silo -type f -printf '%s %p\\n' | sort -n | tail -1 | cut -d' ' -f2-)"
    ],
    "cheatsheet": [
      {
        "cmd": "du -ah ruta",
        "desc": "tamaño por elemento + total"
      },
      {
        "cmd": "df -h",
        "desc": "espacio de filesystems"
      },
      {
        "cmd": "du -a | sort -rn | head",
        "desc": "los mayores primero"
      }
    ],
    "teach": "`du -a` lista el tamaño de cada fichero/archivo; en disco `df` reporta filesystems. `sort -n | tail -1` ordena numéric y coje el mayor.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "\nRADIOGRAFÍA: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(find /var/dojo/silo -type f -printf '%s %p\\n' | sort -n | tail -1 | cut -d' ' -f2-)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(find /var/dojo/silo -type f -printf '%s %p\\n' | sort -n | tail -1 | cut -d' ' -f2-)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(find /var/dojo/silo -type f -printf '%s %p\\n' | sort -n | tail -1 | cut -d' ' -f2-)\""
  },
  {
    "id": "procesos-l4",
    "track": "procesos",
    "index": 0,
    "title": "Asesinato con testigo",
    "subtitle": "/proc y ficheros borrados en uso",
    "xp": 60,
    "difficulty": 3,
    "brief": "Un proceso python guarda en la memoria de su fd un fichero que otra mano borró cómodamente de /tmp. En Linux, el fichero sigue vivo MIENTRAS el proceso lo mantenga abierto: /proc/<PID>/fd/N lo revela.",
    "goal": "Un proceso python mantiene abierto /tmp/ocultad.sock (contiene la flag) pero el fichero fue borrado. Localiza su PID (pgrep) y recupera su contenido vía /proc/<PID>/fd/<N>. Muéstralo.",
    "keywords": [
      "proc",
      "fd",
      "pgrep"
    ],
    "hints": [
      "pgrep -f arena-hold te da el PID del proceso que sostiene el fichero.",
      "ls -l /proc/<PID>/fd  te muestra los fd del proceso (el 3 suele ser el abierto).",
      "cat /proc/<PID>/fd/<N> — sin sudo: el proceso es tuyo (mismo uid)."
    ],
    "cheatsheet": [
      {
        "cmd": "pgrep -f patrón",
        "desc": "encuentra el PID por su cmdline"
      },
      {
        "cmd": "ls -l /proc/PID/fd",
        "desc": "descriptores abiertos de un proceso"
      },
      {
        "cmd": "lsof | grep deleted",
        "desc": "ficheros borrados aún abiertos (a veces lento en contenedor)"
      }
    ],
    "teach": "En Linux un fichero borrado subsiste mientras algún proceso lo tenga abierto (referencia al inodo). `lsof` lista ficheros abiertos (con el marcador deleted) pero puede ser lento/colgar en contenedores: la vía universal de forense es /proc/<PID>/fd — el atajo ES el fichero: su contenido se copia para recuperar datos \"perdidos\". Ojo: los fd de otro usuario no se ven sin permisos de dueño (o root con permisos completos).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "testigo: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "pid=$(pgrep -f 'arena-hold' | head -1)\n[ -n \"$pid\" ]",
        "cmds": [
          {
            "cmd": "pid=$(pgrep",
            "args": "-f arena-hold",
            "why": "comando pid=$(pgrep — revisa «man pid=$(pgrep»",
            "flags": [
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man pid=$(pgrep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-1) [ -n $pid ]",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "{ echo 'no encontré el proceso dueño del fd'",
        "cmds": [
          {
            "cmd": "{",
            "args": "echo no encontré el proceso dueño del fd",
            "why": "comando { — revisa «man {»",
            "flags": []
          }
        ]
      },
      {
        "raw": "exit 1",
        "cmds": [
          {
            "cmd": "exit",
            "args": "1",
            "why": "termina el shell/swrss con el código dado",
            "flags": []
          }
        ]
      },
      {
        "raw": "}\nfd=$(ls -l /proc/$pid/fd 2>/dev/null | grep 'ocultad' | awk '{print $9}' | head -1)\ncat /proc/$pid/fd/$fd",
        "cmds": [
          {
            "cmd": "}",
            "args": "fd=$(ls -l /proc/$pid/fd 2>/dev/null",
            "why": "comando } — revisa «man }»",
            "flags": [
              {
                "flag": "-l",
                "meaning": "flag l del comando — revisa «man }»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "ocultad",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "awk",
            "args": "{print $9}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "head",
            "args": "-1) cat /proc/$pid/fd/$fd",
            "why": "imprime el principio de un fichero/flujo",
            "flags": []
          }
        ]
      }
    ],
    "raw": "pid=$(pgrep -f 'arena-hold' | head -1)\n[ -n \"$pid\" ] || { echo 'no encontré el proceso dueño del fd'; exit 1; }\nfd=$(ls -l /proc/$pid/fd 2>/dev/null | grep 'ocultad' | awk '{print $9}' | head -1)\ncat /proc/$pid/fd/$fd"
  },
  {
    "id": "procesos-l5",
    "track": "procesos",
    "index": 0,
    "title": "Unidades de ficción",
    "subtitle": "systemctl simulado (status, list-units)",
    "xp": 60,
    "difficulty": 3,
    "brief": "En este dojo no corre systemd: corremos un clon minimalista. Un agente puso la clave en la unit 'forge.service' y dejó un systemctl simulado que lista units y sus ficheros de definición.",
    "goal": "Usa el systemctl simulado para LISTAR las unidades del dojo (list-units o --list-units), encuentra cuál lleva la FLAG en su descripción (Description=…) y muestrala leyendo el fichero de la unit correspondiente.",
    "keywords": [
      "systemctl",
      "unidades"
    ],
    "hints": [
      "systemctl list-units  |  systemctl --list-units",
      "lee la unit interessante: cat /etc/systemd/system/forge.service"
    ],
    "cheatsheet": [
      {
        "cmd": "systemctl list-units",
        "desc": "lista servicios (simulado)"
      },
      {
        "cmd": "systemctl status forge.service",
        "desc": "cómo está una unit"
      }
    ],
    "teach": "El systemctl real gestiona systemd units (servicios del sistema); el dojo lo SIMULA para que practiques la mecánica. `systemctl status unidad` te dice cómo está y qué fichero la define; el fichero .service guarda metadatos (Description=) y qué ejecutar (ExecStart=).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "cache.service                cache simulada del dojo\nforge.service                forge that stores the code: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nweb.service                  web simulada del dojo\n[Unit]\nDescription=forge that stores the code: FLAG{d3b09a4f7c2e1b8d6041a5f3}\n[Service]\nExecStart=/bin/true"
      }
    ],
    "steps": [
      {
        "raw": "systemctl list-units\ncat /etc/systemd/system/forge.service",
        "cmds": [
          {
            "cmd": "systemctl",
            "args": "list-units cat /etc/systemd/system/forge.service",
            "why": "comando systemctl — revisa «man systemctl»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "systemctl list-units\ncat /etc/systemd/system/forge.service"
  },
  {
    "id": "procesos-l6",
    "track": "procesos",
    "index": 6,
    "title": "El intruso visible",
    "subtitle": "ps: la línea de comandos delata",
    "xp": 40,
    "difficulty": 3,
    "brief": "Un proceso estrafalario quedó ARRANCADO y su línea de argumentos lleva la marca. No hay ficheros: solo la tabla de procesos.",
    "goal": "Localiza la marca que aparece en los argumentos de algún proceso en ejecución.",
    "keywords": [
      "ps",
      "args",
      "argumentos"
    ],
    "hints": [
      "ps ax lista procesos con su línea de comandos completa.",
      "Los argumentos con los que nació un proceso se ven en ps (no confundir con el env).",
      "ps ax -o args | grep -oE 'FLAG\\{[^}]*\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "ps ax -o args",
        "desc": "argumentos de cada proceso"
      },
      {
        "cmd": "pgrep -f patron",
        "desc": "PID de lo que casa el comando"
      }
    ],
    "teach": "ps no solo muestra nombres: la columna args revela TODOS los argumentos con que un proceso nació. Auditar ps regularmente saca a la luz procesos intrusos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ps ax -o args | grep -oE 'FLAG\\{[^}]*\\}' | tail -n 1",
        "cmds": [
          {
            "cmd": "ps",
            "args": "ax -o args",
            "why": "lista procesos",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man ps»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "tail",
            "args": "-n 1",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ps ax -o args | grep -oE 'FLAG\\{[^}]*\\}' | tail -n 1"
  },
  {
    "id": "procesos-l7",
    "track": "procesos",
    "index": 7,
    "title": "El obediente delator",
    "subtitle": "kill TERM + trap en bash",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un vigilante debe morir CORTESMENTE (SIGTERM): esa señal dispara su confesión escrita en el disco.",
    "goal": "Termina el proceso vigilante con SIGTERM y muestra la marca que deja en /tmp/marca-vigilante.txt.",
    "keywords": [
      "kill",
      "trap",
      "SIGTERM",
      "pgrep"
    ],
    "hints": [
      "El vigilante deja su PID en /tmp/vigilante.pid (haz un pgrep -f vigilante y verás lo mismo).",
      "kill PID manda SIGTERM (la señal por defecto NO es -9).",
      "kill $(cat /tmp/vigilante.pid); sleep 2; cat /tmp/marca-vigilante.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "kill PID",
        "desc": "pide cierre correcto"
      },
      {
        "cmd": "pgrep -f x",
        "desc": "PIDs que casan (vigilante de PID en /tmp/vigilante.pid)"
      }
    ],
    "teach": "SIGTERM es la señal educada: da al proceso la oportunidad de cerrar bien (trap la intercepta). kill -9 (SIGKILL) mata sin ninguna última palabra: úsala solo como último recurso.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "confesion del vigilante: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "pid=$(cat /tmp/vigilante.pid)",
        "cmds": [
          {
            "cmd": "pid=$(cat",
            "args": "/tmp/vigilante.pid)",
            "why": "comando pid=$(cat — revisa «man pid=$(cat»",
            "flags": []
          }
        ]
      },
      {
        "raw": "kill \"$pid\"",
        "cmds": [
          {
            "cmd": "kill",
            "args": "$pid",
            "why": "manda una señal a un proceso; la señal por defecto es TERM (petición de terminar)",
            "flags": []
          }
        ]
      },
      {
        "raw": "sleep 2",
        "cmds": [
          {
            "cmd": "sleep",
            "args": "2",
            "why": "espera los segundos dados (o s/m/h)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /tmp/marca-vigilante.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/marca-vigilante.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "pid=$(cat /tmp/vigilante.pid); kill \"$pid\"; sleep 2; cat /tmp/marca-vigilante.txt"
  },
  {
    "id": "procesos-l8",
    "track": "procesos",
    "index": 8,
    "title": "El que come la memoria",
    "subtitle": "ps --sort=-rss: el más pesado",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un proceso está bebiendo la RAM: es el más pesado de la máquina y quedó bautizado con la marca en sus argumentos.",
    "goal": "Lista los procesos ordenados por consumo de memoria y extrae la marca del más pesado.",
    "keywords": [
      "ps",
      "sort",
      "rss",
      "memoria"
    ],
    "hints": [
      "ps aux --sort=<campo> ordena por RSS (memoria residente).",
      "Con -rss y el modo descendente, el primero de la lista es el más gordo.",
      "ps aux --sort=-rss | grep -oE 'FLAG\\{[^}]*\\}' | head -n 1"
    ],
    "cheatsheet": [
      {
        "cmd": "ps aux --sort=-rss | head",
        "desc": "top en consumo de RAM"
      },
      {
        "cmd": "ps -eo pid,comm,%mem",
        "desc": "tabla compacta"
      }
    ],
    "teach": "ps aux --sort=-rss expone a los devoradores de memoria. Ordenar procesos por consumo es lo que hacen los sysadmins antes de matar nada: medir primero, actuar después.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ps aux --sort=-rss | head -n 5 | grep -oE 'FLAG\\{[^}]*\\}' | head -n 1",
        "cmds": [
          {
            "cmd": "ps",
            "args": "aux --sort=-rss",
            "why": "lista procesos",
            "flags": [
              {
                "flag": "--sort=-rss",
                "meaning": "flag larga del comando — revisa «man ps»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 5",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 5",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 5)"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ps aux --sort=-rss | head -n 5 | grep -oE 'FLAG\\{[^}]*\\}' | head -n 1"
  },
  {
    "id": "procesos-l9",
    "track": "procesos",
    "index": 9,
    "title": "El descriptor abierto",
    "subtitle": "lsof: quién tiene abierto qué",
    "xp": 50,
    "difficulty": 3,
    "brief": "Un guardián (corriendo como tu usuario) mantiene un fichero legado abierto… visible con lsof.",
    "goal": "Descubre con lsof el fichero que el guardián tiene abierto y muéstralo.",
    "keywords": [
      "lsof",
      "fd",
      "proceso",
      "pgrep"
    ],
    "hints": [
      "lsof lista ficheros abiertos por cada proceso (como agente solo ves los tuyos).",
      "El guardián deja su PID en /tmp/guardian.pid; pregúntale solo a ese: lsof -b -p PID (el flag -b evita bloqueos sin privilegios).",
      "p=$(cat /tmp/guardian.pid); cat $(lsof -b -p $p | grep -oE \"/etc/arena/[^ ]+\" | head -n1)"
    ],
    "cheatsheet": [
      {
        "cmd": "lsof -b -p PID",
        "desc": "ficheros abiertos de un PID (-b evita bloqueos sin privilegios)"
      },
      {
        "cmd": "lsof +D dir",
        "desc": "todo lo abierto bajo un árbol"
      }
    ],
    "teach": "lsof responde «quién tiene abierto qué»: ficheros borrados a medias, sockets, descriptores… La combinación pgrep → lsof -b -p PID es un diagnóstico mínimo eficaz (en contenedores sin privilegios usa -b para que lsof no se bloquee escaneando el kernel).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "caso guardado: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(cat /tmp/guardian.pid)",
        "cmds": [
          {
            "cmd": "p=$(cat",
            "args": "/tmp/guardian.pid)",
            "why": "comando p=$(cat — revisa «man p=$(cat»",
            "flags": []
          }
        ]
      },
      {
        "raw": "f=$(lsof -b -p \"$p\" 2>/dev/null | grep -oE '/etc/arena/[^ ]+' | head -n1)",
        "cmds": [
          {
            "cmd": "f=$(lsof",
            "args": "-b -p $p 2>/dev/null",
            "why": "comando f=$(lsof — revisa «man f=$(lsof»",
            "flags": [
              {
                "flag": "-b",
                "meaning": "flag b del comando — revisa «man f=$(lsof»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man f=$(lsof»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE /etc/arena/[^ ]+",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "if [ -z \"$f\" ]",
        "cmds": [
          {
            "cmd": "if",
            "args": "[ -z $f ]",
            "why": "comando if — revisa «man if»",
            "flags": [
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man if»"
              }
            ]
          }
        ]
      },
      {
        "raw": "then f=$(readlink /proc/$p/fd/3)",
        "cmds": [
          {
            "cmd": "then",
            "args": "f=$(readlink /proc/$p/fd/3)",
            "why": "comando then — revisa «man then»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi",
        "cmds": [
          {
            "cmd": "fi",
            "args": "",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat \"$f\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$f",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "p=$(cat /tmp/guardian.pid); f=$(lsof -b -p \"$p\" 2>/dev/null | grep -oE '/etc/arena/[^ ]+' | head -n1); if [ -z \"$f\" ]; then f=$(readlink /proc/$p/fd/3); fi; cat \"$f\""
  },
  {
    "id": "procesos-l10",
    "track": "procesos",
    "index": 10,
    "title": "La lectura del disco",
    "subtitle": "df: espacios y su registro",
    "xp": 40,
    "difficulty": 2,
    "brief": "Antes de la limpieza conviene medir. El registro del uso del disco (var/log/arena) guarda una nota con la marca.",
    "goal": "Comprueba el espacio libre de / con df y después muestra /var/log/arena/uso.log.",
    "keywords": [
      "df",
      "disco",
      "espacio"
    ],
    "hints": [
      "df -h muestra uso y espacio libre por sistema de ficheros (h=humanos).",
      "El fichero del registro es legible para todos (644).",
      "df -h /; cat /var/log/arena/uso.log"
    ],
    "cheatsheet": [
      {
        "cmd": "df -h",
        "desc": "espacio por partición"
      },
      {
        "cmd": "du -sh dir",
        "desc": "tamaño total de un directorio"
      }
    ],
    "teach": "df mide PARTICIONES y du mide CARPETAS. Antes de cualquier limpieza: df para saber dónde aprieta y du para saber a quién culpar.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "Filesystem      Size  Used Avail Use% Mounted on\noverlay          79G   63G   12G  85% /\nmediciones del dia: espacio sano, disco estable: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "df -h /",
        "cmds": [
          {
            "cmd": "df",
            "args": "-h /",
            "why": "uso de espacio en los sistemas de ficheros montados",
            "flags": [
              {
                "flag": "-h",
                "meaning": "legible para humanos"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat /var/log/arena/uso.log",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/var/log/arena/uso.log",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "df -h / && cat /var/log/arena/uso.log"
  },
  {
    "id": "procesos-l11",
    "track": "procesos",
    "index": 11,
    "title": "El alijo del pesado",
    "subtitle": "du: encontrar la carpeta que pesa",
    "xp": 55,
    "difficulty": 4,
    "brief": "En workspace/ hay varios contenedores; uno pesa más que todos por su relleno y guardó la clave dentro.",
    "goal": "Localiza el CONTENEDOR más pesado con du y muestra su fichero clave.txt.",
    "keywords": [
      "du",
      "sort",
      "espacio"
    ],
    "hints": [
      "du -sk lista cada contenedor con su tamaño EN KILOBYTES (k).",
      "Ordenando por el número, el primero es el más pesado; la ruta queda en la 2ª columna.",
      "m=$(du -sk /workspace/* | sort -rn | head -n1 | cut -f2); cat \"$m/clave.txt\""
    ],
    "cheatsheet": [
      {
        "cmd": "du -sk dir/* | sort -rn | head",
        "desc": "mayores por KB"
      },
      {
        "cmd": "cut -f2",
        "desc": "columna 2 (tabulado)"
      }
    ],
    "teach": "du -sk + sort -rn es la rutina clásica de «quién llena el disco». El -k normaliza unidades para que el orden numérico no traicione nada mezclando Mega y Kilo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "aqui estoy: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "m=$(du -sk /workspace/* | sort -rn | head -n1 | cut -f2)",
        "cmds": [
          {
            "cmd": "m=$(du",
            "args": "-sk /workspace/*",
            "why": "comando m=$(du — revisa «man m=$(du»",
            "flags": [
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man m=$(du»"
              },
              {
                "flag": "-k",
                "meaning": "flag k del comando — revisa «man m=$(du»"
              }
            ]
          },
          {
            "cmd": "sort",
            "args": "-rn",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-r",
                "meaning": "inverso (descendente)"
              },
              {
                "flag": "-n",
                "meaning": "orden numérico"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          },
          {
            "cmd": "cut",
            "args": "-f2)",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat \"$m/clave.txt\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$m/clave.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "m=$(du -sk /workspace/* | sort -rn | head -n1 | cut -f2); cat \"$m/clave.txt\""
  },
  {
    "id": "procesos-l12",
    "track": "procesos",
    "index": 12,
    "title": "El portero y su llave",
    "subtitle": "/proc/PID/cmdline: leer el comando del proceso",
    "xp": 55,
    "difficulty": 4,
    "brief": "Un portero dejó pasada su llave en la línea de comandos con la que arrancó. La carpeta /proc lo cuenta todo.",
    "goal": "Lee /proc/<PID>/cmdline del portero, extrae la ruta /etc/arena/... y muestra ese fichero.",
    "keywords": [
      "/proc",
      "cmdline",
      "tr"
    ],
    "hints": [
      "Cada proceso tiene /proc/PID/cmdline separado por bytes NUL (\\\\0).",
      "tr \"\\0\" \" \" convierte los separadores en espacios para poder extraer rutas.",
      "r=$(tr \"\\0\" \" \" < /proc/PID/cmdline | grep -oE \"/etc/arena/[^ ]+\"); cat \"$r\""
    ],
    "cheatsheet": [
      {
        "cmd": "tr \"\\0\" \" \" < /proc/PID/cmdline",
        "desc": "comando del proceso"
      },
      {
        "cmd": "pgrep -f x",
        "desc": "PID de lo buscado"
      }
    ],
    "teach": "/proc es un espejo del kernel: cmdline, environ, status, fd… todo proceso vive ahí. Leer cmdline de otros procesos revela con qué fueron arrancados.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la llave del portero: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "r=$(tr '\\0' ' ' < /proc/$(pgrep -f portero-guardian | head -n1)/cmdline | grep -oE '/etc/arena/[^ ]+' | head -n1)",
        "cmds": [
          {
            "cmd": "r=$(tr",
            "args": "\\0   < /proc/$(pgrep -f portero-guardian",
            "why": "comando r=$(tr — revisa «man r=$(tr»",
            "flags": [
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man r=$(tr»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)/cmdline",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man head»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man head»"
              },
              {
                "flag": "-d",
                "meaning": "flag d del comando — revisa «man head»"
              },
              {
                "flag": "-l",
                "meaning": "flag l del comando — revisa «man head»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man head»"
              },
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man head»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE /etc/arena/[^ ]+",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat \"$r\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$r",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "r=$(tr '\\0' ' ' < /proc/$(pgrep -f portero-guardian | head -n1)/cmdline | grep -oE '/etc/arena/[^ ]+' | head -n1); cat \"$r\""
  },
  {
    "id": "procesos-l13",
    "track": "procesos",
    "index": 13,
    "title": "El renombrado",
    "subtitle": "exec -a: el argv0 manda en ps",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un proceso camina disfrazado: su argv0 ES la marca. ps la revela, pgrep no te dice nada útil aquí.",
    "goal": "Encuentra el proceso cuyo nombre (argv0) es la marca y muéstralo con ps.",
    "keywords": [
      "ps",
      "argv",
      "exec"
    ],
    "hints": [
      "ps -eo args imprime SOLO la línea de argumentos de cada proceso (sin cabecera).",
      "El primer grep -F no se auto-pillar porque pgrep no está de por medio; el grep -v grep limpia al propio ps.",
      "ps -eo args | grep -F 'FLAG{' | grep -v grep"
    ],
    "cheatsheet": [
      {
        "cmd": "ps -eo args",
        "desc": "linea de comando de todos"
      },
      {
        "cmd": "ps -o args= -p PID",
        "desc": "argv de un PID"
      }
    ],
    "teach": "exec -a reescribe argv[0]: es el truco de cambiapieles de los procesos (y de los rootkits). ps -eo args — y en kernels modernos /proc/PID/cmdline — son la contramedida.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "sudo -u agent bash -c exec -a 'FLAG{d3b09a4f7c2e1b8d6041a5f3}' sleep 600"
      }
    ],
    "steps": [
      {
        "raw": "ps -eo args | grep -F 'FLAG{' | grep -v grep | head -n1",
        "cmds": [
          {
            "cmd": "ps",
            "args": "-eo args",
            "why": "lista procesos",
            "flags": [
              {
                "flag": "-e",
                "meaning": "todos los procesos del sistema"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man ps»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-F FLAG{",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "patrón literal, sin regex"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-v grep",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ps -eo args | grep -F 'FLAG{' | grep -v grep | head -n1"
  },
  {
    "id": "procesos-l14",
    "track": "procesos",
    "index": 14,
    "title": "El tozudo",
    "subtitle": "kill -9 cuando TERM no llega",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un proceso se protege del SIGTERM con trap \"\". La educacion aquí es inútl: hay que cortar por lo sanos.KILL.",
    "goal": "Termina con SIGKILL el proceso cuyo PID está en /tmp/quisquilla.pid y confirma leyendo /tmp/manifesto.txt.",
    "keywords": [
      "kill",
      "SIGKILL",
      "term"
    ],
    "hints": [
      "trap \"TERM\" hace al proceso inmune al SIGTERM; hasta un SIGKILL (kill -9) no refunfuna.",
      "kill -9 $(cat /tmp/quisquilla.pid) — el pidfile es la forma limpia de apuntar.",
      "kill -9 $(cat /tmp/quisquilla.pid); cat /tmp/manifesto.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "kill -9 PID",
        "desc": "SIGKILL, indetectable por trap"
      },
      {
        "cmd": "kill -TERM PID",
        "desc": "la educada (trap-compatible)"
      }
    ],
    "teach": "SIGTERM es negociable (trap); SIGKILL es judicial: el kernel saca el proceso y TERMINA. Nunca uses -9 de primeras: \"a veces el trap es el que hace el backup\".",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "manifesto del tozudo: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "kill -9 $(cat /tmp/quisquilla.pid)",
        "cmds": [
          {
            "cmd": "kill",
            "args": "-9 $(cat /tmp/quisquilla.pid)",
            "why": "manda una señal a un proceso; la señal por defecto es TERM (petición de terminar)",
            "flags": [
              {
                "flag": "-9",
                "meaning": "señal KILL: muerte inmediata sin limpieza (última opción)"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat /tmp/manifesto.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/manifesto.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "kill -9 $(cat /tmp/quisquilla.pid); cat /tmp/manifesto.txt"
  },
  {
    "id": "procesos-l15",
    "track": "procesos",
    "index": 15,
    "title": "La señal de usuario",
    "subtitle": "kill -USR1 y trap personalizado",
    "xp": 45,
    "difficulty": 3,
    "brief": "El cubridor solo contesta a una señal de usuario (USR1): su trap escribe la confesión en fichero como regalo.",
    "goal": "Envía SIGUSR1 al proceso con PID en /tmp/cubridor.pid y muestra su confesión en /tmp/confesion-usr.txt.",
    "keywords": [
      "kill",
      "usr1",
      "trap"
    ],
    "hints": [
      "SIGUSR1 es una señal definida por el usuario: kill -USR1 PID la envía sin teclado.",
      "El trap USR1 del proceso escribe al fichero antes de salir; dale 1 segundo.",
      "kill -USR1 $(cat /tmp/cubridor.pid); sleep 1; cat /tmp/confesion-usr.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "kill -USR1 PID",
        "desc": "señal de usuario 1"
      },
      {
        "cmd": "kill -USR2 PID",
        "desc": "señal de usuario 2"
      }
    ],
    "teach": "Señales trappables: TERM (la educada), INT (Ctrl+C) y las de usuario USR1/USR2, pensadas para acciones del programa. kill SIN sufijo es TERM. KILL no es trappable: el kernel mata.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "confesion USR1: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "kill -USR1 $(cat /tmp/cubridor.pid)",
        "cmds": [
          {
            "cmd": "kill",
            "args": "-USR1 $(cat /tmp/cubridor.pid)",
            "why": "manda una señal a un proceso; la señal por defecto es TERM (petición de terminar)",
            "flags": []
          }
        ]
      },
      {
        "raw": "sleep 1",
        "cmds": [
          {
            "cmd": "sleep",
            "args": "1",
            "why": "espera los segundos dados (o s/m/h)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /tmp/confesion-usr.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/confesion-usr.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "kill -USR1 $(cat /tmp/cubridor.pid); sleep 1; cat /tmp/confesion-usr.txt"
  },
  {
    "id": "procesos-l16",
    "track": "procesos",
    "index": 16,
    "title": "Quién manda",
    "subtitle": "PPID: el padre de un proceso",
    "xp": 45,
    "difficulty": 3,
    "brief": "El proceso identificado en /tmp/pantalla.pid es el hijo. Su PADRE (el PID que lo engendró) esconde la marca en su argv0.",
    "goal": "Descubre el PADRE del proceso /tmp/pantalla.pid y muestra su línea de comando con ps.",
    "keywords": [
      "ps",
      "ppid",
      "padre"
    ],
    "hints": [
      "ps -o ppid= -p PID imprime solo el PID del padre (el = quita la cabecera).",
      "Con ese PPID, ps -o args= -p PADRE muestra el argv0 del padre: allí está la marca.",
      "pp=$(ps -o ppid= -p $(cat /tmp/pantalla.pid)); ps -o args= -p $pp"
    ],
    "cheatsheet": [
      {
        "cmd": "ps -o ppid= -p PID",
        "desc": "PID del padre"
      },
      {
        "cmd": "ps -ef --forest",
        "desc": "árbol de procesos"
      }
    ],
    "teach": "Cada proceso tiene PPID: usarlo es el modo de \"¿quién lanzó esto?\" — parentage forense básico. ps -o ppid= y ps -o args= van de la mano.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "sudo -u agent bash -c exec -a 'pantalla-FLAG{d3b09a4f7c2e1b8d6041a5f3}' sleep 600"
      }
    ],
    "steps": [
      {
        "raw": "pp=$(ps -o ppid= -p $(cat /tmp/pantalla.pid) | tr -d ' ')",
        "cmds": [
          {
            "cmd": "pp=$(ps",
            "args": "-o ppid= -p $(cat /tmp/pantalla.pid)",
            "why": "comando pp=$(ps — revisa «man pp=$(ps»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man pp=$(ps»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man pp=$(ps»"
              }
            ]
          },
          {
            "cmd": "tr",
            "args": "-d  )",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "elimina los caracteres del conjunto dado"
              }
            ]
          }
        ]
      },
      {
        "raw": "ps -o args= -p \"$pp\"",
        "cmds": [
          {
            "cmd": "ps",
            "args": "-o args= -p $pp",
            "why": "lista procesos",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man ps»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man ps»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "pp=$(ps -o ppid= -p $(cat /tmp/pantalla.pid) | tr -d ' '); ps -o args= -p \"$pp\""
  },
  {
    "id": "procesos-l17",
    "track": "procesos",
    "index": 17,
    "title": "El escolta que confiesa",
    "subtitle": "pidfiles numerados + trap",
    "xp": 50,
    "difficulty": 3,
    "brief": "Tres escoltas esperan con sus pidfiles. Solo el Nº3 deja un despacho al licenciarse (SIGTERM): los otros dos ratones de campo.",
    "goal": "Manda SIGTERM al escolta Nº3 (pidfile /tmp/escolta.3.pid) y muestra su /tmp/despacho.txt.",
    "keywords": [
      "pidfile",
      "term",
      "kill"
    ],
    "hints": [
      "Los tres ficheros /tmp/escolta.N.pid discriminan a cada escolta; solo el 3 tiene trap de escritura.",
      "kill TERM al PID del pidfile Nº3; el trap escribe el fichero y sale.",
      "kill $(cat /tmp/escolta.3.pid); sleep 2; cat /tmp/despacho.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "kill $(cat f.pid)",
        "desc": "pidfile: apunta y dispara"
      },
      {
        "cmd": "for f in *.pid; do kill $(cat $f); done",
        "desc": "varios a la vez"
      }
    ],
    "teach": "Los pidfiles numerados son un patrón aún útil (systemd generó el patrón). Cuando hay procesos homónimos, apuntar su PID te salvan de la matanza indiscriminada de pkill.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "despacho del escolta: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "kill $(cat /tmp/escolta.3.pid)",
        "cmds": [
          {
            "cmd": "kill",
            "args": "$(cat /tmp/escolta.3.pid)",
            "why": "manda una señal a un proceso; la señal por defecto es TERM (petición de terminar)",
            "flags": []
          }
        ]
      },
      {
        "raw": "sleep 2",
        "cmds": [
          {
            "cmd": "sleep",
            "args": "2",
            "why": "espera los segundos dados (o s/m/h)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /tmp/despacho.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/despacho.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "kill $(cat /tmp/escolta.3.pid); sleep 2; cat /tmp/despacho.txt"
  },
  {
    "id": "procesos-l18",
    "track": "procesos",
    "index": 18,
    "title": "El esmirriado",
    "subtitle": "nice y ni en ps",
    "xp": 50,
    "difficulty": 3,
    "brief": "Un proceso camina ofendido con ni=19 (la menor prioridad). Es distinguido por la marca en su argv0 — enciona por nice.",
    "goal": "Encuentra con ps el proceso cuya prioridad (ni) es 19 y muestra su argv0, donde va la marca.",
    "keywords": [
      "nice",
      "ni",
      "ps"
    ],
    "hints": [
      "ps -eo ni,args imprime prioridad y argv de todos; ni es 0 para lo normal, negativo para lo urgente y 19 el pisoteado.",
      "awk \"$1 == 19\" filtra por prioridad: solo uno encaja.",
      "ps -eo ni,args | awk '$1 == 19'"
    ],
    "cheatsheet": [
      {
        "cmd": "ps -eo ni,args",
        "desc": "prioridad + argv"
      },
      {
        "cmd": "renice -n 5 -p PID",
        "desc": "cambiar prioridad"
      }
    ],
    "teach": "nice -n 19 baja la prioridad al mínimo (ni = 19). ps la muestra con la columna ni. Un proceso ofendido sigue corriendo — solo corre cuando nadie más quiere la CPU.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": " 19 FLAG{d3b09a4f7c2e1b8d6041a5f3} 600"
      }
    ],
    "steps": [
      {
        "raw": "ps -eo ni,args | awk '$1 == 19' | head -n1",
        "cmds": [
          {
            "cmd": "ps",
            "args": "-eo ni,args",
            "why": "lista procesos",
            "flags": [
              {
                "flag": "-e",
                "meaning": "todos los procesos del sistema"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man ps»"
              }
            ]
          },
          {
            "cmd": "awk",
            "args": "$1 == 19",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ps -eo ni,args | awk '$1 == 19' | head -n1"
  },
  {
    "id": "procesos-l19",
    "track": "procesos",
    "index": 19,
    "title": "El candado de la señal",
    "subtitle": "usr1 a un proceso en espera",
    "xp": 55,
    "difficulty": 4,
    "brief": "> Un \"celador\" del dojo duerme agarrado a un candado. Solo si le envías > la señal USR1 depositará la llave (la flag) en ~/candado.listo. > Encuéntralo con pgrep y despíertalo con la señal correcta.",
    "goal": "El proceso que contiene \"celador\" en su línea de comando aún duerme; envíale la señal SIGUSR1 y lee ~/candado.listo (se crea al recibir la señal).",
    "keywords": [
      "pgrep",
      "kill",
      "trap"
    ],
    "hints": [
      "pgrep -f PATRÓN lista los PID cuyo comando completo encaja con PATRÓN.",
      "kill -USR1 PID envía SIGUSR1 (las señales USR1/USR2 son \"de usuario\").",
      "kill -USR1 $(pgrep -f \"[c]elador\") && sleep 2 && cat ~/candado.listo"
    ],
    "cheatsheet": [
      {
        "cmd": "pgrep -f texto",
        "desc": "PIDs whose command line matches"
      },
      {
        "cmd": "pgrep -f '[c]lave'",
        "desc": "truco: el corchete evita auto-coincidir con tu propia cmdline"
      },
      {
        "cmd": "kill -USR1 PID",
        "desc": "envía la señal de usuario 1"
      },
      {
        "cmd": "trap CMD SIto",
        "desc": "en un script: qué hacer al recibir una señal"
      }
    ],
    "teach": "pgrep -f busca en TODA la línea de comando (no solo el nombre):\n\n    pgrep -f '[c]elador'    # imprime el PID (el corchete evita auto-coincidir)\n\nCon kill -USR1 se le avisa; el proceso tiene un trap que, al recibir la señal, escribe la llave en disco. Después solo hay que leerla:\n\n    kill -USR1 $(pgrep -f '[c]elador') && sleep 2 && cat ~/candado.listo\n\nEl corchete importa: pgrep -f busca en TODA la línea de comando — incluida la de tu propia invocación, que contiene la palabra — y sin el [ c ] te matarías a ti mismo con la señal. (sleep 2 deja tiempo al trap).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "kill -USR1 $(pgrep -f '[c]elador')",
        "cmds": [
          {
            "cmd": "kill",
            "args": "-USR1 $(pgrep -f [c]elador)",
            "why": "manda una señal a un proceso; la señal por defecto es TERM (petición de terminar)",
            "flags": [
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man kill»"
              }
            ]
          }
        ]
      },
      {
        "raw": "sleep 2",
        "cmds": [
          {
            "cmd": "sleep",
            "args": "2",
            "why": "espera los segundos dados (o s/m/h)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat ~/candado.listo",
        "cmds": [
          {
            "cmd": "cat",
            "args": "~/candado.listo",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "kill -USR1 $(pgrep -f '[c]elador') && sleep 2 && cat ~/candado.listo"
  },
  {
    "id": "procesos-l20",
    "track": "procesos",
    "index": 20,
    "title": "Nombre en la lista",
    "subtitle": "ps -eo args",
    "xp": 55,
    "difficulty": 4,
    "brief": "> Un doberman del dojo circula con un disfraz obsesivo: su línea de > comando (los \"args\") lleva escondida la flag en texto plano. /proc > tiene poco espacio, así que quien esconde cosas ahí es porque confía > en que nadie mire las columnas.",
    "goal": "Lista las líneas de comando completas de todos los procesos con ps -eo args y usa grep con el patrón FLAG{…} para incautar la flag.",
    "keywords": [
      "ps",
      "pgrep",
      "grep"
    ],
    "hints": [
      "ps -eo args imprime la última columna de los procesos: su comando completo.",
      "Un grep -o patrón extrae CADA coincidencia (no la línea entera).",
      "El patrón FLAG{…} sirve para localizarla sin exponer la entrada completa."
    ],
    "cheatsheet": [
      {
        "cmd": "ps -eo args",
        "desc": "lista los comandos completos de los procesos"
      },
      {
        "cmd": "pgrep -f",
        "desc": "versión reducida: solo PIDs"
      },
      {
        "cmd": "grep -o PATRÓN",
        "desc": "muestra solo la parte que encaja"
      }
    ],
    "teach": "ps -eo args muestra el COMANDO COMPLETO con argumentos de cada proceso; es otra forma de leer /proc/*/cmdline. Con grep se incauta:\n\n    ps -eo args | grep -o 'FLAG{[^}]*}'\n\ngrep -o imprime solo la parte que encaja con el patrón —la flag, entera.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}\nFLAG{[^}\nFLAG{[^}"
      }
    ],
    "steps": [
      {
        "raw": "ps -eo args | grep -o 'FLAG{[^}]*}'",
        "cmds": [
          {
            "cmd": "ps",
            "args": "-eo args",
            "why": "lista procesos",
            "flags": [
              {
                "flag": "-e",
                "meaning": "todos los procesos del sistema"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man ps»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-o FLAG{[^}]*}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ps -eo args | grep -o 'FLAG{[^}]*}'"
  },
  {
    "id": "redes-l1",
    "track": "redes",
    "index": 0,
    "title": "El oráculo por teléfono",
    "subtitle": "nc (netcat cliente)",
    "xp": 60,
    "difficulty": 3,
    "brief": "Un oráculo local escucha en el puerto 7080 y habla con quien se conecte. La respuesta solo la ve quien llame… (en este dojo solo existe el loopback — mejor así).",
    "goal": "Conecta con nc al puerto 7080 de la propia máquina para recibir el mensaje del oráculo (contiene la flag).",
    "keywords": [
      "nc",
      "tcp"
    ],
    "hints": [
      "nc 127.0.0.1 7080 (host y puerto) — la conexión queda abierta hasta recibir.",
      "El puerto es 7080; el host es tu propia máquina (127.0.0.1)."
    ],
    "cheatsheet": [
      {
        "cmd": "nc host puerto",
        "desc": "conecta TCP y pasa stdin/stdout"
      },
      {
        "cmd": "nc -l puerto",
        "desc": "escucha un puerto"
      },
      {
        "cmd": "nc -v host p",
        "desc": "verbose"
      }
    ],
    "teach": "`nc host puerto` conecta TCP y vacía stdin; escupirá la respuesta al stdout. `-l escucha (`servidor`), `-v verbose`. En este dojo la única red es la loopback: mola para lab sin abrir la máquina al mundo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "nc 127.0.0.1 7080",
        "cmds": [
          {
            "cmd": "nc",
            "args": "127.0.0.1 7080",
            "why": "netcat: conexiones TCP/UDP crudas para probar puertos o escuchar (sólo localhost en el dojo)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "nc 127.0.0.1 7080"
  },
  {
    "id": "redes-l2",
    "track": "redes",
    "index": 0,
    "title": "Repositorio interno",
    "subtitle": "curl contra un server http nativo",
    "xp": 60,
    "difficulty": 3,
    "brief": "Un servidor http interno sirve la flag en la ruta /secreto de la propia máquina (127.0.0.1:8501). El dojo bloquea el internet exterior a propósito… tu misión es solo interna.",
    "goal": "Con curl descarga el contenido de http://127.0.0.1:8501/secreto y muéstralo (grep o cat después si hace falta).",
    "keywords": [
      "curl",
      "loopback"
    ],
    "hints": [
      "curl http://127.0.0.1:8501 — el listing muestra la respuesta.",
      "El contenido está en http://127.0.0.1:8501/secreto/",
      "Ojos bien abiertos: el fichero es .cargo (fichero oculto)."
    ],
    "cheatsheet": [
      {
        "cmd": "curl URL",
        "desc": "descarga una URL"
      },
      {
        "cmd": "curl -I URL",
        "desc": "solo cabeceras"
      },
      {
        "cmd": "curl -o fichero URL",
        "desc": "guarda a fichero"
      }
    ],
    "teach": "`curl URL` descarga; `-I` pide cabeceras; `-o fichero` guarda. Monstramos un server nativo de python en loopback para jugar con curl sin salir a internet. `curl localhost:8501` te enseña el index del servidor.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "curl -s http://127.0.0.1:8501/secreto/.cargo",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://127.0.0.1:8501/secreto/.cargo",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s http://127.0.0.1:8501/secreto/.cargo"
  },
  {
    "id": "redes-l3",
    "track": "redes",
    "index": 0,
    "title": "Escaneo sin papas",
    "subtitle": "ss y puertos en escucha",
    "xp": 65,
    "difficulty": 3,
    "brief": "Un servicio oceano está escuchando en una puerta de alta mar no estándar (la 9X9X). ¿Cual? Solo lo sabes si sabes mirar quiénes están a la espera con ss.",
    "goal": "Con ss localiza el puerto local que esté LIS TENiendo (estado LISTEN) con número par alto (ej: 9X9X) e accede al servicio nc que lo atiende para conseguir la flag.",
    "keywords": [
      "ss",
      "netstat"
    ],
    "hints": [
      "ss -tln lista los puertos TCP a la espera (LISTEN).",
      "Busca el puerto 9XXX que no sea 8501 ni 7080: es 9696… pero practica el ss.",
      "nc 127.0.0.1 9696"
    ],
    "cheatsheet": [
      {
        "cmd": "ss -tln",
        "desc": "puertos TCP a la escucha"
      },
      {
        "cmd": "ss -tlnp",
        "desc": "añade el proceso (como root)"
      }
    ],
    "teach": "`ss` es el sucesor de netstat: `-t` TCP, `-l` LISTEN, `-n` sin resolver nombres. Para anclar el recuerdo: en el dojo hay un servicio solo en loopback. Nada peor que un servicio abierto a todos por descuido.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "State  Recv-Q Send-Q Local Address:Port Peer Address:PortProcess\nLISTEN 0      1          127.0.0.1:9696      0.0.0.0:*          \nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ss -tln\nnc 127.0.0.1 9696",
        "cmds": [
          {
            "cmd": "ss",
            "args": "-tln nc 127.0.0.1 9696",
            "why": "estado de sockets y puertos (sustituto moderno de netstat)",
            "flags": [
              {
                "flag": "-t",
                "meaning": "sólo TCP"
              },
              {
                "flag": "-l",
                "meaning": "sólo en escucha"
              },
              {
                "flag": "-n",
                "meaning": "no resuelve nombres"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ss -tln\nnc 127.0.0.1 9696"
  },
  {
    "id": "redes-l4",
    "track": "redes",
    "index": 0,
    "title": "El DNS de cierto abolengo",
    "subtitle": "dig simulado (dnsmasq en loopback, puerto 5353)",
    "xp": 70,
    "difficulty": 3,
    "brief": "En el dojo hay un DNS minúsculo en 127.0.0.1:5353 (dnsmasq). El registro TXT de 'flag.dojo' esconde la clave. No hay internet real; tu dig apuntará al DNS interno.",
    "goal": "Consulta el registro TXT de flag.dojo contra el DNS interno (127.0.0.1:5353) y extrae el contenido. Usa dig.",
    "keywords": [
      "dig",
      "dns",
      "dnsmasq"
    ],
    "hints": [
      "dig @127.0.0.1 -p 5353 flag.dojo TXT",
      "El +short deja la salida limpia: dig +short @127.0.0.1 -p 5353 flag.dojo TXT"
    ],
    "cheatsheet": [
      {
        "cmd": "dig @serv dominio A",
        "desc": "resuelve IPv4"
      },
      {
        "cmd": "dig @serv dominio TXT",
        "desc": "registros TXT"
      },
      {
        "cmd": "dig +short",
        "desc": "salida minimal"
      }
    ],
    "teach": "`dig @server` consulta un servidor DNS concreto; `-p` el puerto. TXT guarda texto libre (popular en mails y cachés). En el dojo, dnsmasq sirve registros con poca RAM: te enseña la mecánica de consultas sin distraerte con BIND real.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "\"FLAG{d3b09a4f7c2e1b8d6041a5f3}\""
      }
    ],
    "steps": [
      {
        "raw": "dig +short @127.0.0.1 -p 5353 flag.dojo TXT",
        "cmds": [
          {
            "cmd": "dig",
            "args": "+short @127.0.0.1 -p 5353 flag.dojo TXT",
            "why": "comando dig — revisa «man dig»",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man dig»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "dig +short @127.0.0.1 -p 5353 flag.dojo TXT"
  },
  {
    "id": "redes-l5",
    "track": "redes",
    "index": 5,
    "title": "Primer saludo HTTP",
    "subtitle": "curl contra un servidor local",
    "xp": 35,
    "difficulty": 2,
    "brief": "La máquina no tiene salida a internet, pero un servidor web corre en el puerto 8000 (solo local). Su página de bandera lleva la clave.",
    "goal": "Descarga con curl la página http://127.0.0.1:8000/flag.html y muéstrala.",
    "keywords": [
      "curl",
      "http",
      "localhost"
    ],
    "hints": [
      "El servidor solo atiende en localhost: la máquina no tiene internet, no busques fuera.",
      "curl -s descarga sin barra de progreso.",
      "curl -s http://127.0.0.1:8000/flag.html"
    ],
    "cheatsheet": [
      {
        "cmd": "curl -s URL",
        "desc": "GET silencioso"
      },
      {
        "cmd": "curl -i URL",
        "desc": "incluye cabeceras"
      }
    ],
    "teach": "curl es el cuchillo suizo de HTTP. En contenedores de práctica sin red externa, 127.0.0.1 (loopback) sigue siendo el terreno de juego: ideal para simular servicios internos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "<html><body><h1>Area clasificada</h1><p>clave de acceso: FLAG{d3b09a4f7c2e1b8d6041a5f3}</p></body></html>"
      }
    ],
    "steps": [
      {
        "raw": "curl -s http://127.0.0.1:8000/flag.html",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://127.0.0.1:8000/flag.html",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s http://127.0.0.1:8000/flag.html"
  },
  {
    "id": "redes-l6",
    "track": "redes",
    "index": 6,
    "title": "Tres puertos, un secreto",
    "subtitle": "recorrer puertos con curl",
    "xp": 40,
    "difficulty": 3,
    "brief": "Hay tres servicios asomados en los puertos 9000, 9001 y 9002. Solo uno devuelve la clave; el resto da señuelos.",
    "goal": "Consulta los tres puertos y muestra la respuesta que contiene la clave.",
    "keywords": [
      "ss",
      "puertos",
      "curl",
      "for"
    ],
    "hints": [
      "ss -tln te enseña qué puertos están a la escucha (y confirma los tres).",
      "Un bucle for sobre los puertos nos ahorra tres comandos iguales.",
      "for p in 9000 9001 9002; do curl -s http://127.0.0.1:$p/; echo; done"
    ],
    "cheatsheet": [
      {
        "cmd": "ss -tln",
        "desc": "puertos a la escucha"
      },
      {
        "cmd": "curl -s http://127.0.0.1:PORT/",
        "desc": "consulta un puerto"
      }
    ],
    "teach": "ss -tln lista sockets TCP a la escucha: la foto del lado servidor. Cuando hay varios puertos, un bucle for con curl barre la fábrica sin repetir código.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "<html>señuelo prudente del puerto 9000</html>\n\n<html>respuesta de sobra: FLAG{d3b09a4f7c2e1b8d6041a5f3}</html>\n\n<html>otro señuelo del puerto 9002</html>"
      }
    ],
    "steps": [
      {
        "raw": "for p in 9000 9001 9002",
        "cmds": [
          {
            "cmd": "for",
            "args": "p in 9000 9001 9002",
            "why": "comando for — revisa «man for»",
            "flags": []
          }
        ]
      },
      {
        "raw": "do curl -s http://127.0.0.1:$p/",
        "cmds": [
          {
            "cmd": "do",
            "args": "curl -s http://127.0.0.1:$p/",
            "why": "comando do — revisa «man do»",
            "flags": [
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man do»"
              }
            ]
          }
        ]
      },
      {
        "raw": "echo",
        "cmds": [
          {
            "cmd": "echo",
            "args": "",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      },
      {
        "raw": "done",
        "cmds": [
          {
            "cmd": "done",
            "args": "",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "for p in 9000 9001 9002; do curl -s http://127.0.0.1:$p/; echo; done"
  },
  {
    "id": "redes-l7",
    "track": "redes",
    "index": 7,
    "title": "Nombre que no existe",
    "subtitle": "/etc/hosts como DNS local",
    "xp": 45,
    "difficulty": 3,
    "brief": "El dominio tesoro.interno no existe en ninguna DNS: el administrador lo ruteó a localhost en /etc/hosts. El servidor ya escucha en el 80.",
    "goal": "Muestra la entrada de /etc/hosts de tesoro.interno y descarga http://tesoro.interno/",
    "keywords": [
      "hosts",
      "dns",
      "curl"
    ],
    "hints": [
      "grep tesoro.interno /etc/hosts te enseña a qué IP responde el nombre.",
      "curl acepta el nombre de dominio igual que una IP (usa la resolución del sistema).",
      "curl -s http://tesoro.interno/"
    ],
    "cheatsheet": [
      {
        "cmd": "cat /etc/hosts",
        "desc": "mapeo local de nombres"
      },
      {
        "cmd": "curl -s http://nombre/",
        "desc": "consulta por nombre"
      }
    ],
    "teach": "/etc/hosts es la resolución local que se consulta ANTES que la DNS: la técnica clásica para entornos de laboratorio (y para secuestrar dominios, ojo).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "127.0.0.1 tesoro.interno\nbandera del dominio interno: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep tesoro.interno /etc/hosts",
        "cmds": [
          {
            "cmd": "grep",
            "args": "tesoro.interno /etc/hosts",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      },
      {
        "raw": "curl -s http://tesoro.interno/",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://tesoro.interno/",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep tesoro.interno /etc/hosts; curl -s http://tesoro.interno/"
  },
  {
    "id": "redes-l8",
    "track": "redes",
    "index": 8,
    "title": "Conversación de un solo sentido",
    "subtitle": "nc: hablar con un servicio TCP",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un oráculo escucha en el TCP 9999: al conectarte, te susurra la clave y cierra.",
    "goal": "Conéctate al servicio del puerto 9999 con netcat y recoge la marca.",
    "keywords": [
      "nc",
      "netcat",
      "tcp",
      "socket"
    ],
    "hints": [
      "netcat es el cliente TCP mínimo: nc HOST PUERTO.",
      "Sin stdin abierto nc esperaría prohibido el cierre: redirige /dev/null",
      "nc -w 2 127.0.0.1 9999 </dev/null"
    ],
    "cheatsheet": [
      {
        "cmd": "nc HOST PUERTO",
        "desc": "conexión TCP simple"
      },
      {
        "cmd": "nc -w 5 HOST PUERTO",
        "desc": "con timeout de 5 s"
      }
    ],
    "teach": "nc habla TCP crudo: ni HTTP ni protocolos, bytes. Es la herramienta para sondear servicios a mano (banners SMTP, SSH…) y suele despejar dudas en la fase de reconocimiento.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "nc -w 2 127.0.0.1 9999 </dev/null",
        "cmds": [
          {
            "cmd": "nc",
            "args": "-w 2 127.0.0.1 9999 </dev/null",
            "why": "netcat: conexiones TCP/UDP crudas para probar puertos o escuchar (sólo localhost en el dojo)",
            "flags": [
              {
                "flag": "-w",
                "meaning": "flag w del comando — revisa «man nc»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "nc -w 2 127.0.0.1 9999 </dev/null"
  },
  {
    "id": "redes-l9",
    "track": "redes",
    "index": 9,
    "title": "La cabecera reveladora",
    "subtitle": "curl -i: ver también los headers",
    "xp": 40,
    "difficulty": 3,
    "brief": "El auditor añadió una cabecera HTTP personalizada con la clave; el cuerpo de la respuesta esta limpio.",
    "goal": "Descarga http://127.0.0.1:7080/auditoria mostrando TAMBIÉN las cabeceras y localiza la cabecera X-Arena-Flag.",
    "keywords": [
      "curl",
      "headers",
      "cabecera"
    ],
    "hints": [
      "La cabecera NO aparece en el cuerpo: hay que ver la respuesta cruda.",
      "curl -i (o -I) imprime también los headers.",
      "curl -s -i http://127.0.0.1:7080/auditoria"
    ],
    "cheatsheet": [
      {
        "cmd": "curl -i URL",
        "desc": "cuerpo + cabeceras"
      },
      {
        "cmd": "curl -s -D - URL",
        "desc": "cabeceras a disco/stdout"
      }
    ],
    "teach": "Los headers HTTP son metadata donde se esconde casi todo (rate-limits, versiones, tokens de sesión): curl -i los destapa junto al cuerpo. Curl -I solo los cabecera.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "HTTP/1.0 200 OK\r\nServer: BaseHTTP/0.6 Python/3.12.3\r\nDate: Fri, 23 Oct 2026 11:37:17 GMT\r\nX-Arena-Flag: FLAG{d3b09a4f7c2e1b8d6041a5f3}\r\nContent-Type: text/plain\r\n\r\nauditoria ejecutada: todo limpio"
      }
    ],
    "steps": [
      {
        "raw": "curl -s -i http://127.0.0.1:7080/auditoria",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s -i http://127.0.0.1:7080/auditoria",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man curl»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s -i http://127.0.0.1:7080/auditoria"
  },
  {
    "id": "redes-l10",
    "track": "redes",
    "index": 10,
    "title": "El guardián del POST",
    "subtitle": "curl -d: enviar datos",
    "xp": 50,
    "difficulty": 3,
    "brief": "Un endpoint del API pide autenticación por POST con el parámetro token=arena (sin documentar). El GET se queda con las ganas.",
    "goal": "Envía un POST con token=arena a http://127.0.0.1:6060/validar y muestra la respuesta con la marca.",
    "keywords": [
      "curl",
      "POST",
      "endpoints"
    ],
    "hints": [
      "El método GET te responde 403: el endpoint quiere POST.",
      "curl -d \"campo=valor\" hace un POST automáticamente.",
      "curl -s -d 'token=arena' http://127.0.0.1:6060/validar"
    ],
    "cheatsheet": [
      {
        "cmd": "curl -d k=v URL",
        "desc": "POST con form-data"
      },
      {
        "cmd": "curl -X POST URL",
        "desc": "forza el verbo"
      }
    ],
    "teach": "curl -d (o --data) cambia el verbo HTTP a POST y manda el cuerpo form-enconded. Es la moneda para hablar con APIs internas sin cliente gráfico.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "acceso concedido: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "curl -s -d 'token=arena' http://127.0.0.1:6060/validar",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s -d token=arena http://127.0.0.1:6060/validar",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              },
              {
                "flag": "-d",
                "meaning": "flag d del comando — revisa «man curl»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s -d 'token=arena' http://127.0.0.1:6060/validar"
  },
  {
    "id": "redes-l11",
    "track": "redes",
    "index": 11,
    "title": "Puerto en /etc/services",
    "subtitle": "el fichero del mapa de servicios",
    "xp": 50,
    "difficulty": 4,
    "brief": "El administrador registró un servicio con nombre arena-tesoro y un puerto asomado; el mapa está en /etc/services.",
    "goal": "Saca el puerto del servicio arena-tesoro desde /etc/services y consulta curl http://127.0.0.1:PUERTO/",
    "keywords": [
      "etc/services",
      "puertos",
      "awk"
    ],
    "hints": [
      "/etc/services mapea nombre de servicio → puerto/protocolo.",
      "grep la línea y aísla la columna del puerto con awk.",
      "p=$(grep \"^arena-tesoro\" /etc/services | awk \"{print $2}\" | cut -d/ -f1); curl -s http://127.0.0.1:$p/"
    ],
    "cheatsheet": [
      {
        "cmd": "grep ssh /etc/services",
        "desc": "puerto de un servicio"
      },
      {
        "cmd": "ss -tlnp",
        "desc": "qué está escuchando"
      }
    ],
    "teach": "/etc/services es el mapa clásico de puertos (80 http, 22 ssh…). Leerlo evita los memorizar: el catálogo vive en el fichero donde empieza toda la revisión de un servidor.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "puerto dinamico: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(grep '^arena-tesoro' /etc/services | awk '{print $2}' | cut -d/ -f1)",
        "cmds": [
          {
            "cmd": "p=$(grep",
            "args": "^arena-tesoro /etc/services",
            "why": "comando p=$(grep — revisa «man p=$(grep»",
            "flags": []
          },
          {
            "cmd": "awk",
            "args": "{print $2}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "cut",
            "args": "-d/ -f1)",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "curl -s http://127.0.0.1:$p/",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://127.0.0.1:$p/",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "p=$(grep '^arena-tesoro' /etc/services | awk '{print $2}' | cut -d/ -f1); curl -s http://127.0.0.1:$p/"
  },
  {
    "id": "redes-l12",
    "track": "redes",
    "index": 12,
    "title": "Auditoría de escucha",
    "subtitle": "ss + json + curl a medida",
    "xp": 55,
    "difficulty": 4,
    "brief": "Un API en 7700 solo responde con la cabecera correcta: Accept: application/arena-json. Ojo también al puerto, que puede caminar.",
    "goal": "Consulta http://127.0.0.1:7700/api con la cabecera Accept: application/arena-json y muéstrala (el puerto correcto lo delata ss).",
    "keywords": [
      "ss",
      "curl -H",
      "accept",
      "api"
    ],
    "hints": [
      "ss -tln te confirma que el puerto escucha.",
      "La cabecera se manda con curl -H \"Accept: application/arena-json\" (el GET 406 se arregla exactamente así).",
      "curl -s -H 'Accept: application/arena-json' http://127.0.0.1:7700/api"
    ],
    "cheatsheet": [
      {
        "cmd": "curl -H \"X: y\" URL",
        "desc": "mandar cabecera a medida"
      },
      {
        "cmd": "ss -tlnp",
        "desc": "mapa de escucha"
      }
    ],
    "teach": "Las cabeceras de PETICIÓN son la mitad de la conversación HTTP: Accept, Authorization, Content-Type… curl -H las teclea por ti. Los errores 406 normalmente delatan una cabecera ausente.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "secreto del api: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "curl -s -H 'Accept: application/arena-json' http://127.0.0.1:7700/api",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s -H Accept: application/arena-json http://127.0.0.1:7700/api",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s -H 'Accept: application/arena-json' http://127.0.0.1:7700/api"
  },
  {
    "id": "redes-l13",
    "track": "redes",
    "index": 13,
    "title": "Ese nombre no existe",
    "subtitle": "/etc/hosts: DNS casero",
    "xp": 40,
    "difficulty": 2,
    "brief": "El dojo sirve una web en el 8000, pero solo la alcanza por IP…oten. Su alias dojo.local mapea en /etc/hosts.",
    "goal": "Resuelve el alias de /etc/hosts y descarga http://dojo.local:8000/pieza.html.",
    "keywords": [
      "hosts",
      "alias",
      "curl"
    ],
    "hints": [
      "./etc/hosts es la tabla de resolución local: se consulta ANTES que el DNS.",
      "grep dojo.local /etc/hosts te enseña el alias; curl por nombre en lugar de 127.0.0.1.",
      "curl -s http://dojo.local:8000/pieza.html"
    ],
    "cheatsheet": [
      {
        "cmd": "grep nombre /etc/hosts",
        "desc": "alias local"
      },
      {
        "cmd": "curl http://alias:puerto/",
        "desc": "descarga por nombre"
      }
    ],
    "teach": "/etc/hosts es el DNS de bolsillo: alias internos, docker-compose sobrescribe IPs, machines frente a entornos. curl por hostname ya no va por IP: pasing de DNS a nombre.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "<html>Desde el alias: FLAG{d3b09a4f7c2e1b8d6041a5f3}</html>"
      }
    ],
    "steps": [
      {
        "raw": "curl -s http://dojo.local:8000/pieza.html",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://dojo.local:8000/pieza.html",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s http://dojo.local:8000/pieza.html"
  },
  {
    "id": "redes-l14",
    "track": "redes",
    "index": 14,
    "title": "El fichero sin nombre",
    "subtitle": "listing HTTP y URL-encoding",
    "xp": 40,
    "difficulty": 2,
    "brief": "Un directorio web lista su contenido. Un fichero lleva en su NOMBRE la marca… nacelados símbolos se viajan como %7B y %7D.",
    "goal": "Mira el listado de http://127.0.0.1:8000/ y decodifica el nombre del fichero que escapa los llaves.",
    "keywords": [
      "listing",
      "url",
      "encode"
    ],
    "hints": [
      "python -m http.server lista el directorio en HTML con los ficheros.",
      "En URLs los llaves escapar: %7B es { y %7D es }; sed los devuelve.",
      "curl -s http://127.0.0.1:8000/ | sed 's/%7B/{/g; s/%7D/}/g' | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "sed 's/%7B/{/g'",
        "desc": "descodificar llaves"
      },
      {
        "cmd": "curl --data-urlencode",
        "desc": "encodear al enviar"
      }
    ],
    "teach": "El URL-encoding transforma todo lo \"raro\" para que viaje en una URL: { → %7B. Saber decodificar (y encodear con --data-urlencode) es lectura básica de URLs.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "curl -s http://127.0.0.1:8000/ | sed 's/%7B/{/g; s/%7D/}/g' | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://127.0.0.1:8000/",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          },
          {
            "cmd": "sed",
            "args": "s/%7B/{/g; s/%7D/}/g",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "curl -s http://127.0.0.1:8000/ | sed 's/%7B/{/g; s/%7D/}/g' | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "redes-l15",
    "track": "redes",
    "index": 15,
    "title": "Recogida física",
    "subtitle": "wget como cliente de descarga",
    "xp": 40,
    "difficulty": 2,
    "brief": "La web del dojo reparte un fichero. wget salva un fichero local (a diferencia de curl, que por defecto lo imprime).",
    "goal": "Descarga http://127.0.0.1:8000/reparto.txt con wget y muestra su contenido.",
    "keywords": [
      "wget",
      "descarga",
      "http"
    ],
    "hints": [
      "wget URL guarda el fichero con su nombre. -O ruta llama distinto al resultado. -q silencia por completo.",
      "Después de descargar, el cat es tuyo.",
      "wget -q -O f http://127.0.0.1:8000/reparto.txt; cat f"
    ],
    "cheatsheet": [
      {
        "cmd": "wget URL",
        "desc": "descarga al nombre igual"
      },
      {
        "cmd": "wget -qO- URL",
        "desc": "al stdout, como curl"
      }
    ],
    "teach": "wget es el capataz de descargas: reintentos, recursividad (--mirror). curl es de copiar al stdout, wget de ir a cacharrar fichero. Dos sabores del mismo café.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "entrega directa: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "wget -q -O /tmp/recogida.txt http://127.0.0.1:8000/reparto.txt",
        "cmds": [
          {
            "cmd": "wget",
            "args": "-q -O /tmp/recogida.txt http://127.0.0.1:8000/reparto.txt",
            "why": "comando wget — revisa «man wget»",
            "flags": [
              {
                "flag": "-q",
                "meaning": "flag q del comando — revisa «man wget»"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat /tmp/recogida.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/recogida.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "wget -q -O /tmp/recogida.txt http://127.0.0.1:8000/reparto.txt; cat /tmp/recogida.txt"
  },
  {
    "id": "redes-l16",
    "track": "redes",
    "index": 16,
    "title": "Un saludo y fuera",
    "subtitle": "nc -l servidor de una sóla línea",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un mini servidor netcat espera UNA única conexión en el puerto 7077 y suelta la pieza al puerta.",
    "goal": "Conéctate una vez con nc al puerto 7077 de localhost y lee lo que envía.",
    "keywords": [
      "nc",
      "netcat",
      "tcp"
    ],
    "hints": [
      "nc HOST PUERTO abierto conexión y baraja lo que llega al stdout hasta cerrar.",
      "Con timeout evistas quedarte colgado si el servidor ya cerró.",
      "nc 127.0.0.1 7077"
    ],
    "cheatsheet": [
      {
        "cmd": "nc -l -p 7077 -q0 < f",
        "desc": "un envío y cierra"
      },
      {
        "cmd": "nc host puerto",
        "desc": "conectar y leer"
      }
    ],
    "teach": "nc -l -p N es un servidor mínimo: una línea de TCP sin HTTP. Para probar servicios custom, juniors y pipelines: es EL petardazo de las redes del shell.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "saludado por nc: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "timeout 5 nc 127.0.0.1 7077",
        "cmds": [
          {
            "cmd": "timeout",
            "args": "5 nc 127.0.0.1 7077",
            "why": "comando timeout — revisa «man timeout»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "timeout 5 nc 127.0.0.1 7077"
  },
  {
    "id": "redes-l17",
    "track": "redes",
    "index": 17,
    "title": "Mira por el puerto",
    "subtitle": "/proc/net/tcp: puertos en hexadecimal",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un servicio corre en el 9009. En /proc/net/tcp los puertos viajan en hexadecimal — 9009 se convierte en 2339. Recherche y confirma descargando la web.",
    "goal": "Comprueba en /proc/net/tcp el puerto 9009 en hexadecimal (2339) y descarga http://127.0.0.1:9009/.",
    "keywords": [
      "proc",
      "tcp",
      "hex"
    ],
    "hints": [
      "/proc/net/tcp muestra local_address como ip:PUERTO en hexadecimal (9009 = 2339).",
      "grep con los espacios alrededor de 2339: :2339 (y ojo de mayúsculas con -i).",
      "grep -i ':2339 ' /proc/net/tcp"
    ],
    "cheatsheet": [
      {
        "cmd": "grep :2339 /proc/net/tcp",
        "desc": "port en hex 0x23399009"
      },
      {
        "cmd": "ss -tln",
        "desc": "lo mismo, humano"
      }
    ],
    "teach": "/proc/net/tcp es la mine de oro de TCP (ss/lo lee de ahí). Puertos/file states en hexadecimal: 1F90=8080, 2339=9009. ¿Parser portátil sin tools? /proc/net/tcp.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "a la vista del 9009: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -i ':2339 ' /proc/net/tcp | head -n1",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-i :2339  /proc/net/tcp",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "curl -s http://127.0.0.1:9009/",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://127.0.0.1:9009/",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -i ':2339 ' /proc/net/tcp | head -n1; curl -s http://127.0.0.1:9009/"
  },
  {
    "id": "redes-l18",
    "track": "redes",
    "index": 18,
    "title": "El registro TXT",
    "subtitle": "dnsmasq + dig TXT en puerto propio",
    "xp": 45,
    "difficulty": 3,
    "brief": "Un DNS minúsculo lleva la pieza como registro TXT en el dominio marca.dojo, en 127.0.0.1:5354.",
    "goal": "Consulta el TXT de marca.dojo al DNS del puerto 5354.",
    "keywords": [
      "dig",
      "txt",
      "dns"
    ],
    "hints": [
      "Los TXT llevan texto suelto entre comillas: la marca entera viaja en el registro.",
      "dig @127.0.0.1 -p 5354 +short TXT marca.dojo — el +short deja la respuesta pelada.",
      "dig @127.0.0.1 -p 5354 +short TXT marca.dojo"
    ],
    "cheatsheet": [
      {
        "cmd": "dig @host -p puerto TXT dom",
        "desc": "TXT a puerto custom"
      },
      {
        "cmd": "dig +short",
        "desc": "solo la respuesta"
      }
    ],
    "teach": "Los registros TXT cargan texto libre (DKIM, verificación dominio…). dig -p habla a un puerto NO estándar: la manera de testear DNS no en el 53 de siempre.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "\"FLAG{d3b09a4f7c2e1b8d6041a5f3}\""
      }
    ],
    "steps": [
      {
        "raw": "dig @127.0.0.1 -p 5354 +short TXT marca.dojo",
        "cmds": [
          {
            "cmd": "dig",
            "args": "@127.0.0.1 -p 5354 +short TXT marca.dojo",
            "why": "comando dig — revisa «man dig»",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man dig»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "dig @127.0.0.1 -p 5354 +short TXT marca.dojo"
  },
  {
    "id": "redes-l19",
    "track": "redes",
    "index": 19,
    "title": "Estación 512",
    "subtitle": "números de puerto: aritmética + ss",
    "xp": 60,
    "difficulty": 4,
    "brief": "> El dojo despliega mini-servidores locales en puertos altos. La regla > de la casa: solo el canal de DATOS (ESTADO \"UNIQUE\") merece leerse, y > su puerto es el PRIMERO que ss reporte COMO ESCUCHA por encima de 5000.",
    "goal": "Usa ss -tln para listar los puertos locales en escucha, identifica el primero cuya columna \"Local Address:Port\" tenga un puerto > 5000 y haz una petición con curl a http://127.0.0.1:PUERTO/tarjeta.txt para incautar la flag.",
    "keywords": [
      "ss",
      "curl"
    ],
    "hints": [
      "ss -tln lista los sockets TCP en escucha (listening).",
      "la columna \"Local Address:Port\" muestra el puerto, ej. 127.0.0.1:5127.",
      "curl -s http://127.0.0.1:PUERTO/tarjeta.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "ss -tln",
        "desc": "lista puertos TCP en escucha"
      },
      {
        "cmd": "curl -s URL",
        "desc": "petición HTTP silenciosa a un servidor local"
      }
    ],
    "teach": "ss -tln lista los puertos en escucha del host. Identifica el puerto \"anormal\" (> 5000) en la columna Local Address:Port y consulta el pequeño servidor:\n\n    ss -tln\n    curl -s http://127.0.0.1:5127/tarjeta.txt\n\n(sustituye 5127 por el puerto que hayas visto en tu ss).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "ss -tln | grep -oE '127\\.0\\.0\\.1:[0-9]+' | awk -F: '$2>5000{print $2}' | head -n 1 | xargs -I{} curl -s http://127.0.0.1:{}/tarjeta.txt",
        "cmds": [
          {
            "cmd": "ss",
            "args": "-tln",
            "why": "estado de sockets y puertos (sustituto moderno de netstat)",
            "flags": [
              {
                "flag": "-t",
                "meaning": "sólo TCP"
              },
              {
                "flag": "-l",
                "meaning": "sólo en escucha"
              },
              {
                "flag": "-n",
                "meaning": "no resuelve nombres"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE 127\\.0\\.0\\.1:[0-9]+",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "awk",
            "args": "-F: $2>5000{print $2}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          },
          {
            "cmd": "xargs",
            "args": "-I{} curl -s http://127.0.0.1:{}/tarjeta.txt",
            "why": "convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)",
            "flags": [
              {
                "flag": "-I",
                "meaning": "marcador de sustitución {}: cada línea va ahí"
              },
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man xargs»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "ss -tln | grep -oE '127\\.0\\.0\\.1:[0-9]+' | awk -F: '$2>5000{print $2}' | head -n 1 | xargs -I{} curl -s http://127.0.0.1:{}/tarjeta.txt"
  },
  {
    "id": "redes-l20",
    "track": "redes",
    "index": 20,
    "title": "La llave del puerto",
    "subtitle": "leer un valor JSON y montar una URL",
    "xp": 60,
    "difficulty": 4,
    "brief": "> La estación sur del dojo abre un canal web OSCURO: nadie recuerda el > número de puerto… pero quedó grabado en /var/dojo/canal.json. Localiza > la llave (el número) y consúltala a mano con curl en el localhost.",
    "goal": "Lee el número de puerto que está dentro de /var/dojo/canal.json y usa curl para pedir http://127.0.0.1:PUERTO/tarjeta.txt, donde viaja la flag.",
    "keywords": [
      "grep",
      "var=$(CMD)",
      "curl"
    ],
    "hints": [
      "cat /var/dojo/canal.json muestra el fichero con el campo \"puerto\".",
      "grep -oE '[0-9]+' canal.json | head -n 1 extrae el número.",
      "curl -s http://127.0.0.1:PUERTO/tarjeta.txt se lo come."
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE PATRÓN fich",
        "desc": "extrae solo el texto que encaja"
      },
      {
        "cmd": "var=$(CMD)",
        "desc": "captura la salida de un comando en una variable"
      },
      {
        "cmd": "curl -s http://127.0.0.1:$port/…",
        "desc": "petición HTTP al puerto guardado"
      }
    ],
    "teach": "Un mini-parse de un JSON plano: localiza el valor del campo y úsalo en la URL.\n\n    cat /var/dojo/canal.json        → {\"instancia\": \"sur\", \"puerto\": 9341}\n    port=$(grep -oE '[0-9]+' /var/dojo/canal.json | head -n 1)\n    curl -s http://127.0.0.1:$port/tarjeta.txt\n\nCon la variable de shell $port la URL se compone al vuelo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "port=$(grep -oE '[0-9]+' /var/dojo/canal.json | head -n 1)",
        "cmds": [
          {
            "cmd": "port=$(grep",
            "args": "-oE [0-9]+ /var/dojo/canal.json",
            "why": "comando port=$(grep — revisa «man port=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man port=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "curl -s http://127.0.0.1:$port/tarjeta.txt",
        "cmds": [
          {
            "cmd": "curl",
            "args": "-s http://127.0.0.1:$port/tarjeta.txt",
            "why": "petición HTTP/CLI (sólo red local del dojo, sin internet)",
            "flags": [
              {
                "flag": "-s",
                "meaning": "silencia la barra de progreso"
              }
            ]
          }
        ]
      }
    ],
    "raw": "port=$(grep -oE '[0-9]+' /var/dojo/canal.json | head -n 1); curl -s http://127.0.0.1:$port/tarjeta.txt"
  },
  {
    "id": "archivos-l1",
    "track": "archivos",
    "index": 0,
    "title": "El paquete sellado",
    "subtitle": "tar (listar y extraer)",
    "xp": 50,
    "difficulty": 2,
    "brief": "Un obsesivo del orden empacó todas sus notas en un tar.gz. Dentro hay un fichero de sonido con la clave… pero de literación textual.",
    "goal": "En /var/dojo/notas.tar.gz hay un fichero que contiene la flag. Lista el tar con tar -tzf, extrae con tar -xzf y muéstralo por cat.",
    "keywords": [
      "tar"
    ],
    "hints": [
      "tar -tzf fichero.tar.gz lista sin extraer (t=list, z=gzip, f=archivo).",
      "tar -xzf notas.tar.gz -C /tmp/notas-extraer lo extrae en /tmp/notas-extraer.",
      "cat /tmp/notas-extraer/notas/nota_clave.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "tar -czf pack.tar.gz ficheros",
        "desc": "crear comprimido"
      },
      {
        "cmd": "tar -tzf pack.tar.gz",
        "desc": "listar contenido"
      },
      {
        "cmd": "tar -xzf pack.tar.gz -C dir",
        "desc": "extraer en dir"
      }
    ],
    "teach": "`tar -czf paquete.tar.gz fichero...` comprime; `tar -tzf` lista;  `tar -xzf` extrae. La `-C destino` redirige la extracción — sin ella tar desempaca en el actual. En tar moderno la extensión insinúa el formato y se puede omitir la z/j/J.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "nota ultra-privada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "mkdir -p /tmp/x\ntar -xzf /var/dojo/notas.tar.gz -C /tmp/x\ncat /tmp/x/notas/nota_clave.txt",
        "cmds": [
          {
            "cmd": "mkdir",
            "args": "-p /tmp/x tar -xzf /var/dojo/notas.tar.gz -C /tmp/x cat /tmp/x/notas/nota_clave.txt",
            "why": "crea directorios",
            "flags": [
              {
                "flag": "-p",
                "meaning": "crea los niveles intermedios que falten y no da error si ya existen"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man mkdir»"
              },
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man mkdir»"
              },
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man mkdir»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "mkdir -p /tmp/x\ntar -xzf /var/dojo/notas.tar.gz -C /tmp/x\ncat /tmp/x/notas/nota_clave.txt"
  },
  {
    "id": "archivos-l2",
    "track": "archivos",
    "index": 0,
    "title": "El secreto inflado",
    "subtitle": "gzip, zcat",
    "xp": 45,
    "difficulty": 2,
    "brief": "Un mensaje importante quedó comprimido con gzip para ahorrar bytes en el floppy del dojo. Solo alguien que sepa desinflar lo leerá.",
    "goal": "En /var/dojo/diario.txt.gz está un texto comprimido con la flag. Descomprimelo SIN destruir el original (no borres el .gz al leerlo) y muéstralo.",
    "keywords": [
      "gzip",
      "zcat"
    ],
    "hints": [
      "zcat fichero.gz muestra el contenido descomprimido SIN borrar ni tocar el fichero.",
      "gunzip -c fichero.gz es equivalente."
    ],
    "cheatsheet": [
      {
        "cmd": "zcat fichero.gz",
        "desc": "descomprime a stdout"
      },
      {
        "cmd": "gzip fichero",
        "desc": "comprime in situ"
      },
      {
        "cmd": "gunzip fichero.gz",
        "desc": "descomprime y borra .gz (cuidado)"
      }
    ],
    "teach": "`gzip fichero` comprime y renombra a .gz en el sitio. `zcat`/`gunzip -c` descomprimen a stdout SIN tocar el fichero original. Con `zcat fichero.gz | head` te ahorras descomprimir a un fichero temporal.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "Diario del operador. Hoy ha sido un gran día. Todo listo para la entrega.\nY por supuesto, el final: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "zcat /var/dojo/diario.txt.gz",
        "cmds": [
          {
            "cmd": "zcat",
            "args": "/var/dojo/diario.txt.gz",
            "why": "comando zcat — revisa «man zcat»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "zcat /var/dojo/diario.txt.gz"
  },
  {
    "id": "archivos-l3",
    "track": "archivos",
    "index": 0,
    "title": "El maletín en los abismos",
    "subtitle": "unzip",
    "xp": 50,
    "difficulty": 2,
    "brief": "Un agente movió todo a un zip con estructura interna profunda. La clave está en el fichero mas profundo del arbol interno.",
    "goal": "En /var/dojo/maletín.zip hay un árbol interno de carpetas con un fichero que contiene la flag. Localiza su ruta interna (unzip -l), extrae (unzip) y muéstralo por cat.",
    "keywords": [
      "zip",
      "unzip"
    ],
    "hints": [
      "unzip -l fichero.zip lista sin extraer (l=list).",
      "unzip maletin.zip -d /tmp/extrae lo extrae en /tmp/extrae."
    ],
    "cheatsheet": [
      {
        "cmd": "unzip -l pack.zip",
        "desc": "listar contenido sin extraer"
      },
      {
        "cmd": "unzip pack.zip -d dir",
        "desc": "extraer a dir"
      }
    ],
    "teach": "`zip -r pack.zip carpeta` crea (recursivo); `unzip -l` lee el índice; `unzip pack.zip -d destino` extrae a un sitio concreto. Contrasta con tar: zip comparte formatos multiplataforma (Windows-friendly).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "Archive:  /var/dojo/maletin.zip\n   creating: /tmp/extraigo/fondos/\n   creating: /tmp/extraigo/fondos/lote3/\n   creating: /tmp/extraigo/fondos/lote3/no-lucer/\n extracting: /tmp/extraigo/fondos/lote3/no-lucer/interior.txt  \n extracting: /tmp/extraigo/fondos/lote3/no-lucer/intermedio.txt  \nclave: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "mkdir -p /tmp/extraigo\nunzip -o /var/dojo/maletin.zip -d /tmp/extraigo\ncat /tmp/extraigo/fondos/lote3/no-lucer/interior.txt",
        "cmds": [
          {
            "cmd": "mkdir",
            "args": "-p /tmp/extraigo unzip -o /var/dojo/maletin.zip -d /tmp/extraigo cat /tmp/extraigo/fondos/lote3/no-lucer/interior.txt",
            "why": "crea directorios",
            "flags": [
              {
                "flag": "-p",
                "meaning": "crea los niveles intermedios que falten y no da error si ya existen"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man mkdir»"
              },
              {
                "flag": "-d",
                "meaning": "flag d del comando — revisa «man mkdir»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "mkdir -p /tmp/extraigo\nunzip -o /var/dojo/maletin.zip -d /tmp/extraigo\ncat /tmp/extraigo/fondos/lote3/no-lucer/interior.txt"
  },
  {
    "id": "archivos-l4",
    "track": "archivos",
    "index": 0,
    "title": "Parche de urgencia",
    "subtitle": "diff y patch",
    "xp": 55,
    "difficulty": 3,
    "brief": "Hay un fichero en su versión primitiva. Existe un parche que lo actualiza (y de paso inserta la clave en la línea correcta).",
    "goal": "Aplica el parche /var/dojo/mejora.patch al fichero /var/dojo/libretas.md y muestra el fichero actualizado: ahí está la flag nueva.",
    "keywords": [
      "patch",
      "diff"
    ],
    "hints": [
      "cp una copia antes de parchear si quieres conservar el original.",
      "cd /var/dojo && patch -p0 libretas.md < mejora.patch  (o patch libretas.md < mejora.patch)"
    ],
    "cheatsheet": [
      {
        "cmd": "patch fichero < parche",
        "desc": "aplica un diff"
      },
      {
        "cmd": "diff -u viejo nuevo",
        "desc": "genera parche unificado"
      },
      {
        "cmd": "patch -R < parche",
        "desc": "deshace el parche (reverse)"
      }
    ],
    "teach": "`diff` genera el parche (diff -u viejo nuevo > parche.diff) y `patch fichero < parche.diff` lo aplica. El formato unificado (-u) es el que usan git y los diffs de código: contexto con espacio, + añade, - quita.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "patching file libretas.md\nLibretas vueltas v2: parche aplicado con éxito. Código: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cd /var/dojo\npatch libretas.md < mejora.patch\ncat libretas.md",
        "cmds": [
          {
            "cmd": "cd",
            "args": "/var/dojo patch libretas.md < mejora.patch cat libretas.md",
            "why": "comando interno del shell: cambia el directorio de trabajo actual; no es un binario, bash lo interpreta",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cd /var/dojo\npatch libretas.md < mejora.patch\ncat libretas.md"
  },
  {
    "id": "archivos-l5",
    "track": "archivos",
    "index": 0,
    "title": "Cadena de sospechosos",
    "subtitle": "enlaces simbólicos y readlink",
    "xp": 60,
    "difficulty": 3,
    "brief": "La clave está detrás de una cadena de enlaces simbólicos que se van pasando la pelota. Algunos van a ficheros trampa. cat SYM sigue la cadena completa; readlink -f te da la ruta física final.",
    "goal": "Sigue la cadena de enlaces desde /home/agent/pomer-result y muéstrame el fichero que la contiene (la flag).Hay varios enlaces; solo uno es bueno.",
    "keywords": [
      "ln",
      "symlink",
      "readlink"
    ],
    "hints": [
      "readlink -f fichero te dice a qué fichero REAL apunta un enlace (con cadena completa).",
      "Alternativa: ls -l para ver todas las flechas →, y probar la buena.",
      "cat $(readlink -f /home/agent/pomer-c)"
    ],
    "cheatsheet": [
      {
        "cmd": "ln -s destino enlace",
        "desc": "crea symlink"
      },
      {
        "cmd": "readlink -f enlace",
        "desc": "ruta real del fichero apuntado"
      }
    ],
    "teach": "Un enlace simbólico (symlink) es un atajo a otro fichero/ruta; los duros (hard link) comparten inodo. `readlink -f` resuelve la cadena completa al fichero real. `ln -s destino link` crea; `ls -l` mue stras flechas →.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "clave: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(readlink -f /home/agent/pomer-c)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(readlink -f /home/agent/pomer-c)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(readlink -f /home/agent/pomer-c)\""
  },
  {
    "id": "archivos-l6",
    "track": "archivos",
    "index": 6,
    "title": "Reunion del compresor",
    "subtitle": "gzip/zcat: descomprimir en el pipe",
    "xp": 35,
    "difficulty": 1,
    "brief": "comprimido.gz contiene una nota importante en texto plano, comprimida. Solo falta leerla sin archivo intermedio.",
    "goal": "Descomprime /home/agent/comprimido.gz en el flujo (sin borrar el fichero) y muestra su contenido.",
    "keywords": [
      "gzip",
      "zcat",
      "compresión"
    ],
    "hints": [
      "gzip -d reemplazaría el fichero: no es lo que se pide.",
      "zcat (o gzip -dc) descomprime AL PIPE sin tocar el fichero.",
      "zcat comprimido.gz"
    ],
    "cheatsheet": [
      {
        "cmd": "zcat f.gz",
        "desc": "descomprime a stdout"
      },
      {
        "cmd": "gzip -d f.gz",
        "desc": "descomprime en sitio"
      }
    ],
    "teach": "zcat/gzip -dc descomprime a stdout manteniendo el original: el flujo se puede encadenar directamente con grafiteo o filtrado. Sustituye descentralizar pistas sin ensuciar el disco.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "nota comprimida: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "zcat /home/agent/comprimido.gz",
        "cmds": [
          {
            "cmd": "zcat",
            "args": "/home/agent/comprimido.gz",
            "why": "comando zcat — revisa «man zcat»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "zcat /home/agent/comprimido.gz"
  },
  {
    "id": "archivos-l7",
    "track": "archivos",
    "index": 7,
    "title": "El paquete tar",
    "subtitle": "tar -xzf: unpack en una cartella distinta",
    "xp": 40,
    "difficulty": 2,
    "brief": "paquete.tar.gz trae un árbol de ficheros con la marca en el fondo. La firma ya empacó y se fue.",
    "goal": "Extrae /home/agent/paquete.tar.gz en /tmp y muestra las líneas de la clave que quedan dentro.",
    "keywords": [
      "tar",
      "compresión",
      "extracción"
    ],
    "hints": [
      "Las opciones tar: x = extraer, z = gzip, f = fichero.",
      "-C DIR decide el DESTINO de la extracción (el origen se pasa separadamente).",
      "tar -xzf paquete.tar.gz -C /tmp && grep -r FLAG /tmp"
    ],
    "cheatsheet": [
      {
        "cmd": "tar -tzf f.tar.gz",
        "desc": "¿qué hay dentro?"
      },
      {
        "cmd": "tar -xzf f.tar.gz -C destino",
        "desc": "extrae en destino"
      }
    ],
    "teach": "tar es el archivador por excelencia de UNIX. Siempre: -x extragir(C)/-c crear, -z/--gzip y -f fichero. La extracción con -C evita la dispersión de ficheros en el cwd.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/tmp/raiz/carpeta-interna/llave.txt:nota profunda: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tar -xzf /home/agent/paquete.tar.gz -C /tmp",
        "cmds": [
          {
            "cmd": "tar",
            "args": "-xzf /home/agent/paquete.tar.gz -C /tmp",
            "why": "empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "extraer"
              },
              {
                "flag": "-z",
                "meaning": "filtro gzip"
              },
              {
                "flag": "-f",
                "meaning": "nombre del archivo tar"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep -r 'FLAG{' /tmp",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r FLAG{ /tmp",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tar -xzf /home/agent/paquete.tar.gz -C /tmp && grep -r 'FLAG{' /tmp"
  },
  {
    "id": "archivos-l8",
    "track": "archivos",
    "index": 8,
    "title": "El zip del corredor",
    "subtitle": "unzip -p: mostrar ficheros del zip",
    "xp": 35,
    "difficulty": 2,
    "brief": "paquete.zip firma el paso final del corredor; dentro trae una nota.txt que interesa al equipo.",
    "goal": "Muestra el contenido de nota.txt DENTRO de /home/agent/paquete.zip sin extraerlo al disco.",
    "keywords": [
      "zip",
      "unzip",
      "compresión"
    ],
    "hints": [
      "unzip sin opciones extraería todo en el cwd: no es lo que se pide.",
      "unzip -p FICHERO miembro escribe ese miembro en stdout.",
      "unzip -p paquete.zip nota.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "unzip -l f.zip",
        "desc": "lista de contenido"
      },
      {
        "cmd": "unzip -p f.zip miembro",
        "desc": "muestra un miembro"
      }
    ],
    "teach": "unzip -p desplaza contenido al stdout sin escribir ficheros: el zcat del mundo zip. Lista con -l antes para saber qué hay dentro del paquete.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "nota del corredor: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "unzip -p /home/agent/paquete.zip nota.txt",
        "cmds": [
          {
            "cmd": "unzip",
            "args": "-p /home/agent/paquete.zip nota.txt",
            "why": "extrae archivos .zip",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man unzip»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "unzip -p /home/agent/paquete.zip nota.txt"
  },
  {
    "id": "archivos-l9",
    "track": "archivos",
    "index": 9,
    "title": "Diferencias validadas",
    "subtitle": "diff: comparar dos versiones",
    "xp": 40,
    "difficulty": 2,
    "brief": "nuevo.txt es la revisión del viejo.txt; además de corregir la broma que venía arrastrando, la revisión incluye una línea marcada.",
    "goal": "Muestra las DIFERENCIAS entre /home/agent/viejo.txt y /home/agent/nuevo.txt y extrae de allí la clase con la marca (empieza con >).",
    "keywords": [
      "diff",
      "comparar",
      "versiones"
    ],
    "hints": [
      "diff A B lista las diferencias con prefijos < y >.",
      "Las líneas que SOLO están en el segundo fichero van con >.",
      "diff viejo.txt nuevo.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "diff a b",
        "desc": "compara línea a línea"
      },
      {
        "cmd": "diff -u a b",
        "desc": "formato unificado (git-ish)"
      }
    ],
    "teach": "diff es la base de wits parecidas a `patch`. Recuerda < = fichero A, > = fichero B. La salida está a la orden de wc, sort y filtered: el beam de comparaciones.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "2c2\n< linea dos con typo\n---\n> linea dos corregida\n3a4\n> linea nueva tabulada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "diff /home/agent/viejo.txt /home/agent/nuevo.txt | cat",
        "cmds": [
          {
            "cmd": "diff",
            "args": "/home/agent/viejo.txt /home/agent/nuevo.txt",
            "why": "compara dos ficheros línea a línea; -u produce el formato de remiendo (contexto + marcadores)",
            "flags": []
          },
          {
            "cmd": "cat",
            "args": "",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "diff /home/agent/viejo.txt /home/agent/nuevo.txt | cat"
  },
  {
    "id": "archivos-l10",
    "track": "archivos",
    "index": 10,
    "title": "La cadena de enlaces",
    "subtitle": "readlink -f: llegar al real",
    "xp": 40,
    "difficulty": 2,
    "brief": "acceso es un enlace simbólico que conduce (a través de otro enlace) al fichero real con la clave. Los decoys pululan.",
    "goal": "Resuelve la cadena de enlaces de /home/agent/acceso (real f) y muestra el fichero REAL.",
    "keywords": [
      "enlaces",
      "symlink",
      "readlink"
    ],
    "hints": [
      "ls -l muestra las flechas -> de cada enlace.",
      "readlink -f RUTA resuelve TODA la cadena hasta el fichero real.",
      "cat $(readlink -f acceso)"
    ],
    "cheatsheet": [
      {
        "cmd": "readlink -f ruta",
        "desc": "ruta real del enlace"
      },
      {
        "cmd": "ln -s objetivo nombre",
        "desc": "crea enlace simbólico"
      }
    ],
    "teach": "Un enlace simbólico es un puntero textual que se resuelve al abrir. readlink -f desmonta la cadena entera: útil para scripts (no te fies del nombre del fichero que recibes).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "el auténtico: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(readlink -f /home/agent/acceso)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(readlink -f /home/agent/acceso)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(readlink -f /home/agent/acceso)\""
  },
  {
    "id": "archivos-l11",
    "track": "archivos",
    "index": 11,
    "title": "Compresión moderna",
    "subtitle": "xz: descomprimir con -d -c",
    "xp": 40,
    "difficulty": 3,
    "brief": "volcado.xz es un fichero comprimido con el algoritmo moderno de alto ratio. Su contenido lleva la marca.",
    "goal": "Descomprime /home/agent/volcado.xz en el flujo y muestra su contenido.",
    "keywords": [
      "xz",
      "compresión",
      "fluxo"
    ],
    "hints": [
      "xz comprime con mucho mejor ratio que gzip: una opción -d descomprime.",
      "Para NO perder el original, -c escribe la salida en stdout.",
      "xz -dc volcado.xz"
    ],
    "cheatsheet": [
      {
        "cmd": "xz -dc f.xz",
        "desc": "descomprime a stdout"
      },
      {
        "cmd": "xz -l f.xz",
        "desc": "muestra estadísticas"
      }
    ],
    "teach": "xz supera a gzip en ratio al precio de más CPU. La trilogía -x/-d/-c funciona igual en gzip, bzip2 y xz: una sola sintaxis para tres compresores.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "papel volcado con marca: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "xz -dc /home/agent/volcado.xz",
        "cmds": [
          {
            "cmd": "xz",
            "args": "-dc /home/agent/volcado.xz",
            "why": "compresión de alta tasa (ficheros .xz)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "descomprimir"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man xz»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "xz -dc /home/agent/volcado.xz"
  },
  {
    "id": "archivos-l12",
    "track": "archivos",
    "index": 12,
    "title": "El paquete de 7",
    "subtitle": "7z: el multi-formato",
    "xp": 45,
    "difficulty": 3,
    "brief": "paquete.7z viene del equipo de backup con gran compresión. Dentro hay una nota.txt que trae la marca",
    "goal": "Extrae /home/agent/paquete.7z en /tmp/7z-salida y muestra nota.txt.",
    "keywords": [
      "7z",
      "p7zip",
      "compresión"
    ],
    "hints": [
      "7z a comprime; 7z x extrae.",
      "La carpeta destino se define con -oRUTA (sin espacio tras -o) (y evita el ok con -y).",
      "7z x -y -o/tmp/7z-salida paquete.7z"
    ],
    "cheatsheet": [
      {
        "cmd": "7z l f.7z",
        "desc": "lista el paquete"
      },
      {
        "cmd": "7z x -oDIR f.7z",
        "desc": "extrae en DIR"
      }
    ],
    "teach": "7z acepta docenas de formatos (tar, zip, gz, iso…) con el mismo interfazo: a/extracto, -o destino, -l listar. Para archivos raros, 7z casi siempre tiene la respuesta.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "marca empacada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "7z x -y -o/tmp/7z-salida /home/agent/paquete.7z >/dev/null",
        "cmds": [
          {
            "cmd": "7z",
            "args": "x -y -o/tmp/7z-salida /home/agent/paquete.7z >/dev/null",
            "why": "comando 7z — revisa «man 7z»",
            "flags": [
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man 7z»"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man 7z»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man 7z»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man 7z»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man 7z»"
              },
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man 7z»"
              },
              {
                "flag": "-s",
                "meaning": "flag s del comando — revisa «man 7z»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man 7z»"
              },
              {
                "flag": "-l",
                "meaning": "flag l del comando — revisa «man 7z»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man 7z»"
              },
              {
                "flag": "-d",
                "meaning": "flag d del comando — revisa «man 7z»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man 7z»"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat /tmp/7z-salida/nota.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/7z-salida/nota.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "7z x -y -o/tmp/7z-salida /home/agent/paquete.7z >/dev/null && cat /tmp/7z-salida/nota.txt"
  },
  {
    "id": "archivos-l13",
    "track": "archivos",
    "index": 13,
    "title": "Pieza en cuatro trozos",
    "subtitle": "split + cat de reunición",
    "xp": 45,
    "difficulty": 3,
    "brief": "El tar quedó dividido en trozos de 200 bytes por split. Reune los fragmentos en orden y descomprime al vuelo.",
    "goal": "Une los trozos de /home/agent/partes/ con cat y extrae el tar.gz resultante leyendo su contenido.",
    "keywords": [
      "split",
      "cat",
      "tar"
    ],
    "hints": [
      "Los trozos de split nombran con sufijo ordenado (trozo-aa, trozo-ab…): por orden alfabético ya están en orden.",
      "cat trozo-* reconstruye el original; tar -xzOf - lee el catenado sin tocar disco.",
      "cat /home/agent/partes/trozo-* | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "split -b 1M f trozo-",
        "desc": "divide por megabytes"
      },
      {
        "cmd": "cat trozo-*",
        "desc": "reunir en orden"
      }
    ],
    "teach": "split parte a bytes fijos (-b) o por líneas (-l); cat * los regresa. El estándar de envíos por fichero pequeño (cuota de tamaño de mail/FTP) es este par siempre alfligido.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/partes/trozo-* | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/partes/trozo-*",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "tar",
            "args": "-xzOf -",
            "why": "empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "extraer"
              },
              {
                "flag": "-z",
                "meaning": "filtro gzip"
              },
              {
                "flag": "-f",
                "meaning": "nombre del archivo tar"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat /home/agent/partes/trozo-* | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "archivos-l14",
    "track": "archivos",
    "index": 14,
    "title": "Cofre con clave",
    "subtitle": "zip + unzip -P",
    "xp": 45,
    "difficulty": 3,
    "brief": "El cofre.zip está cifrado con unzip: la contraseña está impresa en la nota de al lado.",
    "goal": "Lee la contraseña de /home/agent/nota.txt y muestra el contenido de cofre.zip al stdout (unzip -p).",
    "keywords": [
      "zip",
      "unzip",
      "password"
    ],
    "hints": [
      "unzip -p imprime el contenido SIN extraerlo al disco (a difference of unzip normal).",
      "La clave está en nota.txt; usa grep -oE para casi es crunch.",
      "unzip -p -P CLAVE /home/agent/cofre.zip"
    ],
    "cheatsheet": [
      {
        "cmd": "zip -P clave cofre.zip f",
        "desc": "cifrar al crear"
      },
      {
        "cmd": "unzip -p -P clave f.zip",
        "desc": "cat del interior cifrado"
      }
    ],
    "teach": "zip/unzip con cifrado Clásico (ZipCrypto) o AES según versión. unzip -p es el \"cat\" de los zips: manda a stdout y manejable en pipelines.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "guardada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(grep -oE 'dojocofre' /home/agent/nota.txt | head -n1)",
        "cmds": [
          {
            "cmd": "p=$(grep",
            "args": "-oE dojocofre /home/agent/nota.txt",
            "why": "comando p=$(grep — revisa «man p=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man p=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "unzip -p -P \"$p\" /home/agent/cofre.zip",
        "cmds": [
          {
            "cmd": "unzip",
            "args": "-p -P $p /home/agent/cofre.zip",
            "why": "extrae archivos .zip",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man unzip»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "p=$(grep -oE 'dojocofre' /home/agent/nota.txt | head -n1); unzip -p -P \"$p\" /home/agent/cofre.zip"
  },
  {
    "id": "archivos-l15",
    "track": "archivos",
    "index": 15,
    "title": "El tercer compresor",
    "subtitle": "xz: el de ratio más alto",
    "xp": 45,
    "difficulty": 3,
    "brief": "xiles.txt.xz usa xz (extension .xz) — no gzip ni zip. xz -dc lo decodifica al stdout.",
    "goal": "Decodifica /home/agent/xiles.txt.xz y extrae la marca.",
    "keywords": [
      "xz",
      "compresion",
      "stdout"
    ],
    "hints": [
      "xz -d descomprime; añade -c para mandar el resultado al stdout (xz -dc).",
      "La forma de la marca con grep -oE escribes poco que filtrar.",
      "xz -dc f.xz | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "xz -dc f.xz",
        "desc": "al stdout"
      },
      {
        "cmd": "zstd -d f.zst",
        "desc": "el moderno"
      }
    ],
    "teach": "gzip (rápido), bzip2 (mejor ratio), xz (lo mejor ratio, más lento) y zstd (el equilibrado moderno). El sufijo .xz señala realmente Adventisten del juego; -c manda salida al stdout.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "xz -dc /home/agent/xiles.txt.xz | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "xz",
            "args": "-dc /home/agent/xiles.txt.xz",
            "why": "compresión de alta tasa (ficheros .xz)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "descomprimir"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man xz»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "xz -dc /home/agent/xiles.txt.xz | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "archivos-l16",
    "track": "archivos",
    "index": 16,
    "title": "El salto del faro",
    "subtitle": "readlink -f: resolver cadenas de symlinks",
    "xp": 45,
    "difficulty": 3,
    "brief": "En ~/faro cuatro enlaces simbólicos se recogen como bengalas lazos: lazo1 → lazo2 → lazo3 → … hasta la pieza.",
    "goal": "Resuelve la cadena de symlinks desde /home/agent/faro/lazo1 y muestra el fichero final.",
    "keywords": [
      "symlink",
      "readlink",
      "cadena"
    ],
    "hints": [
      "readlink -p resuelve UN salto; readlink -f resuelve TODA la cadena hasta el fichero real.",
      "readlink -f lazo1 imprime el destino real; cat $(readlink -f lazo1) lo muestra.",
      "cat \"$(readlink -f /home/agent/faro/lazo1)\""
    ],
    "cheatsheet": [
      {
        "cmd": "readlink -f f",
        "desc": "destino absoluto final"
      },
      {
        "cmd": "ls -l",
        "desc": "flecchas de los links"
      }
    ],
    "teach": "Un symlink es un puntero: readlink -f lo data el destino ABSOLUTO final a(disfraz de infinite loops). Comprobar enlaces rotos es find -L -type l.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la masa del faro: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(readlink -f /home/agent/faro/lazo1)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(readlink -f /home/agent/faro/lazo1)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(readlink -f /home/agent/faro/lazo1)\""
  },
  {
    "id": "archivos-l17",
    "track": "archivos",
    "index": 17,
    "title": "Remiendo aplicado",
    "subtitle": "patch < fix.diff",
    "xp": 45,
    "difficulty": 3,
    "brief": "La pieza es invisible hasta que alguien APLIQUé el remiendo fix.diff sobre pieza.txt — revela la línea oculta.",
    "goal": "Aplica /home/agent/fix.diff sobre /home/agent/pieza.txt (cd + patch) y muestra el resultado.",
    "keywords": [
      "patch",
      "diff",
      "remiendo"
    ],
    "hints": [
      "Herramienta: cd al taller; patch fichero < remiendo.diff.",
      "Si el remiendo queja por los paths del header, prueba -p0 o -p1.",
      "cd /home/agent/taller && patch pieza.txt < fix.diff; cat pieza.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "diff -u a b > rem.diff",
        "desc": "generar remiendo"
      },
      {
        "cmd": "patch f < rem.diff",
        "desc": "aplicar"
      }
    ],
    "teach": "diff COMPARA y patch APLICA: el par que rige el flujo de parcheos (kernel, git apply). Saber generar (diff -u a b > f.diff) y aplicar (patch < f.diff) es lengüeta de mantenedor.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "patching file pieza.txt\nlinea uno\nla pieza remendada: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nfecha del remiendo: tanda tres\nlinea tres"
      }
    ],
    "steps": [
      {
        "raw": "cd /home/agent/taller",
        "cmds": [
          {
            "cmd": "cd",
            "args": "/home/agent/taller",
            "why": "comando interno del shell: cambia el directorio de trabajo actual; no es un binario, bash lo interpreta",
            "flags": []
          }
        ]
      },
      {
        "raw": "patch pieza.txt < /home/agent/taller/fix.diff",
        "cmds": [
          {
            "cmd": "patch",
            "args": "pieza.txt < /home/agent/taller/fix.diff",
            "why": "aplica un remiendo (diff) sobre un fichero; se lee el diff de stdin con <",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/taller/pieza.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/taller/pieza.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cd /home/agent/taller && patch pieza.txt < /home/agent/taller/fix.diff && cat /home/agent/taller/pieza.txt"
  },
  {
    "id": "archivos-l18",
    "track": "archivos",
    "index": 18,
    "title": "Nombres sin lazar",
    "subtitle": "find + nombres con espacios",
    "xp": 45,
    "difficulty": 3,
    "brief": "En ~/desorden los ficheros parecen tesoros de traslación: espacios, guiones, puntos raros. Solo un \"salida\" (con espacios y guiones) guarda la pieza.",
    "goal": "Localiza con find el fichero con \"salida\" en su nombre dentro de /home/agent/desorden y muéstralo.",
    "keywords": [
      "find",
      "espacios",
      "quoting"
    ],
    "hints": [
      "find -name \"*salida*\" es con COMILLAS: sin ellas, el glob explota en tu shell.",
      "Del resultado filtra el que va de \"final\" (solo él es el buen camino), con grep.",
      "cat \"$(find /home/agent/desorden -name \"*salida*\" | grep final)\""
    ],
    "cheatsheet": [
      {
        "cmd": "find d -name '*salida*'",
        "desc": "por nombre con comillas"
      },
      {
        "cmd": "find -print0 | xargs -0 cmd",
        "desc": "nombres raros a prueba de cañas"
      }
    ],
    "teach": "Nombres con espacios son el pecado de un 50% de los scripts: SIEMPRE entre comillas \"$(...)\". Con find -print0 | xargs -0 nulos separan sin ambigüedad.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "guardada con espacios: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(find /home/agent/desorden -name '*salida*' | grep 'final' | head -n1)\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(find /home/agent/desorden -name '*salida*' | grep 'final' | head -n1)",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat \"$(find /home/agent/desorden -name '*salida*' | grep 'final' | head -n1)\""
  },
  {
    "id": "archivos-l19",
    "track": "archivos",
    "index": 19,
    "title": "La caja del tren",
    "subtitle": "tar: crear y listar",
    "xp": 55,
    "difficulty": 4,
    "brief": "> El equipaje viaja en formato .tar.gz y los bultos se identifican por > su etiqueta (el nombre de cada fichero dentro del paquete). La caja > \"maleta.tar.gz\" tiene 3 bultos: solo el llamado \"j Rusia ligero\" > (joya.txt) lleva la contrapartida. Descomprímela en el sitio seguro.",
    "goal": "Lista el contenido de ~/maleta.tar.gz, extrae su contenido en el directorio actual y muestra la flag del fichero joya.txt.",
    "keywords": [
      "tar"
    ],
    "hints": [
      "tar -czf destino.tar.gz ficheros — c: crear, z: gzip, f: fichero.",
      "tar -tzf paquete.tar.gz lista el contenido (t: \"tocar sin extraer\").",
      "tar -xzf paquete.tar.gz extrae (x: extraer)."
    ],
    "cheatsheet": [
      {
        "cmd": "tar -czf paquete.tar.gz ficheros",
        "desc": "crear un paquete comprimido"
      },
      {
        "cmd": "tar -tzf paquete.tar.gz",
        "desc": "listar su contenido"
      },
      {
        "cmd": "tar -xzf paquete.tar.gz -C DIR",
        "desc": "extraer el paquete en DIR"
      }
    ],
    "teach": "El flujo tar clásico:\n\n    tar -tzf ~/maleta.tar.gz      # ver qué lleva dentro (sin extraer)\n    tar -xzf ~/maleta.tar.gz -C ~ # extraer en tu home\n    cat ~/joya.txt                # la flag está en joya.txt\n\nz significa que el paquete va comprimido con gzip (por lo tanto usa z tanto al listar como al extraer, igual que al crear).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tar -xzf ~/maleta.tar.gz -C ~",
        "cmds": [
          {
            "cmd": "tar",
            "args": "-xzf ~/maleta.tar.gz -C ~",
            "why": "empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "extraer"
              },
              {
                "flag": "-z",
                "meaning": "filtro gzip"
              },
              {
                "flag": "-f",
                "meaning": "nombre del archivo tar"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat ~/joya.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "~/joya.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "tar -xzf ~/maleta.tar.gz -C ~ && cat ~/joya.txt"
  },
  {
    "id": "archivos-l20",
    "track": "archivos",
    "index": 20,
    "title": "Los gemelos del estante",
    "subtitle": "md5sum + uniq: invariantes",
    "xp": 55,
    "difficulty": 4,
    "brief": "> En el estante \"estante\" hay pila de ficheros; dos son IDÉNTICOS byte a > byte (mismo contenido), y solo uno de LOS DOS lleva la contrapartida > dentro. Regla de la casa: los gemelos comparten huella MD5; una vez > detectados, \"el de la izquierda\" (alfabéticamente primero) es el bueno.",
    "goal": "Detecta la huella md5 duplicada en ~/estante usando md5sum + sort + uniq, y muestra el contenido del fichero duplicado (que es el que lleva la flag).",
    "keywords": [
      "md5sum",
      "uniq"
    ],
    "hints": [
      "md5sum fichero imprime \"hash fichero\".",
      "md5sum ~/estante/* | sort | uniq -D -w32 agrupa por los 32 primeros caracteres (el hash).",
      "La línea duplicada contiene el nombre del fichero con la flag: cat ese fichero."
    ],
    "cheatsheet": [
      {
        "cmd": "md5sum FICHEROS",
        "desc": "huella MD5 de cada fichero"
      },
      {
        "cmd": "uniq -D -w32",
        "desc": "agrupa por los 32 primeros caracteres"
      }
    ],
    "teach": "Los ficheros idénticos comparten hash MD5. Se listan las huellas y se agrupan:\n\n    md5sum ~/estante/*           # \"hash  fichero\" por fichero\n    | sort                       # adyacentes las iguales\n    | uniq -D -w32               # muestra TODAS las filas con igual hash (32 chars)\n\nextract: los nombres duplicados; el que contiene la flag es el alfabético primero de los gemelos:\n\n    md5sum ~/estante/* | sort | uniq -D -w32 | sort | head -n 1 | awk '{print $2}' | xargs cat",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "md5sum ~/estante/* | sort | uniq -D -w32 | sort | head -n 1 | awk '{print $2}' | xargs cat",
        "cmds": [
          {
            "cmd": "md5sum",
            "args": "~/estante/*",
            "why": "hash MD5 por fichero (integridad clásica, criptografía obsoleta)",
            "flags": []
          },
          {
            "cmd": "sort",
            "args": "",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": []
          },
          {
            "cmd": "uniq",
            "args": "-D -w32",
            "why": "comprime líneas duplicadas ADYACENTES (por eso casi siempre va tras sort)",
            "flags": [
              {
                "flag": "-w",
                "meaning": "flag w del comando — revisa «man uniq»"
              }
            ]
          },
          {
            "cmd": "sort",
            "args": "",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": []
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          },
          {
            "cmd": "awk",
            "args": "{print $2}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "xargs",
            "args": "cat",
            "why": "convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "md5sum ~/estante/* | sort | uniq -D -w32 | sort | head -n 1 | awk '{print $2}' | xargs cat"
  },
  {
    "id": "scripting-l1",
    "track": "scripting",
    "index": 0,
    "title": "Cazando con un bucle",
    "subtitle": "for + grep + condicional",
    "xp": 55,
    "difficulty": 3,
    "brief": "Veinte ficheros numerados contienen notas de estudio. Solo UNO de ellos contiene la marca FLAG{…}. Escribir la comprobación a mano es de novator.",
    "goal": "Recorre los ficheros de /var/dojo/apuntes con un bucle for; para cada uno, si contiene FLAG{ muéstramelo (solo ese fichero).",
    "keywords": [
      "for",
      "if",
      "grep-q"
    ],
    "hints": [
      "for f in /var/dojo/apuntes/*; do … ; done",
      "if grep -q 'FLAG{' \"$f\"; then cat \"$f\"; fi dentro del bucle."
    ],
    "cheatsheet": [
      {
        "cmd": "for f in /ruta/*; do cat \"$f\"; done",
        "desc": "itera y actúa"
      },
      {
        "cmd": "if cmd; then …; fi",
        "desc": "condicional por exit code"
      },
      {
        "cmd": "grep -q patrón f",
        "desc": "silencioso — ideal en condiciones"
      }
    ],
    "teach": "El clásico `for f in lista; do cmd; done` itera palabras e expandición de globs. `grep -q` queda en silencio y devuelve 0 si hay match — perfecto para condicionales if/then. Cambia {} por los comodines correctos y el shell hace el resto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "el apunte premiado contendía esta línea: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "for f in /var/dojo/apuntes/*",
        "cmds": [
          {
            "cmd": "for",
            "args": "f in /var/dojo/apuntes/*",
            "why": "comando for — revisa «man for»",
            "flags": []
          }
        ]
      },
      {
        "raw": "do\n  if grep -q \"FLAG{\" \"$f\"",
        "cmds": [
          {
            "cmd": "do",
            "args": "if grep -q FLAG{ $f",
            "why": "comando do — revisa «man do»",
            "flags": [
              {
                "flag": "-q",
                "meaning": "flag q del comando — revisa «man do»"
              }
            ]
          }
        ]
      },
      {
        "raw": "then cat \"$f\"",
        "cmds": [
          {
            "cmd": "then",
            "args": "cat $f",
            "why": "comando then — revisa «man then»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi\ndone",
        "cmds": [
          {
            "cmd": "fi",
            "args": "done",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "for f in /var/dojo/apuntes/*; do\n  if grep -q \"FLAG{\" \"$f\"; then cat \"$f\"; fi\ndone"
  },
  {
    "id": "scripting-l2",
    "track": "scripting",
    "index": 0,
    "title": "El guardián de la puerta",
    "subtitle": "variables, case y argumentos",
    "xp": 55,
    "difficulty": 3,
    "brief": "Un script portero (/usr/local/bin/portero) solo abre si le pasas la palabra correcta como argumento. La pista para adivinarla está en /home/agent/pista-portero.txt… escrita del revés, eso sí.",
    "goal": "Lee la pista, descubre la palabra (está invertida en la pista), invoca al portero con ella y recoge la flag que entrega.",
    "keywords": [
      "case",
      "variables"
    ],
    "hints": [
      "cat /home/agent/pista-portero.txt — la palabra aparece escrita del revés.",
      "Inviértela (rev, o a ojo): queda 'espiral'.",
      "portero espiral"
    ],
    "cheatsheet": [
      {
        "cmd": "case $1 in a) …;; b) …;; esac",
        "desc": "ramifica por valor"
      },
      {
        "cmd": "var=valor",
        "desc": "define sin espacios alrededor del ="
      },
      {
        "cmd": "rev fichero",
        "desc": "invierte caracteres por línea"
      }
    ],
    "teach": "`case $x in patrón) cmd;; esac` ramifica por valor sin if/elif. Las variables se leen con $var y entre comillas dobles conservan espacios. Si el portero se resiste, `cat` del script enseña su lógica (y a veces, sus secretos — lección sobre NO meter secretos en scripts legibles).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "La palabra está desdorada: laropse (ñaka ñaka)\nPuerta abierta. Clave: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/pista-portero.txt\nportero espiral",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/pista-portero.txt portero espiral",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /home/agent/pista-portero.txt\nportero espiral"
  },
  {
    "id": "scripting-l3",
    "track": "scripting",
    "index": 0,
    "title": "La función encantada",
    "subtitle": "funciones y argumentos \"$@\"",
    "xp": 60,
    "difficulty": 3,
    "brief": "Un hechicero es hizo un script que solo desbloquea el truco correcto si lo llamas con DOS argumentos en orden específico — y todo en estilo shell, claro: invocando ./verso.sh arg1 arg2.",
    "goal": "En /home/agent/verso.sh hay un script que exige (en orden): el primer argumento 'abierto' y el segundo 'sésamo'. LÁNZALO correctamente desde el shell (bash verso.sh abierto sésamo) y te dará la flag.",
    "keywords": [
      "funciones",
      "args"
    ],
    "hints": [
      "bash /home/agent/verso.sh abierto sésamo",
      "'$#' cuenta argumentos; $1 y $2 son los primero y segundo."
    ],
    "cheatsheet": [
      {
        "cmd": "fn() { echo \"$1\"; }",
        "desc": "define una función"
      },
      {
        "cmd": "\"$@\"",
        "desc": "todos los args"
      },
      {
        "cmd": "[ -f fichero ]",
        "desc": "test de existencia"
      }
    ],
    "teach": "`$1`..`$9` son argumentos posicionales; `$#` el número total; `$@` todos, cada uno como está. Las funciones (`fn() { … }`) se llaman como comandos con SUS argumentos locales a $1/$2 dentro.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "invocación correcta. Banner del honi: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "bash /home/agent/verso.sh abierto sésamo",
        "cmds": [
          {
            "cmd": "bash",
            "args": "/home/agent/verso.sh abierto sésamo",
            "why": "ejecuta un script/cadena con bash",
            "flags": []
          }
        ]
      }
    ],
    "raw": "bash /home/agent/verso.sh abierto sésamo"
  },
  {
    "id": "scripting-l4",
    "track": "scripting",
    "index": 0,
    "title": "El oráculo con opciones",
    "subtitle": "getopts y argumentos con -x",
    "xp": 65,
    "difficulty": 3,
    "brief": "El oráculo del dojo solo desvela la flag si le pasas las opciones correctas en el orden que quiere (-k con valor clave) — y lanza un mensaje de uso si te despistas. getopts es tu amiga.",
    "goal": "El binario /usr/local/bin/oraculo solo imprime la flag si lo llamas con -k seguido de la palabra 'matrix' (getopts clásico). Ejecútalo correctamente.",
    "keywords": [
      "getopts"
    ],
    "hints": [
      "oraculo -k matrix",
      "Mira el script con cat: el uso correcto está en la línea de error."
    ],
    "cheatsheet": [
      {
        "cmd": "while getopts \"k:h\" opt; do case $opt in k) K=$OPTARG;; esac; done",
        "desc": "patrón getopts"
      },
      {
        "cmd": "shift $((OPTIND-1))",
        "desc": "deja solo los args restantes"
      }
    ],
    "teach": "`getopts \"k:vh\" opt` procesa opciones cortas: `k:` exige valor (queda en $OPTARG). La forma correcta de escribir opciones es la misma en cualquier script de sistema — y es lo que hace legible a tus herramientas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "@@@ FLAG{d3b09a4f7c2e1b8d6041a5f3} @@@"
      }
    ],
    "steps": [
      {
        "raw": "oraculo -k matrix",
        "cmds": [
          {
            "cmd": "oraculo",
            "args": "-k matrix",
            "why": "comando oraculo — revisa «man oraculo»",
            "flags": [
              {
                "flag": "-k",
                "meaning": "flag k del comando — revisa «man oraculo»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "oraculo -k matrix"
  },
  {
    "id": "scripting-l5",
    "track": "scripting",
    "index": 0,
    "title": "Legion de fragmentos",
    "subtitle": "boss — bucles + base64",
    "xp": 85,
    "difficulty": 4,
    "brief": "La clave fue codificada a base64 y troceada en 5 ficheros (a..e). Los pedazos solo valen juntos: concatenados EN ORDEN alfabético forman el base64 completo, que decodificado revela la flag.",
    "goal": "Concatena en orden alfabético los ficheros .b64 de /var/dojo/fragmentos, decodifica el resultado UNA VEZ y muestra la flag completa.",
    "keywords": [
      "for",
      "base64",
      "boss"
    ],
    "hints": [
      "cat /var/dojo/fragmentos/a.b64 /var/dojo/fragmentos/b.b64 … (en orden) une los base64.",
      "cat /var/dojo/fragmentos/*.b64 | base64 -d hace todo de golpe: el globo * sigue el orden alfabético.",
      "atención: decodifica UNA sola vez sobre la concatenación, no fragmento a fragmento."
    ],
    "cheatsheet": [
      {
        "cmd": "cat /dir/*.b64",
        "desc": "concatena en orden alfabético"
      },
      {
        "cmd": "base64 -d",
        "desc": "decodifica base64 de stdin"
      },
      {
        "cmd": "cmd; echo",
        "desc": "añade salto de línea final para verlo limpio"
      }
    ],
    "teach": "El glob `*` expande en orden alfabético: por eso `cat fragdir/*.b64 | base64 -d` rearma lo troceado. Recuerda: base64 exige bloques de 4 caracteres — si troceas en el medio, cada fragmento por separado NO es base64 válido; solo la concatenación lo es.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /var/dojo/fragmentos/*.b64 | base64 -d",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/var/dojo/fragmentos/*.b64",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      },
      {
        "raw": "echo",
        "cmds": [
          {
            "cmd": "echo",
            "args": "",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /var/dojo/fragmentos/*.b64 | base64 -d; echo"
  },
  {
    "id": "scripting-l6",
    "track": "scripting",
    "index": 6,
    "title": "Conf en el entorno",
    "subtitle": "source: cargar un fichero de variables",
    "xp": 35,
    "difficulty": 2,
    "brief": "config.env define la ruta del depósito con una variable. Las variables del shell NO están cargadas por defecto.",
    "goal": "Carga /home/agent/config.env en el shell y con la variable que define úsala para mostrar /home/agent/buzon/<DEPOSITO>/clave.txt",
    "keywords": [
      "source",
      "variables",
      "env"
    ],
    "hints": [
      "El fichero config.env tiene líneas variable=valor.",
      "source (o .) ejecuta un fichero EN el shell actual: las variables quedan cargadas.",
      ". config.env && cat buzon/$DEPOSITO/clave.txt"
    ],
    "cheatsheet": [
      {
        "cmd": ". fichero.env",
        "desc": "carga variables en el shell"
      },
      {
        "cmd": "env | sort",
        "desc": "lista el entorno actual"
      }
    ],
    "teach": "source (o el punto) ejecuta un script SIN crear subshell: las variables que define quedan en TU shell. Es el mecanismo con el que TODO el mundo carga configuraciones (.bashrc incluido).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "buzón confirmado: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": ". /home/agent/config.env",
        "cmds": [
          {
            "cmd": ".",
            "args": "/home/agent/config.env",
            "why": "comando . — revisa «man .»",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /home/agent/buzon/$DEPOSITO/clave.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/buzon/$DEPOSITO/clave.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": ". /home/agent/config.env && cat /home/agent/buzon/$DEPOSITO/clave.txt"
  },
  {
    "id": "scripting-l7",
    "track": "scripting",
    "index": 7,
    "title": "La edad y la puerta",
    "subtitle": "if/condiciones numericas",
    "xp": 35,
    "difficulty": 2,
    "brief": "El sistema decide con la edad del fichero edad.txt qué fichero entregar: adulto o menor.",
    "goal": "Con tee logic: si edad.txt >= 18, muestra adulto/clave.txt; si no, muestra menor/broma.txt.",
    "keywords": [
      "if",
      "test",
      "condicional"
    ],
    "hints": [
      "La condición numérica en bash usa test: [ valor -ge 18 ].",
      "Sacar el valor del fichero con $(cat edad.txt) evita que quede con salto de línea.",
      "if [ \"$(cat edad.txt)\" -ge 18 ]; then cat adulto/clave.txt; fi"
    ],
    "cheatsheet": [
      {
        "cmd": "[ x -ge 18 ] && a || b",
        "desc": "if corto en una línea"
      },
      {
        "cmd": "if [ cond ]; then ... fi",
        "desc": "estructura clásica"
      }
    ],
    "teach": "El test [ ] compara: -eq, -ne, -gt, -ge, -lt, -le para números; = para cadenas. Si el if no entra, else (o elif) dan la alternativa.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "puerta del adulto: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "if [ \"$(cat /home/agent/edad.txt)\" -ge 18 ]",
        "cmds": [
          {
            "cmd": "if",
            "args": "[ $(cat /home/agent/edad.txt) -ge 18 ]",
            "why": "comando if — revisa «man if»",
            "flags": [
              {
                "flag": "-g",
                "meaning": "flag g del comando — revisa «man if»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man if»"
              }
            ]
          }
        ]
      },
      {
        "raw": "then cat /home/agent/adulto/clave.txt",
        "cmds": [
          {
            "cmd": "then",
            "args": "cat /home/agent/adulto/clave.txt",
            "why": "comando then — revisa «man then»",
            "flags": []
          }
        ]
      },
      {
        "raw": "else cat /home/agent/menor/broma.txt",
        "cmds": [
          {
            "cmd": "else",
            "args": "cat /home/agent/menor/broma.txt",
            "why": "comando else — revisa «man else»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi",
        "cmds": [
          {
            "cmd": "fi",
            "args": "",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "if [ \"$(cat /home/agent/edad.txt)\" -ge 18 ]; then cat /home/agent/adulto/clave.txt; else cat /home/agent/menor/broma.txt; fi"
  },
  {
    "id": "scripting-l8",
    "track": "scripting",
    "index": 8,
    "title": "El menú por parámetros",
    "subtitle": "posicionales $1 $2 y case",
    "xp": 40,
    "difficulty": 3,
    "brief": "menu.sh acepta un ACCION y una CLAVE: hay que invocarlo correctamente para que lea el fichero que interesa.",
    "goal": "Invoca /home/agent/menu.sh (con bash) con acción \"mostrar\" y clave \"centro-2\" para leer la ficha correcta.",
    "keywords": [
      "case",
      "posicionales",
      "$1",
      "script"
    ],
    "hints": [
      "Dentro del script, $1 y $2 son el primer y segundo parámetro que le pasas.",
      "El case $1 ejecuta la rama cuyo patrón case la acción.",
      "bash menu.sh mostrar centro-2"
    ],
    "cheatsheet": [
      {
        "cmd": "./script a b",
        "desc": "invoca con parámetros"
      },
      {
        "cmd": "case $1 in a) ...;; esac",
        "desc": "switch bash"
      }
    ],
    "teach": "$0 $1 $2… son los argumentos posicionales de un script (como argv de C). case sobre $1 es el switch de bash: la forma idiomática de depender del parámetro a ser.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "ficha correcta: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "bash /home/agent/menu.sh mostrar centro-2",
        "cmds": [
          {
            "cmd": "bash",
            "args": "/home/agent/menu.sh mostrar centro-2",
            "why": "ejecuta un script/cadena con bash",
            "flags": []
          }
        ]
      }
    ],
    "raw": "bash /home/agent/menu.sh mostrar centro-2"
  },
  {
    "id": "scripting-l9",
    "track": "scripting",
    "index": 9,
    "title": "Lee tu itinerario",
    "subtitle": "while read + campos al vuelo",
    "xp": 45,
    "difficulty": 3,
    "brief": "itinerario lista pares host puerto. Solo la fila localhost 4242 corresponde a un fichero real en rutas/.",
    "goal": "Recorre itinerario.txt línea a línea (while read) y cuando la fila sea localhost 4242, muestra /home/agent/rutas/4242.txt",
    "keywords": [
      "while read",
      "bucle",
      "campos"
    ],
    "hints": [
      "while read -r a b; do ...; done < fichero lee campo a campo.",
      "Es la forma idiomática de procesar líneas con campos: NO uses for sobre la salida de cat.",
      "while read -r h p; do echo \"$h\"; done < itinerario.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "while read -r a b; do …; done < f",
        "desc": "lee dos campos por línea"
      },
      {
        "cmd": "wc -l itinerario.txt",
        "desc": "verifica el recorrido"
      }
    ],
    "teach": "while read parsea cada línea en variables: para procesar ficheros columna a columna es EL patrón. for sobre $() rompe en espacios y come los saltos: read es la vía fiel.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "ruta local exacta: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "while read -r h p",
        "cmds": [
          {
            "cmd": "while",
            "args": "read -r h p",
            "why": "comando while — revisa «man while»",
            "flags": [
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man while»"
              }
            ]
          }
        ]
      },
      {
        "raw": "do if [ \"$h\" = \"localhost\" ]",
        "cmds": [
          {
            "cmd": "do",
            "args": "if [ $h = localhost ]",
            "why": "comando do — revisa «man do»",
            "flags": []
          }
        ]
      },
      {
        "raw": "[ \"$p\" = \"4242\" ]",
        "cmds": [
          {
            "cmd": "[",
            "args": "$p = 4242 ]",
            "why": "comando [ — revisa «man [»",
            "flags": []
          }
        ]
      },
      {
        "raw": "then cat /home/agent/rutas/4242.txt",
        "cmds": [
          {
            "cmd": "then",
            "args": "cat /home/agent/rutas/4242.txt",
            "why": "comando then — revisa «man then»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi",
        "cmds": [
          {
            "cmd": "fi",
            "args": "",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      },
      {
        "raw": "done < /home/agent/itinerario.txt",
        "cmds": [
          {
            "cmd": "done",
            "args": "< /home/agent/itinerario.txt",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "while read -r h p; do if [ \"$h\" = \"localhost\" ] && [ \"$p\" = \"4242\" ]; then cat /home/agent/rutas/4242.txt; fi; done < /home/agent/itinerario.txt"
  },
  {
    "id": "scripting-l10",
    "track": "scripting",
    "index": 10,
    "title": "Solo los ejecutables",
    "subtitle": "funciones + test -x",
    "xp": 45,
    "difficulty": 3,
    "brief": "En caja/ hay ficheros mixtos: la mayoría ni siquiera es ejecutable. El que sí, guarda la marca.",
    "goal": "Define una función (o usa test -x) para recorrer /home/agent/caja/* y imprimir SOLO los ficheros con permiso de ejecución.",
    "keywords": [
      "funciones",
      "test -x",
      "bucle"
    ],
    "hints": [
      "test -x FICHERO responde ¿es ejecutable?",
      "Un bucle for sobre caja/* te recorre los ficheros de a uno.",
      "for f in caja/*; do [ -x \"$f\" ] && cat \"$f\"; done"
    ],
    "cheatsheet": [
      {
        "cmd": "mi_fn() { …; }; mi_fn",
        "desc": "definir y llamar"
      },
      {
        "cmd": "[ -x f ] && a",
        "desc": "if corto si ejecutable"
      }
    ],
    "teach": "Las funciones en bash (nombre() { … }) reutilizan lógica en el mismo shell. El test -x/-r/-f/-d responde propiedades de ficheros: la combinación script = filtro perfectro para lotes.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "ejecutable: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "for f in /home/agent/caja/*",
        "cmds": [
          {
            "cmd": "for",
            "args": "f in /home/agent/caja/*",
            "why": "comando for — revisa «man for»",
            "flags": []
          }
        ]
      },
      {
        "raw": "do if [ -x \"$f\" ]",
        "cmds": [
          {
            "cmd": "do",
            "args": "if [ -x $f ]",
            "why": "comando do — revisa «man do»",
            "flags": [
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man do»"
              }
            ]
          }
        ]
      },
      {
        "raw": "then cat \"$f\"",
        "cmds": [
          {
            "cmd": "then",
            "args": "cat $f",
            "why": "comando then — revisa «man then»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi",
        "cmds": [
          {
            "cmd": "fi",
            "args": "",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      },
      {
        "raw": "done",
        "cmds": [
          {
            "cmd": "done",
            "args": "",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "for f in /home/agent/caja/*; do if [ -x \"$f\" ]; then cat \"$f\"; fi; done"
  },
  {
    "id": "scripting-l11",
    "track": "scripting",
    "index": 11,
    "title": "El script cojo",
    "subtitle": "sed -i: editar ficheros en sitio",
    "xp": 50,
    "difficulty": 4,
    "brief": "repara.sh debería ejecutar el echo de la flag, pero SU ecos línea perfilalı quedó comentada. Medicina: quitar el # avant de ejecutar.",
    "goal": "Descomenta la línea ejecutable de /home/agent/repara.sh (sed -i), ejecútalo y muestra lo que imprime.",
    "keywords": [
      "sed -i",
      "in-place",
      "descomentar"
    ],
    "hints": [
      "sed -i edita el fichero directamente (sin volcar a otro).",
      "El patrón ^# (comentario al inicio) seguido de espacio es lo que dejó la línea comentada.",
      "sed -i 's/^# //' repara.sh && bash repara.sh"
    ],
    "cheatsheet": [
      {
        "cmd": "sed -i 's/a/b/' f",
        "desc": "sustituye y guarda"
      },
      {
        "cmd": "sed -i 's|^#!|#!' f",
        "desc": "con delimitador alterno"
      }
    ],
    "teach": "sed -i es la edición en el sitio (in-place) que usan los scripters para toques quirúrgicos. La / la puedes depender: s|a|b| con cualquier carácter evita fugas con la propia ele.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "primero la calibración\nla marca del parche: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nfin del fichero"
      }
    ],
    "steps": [
      {
        "raw": "sed -i 's|^# ||' /home/agent/repara.sh",
        "cmds": [
          {
            "cmd": "sed",
            "args": "-i s|^# || /home/agent/repara.sh",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": [
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man sed»"
              }
            ]
          }
        ]
      },
      {
        "raw": "bash /home/agent/repara.sh",
        "cmds": [
          {
            "cmd": "bash",
            "args": "/home/agent/repara.sh",
            "why": "ejecuta un script/cadena con bash",
            "flags": []
          }
        ]
      }
    ],
    "raw": "sed -i 's|^# ||' /home/agent/repara.sh && bash /home/agent/repara.sh"
  },
  {
    "id": "scripting-l12",
    "track": "scripting",
    "index": 12,
    "title": "La caja según el estado",
    "subtitle": "case + fichero de estado",
    "xp": 50,
    "difficulty": 4,
    "brief": "estado.txt indica el MODO activo. caja.sh sabe contestar con la rama adecuada… si le pasas el modo correcto como argumento.",
    "goal": "Lee /home/agent/estado.txt e invoca /home/agent/caja.sh con ese modo. Caja.sh imprimirá la ficha del modo correcto (una de ellas lleva la marca).",
    "keywords": [
      "case",
      "estado",
      "sustitución"
    ],
    "hints": [
      "Primero lee el estado: cat estado.txt.",
      "Luego invoca caja.sh con ese valor como $1.",
      "bash caja.sh \"$(cat estado.txt)\""
    ],
    "cheatsheet": [
      {
        "cmd": "script \"$(cat f)\"",
        "desc": "argumento leído de fichero"
      },
      {
        "cmd": "cat estado.txt",
        "desc": "primero mira el estado"
      }
    ],
    "teach": "Combinar $(…) dentro de los argumentos es la forma de pasarle a un script dinámicas reales: la salida de un comando (estado) alimenta el siguiente (caja). así viven los scripts de un administrador.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "ficha fantasma: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "bash /home/agent/caja.sh \"$(cat /home/agent/estado.txt)\"",
        "cmds": [
          {
            "cmd": "bash",
            "args": "/home/agent/caja.sh $(cat /home/agent/estado.txt)",
            "why": "ejecuta un script/cadena con bash",
            "flags": []
          }
        ]
      }
    ],
    "raw": "bash /home/agent/caja.sh \"$(cat /home/agent/estado.txt)\""
  },
  {
    "id": "scripting-l13",
    "track": "scripting",
    "index": 13,
    "title": "Índice triangular",
    "subtitle": "arrays de bash",
    "xp": 45,
    "difficulty": 3,
    "brief": "El monstruo de ~/almenas ordena sus marcas por posición: la del índice 2 (el tercero de la lista ordenada) es la buena.",
    "goal": "Carga el contenido de /home/agent/almenas en un array ordenado y muestra el elemento de índice 2 con su contenido.",
    "keywords": [
      "arrays",
      "bash",
      "indice"
    ],
    "hints": [
      "Los arrays en bash empiezan en 0: arr[2] es el TERCER miembro de la lista.",
      "Con ls ordenado alfabético 1-alfa…4-delta, el tercero es 3-gamma.",
      "arr=($(ls /home/agent/almenas)); echo \"${arr[2]}\""
    ],
    "cheatsheet": [
      {
        "cmd": "arr=(a b c)",
        "desc": "constructor de array"
      },
      {
        "cmd": "\"${arr[2]}\"",
        "desc": "tercer elemento"
      }
    ],
    "teach": "Bash nace de Savoy arrays: arr=(...) crea, ${arr[0]} lee el PRIMER elemento y ${#arr[@]} cuenta. Los índices empiezan si en 0, y la expansión entre comillas evita split por espacios.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "3-gamma.txt\nmarca gamma: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "arr=($(ls /home/agent/almenas))",
        "cmds": [
          {
            "cmd": "arr=($(ls",
            "args": "/home/agent/almenas))",
            "why": "comando arr=($(ls — revisa «man arr=($(ls»",
            "flags": []
          }
        ]
      },
      {
        "raw": "echo \"${arr[2]}\"",
        "cmds": [
          {
            "cmd": "echo",
            "args": "${arr[2]}",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat \"/home/agent/almenas/${arr[2]}\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/almenas/${arr[2]}",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "arr=($(ls /home/agent/almenas)); echo \"${arr[2]}\"; cat \"/home/agent/almenas/${arr[2]}\""
  },
  {
    "id": "scripting-l14",
    "track": "scripting",
    "index": 14,
    "title": "Línea a línea",
    "subtitle": "while read en un bucle",
    "xp": 45,
    "difficulty": 3,
    "brief": "El manifiesto lista exactamente UNA ruta \"es bueno\". Con un while read línea a línea puedes inspeccionar cada fichero sin recorrer a mano.",
    "goal": "Recorre /home/agent/manifiesto.txt con while read y muesta la primera ficha cuyo contenido menciona la marca.",
    "keywords": [
      "while",
      "read",
      "bucle"
    ],
    "hints": [
      "while read -r línea lee un fichero línea a línea con redirección < fichero.",
      "La condición de grep -q: si uno matchea, imprime la marca y break detiene el bucle.",
      "while read -r f; do grep -oE 'FLAG\\{[a-f0-9]+\\}' \"$f\" && break; done < manifiesto.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "while read -r f; do …; done < f",
        "desc": "línea a línea"
      },
      {
        "cmd": "grep -q patrón f",
        "desc": "silencioso para ifs"
      }
    ],
    "teach": "while read -r es EL bucle de líneas en bash (xargs -I es el primo). La -r cuesta nada y evita que el backslash se coma los datos. Con < fichero al final, el bucle lee del fichero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "while read -r f",
        "cmds": [
          {
            "cmd": "while",
            "args": "read -r f",
            "why": "comando while — revisa «man while»",
            "flags": [
              {
                "flag": "-r",
                "meaning": "flag r del comando — revisa «man while»"
              }
            ]
          }
        ]
      },
      {
        "raw": "do if grep -qE 'FLAG\\{[a-f0-9]+\\}' \"$f\" 2>/dev/null",
        "cmds": [
          {
            "cmd": "do",
            "args": "if grep -qE FLAG\\{[a-f0-9]+\\} $f 2>/dev/null",
            "why": "comando do — revisa «man do»",
            "flags": [
              {
                "flag": "-q",
                "meaning": "flag q del comando — revisa «man do»"
              }
            ]
          }
        ]
      },
      {
        "raw": "then grep -oE 'FLAG\\{[a-f0-9]+\\}' \"$f\"",
        "cmds": [
          {
            "cmd": "then",
            "args": "grep -oE FLAG\\{[a-f0-9]+\\} $f",
            "why": "comando then — revisa «man then»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man then»"
              }
            ]
          }
        ]
      },
      {
        "raw": "break",
        "cmds": [
          {
            "cmd": "break",
            "args": "",
            "why": "comando break — revisa «man break»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi",
        "cmds": [
          {
            "cmd": "fi",
            "args": "",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      },
      {
        "raw": "done < /home/agent/manifiesto.txt",
        "cmds": [
          {
            "cmd": "done",
            "args": "< /home/agent/manifiesto.txt",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "while read -r f; do if grep -qE 'FLAG\\{[a-f0-9]+\\}' \"$f\" 2>/dev/null; then grep -oE 'FLAG\\{[a-f0-9]+\\}' \"$f\"; break; fi; done < /home/agent/manifiesto.txt"
  },
  {
    "id": "scripting-l15",
    "track": "scripting",
    "index": 15,
    "title": "La taquilla numérica",
    "subtitle": "aritmética $(( ))",
    "xp": 45,
    "difficulty": 3,
    "brief": "Dos ficheros de la taquilla, dos números. La SUMA de ambos es el número de la celda que guarda la pieza.",
    "goal": "Suma el contenido de a.num y b.num de /home/agent/taquilla y muestra la celda ~/taquilla/N.txt que sea el resultado.",
    "keywords": [
      "aritmetica",
      "contar",
      "bash"
    ],
    "hints": [
      "$((expr)) hace matemáticas en bash (y no creche chamuscados).",
      "La celda correcta se llama con el RESULTADO de la suma.",
      "cat \"$((a+b))\""
    ],
    "cheatsheet": [
      {
        "cmd": "echo $((3*7))",
        "desc": "21"
      },
      {
        "cmd": "s=$((s+1))",
        "desc": "contador"
      }
    ],
    "teach": "La aritmética de bash es nativa con $(( )): no necesitas expr ni bc para enteras (bc sí para decimales). Asignaciones también van dentro: s=$((s+1)).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "celda acertada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "a=$(cat /home/agent/taquilla/a.num)",
        "cmds": [
          {
            "cmd": "a=$(cat",
            "args": "/home/agent/taquilla/a.num)",
            "why": "comando a=$(cat — revisa «man a=$(cat»",
            "flags": []
          }
        ]
      },
      {
        "raw": "b=$(cat /home/agent/taquilla/b.num)",
        "cmds": [
          {
            "cmd": "b=$(cat",
            "args": "/home/agent/taquilla/b.num)",
            "why": "comando b=$(cat — revisa «man b=$(cat»",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat \"/home/agent/taquilla/$((a+b)).txt\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/taquilla/$((a+b)).txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "a=$(cat /home/agent/taquilla/a.num); b=$(cat /home/agent/taquilla/b.num); cat \"/home/agent/taquilla/$((a+b)).txt\""
  },
  {
    "id": "scripting-l16",
    "track": "scripting",
    "index": 16,
    "title": "Dos mitades, un todo",
    "subtitle": "paste -d'' + printf",
    "xp": 45,
    "difficulty": 3,
    "brief": "La marca está partida: la mitad izquierda en parteA.txt, la derecha en parteB.txt. Sin espacios entre ellas, el todo ES la marca.",
    "goal": "Concatena la primera línea de ambas partes (paste sin delimitador) y muéstrala como una sola cadena.",
    "keywords": [
      "paste",
      "concatenar",
      "printf"
    ],
    "hints": [
      "cat A B concatena: la línea de la 1ª parte y la de la 2ª.",
      "tr -d '\\n' quita los saltos de línea: las dos mitades quedan pegadas.",
      "cat parteA.txt parteB.txt | tr -d '\\n'"
    ],
    "cheatsheet": [
      {
        "cmd": "cat a b | tr -d '\\n'",
        "desc": "pegar sin saltos"
      },
      {
        "cmd": "paste a b",
        "desc": "unidos con TAB"
      }
    ],
    "teach": "cat une ficheros y tr -d '\\n' elimina los saltos: el pegado de mitades sin herramientas sofisticadas. (GNU paste con delimitador vacío es quisquilloso: queda como dato curioso.)",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/parteA.txt /home/agent/parteB.txt | tr -d '\\n'",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/parteA.txt /home/agent/parteB.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "tr",
            "args": "-d \\n",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "elimina los caracteres del conjunto dado"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat /home/agent/parteA.txt /home/agent/parteB.txt | tr -d '\\n'"
  },
  {
    "id": "scripting-l17",
    "track": "scripting",
    "index": 17,
    "title": "El invocador",
    "subtitle": "expansiones ${var^^} y ${var:0:n}",
    "xp": 45,
    "difficulty": 3,
    "brief": "La pista fichada llegó en minúsculas: la expansión de parámetros la arregla en el propio shell, con MAYÚSCULAS y sin sed.",
    "goal": "Pon en MAYÚSCULAS el contenido de /home/agent/id_doc.txt y muéstralo (expansión ${v^^}).",
    "keywords": [
      "expansion",
      "bash",
      "mayusculas"
    ],
    "hints": [
      "Extracto el trozo y arregla solo el prefijo: ${v/flag/FLAG} cambia 'flag' por 'FLAG' sin tocar el resto.",
      "Extrae primero la forma en minúscula con grep -oE (y la -i).",
      "v=$(grep -ioE 'flag\\{[a-f0-9]+\\}' f); echo \"${v/flag/FLAG}\""
    ],
    "cheatsheet": [
      {
        "cmd": "echo \"${v^^}\"",
        "desc": "MAYÚSCULAS"
      },
      {
        "cmd": "echo \"${v:0:5}\"",
        "desc": "primeros 5"
      }
    ],
    "teach": "Las expansiones de parámetros son el \"pozo\" de bash: ${v^^} (MAYÚSCULAS), ${v:0:5} (substring), ${v%.txt} (quitar sufijo). Sin sed ni tr manipulas cadenas en la misma línea.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "v=$(grep -ioE 'flag\\{[a-f0-9]+\\}' /home/agent/id_doc.txt | head -n1)",
        "cmds": [
          {
            "cmd": "v=$(grep",
            "args": "-ioE flag\\{[a-f0-9]+\\} /home/agent/id_doc.txt",
            "why": "comando v=$(grep — revisa «man v=$(grep»",
            "flags": [
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man v=$(grep»"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man v=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "echo \"${v/flag/FLAG}\"",
        "cmds": [
          {
            "cmd": "echo",
            "args": "${v/flag/FLAG}",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "v=$(grep -ioE 'flag\\{[a-f0-9]+\\}' /home/agent/id_doc.txt | head -n1); echo \"${v/flag/FLAG}\""
  },
  {
    "id": "scripting-l18",
    "track": "scripting",
    "index": 18,
    "title": "La cadena de pasos",
    "subtitle": "&&, || y códigos de salida",
    "xp": 50,
    "difficulty": 3,
    "brief": "Los pasos corren en orden: solo si el paso1 pasa (exit 0), el paso2 corre y entrega la pieza; si no, el ruido.",
    "goal": "Ejecuta en cadena: si /home/agent/paso1.sh pasa, corre paso2.sh y muestra la marca querena escrita en /tmp/corredor.txt.",
    "keywords": [
      "exit",
      "cadena",
      "codigos"
    ],
    "hints": [
      "cmd1 && cmd2 ejecuta cmd2 solo si cmd1 salió con 0.",
      "A la inversa, || corre SOLO si el anterior falla.",
      "paso1.sh && paso2.sh && cat /tmp/corredor.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "cmd1 && cmd2",
        "desc": "si pasa, si no, no"
      },
      {
        "cmd": "cmd1 || cmd2",
        "desc": "si falla, el plan B"
      }
    ],
    "teach": "&& y || son los \"and / or\" de comandos encasquetados: exit 0 = TRUE, resto = FALSE. La cadena cmd1 && cmd2 && cmd3 es un flujo de puerta: falla al primero, para. Escondido en todos los CI.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "corredor en su muelle: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "/home/agent/paso1.sh",
        "cmds": [
          {
            "cmd": "/home/agent/paso1.sh",
            "args": "",
            "why": "comando /home/agent/paso1.sh — revisa «man /home/agent/paso1.sh»",
            "flags": []
          }
        ]
      },
      {
        "raw": "/home/agent/paso2.sh",
        "cmds": [
          {
            "cmd": "/home/agent/paso2.sh",
            "args": "",
            "why": "comando /home/agent/paso2.sh — revisa «man /home/agent/paso2.sh»",
            "flags": []
          }
        ]
      },
      {
        "raw": "cat /tmp/corredor.txt",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/tmp/corredor.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "/home/agent/paso1.sh && /home/agent/paso2.sh && cat /tmp/corredor.txt"
  },
  {
    "id": "scripting-l19",
    "track": "scripting",
    "index": 19,
    "title": "El caso del argumento",
    "subtitle": "case + $1 en un script",
    "xp": 60,
    "difficulty": 4,
    "brief": "> El conserje ha dejado un script \"caja.sh\" en tu home. Se maneja con > una ÚNICA palabra-clave como argumento; si la aciertas, la caja > suelta el contrabando. Míralo primero: con head verás el case y qué > palabra espera.",
    "goal": "Lee ~/caja.sh para descubrir el argumento que acepta y ejecútalo con la palabra correcta para que imprima la flag.",
    "keywords": [
      "case",
      "$1,",
      "bash"
    ],
    "hints": [
      "En un script, $1 es su primer argumento: caja.sh palabra",
      "case \"$1\" in patrón) comando;; esac elige por coincidencia.",
      "head ~/caja.sh te muestra qué patrón imprime la flag."
    ],
    "cheatsheet": [
      {
        "cmd": "case \"$1\" in … esac",
        "desc": "elige una rama según el primer argumento"
      },
      {
        "cmd": "$1, $2, $#",
        "desc": "argumentos y número de argumentos"
      },
      {
        "cmd": "bash script.sh arg",
        "desc": "ejecuta un script con argumento"
      }
    ],
    "teach": "Los scripts reciben argumentos por posición: $1 es el primero. case los compara con patrones:\n\n    case \"$1\" in\n      desbloquear) echo \"...\" ;;\n      *) echo \"uso: caja.sh desconocido\" ;;\n    esac\n\nprocedimiento: mira el script (head ~/caja.sh), detecta qué palabra encaja con la rama que imprime la flag, y ejecuta:\n\n    bash ~/caja.sh desbloquear",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "#!/bin/bash\ncase \"$1\" in\n  desbloquear)\n    echo \"FLAG{d3b09a4f7c2e1b8d6041a5f3}\"\n    ;;\n  *)\n    echo \"uso: caja.sh <palabra>\" >&2\n    exit 1\n    ;;\nesac\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "head ~/caja.sh",
        "cmds": [
          {
            "cmd": "head",
            "args": "~/caja.sh",
            "why": "imprime el principio de un fichero/flujo",
            "flags": []
          }
        ]
      },
      {
        "raw": "bash ~/caja.sh desbloquear",
        "cmds": [
          {
            "cmd": "bash",
            "args": "~/caja.sh desbloquear",
            "why": "ejecuta un script/cadena con bash",
            "flags": []
          }
        ]
      }
    ],
    "raw": "head ~/caja.sh; bash ~/caja.sh desbloquear"
  },
  {
    "id": "scripting-l20",
    "track": "scripting",
    "index": 20,
    "title": "El bucle de la tropa",
    "subtitle": "for + globbing",
    "xp": 60,
    "difficulty": 4,
    "brief": "> El sargento repartió la contrapartida entre la tropa: fragmentos > pequeños en ~/tropa/*.txt. Ninguno lleva la flag entera. Para > recomponer el mensaje hay que UNIR todos los fragmentos: el bucle for > con tilde-glob es la herramienta del sargento.",
    "goal": "Concatena en orden TODOS los ficheros ~/tropa/*.txt (usa for f in … con cat \"$f\") y muestra el mensaje completo con la flag.",
    "keywords": [
      "for",
      ".txt"
    ],
    "hints": [
      "for f in ~/tropa/*.txt; do … done itera los ficheros del patrón.",
      "cat \"$f\" imprime cada fichero: al concatenar todos sale el mensaje.",
      "El globbing (*.txt) se expande en orden alfabético."
    ],
    "cheatsheet": [
      {
        "cmd": "for f in FILES; do …; done",
        "desc": "bucle sobre un patrón de ficheros"
      },
      {
        "cmd": "*.txt",
        "desc": "globbing: se expande a la lista ordenada"
      }
    ],
    "teach": "Un for con glob recorre ficheros:\n\n    for f in ~/tropa/*.txt; do\n      cat \"$f\"\n    done\n\nCada iteración imprime un fragmento; en conjunto la flag completa queda reconstruida (y ordenada, porque el globbing ordena alfabéticamente).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}fin de la contrapartida"
      }
    ],
    "steps": [
      {
        "raw": "for f in ~/tropa/*.txt",
        "cmds": [
          {
            "cmd": "for",
            "args": "f in ~/tropa/*.txt",
            "why": "comando for — revisa «man for»",
            "flags": []
          }
        ]
      },
      {
        "raw": "do cat \"$f\"",
        "cmds": [
          {
            "cmd": "do",
            "args": "cat $f",
            "why": "comando do — revisa «man do»",
            "flags": []
          }
        ]
      },
      {
        "raw": "done",
        "cmds": [
          {
            "cmd": "done",
            "args": "",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      },
      {
        "raw": "echo",
        "cmds": [
          {
            "cmd": "echo",
            "args": "",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "for f in ~/tropa/*.txt; do cat \"$f\"; done; echo"
  },
  {
    "id": "forense-l1",
    "track": "forense",
    "index": 0,
    "title": "Analista de acceso",
    "subtitle": "auth.log con ruido de fuerza bruta",
    "xp": 60,
    "difficulty": 3,
    "brief": "Un ataque de fuerza bruta llenó el auth.log de fallos. Entre ellos hay UNA entrada de \"Nivel 2 autenticado\" con la sesión del intruso: su contraseña quedó registrada.",
    "goal": "En /var/log/auth-dojo.log, solo UNA línea es de acceso CONCEDIDO (todas las demás son passwords de fallo). Filtra esa línea y recupera la contraseña del intruso.",
    "keywords": [
      "grep",
      "logs"
    ],
    "hints": [
      "grep -v 'pifia' /var/log/auth-dojo.log descarta todo lo que no sea éxito.",
      "Alternativa: grep 'granted' /var/log/auth-dojo.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep patrón log",
        "desc": "deja solo líneas que casan"
      },
      {
        "cmd": "grep -v patrón log",
        "desc": "descarta líneas que casan"
      },
      {
        "cmd": "grep -c patrón log",
        "desc": "cuenta las coincidencias"
      }
    ],
    "teach": "En logs de autenticación lo que importa es separar fallos de éxitos: `grep -v` descarta (la forma amortiguada) y `grep texto` localiza el patrón de interés — aquí la línea de sesión concedida. Con `grep -c` entenderás el volumen de la fuerza bruta.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "(auth okay) Session granted: user=ghost passwd=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -v pifia /var/log/auth-dojo.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-v pifia /var/log/auth-dojo.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -v pifia /var/log/auth-dojo.log"
  },
  {
    "id": "forense-l2",
    "track": "forense",
    "index": 0,
    "title": "Mensaje interceptado",
    "subtitle": "base64 -d",
    "xp": 60,
    "difficulty": 3,
    "brief": "La interceptación de tráfico (de ficción, de laboratorio) pilló un mensaje codificado. Base64 es la basilica de los encodings: los operadores la decodifican en un suspiro.",
    "goal": "En /var/dojo/interceptado.b64 hay un mensaje en base64. Decodilo y muestrame su contenido — dentro va la flag.",
    "keywords": [
      "base64"
    ],
    "hints": [
      "La 2ª línea del fichero es el bloque base64: decodifica con base64 -d.",
      "tail -1 fichero | base64 -d — pero asegúrate de apuntar a la línea correcta."
    ],
    "cheatsheet": [
      {
        "cmd": "base64 fichero",
        "desc": "codifica"
      },
      {
        "cmd": "base64 -d fichero",
        "desc": "decodifica"
      },
      {
        "cmd": "base64 -w0",
        "desc": "sin saltos de línea al codificar"
      }
    ],
    "teach": "El base64 convierte binario en texto (4 chars por 3 bytes) — por eso sale de sigilos en mails y logs. `base64 fichero` codifica; `base64 -d fichero` descodifica. En pipes: `cmd | base64 -d`.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "contraseña confidencial: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tail -1 /var/dojo/interceptado.b64 | base64 -d",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-1 /var/dojo/interceptado.b64",
            "why": "imprime el final de un fichero/flujo",
            "flags": []
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tail -1 /var/dojo/interceptado.b64 | base64 -d"
  },
  {
    "id": "forense-l3",
    "track": "forense",
    "index": 0,
    "title": "Basura con joyas",
    "subtitle": "hexdump y grep binario",
    "xp": 65,
    "difficulty": 3,
    "brief": "Un binario correcto con basura de bytes lejos ocupa casi 2.000 bytes y las herramientas de texto se tragan la mayor parte. La flag está incrustada en texto plano en algún byte.",
    "goal": "En /var/dojo/core-dump existe un dump con bytes raros; en algún hueco placa textual está FLAG{...}. Recuperala: puedes con xxd (hexdump) + grep, o con grep -a (aclara: grep trata el fichero como texto plano).",
    "keywords": [
      "grep-a",
      "xxd"
    ],
    "hints": [
      "grep -a 'FLAG{' /var/dojo/core-dump — el -a fuerza modo texto.",
      "xxd fichero | grep 'FLAG{' también funciona (con cuidado con bytes raros)."
    ],
    "cheatsheet": [
      {
        "cmd": "grep -a patrón fichero",
        "desc": "grep en binarios como texto"
      },
      {
        "cmd": "xxd fichero",
        "desc": "volcado hexadecimal"
      },
      {
        "cmd": "xxd -r -p",
        "desc": "hex/plain → binario"
      }
    ],
    "teach": "`grep` por defecto se niega a procesar el binario; `-a` (text-jump) fuerza la lectura texto. `xxd` vuelca hexadecimal para el análisis forense clásico. Si tu herramienta falla con bytes raros, reduce a octetos con `xxd -r -p` (reconstruye el binario del hex).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "La joya escondida: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -a 'FLAG{' /var/dojo/core-dump",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-a FLAG{ /var/dojo/core-dump",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man grep»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -a 'FLAG{' /var/dojo/core-dump"
  },
  {
    "id": "forense-l4",
    "track": "forense",
    "index": 0,
    "title": "Cifrada a manopla",
    "subtitle": "rot13 vía tr",
    "xp": 65,
    "difficulty": 3,
    "brief": "El agente paranoico cifró su nota con rot13: cada letra avanzó 13 posiciones del alfabeto (si pasaba la Z, volvía por la A). tr es la herramienta del descifrador artesanal.",
    "goal": "En /var/dojo/rot13.txt está la nota cifrada. Descífrala con tr y muestra la flag resultante.",
    "keywords": [
      "tr",
      "rot13"
    ],
    "hints": [
      "tr \"A-Z a-z\" \"N-Z A-M n-z a-m\" es el mapa rot13 (con los espacios del conjunto).",
      "El secreto está al principio de la línea."
    ],
    "cheatsheet": [
      {
        "cmd": "tr 'a-z' 'A-Z'",
        "desc": "mayusculiza"
      },
      {
        "cmd": "tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "desc": "rot13"
      }
    ],
    "teach": "`tr` traduce entre DOS conjuntos del mismo tamaño: cada byte del primero se cambia por su par. El clásico rot13: 'A-Za-z' → 'N-ZA-Mn-za-m'. El cifrado César/rot13 se decodifica aplicand PROPIO tr de nuevo (es su inversa).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3} erfgb qr yn abgn: svezn qry zrafnwr ra póqvtb Péfne 13."
      }
    ],
    "steps": [
      {
        "raw": "cat /var/dojo/rot13.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/var/dojo/rot13.txt",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "tr",
            "args": "A-Za-z N-ZA-Mn-za-m",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "cat /var/dojo/rot13.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
  },
  {
    "id": "forense-l5",
    "track": "forense",
    "index": 0,
    "title": "Triple embalaje",
    "subtitle": "boss — base64 → gzip → flag",
    "xp": 85,
    "difficulty": 4,
    "brief": "Un paquete de exfiltración pasó por DOS capas: primero gzip, después base64 (así su \"ruido\" se mete en logs de texto). Dos herramientas encadenadas por pipe dan con la carga útil.",
    "goal": "En /var/dojo/exfiltrado.log hay una línea con datos base64. Decodifica y descomprime para recuperar el mensaje original — dentro está la flag.",
    "keywords": [
      "base64",
      "gzip",
      "boss"
    ],
    "hints": [
      "El orden de desembalaje es el inverso: primero base64 -d, después gzip -d / zcat.",
      "tail -1 /var/dojo/exfiltrado.log | base64 -d | zcat"
    ],
    "cheatsheet": [
      {
        "cmd": "cmd | base64 -d | zcat",
        "desc": "desembalaje por capas"
      },
      {
        "cmd": "zcat fichero.gz",
        "desc": "descomprime a stdout"
      }
    ],
    "teach": "Las capas se deshacen en orden inverso al de embalaje: `base64 -d` te da el flujo gzip, y `zcat` (uo `gunzip -c`) el contenido. La disciplina UNIX de pipelines hace trivial encadenar 2, 3 o más transformaciones.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "el tesoro: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tail -1 /var/dojo/exfiltrado.log | base64 -d | zcat",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-1 /var/dojo/exfiltrado.log",
            "why": "imprime el final de un fichero/flujo",
            "flags": []
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          },
          {
            "cmd": "zcat",
            "args": "",
            "why": "comando zcat — revisa «man zcat»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "tail -1 /var/dojo/exfiltrado.log | base64 -d | zcat"
  },
  {
    "id": "forense-l6",
    "track": "forense",
    "index": 6,
    "title": "Caza en el binario",
    "subtitle": "grep -a: buscar texto dentro de bytes",
    "xp": 40,
    "difficulty": 3,
    "brief": "blob.bin es un fichero binario (basura aleatoria). Entre los bytes, la cadena de la marca sobrevive.",
    "goal": "Extrae TODAS las ocurrencias de la marca (patrón FLAG{...}) dentro del binario /home/agent/blob.bin.",
    "keywords": [
      "grep -a",
      "binario",
      "strings"
    ],
    "hints": [
      "grep sin -a te dirá Binary file matches: -a proporciona el modo texto.",
      "-o imprime solo el trozo casado, muy útil en binarios.",
      "grep -a -oE 'FLAG\\{[^}]*\\}' blob.bin"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -a -oE 'x' f.bin",
        "desc": "extrae cadenas de un binario"
      },
      {
        "cmd": "xxd f | head",
        "desc": "mira los bytes crudos"
      }
    ],
    "teach": "grep -a trata los ficheros binarios como texto (binary→text). La pareja -a -o es el kit forense para extraer cadenas sin instolar strings:",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -a -oE 'FLAG\\{[^}]*\\}' /home/agent/blob.bin",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-a -oE FLAG\\{[^}]*\\} /home/agent/blob.bin",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man grep»"
              },
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -a -oE 'FLAG\\{[^}]*\\}' /home/agent/blob.bin"
  },
  {
    "id": "forense-l7",
    "track": "forense",
    "index": 7,
    "title": "Mensaje blindado en b64",
    "subtitle": "base64 -d: decodificar",
    "xp": 40,
    "difficulty": 2,
    "brief": "adjunto.b64 es texto base64: un formato clásico de correo para eludir filtros. Decodifícalo en el flujo para recuperar el origen.",
    "goal": "Decodifica /home/agent/adjunto.b64 y muestra el mensaje original (que trae la marca).",
    "keywords": [
      "base64",
      "codificar",
      "decodificar"
    ],
    "hints": [
      "base64 -d decodifica en el flujo (stdout).",
      "También puedes cat fichero | base64 -d si prefieres.",
      "base64 -d adjunto.b64"
    ],
    "cheatsheet": [
      {
        "cmd": "base64 -d f",
        "desc": "decodifica"
      },
      {
        "cmd": "base64 -w0 f",
        "desc": "codifica en una línea"
      }
    ],
    "teach": "base64 codifica a 64 caracteres binarios seguros; -d deshace. Appears en logs, adjuntos, tokens JWT (la parte media) y exfiltraciones: reconocerla es obligatorio en forense.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "adjunto normal: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "base64 -d /home/agent/adjunto.b64",
        "cmds": [
          {
            "cmd": "base64",
            "args": "-d /home/agent/adjunto.b64",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "base64 -d /home/agent/adjunto.b64"
  },
  {
    "id": "forense-l8",
    "track": "forense",
    "index": 8,
    "title": "Volcado hexadecimal",
    "subtitle": "xxd -r: reconstruir del hex",
    "xp": 45,
    "difficulty": 3,
    "brief": "volcado.hex proviene de un volcado xxd del fichero original. Los bytes están ahí, solo hay que re-ensamblar.",
    "goal": "Reconstruye /home/agent/volcado.hex con xxd -r y muestra el texto original (que contiene la marca).",
    "keywords": [
      "xxd",
      "hex",
      "reversa"
    ],
    "hints": [
      "xxd muestra bytes en hex; la opción -r hace la máscara inversa.",
      "La salida vuelve al stdout: puedes encadenerla con grep.",
      "xxd -r volcado.hex"
    ],
    "cheatsheet": [
      {
        "cmd": "xxd -r f.hex",
        "desc": "hex → bytes"
      },
      {
        "cmd": "xxd f",
        "desc": "bytes → hex"
      }
    ],
    "teach": "xxd -r revierte un volcado hex a bytes: la forensic reconstrucción de ficheros que ya no existen. Grabar claves hexa es exactamente lo mismo que las marcas hexa frecuentes en el foro.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "volcado real de la sala: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "xxd -r /home/agent/volcado.hex",
        "cmds": [
          {
            "cmd": "xxd",
            "args": "-r /home/agent/volcado.hex",
            "why": "volcado hexadecimal de un fichero (byte a byte con representación ASCII la derecha)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "revertir: de hexadecimal de vuelta a bytes"
              }
            ]
          }
        ]
      }
    ],
    "raw": "xxd -r /home/agent/volcado.hex"
  },
  {
    "id": "forense-l9",
    "track": "forense",
    "index": 9,
    "title": "Cifrado por desplazamiento",
    "subtitle": "tr con abecedario rotado (césar +7)",
    "xp": 50,
    "difficulty": 3,
    "brief": "El mensaje de cifrado.txt está levantado con un desplazamiento CÉSAR de +7 en las letras (los dígitos y la puntuación intactos). Le recuperación es aplicar desplazamiento INVERSERTE.",
    "goal": "Recupera el texto original de /home/agent/cifrado.txt aplicando el desplazamiento inverso (las letras vuelven a su sitio).",
    "keywords": [
      "tr",
      "cifrado",
      "césar",
      "rotación"
    ],
    "hints": [
      "El cifrado avanzó las letras +7 posiciones: recupera restándole 7 (o sumando 19).",
      "tr set1 set2 mapea letra a letra: puedes definir TU propio abecedario destino.",
      "tr 'A-Za-z' 'tuvwxyz…' < cifrado.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "tr 'a-z' 'n-za-m'",
        "desc": "rot13 (desplaza 13)"
      },
      {
        "cmd": "tr 'A-Za-z' 'H-Za-g…' f",
        "desc": "cifra con desplazamiento +7"
      }
    ],
    "teach": "tr es el cifrado césar sencillo: defines el abecedario destino rotado. Para descifrar, aplica el desplazamiento COMPLEMENTARIO (para +7, es +19 sobre 26 letras).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "mensagem cifrada con cesar: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tr 'A-Za-z' 'tuvwxyzabcdefghijklmnopqrsTUVWXYZABCDEFGHIJKLMNOPQRS' < /home/agent/cifrado.txt",
        "cmds": [
          {
            "cmd": "tr",
            "args": "A-Za-z tuvwxyzabcdefghijklmnopqrsTUVWXYZABCDEFGHIJKLMNOPQRS < /home/agent/cifrado.txt",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "tr 'A-Za-z' 'tuvwxyzabcdefghijklmnopqrsTUVWXYZABCDEFGHIJKLMNOPQRS' < /home/agent/cifrado.txt"
  },
  {
    "id": "forense-l10",
    "track": "forense",
    "index": 10,
    "title": "El intruso en el log",
    "subtitle": "grep en sucesos.log",
    "xp": 45,
    "difficulty": 3,
    "brief": "un caso: en sucesos.log se registra un \"intruso\" con su clave entre colegas legales y ruido administrativo.",
    "goal": "Localiza en /home/agent/sucesos.log la línea del intruso y extrae de ella solo la FLAG que aparece.",
    "keywords": [
      "grep",
      "log",
      "intruso",
      "sucesos"
    ],
    "hints": [
      "Primero grep intruso sucesos.log para leer el contexto.",
      "Luego te queda SOLO la flag: grep -oE FLAG con la clase [^}]*",
      "grep intruso sucesos.log | grep -oE 'FLAG\\{[^}]*\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep 'actor' f | grep -oE 'x'",
        "desc": "actor + extraer"
      },
      {
        "cmd": "tail -n 20 sucesos.log",
        "desc": "últimos sucesos"
      }
    ],
    "teach": "La revisión de logs con grep en dos fases: primero identifica al actor sospechoso, después extrae el trozo exacto con la clase [^}]*. Leer primero y extraer después reduce el ruido a cero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE 'FLAG\\{[^}]*\\}' /home/agent/sucesos.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\} /home/agent/sucesos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -oE 'FLAG\\{[^}]*\\}' /home/agent/sucesos.log"
  },
  {
    "id": "forense-l11",
    "track": "forense",
    "index": 11,
    "title": "Cola del exfiltrado",
    "subtitle": "tail -c: los últimos bytes de un binario",
    "xp": 45,
    "difficulty": 3,
    "brief": "cargo.bin es un binario de exportación (relleno a decenas de KB). La exfiltración anexó la marca justo al final del fichero.",
    "goal": "Muestra los últimos 90 bytes de /home/agent/cargo.bin para recoger la marca anexada.",
    "keywords": [
      "tail -c",
      "bytes",
      "exfiltración"
    ],
    "hints": [
      "tail -c N imprime los últimos N BYTES (no líneas).",
      "El relleno binario puede romper la pantalla: -c es la forma acotada de mirar.",
      "tail -c 90 cargo.bin"
    ],
    "cheatsheet": [
      {
        "cmd": "tail -c 100 f",
        "desc": "últimos 100 bytes"
      },
      {
        "cmd": "head -c 100 f",
        "desc": "primeros 100 bytes"
      }
    ],
    "teach": "El patrón «relleno + carga útil al final» es una técnica de steganografía trivial: los ficheros siguen siendo válidos pero la cola lleva secretos. tail -c es el bisturí.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "��=v\u0013�W쮥T��\\\rھM���\\\u0011>T�C4��\r\u001b>�ʠb�\bq\nmarca exfiltrada: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tail -c 90 /home/agent/cargo.bin",
        "cmds": [
          {
            "cmd": "tail",
            "args": "-c 90 /home/agent/cargo.bin",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man tail»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tail -c 90 /home/agent/cargo.bin"
  },
  {
    "id": "forense-l12",
    "track": "forense",
    "index": 12,
    "title": "Señuelos y la marca pura",
    "subtitle": "regex que discrimina falsos vestigios",
    "xp": 55,
    "difficulty": 4,
    "brief": "rastro.txt está sembrado de FAKE {FLAG{decoy-XX}} para no permitir los filtros: la marca REAL es la única de 24 caracteres hexadecimales MAYUSCULASNO dentro.",
    "goal": "Extrae de /home/agent/rastro.txt únicamente la marca real (24 hex lowercase) descartando los señuelos.",
    "keywords": [
      "regex",
      "decoy",
      "cuantificador"
    ],
    "hints": [
      "Los señuelos llevan letras y guiones: la clase [0-9a-f] NO casa guiones.",
      "El cuantificador {24} exige EXACTAMENTE 24 caracteres.",
      "grep -oE 'FLAG\\{[0-9a-f]{24}\\}' rastro.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE 'p\\{24\\}' f",
        "desc": "cuantificador exacto"
      },
      {
        "cmd": "grep -c 'decoy' f",
        "desc": "cuenta los señuelos"
      }
    ],
    "teach": "Las regex con clases y cuantificadores EXACTOS ({24}, [0-9a-f]) son cómo se descarta la basura: el patrón codifica la estructura REAL de lo legítimo. Arma afilada contra los señuelos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE 'FLAG\\{[0-9a-f]{24}\\}' /home/agent/rastro.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[0-9a-f]{24}\\} /home/agent/rastro.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -oE 'FLAG\\{[0-9a-f]{24}\\}' /home/agent/rastro.txt"
  },
  {
    "id": "forense-l13",
    "track": "forense",
    "index": 13,
    "title": "Hexdump invertido",
    "subtitle": "xxd -r: reconstituir desde hex",
    "xp": 45,
    "difficulty": 3,
    "brief": "volcado.hex guarda la pieza como volcado hexadecimal. xxd -r es su inverso EXACTO.",
    "goal": "Reconstruye /home/agent/volcado.hex con xxd -r y muestra la marca.",
    "keywords": [
      "xxd",
      "hex",
      "reverso"
    ],
    "hints": [
      "xxd fichero produce el volcado hex; xxd -r fichero.hex hace lo inverso: bytes desde hex.",
      "La marea de texto uxxd lleva offsets y ASCII: -r reconstruye SOLO desde la columna hex.",
      "xxd -r /home/agent/volcado.hex | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "xxd f | head",
        "desc": "volcado hex"
      },
      {
        "cmd": "xxd -r f.hex",
        "desc": "hex → bytes"
      }
    ],
    "teach": "xxd y xxd -r son par par (hex ↔ bytes). Es la forma de desempacar trozos binarios que solo existen como texto en otra capa (datos de un log, chat…).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "xxd -r /home/agent/volcado.hex | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "xxd",
            "args": "-r /home/agent/volcado.hex",
            "why": "volcado hexadecimal de un fichero (byte a byte con representación ASCII la derecha)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "revertir: de hexadecimal de vuelta a bytes"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "xxd -r /home/agent/volcado.hex | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "forense-l14",
    "track": "forense",
    "index": 14,
    "title": "strings reveladoras",
    "subtitle": "binario con texto enterrado",
    "xp": 45,
    "difficulty": 3,
    "brief": "mechero.bin es un binario auténtico con los stamp de la marca enterreado entre bytes que no son texto.",
    "goal": "Extrae con strings las cadenas legibles de /home/agent/mechero.bin y pescar la marca.",
    "keywords": [
      "strings",
      "binario",
      "forense"
    ],
    "hints": [
      "tr -c '[:print:]' '\\n' sustituye todo lo NO imprimible por saltos de línea: deja solo el texto limpio.",
      "Después, grep -oE con la forma de la marca saca el hallazgo.",
      "tr -c '[:print:]' '\\n' < f.bin | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "tr -c '[:print:]' '\\n' < f.bin",
        "desc": "solo el texto imprimible"
      },
      {
        "cmd": "strings -n 4 f.bin",
        "desc": "mínimo 4 chars"
      }
    ],
    "teach": "En binarios con NUL y bytes raros hay que dest textar: tr -c [:print:] los limpia a saltos y el texto true resalta. (Si binutils está instalada, strings hace lo mismo: filtra \"lo que parece texto\".)",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat /home/agent/mechero.bin | tr -c '[:print:]\\n' '\\n' | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "cat",
            "args": "/home/agent/mechero.bin",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "tr",
            "args": "-c [:print:]\\n \\n",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man tr»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat /home/agent/mechero.bin | tr -c '[:print:]\\n' '\\n' | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "forense-l15",
    "track": "forense",
    "index": 15,
    "title": "El turno de las 09:42",
    "subtitle": "grep por marca horaria",
    "xp": 45,
    "difficulty": 3,
    "brief": "turno.log lista millones de líneas por HH:MM. Solo las del minuto 09:42 reportan el hallazgo.",
    "goal": "Filtra de /home/agent/turno.log solo las líneas de la hora 09:42 y extrae la marca.",
    "keywords": [
      "logs",
      "timestamp",
      "grep"
    ],
    "hints": [
      "El ancla ^ obliga a que el patrón esté al INICIO de línea (la marca horaria).",
      "grep \"^09:42\" fichero filtra el minuto; el segundo grep extrae la marca.",
      "grep '^09:42' f | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep '^09:42' f",
        "desc": "por hora al inicio"
      },
      {
        "cmd": "awk '$1==\"09:42\"' f",
        "desc": "por campo"
      }
    ],
    "teach": "Los logs estructurados se filtran mejor que se buscan: si la fecha es el primer campo, grep \"^HH:MM\" y awk $1==\"HH:MM\" son equivalentes. Elige el que dé menos falsos positivos en cada log.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep '^09:42' /home/agent/turno.log | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "^09:42 /home/agent/turno.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep '^09:42' /home/agent/turno.log | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "forense-l16",
    "track": "forense",
    "index": 16,
    "title": "Detalle sin débiles",
    "subtitle": "file + zcat: el compresor mudo",
    "xp": 45,
    "difficulty": 3,
    "brief": "algo_sin_nombre es un fichero sin extensión con PAPEL que contiene la pieza comprimida. file lo identifica.",
    "goal": "Identifica el tipo de /home/agent/algo_sin_nombre con file, y si es gzip muéstralo descomprimido (zcat) con su marca.",
    "keywords": [
      "file",
      "gzip",
      "forense"
    ],
    "hints": [
      "file fichero dice el tipo; \"gzip compressed data\" a la fuga la campana.",
      "zcat fichero imprime el contenido descomprimido al stdout, sin crear fichero.",
      "zcat /home/agent/algo_sin_nombre | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "file f",
        "desc": "clase real"
      },
      {
        "cmd": "zcat f | grep x",
        "desc": "si es gzip…"
      }
    ],
    "teach": "La extención ES mentira; los PRIMEROS BYTES no: 1f 8b = gzip. file da el tipo real. No confiar en el nombre = primer paso forense.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "zcat /home/agent/algo_sin_nombre | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "zcat",
            "args": "/home/agent/algo_sin_nombre",
            "why": "comando zcat — revisa «man zcat»",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "zcat /home/agent/algo_sin_nombre | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "forense-l17",
    "track": "forense",
    "index": 17,
    "title": "Fragmentos en el canal",
    "subtitle": "base64 troceado por el log",
    "xp": 50,
    "difficulty": 4,
    "brief": "Un exfiltrado partió la marca en bloques base64 de línea suelta, mezclados con líneas normales del canal. Recoge TODO, une y decodifica una vez.",
    "goal": "Extrae las líneas que parezcan base64 (solo para A-Z a-z 0-9 +/=) de /home/agent/canal.log, cóncatenas sin saltos y decodifica.",
    "keywords": [
      "base64",
      "trazos",
      "exfiltracion"
    ],
    "hints": [
      "Los bloques van como \"chip N: BLOQUE\": grep -oE \"chip [0-9]+: [A-Za-z0-9+/=]+\" piesa el patrón.",
      "sed \"s/.*: //\" quita el label; tr -d \"\n\" une; base64 -d decodifica una sola vez.",
      "grep -oE 'chip [0-9]+: [A-Za-z0-9+/=]+' canal.log | sed 's/.*: //' | tr -d '\\n' | base64 -d"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE '[A-Za-z0-9+/=]{8,}' f",
        "desc": "candidatos b64"
      },
      {
        "cmd": "tr -d '\\n'",
        "desc": "unir líneas"
      }
    ],
    "teach": "Exfiltrar es trocear: base64 troceado por líneas sueltas de un log es una canal clásico. La receta del analista: extraer los candidatos con regex, unir (tr -d '\\n') y decodificar UNA VEZ al final.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE 'chip [0-9]+: [A-Za-z0-9+/=]+' /home/agent/canal.log | sed 's/.*: //' | tr -d '\\n' | base64 -d",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE chip [0-9]+: [A-Za-z0-9+/=]+ /home/agent/canal.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "sed",
            "args": "s/.*: //",
            "why": "editor de streams: recorre línea a línea aplicando comandos de sustitución/eliminación",
            "flags": []
          },
          {
            "cmd": "tr",
            "args": "-d \\n",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "elimina los caracteres del conjunto dado"
              }
            ]
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -oE 'chip [0-9]+: [A-Za-z0-9+/=]+' /home/agent/canal.log | sed 's/.*: //' | tr -d '\\n' | base64 -d"
  },
  {
    "id": "forense-l18",
    "track": "forense",
    "index": 18,
    "title": "Acta de embudo",
    "subtitle": "filtering combinado grep -vE",
    "xp": 50,
    "difficulty": 4,
    "brief": "La marca está en mix.log, en una línea SIN palabras trampa (falso, test, spacer) y con la forma de la marca. Doble trébol.",
    "goal": "De /home/agent/mix.log quita las líneas que contengan \"falso|test|spacer\" y de resto extrae la marca que encaje la regex.",
    "keywords": [
      "grep",
      "excluir",
      "ruido"
    ],
    "hints": [
      "grep -v es de \"todo lo que NO encaje\"; añade -i para cualquier casa (falso, FALSO, False).",
      "La excluta con 24 hex exactos discrimeña los señuelos.",
      "grep -vE 'falso|test|spacer' f | grep -oE 'FLAG\\{[a-f0-9]{24}\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -vE 'ruido|ruido2' f",
        "desc": "exclusión múltiple"
      },
      {
        "cmd": "grep -viE 'p1|p2' f",
        "desc": "todo sin case"
      }
    ],
    "teach": "La inversión de log (exclusiones) es el 90% del filtrado auditable: ruido de FALLOS, ARGS DE TEST, líneas de train. -v + -E es el dúo rápido en vez del cut — de esos todos sons",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -viE 'falso|test|spacer' /home/agent/mix.log | grep -oE 'FLAG\\{[a-f0-9]{24}\\}'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-viE falso|test|spacer /home/agent/mix.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              },
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]{24}\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -viE 'falso|test|spacer' /home/agent/mix.log | grep -oE 'FLAG\\{[a-f0-9]{24}\\}'"
  },
  {
    "id": "forense-l19",
    "track": "forense",
    "index": 19,
    "title": "El paquete sellado",
    "subtitle": "base64 en un log",
    "xp": 65,
    "difficulty": 5,
    "brief": "> En el sucio registro ~/registro.log un \"paquete\" viaja codificado en > base64 en la línea que empieza por PAYLOAD. Al decodificarlo, la flag > asoma. Los logs del dojo guardan todo; incluso lo que no deberían.",
    "goal": "Extrae el segmento base64 de la línea PAYLOAD de ~/registro.log y decodifícalo para mostrar la flag.",
    "keywords": [
      "grep",
      "awk",
      "base64"
    ],
    "hints": [
      "grep PAYLOAD fichero encuentra la línea; con awk '{print $3}' se saca el 3.º campo.",
      "base64 -d decodifica en el otro sentido.",
      "grep -F … | awk \"{print \\$2}\" | base64 -d"
    ],
    "cheatsheet": [
      {
        "cmd": "grep TEXTO fich",
        "desc": "localiza la línea clave"
      },
      {
        "cmd": "awk '{print $N}'",
        "desc": "extrae el campo N de la línea"
      },
      {
        "cmd": "base64 -d",
        "desc": "decodifica un bloque base64"
      }
    ],
    "teach": "El flujo forense minero: localizar la línea, recortar el campo, decodificar:\n\n    grep 'PAYLOAD' registro.log      → \"PAYLOAD cod BxOx…\"\n    awk '{print $4}'                 → solo el bloque base64\n    base64 -d                        → texto en claro\n\nencadenado:\n\n    grep 'PAYLOAD' /home/agent/registro.log | awk '{print $4}' | base64 -d",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep 'PAYLOAD' ~/registro.log | awk '{print $4}' | base64 -d",
        "cmds": [
          {
            "cmd": "grep",
            "args": "PAYLOAD ~/registro.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "awk",
            "args": "{print $4}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      },
      {
        "raw": "echo",
        "cmds": [
          {
            "cmd": "echo",
            "args": "",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep 'PAYLOAD' ~/registro.log | awk '{print $4}' | base64 -d; echo"
  },
  {
    "id": "forense-l20",
    "track": "forense",
    "index": 20,
    "title": "Hexagonal",
    "subtitle": "xxd: bytes a texto",
    "xp": 65,
    "difficulty": 5,
    "brief": "> El técnico volcó un intercambio en forma hexadecimal en ~/rastro.hex: > cada byte son dos caracteres hex. Laっても flag viaja ahí dentro en > plano... pero no lo verás con cat. Los hex tienen que Volver a bytes.",
    "goal": "Convierte ~/rastro.hex con xxd -r -p (reverse + plain hex) y verifica que la flag asoma en la salida.",
    "keywords": [
      "xxd",
      "strings"
    ],
    "hints": [
      "xxd -p convierte a hex; xxd -r -p hace lo inverso (hex → bytes).",
      "El fichero .hex puede llevar saltos de línea: xxd -r -p los tolera.",
      "echo $(cat rastro.hex) | xxd -r -p"
    ],
    "cheatsheet": [
      {
        "cmd": "xxd -p fich",
        "desc": "vuelca el fichero en hex plano"
      },
      {
        "cmd": "xxd -r -p",
        "desc": "convierte hex plano de nuevo a bytes"
      },
      {
        "cmd": "strings fich",
        "desc": "alternativa: extrae texto de un binario"
      }
    ],
    "teach": "xxd trabaja con \"hexdumps\". Para invertir un fichero de hex plano:\n\n    echo $(cat ~/rastro.hex) | xxd -r -p\n\n-p interpreta entrada/salida como hex plano y -r revierte al binario. El grep final confirma que la flag está dentro:\n\n    ... | grep -o 'FLAG{[^}]*}'",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "echo $(cat ~/rastro.hex) | xxd -r -p | grep -o 'FLAG{[^}]*}'",
        "cmds": [
          {
            "cmd": "echo",
            "args": "$(cat ~/rastro.hex)",
            "why": "imprime sus argumentos en stdout (con \\n final)",
            "flags": []
          },
          {
            "cmd": "xxd",
            "args": "-r -p",
            "why": "volcado hexadecimal de un fichero (byte a byte con representación ASCII la derecha)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "revertir: de hexadecimal de vuelta a bytes"
              },
              {
                "flag": "-p",
                "meaning": "salida limpia: sólo hex sin offsets ni columna ASCII"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-o FLAG{[^}]*}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "echo $(cat ~/rastro.hex) | xxd -r -p | grep -o 'FLAG{[^}]*}'"
  },
  {
    "id": "boss-l1",
    "track": "boss",
    "index": 0,
    "title": "Caza mayor I",
    "subtitle": "find + grep + base64",
    "xp": 90,
    "difficulty": 4,
    "brief": "La flag está oculta en un fichero con nombre genérico dentro de un árbol ancho, y encima codificada en base64. Pipeline creíble: find para localizar, base64 -d para abrir, y ojo al output.",
    "goal": "En /var/dojo/jungla hay varios ficheros .payload; solo uno contiene datos base64 decodificables con la flag (los demás son texto). Localízalo y muéstrame ya decodificado.",
    "keywords": [
      "find",
      "base64",
      "pipeline"
    ],
    "hints": [
      "find /var/dojo/jungla -type f | xargs file | grep -v ASCII marca la diferencia… pero instaló file, no lo olvides.",
      "El fichero bueno empieza por punto: find /var/dojo/jungla -name '.*'",
      "find /var/dojo/jungla -name \".*\""
    ],
    "cheatsheet": [
      {
        "cmd": "find /ruta -name \".*\"",
        "desc": "ficheros ocultos por nombre"
      },
      {
        "cmd": "file fichero",
        "desc": "tipo de fichero (texto/binario/etc.)"
      },
      {
        "cmd": "cat fichero | base64 -d",
        "desc": "decodifica y muestra"
      }
    ],
    "teach": "El truco de nivel boss es encadenar herramientas: `find` da el fichero objetivo, el fichero oculto evita las trampas y `base64 -d` abre la carga útil. La disciplina de pipelines cubrirá tu caos.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "desierto: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "cat \"$(find /var/dojo/jungla -name '.*')\" | base64 -d",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$(find /var/dojo/jungla -name '.*')",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "cat \"$(find /var/dojo/jungla -name '.*')\" | base64 -d"
  },
  {
    "id": "boss-l2",
    "track": "boss",
    "index": 0,
    "title": "Caza mayor II",
    "subtitle": "find -newer, mtime",
    "xp": 90,
    "difficulty": 4,
    "brief": "Cientos de ficheros idénticos, y solo UNO fue tocado hace minutos (los demás tienen fechas viejas). `find -newer REF` dife truncate o `find -mmin`. La salida del recién pizzado es la flag.",
    "goal": "En /var/dojo/estantería hay libros .txt idénticos por fuera; solo uno fue modificado en los últimos minutos. Identifica cuál por fecha (find -newer o sort por mtime) y muéstrame su línea clave.",
    "keywords": [
      "find",
      "mtime"
    ],
    "hints": [
      "touch -t '202001010000' /tmp/REF crea un fichero-tótem viejo.",
      "find /var/dojo/estantería -type f -newer /tmp/REF",
      "La variante simple: find … -mmin -10  (los últimos 10 minutos)."
    ],
    "cheatsheet": [
      {
        "cmd": "find /r -newer REF",
        "desc": "más nuevo que REF"
      },
      {
        "cmd": "find /r -mmin -10",
        "desc": "tocado hace menos de 10 min"
      },
      {
        "cmd": "touch -m f",
        "desc": "refresca mtime"
      }
    ],
    "teach": "`find` filtra por mtime: `-newer fichero` compara contra un REF; `-mmin -10` busca tocados hace MENOS de 10 min, `-newermt 'YYYY-MM-DD'` por fecha. Forenses buscan «lo recién cambiado» tras un intruso.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "edición recién impresa: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /var/dojo/estantería -type f -mmin -30 -exec cat {} ;",
        "cmds": [
          {
            "cmd": "find",
            "args": "/var/dojo/estantería -type f -mmin -30 -exec cat {} ;",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man find»"
              },
              {
                "flag": "-y",
                "meaning": "flag y del comando — revisa «man find»"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-i",
                "meaning": "flag i del comando — revisa «man find»"
              },
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /var/dojo/estantería -type f -mmin -30 -exec cat {} \\;"
  },
  {
    "id": "boss-l3",
    "track": "boss",
    "index": 0,
    "title": "Caza mayor III",
    "subtitle": "procesos + señales + decode",
    "xp": 95,
    "difficulty": 4,
    "brief": "Un transmisor bombea la clave codificada cada pocos segundos al log. Necesitas: leer la última emisión, matar el transmisor (la señal de apagado es parte del oficio) y decodificar.",
    "goal": "En /var/log/transmisor.log se acumula la salida codificada (base64) del transmisor. Mata el proceso (term o kill), decodifica la ÚLTIMA línea completa y muéstrame el mensaje en claro (contiene la flag).",
    "keywords": [
      "pkill",
      "tail",
      "base64"
    ],
    "hints": [
      "tail -1 /var/log/transmisor.log | base64 -d te muestra el último mensaje.",
      "pkill -f transmisor para frenar la emisión."
    ],
    "cheatsheet": [
      {
        "cmd": "pkill -f nombre",
        "desc": "mata por patrón"
      },
      {
        "cmd": "tail -n 2 fichero",
        "desc": "últimas 2 líneas"
      },
      {
        "cmd": "base64 -d",
        "desc": "decodifica stdin"
      }
    ],
    "teach": "Combinación boss: `pkill -f` te limpia el proceso ruidoso, `tail -1` saca la última emisión, `base64 -d` la abre. ¿Por qué matar primero? Evitas leer una emisión PARTIDA a mitad de escritura (atomicidad práctica) y dejas claro quién fue.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "mensaje cifrado: FLAG{d3b09a4f7c2e1b8d6041a5f3} residuo 842"
      }
    ],
    "steps": [
      {
        "raw": "pkill -f '[t]ransmisor$'",
        "cmds": [
          {
            "cmd": "pkill",
            "args": "-f [t]ransmisor$",
            "why": "comando pkill — revisa «man pkill»",
            "flags": [
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man pkill»"
              }
            ]
          }
        ]
      },
      {
        "raw": "true\nsleep 1\ntail -1 /var/log/transmisor.log | base64 -d",
        "cmds": [
          {
            "cmd": "true",
            "args": "sleep 1 tail -1 /var/log/transmisor.log",
            "why": "comando true — revisa «man true»",
            "flags": []
          },
          {
            "cmd": "base64",
            "args": "-d",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "pkill -f '[t]ransmisor$' || true\nsleep 1\ntail -1 /var/log/transmisor.log | base64 -d"
  },
  {
    "id": "boss-l4",
    "track": "boss",
    "index": 0,
    "title": "Caza mayor IV — el empaque final",
    "subtitle": "tar + gzip + zip + base64",
    "xp": 120,
    "difficulty": 5,
    "brief": "La carga final viaja como muñeca rusa: un .txt metido en zip, metido en tar.gz, y el tar.gz codificado en base64. Solo los pacientes con pipelines escalan este tramo.",
    "goal": "En /var/dojo/paquete-final.b64 está un base64 que decodifica a un .tar.gz con un .zip dentro; dentro del zip hay un flag.txt. Extrae hasta el final y muéstrame su contenido.",
    "keywords": [
      "tar",
      "zip",
      "base64",
      "boss"
    ],
    "hints": [
      "base64 -d paquete-final.b64 > /tmp/paquete.tar.gz",
      "tar -xzf /tmp/paquete.tar.gz -C /tmp/extrae  →  unzip /tmp/extrae/flag.zip -d /tmp/extrae2",
      "cat /tmp/extrae2/flag.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "base64 -d in.b64 > out.bin",
        "desc": "desembala capa 1"
      },
      {
        "cmd": "tar -xzf pack.tar.gz -C dir",
        "desc": "desembala capa tar.gz"
      },
      {
        "cmd": "unzip pack.zip -d dir",
        "desc": "capa zip y leer"
      }
    ],
    "teach": "La muñeca rusa real: base64 → tar.gz → zip → flag.txt. Cada nivel de empaque tiene su herramienta de apertura, y TU única disciplina es ir capa a capa con el pipeline correcto. En la vida real (logs, malware, backup) verás cada capa en combinaciones nuevas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "Archive:  /tmp/e1/flag.zip\n extracting: /tmp/e2/flag.txt        \nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "base64 -d /var/dojo/paquete-final.b64 > /tmp/paquete.tar.gz\nmkdir -p /tmp/e1 /tmp/e2\ntar -xzf /tmp/paquete.tar.gz -C /tmp/e1\nunzip -o /tmp/e1/flag.zip -d /tmp/e2\ncat /tmp/e2/flag.txt",
        "cmds": [
          {
            "cmd": "base64",
            "args": "-d /var/dojo/paquete-final.b64 > /tmp/paquete.tar.gz mkdir -p /tmp/e1 /tmp/e2 tar -xzf /tmp/paquete.tar.gz -C /tmp/e1 unzip -o /tmp/e1/flag.zip -d /tmp/e2 cat /tmp/e2/flag.txt",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              },
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man base64»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man base64»"
              },
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man base64»"
              },
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man base64»"
              },
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man base64»"
              },
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "base64 -d /var/dojo/paquete-final.b64 > /tmp/paquete.tar.gz\nmkdir -p /tmp/e1 /tmp/e2\ntar -xzf /tmp/paquete.tar.gz -C /tmp/e1\nunzip -o /tmp/e1/flag.zip -d /tmp/e2\ncat /tmp/e2/flag.txt"
  },
  {
    "id": "boss-l5",
    "track": "boss",
    "index": 5,
    "title": "El rey del error",
    "subtitle": "grep -c + bucle + cat selectivo",
    "xp": 80,
    "difficulty": 4,
    "brief": "Cinco logs grandes en logs/. Solo el loberrimo tiene MÁS de 50 líneas ERROR; su cabecera lleva el avanzado trofeo.",
    "goal": "Encuenposition el .log de /home/agent/logs con más de 50 líneas ERROR y MUESTRA su contenido (los errores Y su cabecera con el trofeo).",
    "keywords": [
      "grep -c",
      "bucle",
      "logs"
    ],
    "hints": [
      "grep -c ERROR f cuenta las líneas ERROR de cada log.",
      "El número lo decide el bucle: compara la cuenta con -gt 50.",
      "for f in logs/*.log; do [ \"$(grep -c ERROR \"$f\")\" -gt 50 ] && cat \"$f\"; done"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -c ERROR f",
        "desc": "cuenta ERRORS"
      },
      {
        "cmd": "[ n -gt 50 ] && a",
        "desc": "condición del trofeo"
      }
    ],
    "teach": "El combo «señuelo + grep -c + test» es el patrón estándar de auditoría por lotes. Encadenarlo con head/tail te enseña las cabeceras de CADA log sospechoso sin abrir el editor.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "inicio del lote 4 formato ESTANDAR\ntrofeo del causante: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nERROR en componente 1\nERROR en componente 2\nERROR en componente 3\nERROR en componente 4\nERROR en componente 5\nERROR en componente 6\nERROR en componente 7\nERROR en componente 8\nERROR en componente 9\nERROR en componente 10\nERROR en componente 11\nERROR en componente 12\nERROR en componente 13\nERROR en componente 14\nERROR en componente 15\nERROR en componente 16\nERROR en componente 17\nERROR en componente 18\nERROR en componente 19\nERROR en componente 20\nERROR en componente 21\nERROR en componente 22\nERROR en componente 23\nERROR en componente 24\nERROR en componente 25\nERROR en componente 26\nERROR en componente 27\nERROR en componente 28\nERROR en componente 29\nERROR en componente 30\nERROR en componente 31\nERROR en componente 32\nERROR en componente 33\nERROR en componente 34\nERROR en componente 35\nERROR en componente 36\nERROR en componente 37\nERROR en componente 38\n  … (+22 líneas más — la forma es idéntica)"
      }
    ],
    "steps": [
      {
        "raw": "for f in /home/agent/logs/*.log",
        "cmds": [
          {
            "cmd": "for",
            "args": "f in /home/agent/logs/*.log",
            "why": "comando for — revisa «man for»",
            "flags": []
          }
        ]
      },
      {
        "raw": "do if [ \"$(grep -c ERROR \"$f\")\" -gt 50 ]",
        "cmds": [
          {
            "cmd": "do",
            "args": "if [ $(grep -c ERROR $f) -gt 50 ]",
            "why": "comando do — revisa «man do»",
            "flags": [
              {
                "flag": "-g",
                "meaning": "flag g del comando — revisa «man do»"
              },
              {
                "flag": "-t",
                "meaning": "flag t del comando — revisa «man do»"
              }
            ]
          }
        ]
      },
      {
        "raw": "then cat \"$f\"",
        "cmds": [
          {
            "cmd": "then",
            "args": "cat $f",
            "why": "comando then — revisa «man then»",
            "flags": []
          }
        ]
      },
      {
        "raw": "fi",
        "cmds": [
          {
            "cmd": "fi",
            "args": "",
            "why": "comando fi — revisa «man fi»",
            "flags": []
          }
        ]
      },
      {
        "raw": "done",
        "cmds": [
          {
            "cmd": "done",
            "args": "",
            "why": "comando done — revisa «man done»",
            "flags": []
          }
        ]
      }
    ],
    "raw": "for f in /home/agent/logs/*.log; do if [ \"$(grep -c ERROR \"$f\")\" -gt 50 ]; then cat \"$f\"; fi; done"
  },
  {
    "id": "boss-l6",
    "track": "boss",
    "index": 6,
    "title": "Agregación de ventas",
    "subtitle": "awk con acumulador por grupo",
    "xp": 85,
    "difficulty": 4,
    "brief": "ventas.csv reparte montos por regiones (varias filas por region). Una region esconde su nombre la marca; la ganadora es la que MÁS acuminula.",
    "goal": "Suma por region con awk y muestra el par importe-region de la region que más acumula (su nombre trae la marca).",
    "keywords": [
      "awk",
      "arrays",
      "END",
      "agregación"
    ],
    "hints": [
      "awk puede ACRECER un array asociativo: s[r] += monto por salida de cada fila.",
      "El bloque END corre una vez al terminar: recorre el array con un for.",
      "awk -F, '{s[$1]+=$2} END {for (r in s) print s[r], r}' ventas.csv | sort -nr | head -1"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{s[$1]+=$2} END…'",
        "desc": "suma por grupo"
      },
      {
        "cmd": "sort -nr",
        "desc": "numérico descendente"
      }
    ],
    "teach": "Awk con arrays asociativos + bloque END es SQL de bolsillo (GROUP BY + SUM). El for (r in s) recorre las claves y el print saca el relatório. Ordena con sort -nr para ver al ganador.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "1250 torreon-FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk -F, '{s[$1]+=$2} END {for (r in s) print s[r], r}' /home/agent/ventas.csv | sort -nr | head -n 1",
        "cmds": [
          {
            "cmd": "awk",
            "args": "-F, {s[$1]+=$2} END {for (r in s) print s[r], r} /home/agent/ventas.csv",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          },
          {
            "cmd": "sort",
            "args": "-nr",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-n",
                "meaning": "orden numérico"
              },
              {
                "flag": "-r",
                "meaning": "inverso (descendente)"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n 1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk -F, '{s[$1]+=$2} END {for (r in s) print s[r], r}' /home/agent/ventas.csv | sort -nr | head -n 1"
  },
  {
    "id": "boss-l7",
    "track": "boss",
    "index": 7,
    "title": "Caza en los comprimidos",
    "subtitle": "find + xargs zcat/gunzip",
    "xp": 85,
    "difficulty": 4,
    "brief": "En caja/ hay un árbol de ficheros .gz y decoys sueltos. Todas las marcas interesantes están DENTRO de los comprimidos.",
    "goal": "Encuentra candidatos .gz en /home/agent/caja con find, descomprímelos de una pasada (xargs zcat) y extrae la marca real.",
    "keywords": [
      "find",
      "zcat",
      "xargs",
      "lote"
    ],
    "hints": [
      "find -name \"*.gz\" localiza TODOS los comprimidos del árbol.",
      "zcat no acepta múltiples slots? sí: puedes lanzarlo con xargs o por -exec.",
      "find caja -name '*.gz' -exec zcat {} \\;… con grep -oE extraes SOLO la marca."
    ],
    "cheatsheet": [
      {
        "cmd": "find d -name '*.gz' | xargs zcat",
        "desc": "descomprimir lote"
      },
      {
        "cmd": "zcat f | grep -oE x",
        "desc": "marca en el flujo"
      }
    ],
    "teach": "find + xargs/-exec es la dupla clásica de bash para procesar hallazgos en lote. Descomprimir en el flujo (zcat) permite encadenar pipes sin ensuciar disco: caza de la marca sin archivos intermedios.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "find /home/agent/caja -name '*.gz' -exec zcat {} ; | grep -oE 'FLAG\\{[^}]*\\}'",
        "cmds": [
          {
            "cmd": "find",
            "args": "/home/agent/caja -name *.gz -exec zcat {} ;",
            "why": "busca ficheros jerárquicamente por nombre, tamaño, tiempo o tipo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "flag n del comando — revisa «man find»"
              },
              {
                "flag": "-a",
                "meaning": "flag a del comando — revisa «man find»"
              },
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man find»"
              },
              {
                "flag": "-e",
                "meaning": "flag e del comando — revisa «man find»"
              },
              {
                "flag": "-c",
                "meaning": "flag c del comando — revisa «man find»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "find /home/agent/caja -name '*.gz' -exec zcat {} \\; | grep -oE 'FLAG\\{[^}]*\\}'"
  },
  {
    "id": "boss-l8",
    "track": "boss",
    "index": 8,
    "title": "La persistencia del planificador",
    "subtitle": "infiltración en /etc/cron.d",
    "xp": 90,
    "difficulty": 4,
    "brief": "Un atacante inyectó persistencia en /etc/cron.d: la tarea apunta a un script que a su vez señala un destinario final.",
    "goal": "Sigue sendera ficheros: /etc/cron.d (el fichero del planificador) → el script apuntado → el destinario que él señala. Muestra ese último con la marca.",
    "keywords": [
      "cron.d",
      "persistencia",
      "cadena"
    ],
    "hints": [
      "Los ficheros de /etc/cron.d apuntan a un script: le el fichero del planificador primero.",
      "Extrae el path= del FICHERO script y después el destino= de jóin script.",
      "p=$(grep -oE \"path=[^ ]+\" /etc/cron.d/backup | cut -d= -f2); q=$(grep -oE \"destino=[^ ]+\" \"$p\" | cut -d= -f2); cat \"$q\""
    ],
    "cheatsheet": [
      {
        "cmd": "ls /etc/cron.d",
        "desc": "persistencia programada"
      },
      {
        "cmd": "cut -d= -f2",
        "desc": "extrae el valor k=v"
      }
    ],
    "teach": "La persistencia vía cron es una técnica clásica de los atacantes: SIEMPRE revisa /etc/cron.d en una investigación. Seguir la cadena fichero→script→destino flujo es la forma de reconstruir el plan del atacante.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la marca de la persistedencia: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(grep -oE 'path=[^ ]+' /etc/cron.d/backup | head -n1 | cut -d= -f2)",
        "cmds": [
          {
            "cmd": "p=$(grep",
            "args": "-oE path=[^ ]+ /etc/cron.d/backup",
            "why": "comando p=$(grep — revisa «man p=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man p=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          },
          {
            "cmd": "cut",
            "args": "-d= -f2)",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "q=$(grep -oE 'destino=[^ ]+' \"$p\" | head -n1 | cut -d= -f2)",
        "cmds": [
          {
            "cmd": "q=$(grep",
            "args": "-oE destino=[^ ]+ $p",
            "why": "comando q=$(grep — revisa «man q=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man q=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          },
          {
            "cmd": "cut",
            "args": "-d= -f2)",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "cat \"$q\"",
        "cmds": [
          {
            "cmd": "cat",
            "args": "$q",
            "why": "vuelca el contenido de un fichero al stdout (concatenar archivos)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "p=$(grep -oE 'path=[^ ]+' /etc/cron.d/backup | head -n1 | cut -d= -f2); q=$(grep -oE 'destino=[^ ]+' \"$p\" | head -n1 | cut -d= -f2); cat \"$q\""
  },
  {
    "id": "boss-l9",
    "track": "boss",
    "index": 9,
    "title": "El tar sin tocar disco",
    "subtitle": "tar -O: contenido del comprimido al stdout",
    "xp": 90,
    "difficulty": 4,
    "brief": "archivo.tar.gz guarda un fichero NOTA.txt con la marca. La directiva del dojo: la marca debe sacarse SIN extraer nada al disco.",
    "goal": "Muestra el contenido del fichero guardado dentro de /home/agent/archivo.tar.gz SIN extraer al disco (lee el tar en el copia) y extrae la marca.",
    "keywords": [
      "tar -O",
      "stdout",
      "forense"
    ],
    "hints": [
      "tar -f es el fichero; añade x, z y -O (O mayúscula = escribir al stdout, no disco).",
      "La salida tar va a stdout: encadénala con grep.",
      "tar -xzOf archivo.tar.gz | grep -oE \"FLAG\\{[^}]*\\}\""
    ],
    "cheatsheet": [
      {
        "cmd": "tar -tzf f.tar.gz",
        "desc": "lista sin extraer"
      },
      {
        "cmd": "tar -xzOf f.tar.gz",
        "desc": "todo el contenido al stdout"
      }
    ],
    "teach": "tar -O (mayúscula) escribe TODO el contenido AL stdout: el modo «cat del tar» sin extraer al disco. Es la forma forense de analizar un archivo sin contaminar la evidencia.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "tar -xzOf /home/agent/archivo.tar.gz | grep -oE 'FLAG\\{[^}]*\\}'",
        "cmds": [
          {
            "cmd": "tar",
            "args": "-xzOf /home/agent/archivo.tar.gz",
            "why": "empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "extraer"
              },
              {
                "flag": "-z",
                "meaning": "filtro gzip"
              },
              {
                "flag": "-f",
                "meaning": "nombre del archivo tar"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "tar -xzOf /home/agent/archivo.tar.gz | grep -oE 'FLAG\\{[^}]*\\}'"
  },
  {
    "id": "boss-l10",
    "track": "boss",
    "index": 10,
    "title": "La caja de seguridad final",
    "subtitle": "dos capas: base64 + tr rotación",
    "xp": 100,
    "difficulty": 5,
    "brief": "ultimis.b64 guarda (pista: rotación +13 de las letras dentro de una codificación base64) la marca final. Ambas capas deben deshacerse EN ORDEN.",
    "goal": "Decodifica /home/agent/ultimis.b64 con base64 y DESPUÉS deshaz la rotación +13 (rot13) de las letras ya extraídas.",
    "keywords": [
      "base64",
      "rot13",
      "capas",
      "boss"
    ],
    "hints": [
      "Primero quita la codificación: base64 -d trae la cadena rotada.",
      "La rotación +13 es simétrica: la misma tr la deshace.",
      "base64 -d ultimis.b64 | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
    ],
    "cheatsheet": [
      {
        "cmd": "base64 -d f | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "desc": "decodifica + rot13"
      },
      {
        "cmd": "xxd -r f.hex",
        "desc": "otro imposible reversible"
      }
    ],
    "teach": "Los encadenamientos (rot13+base64, hex+rot…) son una evasión típica de DLP. Deshacer CAPAS EN ORDEN es la disciplina del oficio: primero transforma la capa de transporte, luego recupera el texto original.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "la hospitalaria terminal: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "base64 -d /home/agent/ultimis.b64 | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "cmds": [
          {
            "cmd": "base64",
            "args": "-d /home/agent/ultimis.b64",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          },
          {
            "cmd": "tr",
            "args": "A-Za-z N-ZA-Mn-za-m",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "base64 -d /home/agent/ultimis.b64 | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
  },
  {
    "id": "boss-l11",
    "track": "boss",
    "index": 11,
    "title": "Caza mayor V — tricaposa",
    "subtitle": "hex → rot13 → base64, EN ESE ORDEN",
    "xp": 90,
    "difficulty": 5,
    "brief": "indomable.dat está cerrado tres veces: primero la codificación a hex, luego rotación +13 de las letras del texto hex… y por encima, base64. Deshacer las capas EN ORDER: base64, rot13, xxd -r.",
    "goal": "Deshaz /home/agent/indomable.dat capas EN ORDEN (base64 -d → tr rot13 → xxd -r) y muéstralo.",
    "keywords": [
      "boss",
      "capas",
      "xxd",
      "rot13"
    ],
    "hints": [
      "El orden DE CIERRE es el inverso del de apertura: base64 -d, luego tr rot13, luego xxd -r -p.",
      "El texto tras las dos primeras capas es UN volcado hex puro (xxd -p): xxd -r -p lo vuelve a bytes.",
      "base64 -d f | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p"
    ],
    "cheatsheet": [
      {
        "cmd": "xxd -p f | xxd -r -p",
        "desc": "hex puro ida y vuelta"
      },
      {
        "cmd": "tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "desc": "rot13 simétrico"
      }
    ],
    "teach": "Los ofuscadores encadenan transformaciones y el analista las deshace IN VERSO. Aquí el truco es darte cuenta de que el texto \"rotado\" es hex: 1f 8b…: análisis de primer byte = decidir la próxima capa.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "base64 -d /home/agent/indomable.dat | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "base64",
            "args": "-d /home/agent/indomable.dat",
            "why": "codifica/decodifica base64 (binario ↔ texto plano)",
            "flags": [
              {
                "flag": "-d",
                "meaning": "decodifica (de base64 a binario)"
              }
            ]
          },
          {
            "cmd": "tr",
            "args": "A-Za-z N-ZA-Mn-za-m",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": []
          },
          {
            "cmd": "xxd",
            "args": "-r -p",
            "why": "volcado hexadecimal de un fichero (byte a byte con representación ASCII la derecha)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "revertir: de hexadecimal de vuelta a bytes"
              },
              {
                "flag": "-p",
                "meaning": "salida limpia: sólo hex sin offsets ni columna ASCII"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "base64 -d /home/agent/indomable.dat | tr 'A-Za-z' 'N-ZA-Mn-za-m' | xxd -r -p | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "boss-l12",
    "track": "boss",
    "index": 12,
    "title": "Caza mayor VI — el cofre cifrado",
    "subtitle": "contraseña en pista + unzip + tar",
    "xp": 90,
    "difficulty": 5,
    "brief": "fortin.zip pide clave; la pista par a la izquierda da su valor exacto (no la adivines: léela). Dentro hay un tar.gz con la marca.",
    "goal": "Extrae la clave de /home/agent/fortin.clave, abre fortin.zip con ella (unzip -p) y de ahí extrae el tar.gz embebido con la marca.",
    "keywords": [
      "boss",
      "zip",
      "tar",
      "clave"
    ],
    "hints": [
      "La clave completa es una cadena impresa en fortin.clave: grep para sacarla limpia.",
      "unzip -p -P CLAVE imprime el tar.gz al stdout; tar -xzOf - lo lee de ahí.",
      "unzip -p -P KEY fortin.zip | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "unzip -p -P K f.zip",
        "desc": "el interior al stdout"
      },
      {
        "cmd": "tar -xzOf -",
        "desc": "tar de stdin al stdout"
      }
    ],
    "teach": "flujos sin tocar disco: unzip -p manda el BINARIO interior al stdout y tar -xzOf - lo consume: la cadena de compresores se descuelga sin ficheros temporales. Limpio y auditable.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "p=$(grep -oE 'claveDelFortin12' /home/agent/fortin.clave | head -n1)",
        "cmds": [
          {
            "cmd": "p=$(grep",
            "args": "-oE claveDelFortin12 /home/agent/fortin.clave",
            "why": "comando p=$(grep — revisa «man p=$(grep»",
            "flags": [
              {
                "flag": "-o",
                "meaning": "flag o del comando — revisa «man p=$(grep»"
              }
            ]
          },
          {
            "cmd": "head",
            "args": "-n1)",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              }
            ]
          }
        ]
      },
      {
        "raw": "unzip -p -P \"$p\" /home/agent/fortin.zip | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "unzip",
            "args": "-p -P $p /home/agent/fortin.zip",
            "why": "extrae archivos .zip",
            "flags": [
              {
                "flag": "-p",
                "meaning": "flag p del comando — revisa «man unzip»"
              }
            ]
          },
          {
            "cmd": "tar",
            "args": "-xzOf -",
            "why": "empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "extraer"
              },
              {
                "flag": "-z",
                "meaning": "filtro gzip"
              },
              {
                "flag": "-f",
                "meaning": "nombre del archivo tar"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "p=$(grep -oE 'claveDelFortin12' /home/agent/fortin.clave | head -n1); unzip -p -P \"$p\" /home/agent/fortin.zip | tar -xzOf - | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "boss-l13",
    "track": "boss",
    "index": 13,
    "title": "Caza mayor VII — el log del traidor",
    "subtitle": "exclusiones + strings + rot13",
    "xp": 90,
    "difficulty": 5,
    "brief": "traidor.log mezcla líneas de señuelo, líneas de test y UNA línea legible con texto rotado (rot13) que esconde la marca.",
    "goal": "Filtra /home/agent/traidor.log quitando las líneas con señuelo o test, extrae su texto con rot13 y pescá la marca.",
    "keywords": [
      "boss",
      "rot13",
      "log",
      "excluir"
    ],
    "hints": [
      "Primero grep -viE 'señuelo|test' para excluir las trampas por nombre.",
      "La línea restante está rotada +13: tr A-Za-z N-ZA-Mn-za-m la deshace (es simétrica).",
      "grep -vE 'señuelo|test' traidor.log | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
    ],
    "cheatsheet": [
      {
        "cmd": "tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "desc": "rot13 ida y vuelta"
      },
      {
        "cmd": "grep -viE 'a|b' f",
        "desc": "excluir por case-insensitive"
      }
    ],
    "teach": "\"rot13 el log\" es el truco de ofuscación núm 1 de logs mal protegidos: simétrico, sin clave, sin software. Tu contramedida es generar texto limpio + auditoría por anomalías de frecuencias.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -viE 'señuelo|test' /home/agent/traidor.log | tr 'A-Za-z' 'N-ZA-Mn-za-m' | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-viE señuelo|test /home/agent/traidor.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              },
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "tr",
            "args": "A-Za-z N-ZA-Mn-za-m",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -viE 'señuelo|test' /home/agent/traidor.log | tr 'A-Za-z' 'N-ZA-Mn-za-m' | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "boss-l14",
    "track": "boss",
    "index": 14,
    "title": "Caza mayor VIII — nido de comprimidos",
    "subtitle": "file → zcat → tar flujo al stdout",
    "xp": 100,
    "difficulty": 5,
    "brief": "En /home/agent/nido hay tres ficheros SIN extensión; SOLO uno es un tar.gz (los otros son gzip planos y texto). En el tar.gz vive la marca.",
    "goal": "Identifica el único tar.gz de /home/agent/nido con file -z y extrae su contenido al vuelo (tar -xzOf) hasta la marca.",
    "keywords": [
      "boss",
      "tar",
      "file",
      "nido"
    ],
    "hints": [
      "file -z mira DENTRO de los comprimidos: solo el tar.gz sale como 'tar archive'.",
      "cut -d: -f1 isola el nombre; tar -xzOf FICHERO imprime su contenu al stdout.",
      "f=$(file -z /home/agent/nido/* | grep 'tar archive' | cut -d: -f1); tar -xzOf \"$f\""
    ],
    "cheatsheet": [
      {
        "cmd": "file * | grep tst",
        "desc": "identifica entre nombres mudos"
      },
      {
        "cmd": "tar -xzOf f.tgz",
        "desc": "contents al stdout"
      }
    ],
    "teach": "file + tar -O es el par mágico forense: identificar el recipiente y verterlo sin intermediar disco. Cuando hay recipiente dentro de recipiente, SEGUIR la file cadenas de comprimido hasta el resultado.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "f=$(file -z /home/agent/nido/* | grep 'tar archive' | cut -d: -f1)",
        "cmds": [
          {
            "cmd": "f=$(file",
            "args": "-z /home/agent/nido/*",
            "why": "comando f=$(file — revisa «man f=$(file»",
            "flags": [
              {
                "flag": "-z",
                "meaning": "flag z del comando — revisa «man f=$(file»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "tar archive",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "cut",
            "args": "-d: -f1)",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "tar -xzOf \"$f\" | grep -oE 'FLAG\\{[a-f0-9]+\\}'",
        "cmds": [
          {
            "cmd": "tar",
            "args": "-xzOf $f",
            "why": "empaqueta (tar) y, con las letras compuestas, descomprime (tar -xzf = eXtract + gZip + File)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "extraer"
              },
              {
                "flag": "-z",
                "meaning": "filtro gzip"
              },
              {
                "flag": "-f",
                "meaning": "nombre del archivo tar"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[a-f0-9]+\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "f=$(file -z /home/agent/nido/* | grep 'tar archive' | cut -d: -f1); tar -xzOf \"$f\" | grep -oE 'FLAG\\{[a-f0-9]+\\}'"
  },
  {
    "id": "boss-l19",
    "track": "boss",
    "index": 19,
    "title": "El mayor del caso",
    "subtitle": "pipeline: uniq + sort -n + xargs",
    "xp": 90,
    "difficulty": 5,
    "brief": "> El archivo de cierre del caso (diario.txt) registra a quién se llamó > por canal: la ÚLTIMA palabra de cada línea es el \"ciudadano\". El > ciudadano que más repite es el jefe de la banda; guarda su expediente > en ~/casos/<ciudadano>.txt… con la flag dentro.",
    "goal": "Analiza diario.txt, descubre qué ciudadano (última columna) aparece MÁS veces y muestra su expediente ~/casos/<ciudadano>.txt.",
    "keywords": [
      "awk",
      "sort",
      "xargs"
    ],
    "hints": [
      "awk '{print $NF}' toma la ÚLTIMA columna de cada línea.",
      "sort | uniq -c cuenta repeticiones; sort -n ordena por ese conteo numérico.",
      "tail -n 1 se queda con el mayor; el campo 2.º es el nombre."
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{print $NF}'",
        "desc": "última columna (NF = nº de campos)"
      },
      {
        "cmd": "sort -n | uniq -c | sort -n",
        "desc": "frecuencia par línea: lo clásico"
      },
      {
        "cmd": "xargs -I{} CMD {}",
        "desc": "COLÓN la salida en un marcador de posición"
      }
    ],
    "teach": "Pipeline de análisis (el clásico de \"word count\"):\n\n    awk '{print $NF}' ~/diario.txt   # la última palabra de cada línea\n    | sort | uniq -c                 # cuenta repeticiones\n    | sort -n                        # de menor a mayor frecuencia\n    | tail -n 1                      # el ganador: \"  N ciudadano\"\n    | awk '{print $2}'               # el nombre del ganador\n    | xargs -I{} cat ~/casos/{}.txt  # lee SU expediente",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAGVEZ=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{print $NF}' ~/diario.txt | sort | uniq -c | sort -n | tail -n 1 | awk '{print $2}' | xargs -I{} cat ~/casos/{}.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{print $NF} ~/diario.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "sort",
            "args": "",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": []
          },
          {
            "cmd": "uniq",
            "args": "-c",
            "why": "comprime líneas duplicadas ADYACENTES (por eso casi siempre va tras sort)",
            "flags": [
              {
                "flag": "-c",
                "meaning": "prefija cada línea con su nº de repeticiones"
              }
            ]
          },
          {
            "cmd": "sort",
            "args": "-n",
            "why": "ordena líneas lexicográficamente por defecto",
            "flags": [
              {
                "flag": "-n",
                "meaning": "orden numérico"
              }
            ]
          },
          {
            "cmd": "tail",
            "args": "-n 1",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              },
              {
                "flag": "-n 1",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 1)"
              }
            ]
          },
          {
            "cmd": "awk",
            "args": "{print $2}",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          },
          {
            "cmd": "xargs",
            "args": "-I{} cat ~/casos/{}.txt",
            "why": "convertir la salida de un comando en ARGUMENTOS del siguiente (grep lista → rm borra cada uno)",
            "flags": [
              {
                "flag": "-I",
                "meaning": "marcador de sustitución {}: cada línea va ahí"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk '{print $NF}' ~/diario.txt | sort | uniq -c | sort -n | tail -n 1 | awk '{print $2}' | xargs -I{} cat ~/casos/{}.txt"
  },
  {
    "id": "boss-l20",
    "track": "boss",
    "index": 20,
    "title": "La rotación doble",
    "subtitle": "rev + tr: rot13 al rescate",
    "xp": 90,
    "difficulty": 5,
    "brief": "> La chapa del boss está en ~/enigma.txt pero se ROizó con dos capas: > primero rot13 (letras desplazadas 13) y luego invertida letra a letra. > Solo se puede deshacer en orden inverso a como se construyó.",
    "goal": "Deshace la doble transformación de ~/enigma.txt (primero rev, luego un tr de rot13) para imprimir la flag. Recordar: si se aplicó \"rev | tr\", para deshacer se aplica \"tr | rev\".",
    "keywords": [
      "tr",
      "rev"
    ],
    "hints": [
      "tr 'A-Za-z' 'N-ZA-Mn-za-m' es el rot13 (desplaza 13 posiciones y da la vuelta al abecedario).",
      "Para deshacer: primero VOLTEA LOS CARACTERES con rev, después el rot13 tr.",
      "rev fichero | tr A-Za-z N-ZA-Mn-za-m"
    ],
    "cheatsheet": [
      {
        "cmd": "tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "desc": "rot13: cifra y descifra (es auto-inverso)"
      },
      {
        "cmd": "rev",
        "desc": "invierte los caracteres"
      }
    ],
    "teach": "La transformación original fue: rot13 → luego invertir. Para deshacer se desmonta al revés (como los calcetines):\n\n    rev ~/enigma.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'\n\nrev arregla el orden de letras; tr re-desplaza el alfabeto 13 posiciones. rot13 es auto-inverso (rot13 de rot13 es identidad): el mismo tr sirve para cifrar y descifrar.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "rev ~/enigma.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'",
        "cmds": [
          {
            "cmd": "rev",
            "args": "~/enigma.txt",
            "why": "invierte cada línea carácter a carácter",
            "flags": []
          },
          {
            "cmd": "tr",
            "args": "A-Za-z N-ZA-Mn-za-m",
            "why": "traduce/borra caracteres del flujo, uno a uno (p. ej. tr a-z A-Z pasa a mayúsculas)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "rev ~/enigma.txt | tr 'A-Za-z' 'N-ZA-Mn-za-m'"
  },
  {
    "id": "grep-l1",
    "track": "grep",
    "index": 1,
    "title": "El diario del dojo",
    "subtitle": "grep básico: líneas que contienen algo",
    "xp": 25,
    "difficulty": 1,
    "brief": "El diario de visitas registra cada paso por el dojo. Una entrada anómala dejó constancia del hallazgo: es la única que habla de «hallazgo».",
    "goal": "Imprime la línea del diario que contiene la palabra hallazgo.",
    "keywords": [
      "grep",
      "filtrado",
      "log"
    ],
    "hints": [
      "grep PATRÓN FICHERO imprime las líneas que contienen PATRÓN.",
      "El patrón es una palabra plana: hallazgo.",
      "grep 'hallazgo' /home/agent/visitas.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep patrón fichero",
        "desc": "líneas que contienen el patrón"
      },
      {
        "cmd": "grep -c patrón f",
        "desc": "cuántas líneas casan"
      }
    ],
    "teach": "grep busca un patrón en un fichero y muestra cada línea que lo contiene. Es la base de todo el filtrado en la terminal: las variantes siguientes (−i, −v, −o…) son solo ajustes de esta misma idea.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "10:02 hallazgo FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep 'hallazgo' /home/agent/visitas.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "hallazgo /home/agent/visitas.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep 'hallazgo' /home/agent/visitas.log"
  },
  {
    "id": "grep-l2",
    "track": "grep",
    "index": 2,
    "title": "Mayúsculas rebeldes",
    "subtitle": "grep -i: ignorar el caso",
    "xp": 30,
    "difficulty": 2,
    "brief": "El reactor escribe «critico» con gritos aleatorios: cRiTiCo, CRITICO… Solo −i se entera de todas sus formas.",
    "goal": "Imprime del reactor.log las líneas que contienen critico en cualquier combinación de mayúsculas y minúsculas.",
    "keywords": [
      "grep",
      "-i",
      "mayúsculas"
    ],
    "hints": [
      "−i busca sin distinguir mayúsculas de minúsculas.",
      "El patrón en minúsculas + -i casa cRiTiCo y CRITICO también.",
      "grep -i 'critico' /home/agent/reactor.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -i patrón f",
        "desc": "insensible a mayúsculas"
      },
      {
        "cmd": "grep -v patrón f",
        "desc": "excluye las líneas que casan"
      }
    ],
    "teach": "grep -i ignora el caso: critico casa con cRiTiCo y CRITICO. Ojo con el acento: «crítico» con tilde NO casa con «critico» — en logs reales conviene decidir qué se busca y probarlo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "cRiTiCo refrigerante bajo: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nCRITICO simulacro programado a mediodía"
      }
    ],
    "steps": [
      {
        "raw": "grep -i 'critico' /home/agent/reactor.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-i critico /home/agent/reactor.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -i 'critico' /home/agent/reactor.log"
  },
  {
    "id": "grep-l3",
    "track": "grep",
    "index": 3,
    "title": "Quitar el ruido",
    "subtitle": "grep -v: excluir líneas",
    "xp": 35,
    "difficulty": 2,
    "brief": "El proxy.conf es un ruido de comentarios y líneas de debug. El ajuste auth_secret está ahí, escondido entre tanto adorno.",
    "goal": "Trae a la vista la línea auth_secret del config: primero descarta los comentarios (#), luego busca el ajuste.",
    "keywords": [
      "grep",
      "-v",
      "excluir"
    ],
    "hints": [
      "−v es el filtro inverso: muestra las líneas que NO casan.",
      "Encadena dos greps con una tubería: limpiar primero, apuntar después.",
      "grep -v '^#' /home/agent/proxy.conf | grep 'auth_secret'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -v patrón f",
        "desc": "excluye las líneas que casan"
      },
      {
        "cmd": "cmd1 | cmd2",
        "desc": "tubería: la salida alimenta al siguiente"
      }
    ],
    "teach": "grep -v invierte el criterio: «muéstrame lo que NO casa». Combinar −v con un segundo grep es el patrón clásico de limpieza: quita lo inútil y entonces filtra lo importante.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "auth_secret FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -v '^#' /home/agent/proxy.conf | grep 'auth_secret'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-v ^# /home/agent/proxy.conf",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "auth_secret",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -v '^#' /home/agent/proxy.conf | grep 'auth_secret'"
  },
  {
    "id": "grep-l4",
    "track": "grep",
    "index": 4,
    "title": "La línea número…",
    "subtitle": "grep -n: numerar resultados",
    "xp": 35,
    "difficulty": 2,
    "brief": "Para reportar el incidente al rango superior necesitas saber en QUÉ línea del registro aterrizó la anomalía.",
    "goal": "Imprime la línea de la anomalía con su número de línea (formato nº: contenido).",
    "keywords": [
      "grep",
      "-n",
      "numerar"
    ],
    "hints": [
      "−n antepone el número de línea a cada coincidencia.",
      "La palabra anomalía (con acento) aparece solo en la línea 12.",
      "grep -n 'anomalía' /home/agent/turnos.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -n patrón f",
        "desc": "con número de línea"
      },
      {
        "cmd": "grep -in patrón f",
        "desc": "insensible + numerado"
      }
    ],
    "teach": "grep -n numeriza las coincidencias: imprescindible para decir «línea 12» al operador de guardia. Se combina con las demás opciones: -in, -rn, -on…",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "12:2026-10-22 08:12 anomalía FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -n 'anomalía' /home/agent/turnos.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-n anomalía /home/agent/turnos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-n",
                "meaning": "numera las líneas coincidentes"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -n 'anomalía' /home/agent/turnos.log"
  },
  {
    "id": "grep-l5",
    "track": "grep",
    "index": 5,
    "title": "Solo la marca",
    "subtitle": "grep -o: extraer, no mostrar",
    "xp": 45,
    "difficulty": 3,
    "brief": "En carta.txt la marca viaja dentro de la prosa: la línea entera es demasiado ruido. Quieres SOLO la pieza que casa, nada más.",
    "goal": "Extrae de carta.txt únicamente la subcadena en formato FLAG{…} (una línea limpia, sin adornos).",
    "keywords": [
      "grep",
      "-o",
      "extraer"
    ],
    "hints": [
      "−o imprime la PARTE que casa, no la línea entera.",
      "El patrón debe describir: FLAG + { + todo lo que NO sea llave de cierre + }.",
      "grep -oE 'FLAG\\{[^}]*\\}' carta.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE 'FLAG\\{[^}]*\\}' f",
        "desc": "extrae solo la marca"
      },
      {
        "cmd": "grep -oE '[0-9]+' f",
        "desc": "extrae todos los números"
      }
    ],
    "teach": "grep -o cambia el foco: en lugar de líneas completas, extrae exactamente la coincidencia. Con -E y el patrón FLAG\\{[^}]*\\} sales las marcas en una línea limpia… y las truncadas sin cierre, descartadas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE 'FLAG\\{[^}]*\\}' /home/agent/carta.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\} /home/agent/carta.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -oE 'FLAG\\{[^}]*\\}' /home/agent/carta.txt"
  },
  {
    "id": "grep-l6",
    "track": "grep",
    "index": 6,
    "title": "Rango privado",
    "subtitle": "grep -E con anclas y clases",
    "xp": 50,
    "difficulty": 3,
    "brief": "Un envío interno (subred 172.31.*) filtró el hallazgo hacia una puerta impropia. Los demás rangos son de paseo.",
    "goal": "Imprime del registro de red las entradas cuyo emisor empieza por 172.31. (anclado al inicio de línea).",
    "keywords": [
      "grep",
      "-E",
      "regex",
      "IP"
    ],
    "hints": [
      "−E activa la regex extendida: + (uno o más), clases [0-9], anclas ^.",
      "En -E el punto ANY es \\. y el punto préstamo es . literal.",
      "grep -E '^172\\.31\\.[0-9]+\\.[0-9]+' /home/agent/red.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E '^172\\.31\\.' f",
        "desc": "IP anclada a inicio de línea"
      },
      {
        "cmd": "grep -E '(a|b)c'",
        "desc": "alternancia"
      }
    ],
    "teach": "grep -E abre el vocabulario regex completo: +, clases y anclas ^. Los puntos literales se escapan: \\. — sin el escape casarían «cualquier carácter». La ancla ^ evita que una IP en medio de la línea engañe.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "172.31.14.3 -> entrega del hallazgo: FLAG{d3b09a4f7c2e1b8d6041a5f3}\n172.31.255.1 -> balanceador sin etiqueta"
      }
    ],
    "steps": [
      {
        "raw": "grep -E '^172\\.31\\.[0-9]+\\.[0-9]+' /home/agent/red.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E ^172\\.31\\.[0-9]+\\.[0-9]+ /home/agent/red.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E '^172\\.31\\.[0-9]+\\.[0-9]+' /home/agent/red.log"
  },
  {
    "id": "grep-l7",
    "track": "grep",
    "index": 7,
    "title": "Reglas literales",
    "subtitle": "grep -F: patrón sin regex",
    "xp": 50,
    "difficulty": 3,
    "brief": "El cuaderno del taller guarda órdenes con símbolos que parecerían regex (*. ?). Los decoys escribieron variantes sin símbolos. −F toma el patrón tal cual.",
    "goal": "Encuentra en taller.txt la línea que contiene la instrucción detector.*laser escrita tal cual, con sus símbolos.",
    "keywords": [
      "grep",
      "-F",
      "literal"
    ],
    "hints": [
      "−F significa Fixed: el patrón es TEXTO PLANO, sin interpretación regex.",
      "Como regex, detector.*laser casaría «detectorXlaser»; con -F solo casa los caracteres exactos: detector.*laser.",
      "grep -F 'detector.*laser' /home/agent/taller.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -F 'a.*b' f",
        "desc": "coincidencia literal"
      },
      {
        "cmd": "grep -Ff lista.txt f",
        "desc": "múltiples patrones literal de un fichero"
      }
    ],
    "teach": "grep -F (Fixed) trata el patrón como texto: ni + ni * ni puntos mágicos. Es además el grep más rápido en ficheros grandes porque se salta el motor de regex.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "plan maestro: detector.*laser activo esta noche FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -F 'detector.*laser' /home/agent/taller.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-F detector.*laser /home/agent/taller.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "patrón literal, sin regex"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -F 'detector.*laser' /home/agent/taller.txt"
  },
  {
    "id": "grep-l8",
    "track": "grep",
    "index": 8,
    "title": "El bosque de expedientes",
    "subtitle": "grep -r: búsqueda recursiva",
    "xp": 55,
    "difficulty": 3,
    "brief": "Los expedientes están repartidos en carpetas por año y mes. Solo quien mira en profundidad encuentra la entrada con la marca.",
    "goal": "Recorre todo el árbol expedientes/ y muestra la línea que contiene la palabra confirmada (con su ruta y línea).",
    "keywords": [
      "grep",
      "-r",
      "recursivo"
    ],
    "hints": [
      "−r baja recursivamente por los subdirectorios: grep PATRÓN DIRECTORIO.",
      "Dos líneas dicen «hallazgo confirmado»; la verdadera trae la marca.",
      "grep -r 'hallazgo confirmado' /home/agent/expedientes"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -r patrón dir",
        "desc": "recursivo: ruta + línea"
      },
      {
        "cmd": "grep -rl patrón dir",
        "desc": "solo ficheros con coincidencia"
      }
    ],
    "teach": "grep -r recorre el árbol: imprime cada coincidencia con su ruta de origen. Con -rn numeras las líneas del hallazgo; con -rl recibes solo los nombres de fichero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/expedientes/2025/diciembre/h-05.txt:hallazgo confirmado (el disputado, sin marca)\n/home/agent/expedientes/2026/febrero/h-31.txt:hallazgo confirmado con la marca: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -r 'hallazgo confirmado' /home/agent/expedientes",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r hallazgo confirmado /home/agent/expedientes",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r 'hallazgo confirmado' /home/agent/expedientes"
  },
  {
    "id": "grep-l9",
    "track": "grep",
    "index": 9,
    "title": "Palabras, no fragmentos",
    "subtitle": "grep -w: palabra entera",
    "xp": 60,
    "difficulty": 4,
    "brief": "El índice de niebla trae variantes: brumario, desbrumar, brumelia… Solo el registro con literalmente la palabra bruma aislada guarda la señal.",
    "goal": "Imprime del índice ÚNICAMENTE las líneas donde aparece bruma como palabra entera (ni brumario ni desbrumar ni brumelia).",
    "keywords": [
      "grep",
      "-w",
      "palabra"
    ],
    "hints": [
      "−w exige que la coincidencia sea una PALABRA completa (delimitada por espacios, puntuación, inicio/fin de línea).",
      "Sin -w, «bruma» casaría dentro de «brumario»; con -w no.",
      "grep -w 'bruma' /home/agent/indice.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -w palabra f",
        "desc": "solo palabras completas"
      },
      {
        "cmd": "grep -oE 'FLAG\\{[^}]*\\}'",
        "desc": "extraer la marca en cualquier contexto"
      }
    ],
    "teach": "grep -w garantiza palabra entera: bruma casa, brumario no. Es el antídoto contra los falsos positivos cuando el vocabulario del dojo tiene familias completas de palabras parecidas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "bruma señal clara en el patio: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nniebla densa, sin bruma aparente"
      }
    ],
    "steps": [
      {
        "raw": "grep -w 'bruma' /home/agent/indice.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-w bruma /home/agent/indice.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-w",
                "meaning": "flag w del comando — revisa «man grep»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -w 'bruma' /home/agent/indice.txt"
  },
  {
    "id": "grep-l10",
    "track": "grep",
    "index": 10,
    "title": "Contexto del evento",
    "subtitle": "grep -A/-B/-C: ver alrededor",
    "xp": 65,
    "difficulty": 4,
    "brief": "El registro de tareas no esconde la marca EN la línea del suceso: la clave llega dos líneas DESPUÉS de «pinza». El contexto se lee con −A.",
    "goal": "Muestra del registro la línea pinza y las 2 líneas siguientes (la marca viaja entre ellas).",
    "keywords": [
      "grep",
      "-A",
      "-B",
      "-C",
      "contexto"
    ],
    "hints": [
      "−A N muestra N líneas DESPUÉS de cada coincidencia (−B: antes, −C: ambos).",
      "El patrón punta a la línea 02: pinza marcada; el premio está en la 04.",
      "grep -A2 'pinza marcada' /home/agent/tareas.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -A2 patrón f",
        "desc": "2 líneas después de cada match"
      },
      {
        "cmd": "grep -B3 patrón f",
        "desc": "3 líneas antes"
      },
      {
        "cmd": "grep -C5 patrón f",
        "desc": "5 líneas a ambos lados"
      }
    ],
    "teach": "grep -A/-B/-C dan contexto alrededor del resultado: A de After (después), B de Before (antes), C de Contexto (ambos). Es la forma rápida de leer un log alrededor del evento sin abrir el fichero entero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "tarea 02: pinza marcada en el tablero\ntarea 03: repaso del oficial de guardia\ntarea 04: hallazgo asociado a la pinza: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -A2 'pinza marcada' /home/agent/tareas.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-A2 pinza marcada /home/agent/tareas.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -A2 'pinza marcada' /home/agent/tareas.txt"
  },
  {
    "id": "grep-l11",
    "track": "grep",
    "index": 11,
    "title": "Clases con contadores",
    "subtitle": "grep -E: {n} exacto y rangos",
    "xp": 70,
    "difficulty": 4,
    "brief": "El registro del laboratorio guarda muestras con identificador hex compacto. Solo una fila respeta el formato EXACTO: 16 símbolos hexadecimales minúsculas seguidos de un espacio.",
    "goal": "Imprime del registro solo la línea cuyo primer campo sea exactamente 16 hexadecimales en minúscula seguidos de un espacio.",
    "keywords": [
      "grep",
      "-E",
      "clases",
      "contador"
    ],
    "hints": [
      "[a-f0-9] es un rango: solo letras a–f y dígitos en minúscula.",
      "{16} pide EXACTAMENTE 16 repeticiones del expediente anterior; el espacio después delimita la columna.",
      "grep -E '^[a-f0-9]{16} ' /home/agent/muestras.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E '^[a-f0-9]{16} ' f",
        "desc": "ID hex exacto de 16"
      },
      {
        "cmd": "grep -E '[0-9]{4}-[0-9]{2}'",
        "desc": "formato fecha por clases"
      }
    ],
    "teach": "grep -E con rangos y contadores exactos: {16} pide exactamente 16 repeticiones (ni una más). El ancla ^ fija el inicio y el espacio final delimita el campo: sin explore, casaría prefijos de líneas más largas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "1f2e3d4c5b6a7980 FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -E '^[a-f0-9]{16} ' /home/agent/muestras.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E ^[a-f0-9]{16}  /home/agent/muestras.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E '^[a-f0-9]{16} ' /home/agent/muestras.txt"
  },
  {
    "id": "grep-l12",
    "track": "grep",
    "index": 12,
    "title": "Solo en los conf",
    "subtitle": "grep -r con --include",
    "xp": 70,
    "difficulty": 4,
    "brief": "El directorio servicio mezcla configuraciones .conf con logs, scripts y respaldos. La señal «chip» interesa SOLO entre los ficheros .conf vivos.",
    "goal": "Recursivamente, muestra las coincidencias con chip: solo entre ficheros *.conf (con ruta y línea).",
    "keywords": [
      "grep",
      "-r",
      "--include"
    ],
    "hints": [
      "--include=\"*.conf\" restringe QUÉ ficheros participan en la recursiva.",
      "El patrón \"chip: \" (con espacio y dos puntos) deja fuera los ecos sin valor.",
      "grep -r --include='*.conf' 'chip: ' /home/agent/servicio"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -r --include=\"*.conf\" p dir",
        "desc": "solo ficheros .conf"
      },
      {
        "cmd": "grep -r --exclude=\"*.bak\" p dir",
        "desc": "el inverso: excluir nombres"
      }
    ],
    "teach": "grep -r --include=\"*.conf\" filtra los ficheros por NOMBRE (no por contenido) — imprescindible cuando el árbol está lleno de logs, scripts y backups .conf.bak que no forman parte del servicio.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/servicio/servidor.conf:chip: FLAG{d3b09a4f7c2e1b8d6041a5f3} (config servidor)\n/home/agent/servicio/cliente.conf:chip: FLAG{d3b09a4f7c2e1b8d6041a5f3} (config cliente)\n/home/agent/servicio/mon.conf:chip: FLAG{d3b09a4f7c2e1b8d6041a5f3} (config mon)"
      }
    ],
    "steps": [
      {
        "raw": "grep -r --include='*.conf' 'chip: ' /home/agent/servicio",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r --include=*.conf chip:  /home/agent/servicio",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              },
              {
                "flag": "--include=*.conf",
                "meaning": "patrones de ficheros a incluir en la búsqueda"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r --include='*.conf' 'chip: ' /home/agent/servicio"
  },
  {
    "id": "grep-l13",
    "track": "grep",
    "index": 13,
    "title": "La línea exacta",
    "subtitle": "grep -x: coincidencia de línea completa",
    "xp": 75,
    "difficulty": 4,
    "brief": "El registro de accesos guarda pares sec=valor con trampas: indentados, con cola, comentados… Solo una línea es limpia de la forma sec=valor_entero.",
    "goal": "Imprime del registro únicamente las líneas que son exactamente sec=valor (sin espacios antes o después del valor).",
    "keywords": [
      "grep",
      "-x",
      "exacto"
    ],
    "hints": [
      "−x exige que el patrón case TODA la línea (equivale a ^patrón$).",
      "[^[:space:]]+ es «uno o más símbolos que no sean espacios»: descarta indentados, colas y tabs.",
      "grep -xE 'sec=[^[:space:]]+' /home/agent/accesos.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -x 'palabra' f",
        "desc": "coincidencia de línea entera"
      },
      {
        "cmd": "grep -xE 'sec=[^[:space:]]+'",
        "desc": "exacto con clase negada"
      }
    ],
    "teach": "grep -x (exact) obliga a que la coincidencia cubra la línea entera. Con la clase negada [^[:space:]] eliminan trampas de espacios; combinado -xE demuestra que las opciones se acumulan.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "sec=FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -xE 'sec=[^[:space:]]+' /home/agent/accesos.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-xE sec=[^[:space:]]+ /home/agent/accesos.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man grep»"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -xE 'sec=[^[:space:]]+' /home/agent/accesos.txt"
  },
  {
    "id": "grep-l14",
    "track": "grep",
    "index": 14,
    "title": "Boss: la cadena del intruso",
    "subtitle": "cadena de greps: -rh + -oE",
    "xp": 130,
    "difficulty": 5,
    "brief": "Un intruso escribió eventos EXFIL por todo el árbol intrusion/. En un evento real viaja la marca completa; los demás son señuelos incompletos. Dos greps encadenados la desenmascaran.",
    "goal": "Extrae del árbol intrusion/ la marca completa FLAG{…} imprimiendo ÚNICAMENTE la marca (sin rutas ni adornos).",
    "keywords": [
      "grep",
      "boss",
      "-r",
      "-o",
      "cadena"
    ],
    "hints": [
      "Primer grep: -r recupera las líneas EXFIL del árbol y -h oculta las rutas.",
      "Los parciales sin llaves son trampa: FLAG\\{[^}]*\\} exige cuerpo antes del cierre.",
      "grep -rh 'EXFIL' intrusion | grep -oE 'FLAG\\{[^}]*\\}'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -rh patrón dir",
        "desc": "recursivo sin rutas"
      },
      {
        "cmd": "grep -oE 'FLAG\\{[^}]*\\}' f",
        "desc": "extraer la marca"
      }
    ],
    "teach": "La cadena -rh + -oE es el extractor forense: primero selecciona las líneas relevantes en el árbol (−h tira el ruido de rutas), luego −o entrega solo lo casado. Es el patrón grep-sobre-grep: «dime dónde, y luego dame solo la cosa».",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -rh 'EXFIL' /home/agent/intrusion | grep -oE 'FLAG\\{[^}]*\\}'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-rh EXFIL /home/agent/intrusion",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              },
              {
                "flag": "-h",
                "meaning": "flag h del comando — revisa «man grep»"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-oE FLAG\\{[^}]*\\}",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -rh 'EXFIL' /home/agent/intrusion | grep -oE 'FLAG\\{[^}]*\\}'"
  },
  {
    "id": "awk-l1",
    "track": "awk",
    "index": 1,
    "title": "El inspector de columnas",
    "subtitle": "awk: campos $1, $2…",
    "xp": 25,
    "difficulty": 1,
    "brief": "En cargos.txt cada línea es «alias objeto peso». Un envío viene marcado con la marca como objeto y su alias es vista.",
    "goal": "Imprime de cargos.txt el SEGUNDO campo de la línea cuyo primer campo es vista.",
    "keywords": [
      "awk",
      "campos"
    ],
    "hints": [
      "awk trabaja con la estructura «patrón {acción}»: el patrón selecciona líneas, la acción imprime.",
      "awk parte cada línea en campos: $1, $2, $3… y $2 es el segundo.",
      "awk '$1 == \"vista\" {print $2}' /home/agent/cargos.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{print $2}' f",
        "desc": "segundo campo de cada línea"
      },
      {
        "cmd": "awk '$1 == \"x\" {print $2}' f",
        "desc": "campo 2 de las línea cuyo campo 1 es x"
      }
    ],
    "teach": "awk parte cada línea en campos separados por espacios: $1 primero, $2 segundo y $NF último. La estructura patrón {acción} es el corazón de awk: filtro y acción en una sola línea.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$1 == \"vista\" {print $2}' /home/agent/cargos.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$1 == \"vista\" {print $2} /home/agent/cargos.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$1 == \"vista\" {print $2}' /home/agent/cargos.txt"
  },
  {
    "id": "awk-l2",
    "track": "awk",
    "index": 2,
    "title": "El último campo",
    "subtitle": "awk $NF: la cola de la línea",
    "xp": 30,
    "difficulty": 2,
    "brief": "Los mensajes de maniobra tienen longitud variable. En los de cinco campos va la marca en el final.",
    "goal": "Imprime de mensajes.txt el ÚLTIMO campo de las líneas que empiezan por maniobra y tienen exactamente 5 campos.",
    "keywords": [
      "awk",
      "$NF",
      "NF"
    ],
    "hints": [
      "$NF es el ÚLTIMO campo de la línea (se ajusta a cualquier longitud) y NF es cuántos campos tiene.",
      "Filtra $1 == \"maniobra\" && NF == 5 y entonces imprime $NF.",
      "awk '$1 == \"maniobra\" && NF == 5 {print $NF}' /home/agent/mensajes.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{print $NF}' f",
        "desc": "último campo de cada línea"
      },
      {
        "cmd": "awk 'NF == 5' f",
        "desc": "líneas de exactamente 5 campos"
      }
    ],
    "teach": "awk $NF apunta al último campo sin importar la longitud de la línea; NF es el número de campos. La pareja (NF, $NF) maneja registros de ancho variable sin bucles.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$1 == \"maniobra\" && NF == 5 {print $NF}' /home/agent/mensajes.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$1 == \"maniobra\" && NF == 5 {print $NF} /home/agent/mensajes.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$1 == \"maniobra\" && NF == 5 {print $NF}' /home/agent/mensajes.txt"
  },
  {
    "id": "awk-l3",
    "track": "awk",
    "index": 3,
    "title": "La contraseña del asistente",
    "subtitle": "awk -F: separador personalizado",
    "xp": 35,
    "difficulty": 2,
    "brief": "El dojo guarda cuentas como passwd, separadas por dos-puntos. La del asistente quedó escrita EN CLARO en el segundo campo.",
    "goal": "De cuentas.dat, imprime el SEGUNDO campo (la contraseña) de la cuenta cuyo primer campo es asistente.",
    "keywords": [
      "awk",
      "-F",
      "separador"
    ],
    "hints": [
      "-F: cambia el separador de campos a «dos-puntos».",
      "El filtro $1 == \"asistente\" es comparación exacta; la acción imprime $2.",
      "awk -F: '$1 == \"asistente\" {print $2}' /home/agent/cuentas.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F: '{print $1}' f",
        "desc": "primera columna de passwd"
      },
      {
        "cmd": "awk -F: '$3 > 1000' f",
        "desc": "cuentas con uid alto"
      }
    ],
    "teach": "con -F: las líneas passwd se abren en 7 campos: usuario, contraseña, uid, gid, GECOS, home, shell. awk también acepta separadores multi-carácter o regex: -F\"[, ]+\".",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk -F: '$1 == \"asistente\" {print $2}' /home/agent/cuentas.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "-F: $1 == \"asistente\" {print $2} /home/agent/cuentas.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk -F: '$1 == \"asistente\" {print $2}' /home/agent/cuentas.dat"
  },
  {
    "id": "awk-l4",
    "track": "awk",
    "index": 4,
    "title": "La fila 37",
    "subtitle": "awk NR: fila concreta",
    "xp": 40,
    "difficulty": 2,
    "brief": "El registro de lecturas lleva 42 filas de calma. La 37 guarda la lectura crítica: awk sabe dirigirse directo a ella con NR.",
    "goal": "Imprime únicamente la línea 37 del registro lecturas.txt.",
    "keywords": [
      "awk",
      "NR",
      "línea"
    ],
    "hints": [
      "NR es el número de la línea que awk va procesando (empieza en 1).",
      "NR == 37 imprime la 37.ª línea y nada más.",
      "awk 'NR == 37 {print}' /home/agent/lecturas.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'NR <= 5' f",
        "desc": "las 5 primeras líneas"
      },
      {
        "cmd": "awk 'NR % 2 == 0' f",
        "desc": "solo las filas pares"
      }
    ],
    "teach": "awk cuenta líneas con NR: puedes seleccionar filas concretas (NR==37), rangos (NR>=2 && NR<=5) o pares (NR%2==0) sin tocar nada más.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "lectura 37: pico FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'NR == 37 {print}' /home/agent/lecturas.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "NR == 37 {print} /home/agent/lecturas.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'NR == 37 {print}' /home/agent/lecturas.txt"
  },
  {
    "id": "awk-l5",
    "track": "awk",
    "index": 5,
    "title": "Filas de nueve",
    "subtitle": "awk NF como filtro",
    "xp": 45,
    "difficulty": 3,
    "brief": "El cuaderno de travesías guarda filas de distinto ancho. Solo las filas de EXACTAMENTE 9 palabras llevan la firma del capitán.",
    "goal": "Imprime de travesia.txt únicamente las filas con exactamente 9 campos.",
    "keywords": [
      "awk",
      "NF",
      "filtro"
    ],
    "hints": [
      "NF (sin $) es el número de campos de la línea: e-aye comparar con ==, >, <.",
      "\"Exactamente 9\" es NF == 9 — las de 6 o 10 quedan fuera.",
      "awk 'NF == 9' /home/agent/travesia.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'NF == 9' f",
        "desc": "filas de exactamente 9 campos"
      },
      {
        "cmd": "awk 'NF > 5 && NR > 3' f",
        "desc": "doble filtro"
      }
    ],
    "teach": "awk permite comparar variables internas (NF, NR, $N) con operadores: filtros «por número de columnas» sin escribir bucles. Comprueba con NR en la línea de arriba cuando te cuesten.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "uno dos tres cuatro cinco seis siete ocho FLAG{d3b09a4f7c2e1b8d6041a5f3}\nuno dos tres cuatro cinco seis siete ocho nueve"
      }
    ],
    "steps": [
      {
        "raw": "awk 'NF == 9' /home/agent/travesia.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "NF == 9 /home/agent/travesia.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'NF == 9' /home/agent/travesia.txt"
  },
  {
    "id": "awk-l6",
    "track": "awk",
    "index": 6,
    "title": "Umbral crítico",
    "subtitle": "awk: comparación numérica",
    "xp": 50,
    "difficulty": 3,
    "brief": "Los famacéuticos con tonelaje superior a 120 salen con la marca REMITIDA (y a veces es su nombre).",
    "goal": "De cargamentos.txt, imprime el NOMBRE (1.er campo) de las filas cuyo TONELAJE (2.º campo) supera 120.",
    "keywords": [
      "awk",
      "comparación",
      "umbral"
    ],
    "hints": [
      "$2 > 120 es un filtro numérico: awk convierte el campo a número para comparar.",
      "La acción {print $1} imprime el primer campo (el nombre).",
      "awk '$2 > 120 {print $1}' /home/agent/cargamentos.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$2 > 120 {print $1}' f",
        "desc": "nombre de filas con valor alto"
      },
      {
        "cmd": "awk '$2 <= 50' f",
        "desc": "bajo el umbral (líneas completas)"
      }
    ],
    "teach": "awk es un motor de informáticos: coge una columna, aplica un umbral y Reporta otra columna. La comparación funciona con decimales también (19.5 > 19).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 > 120 {print $1}' /home/agent/cargamentos.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 > 120 {print $1} /home/agent/cargamentos.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 > 120 {print $1}' /home/agent/cargamentos.txt"
  },
  {
    "id": "awk-l7",
    "track": "awk",
    "index": 7,
    "title": "El código de la antena",
    "subtitle": "awk: regex por campo (~)",
    "xp": 55,
    "difficulty": 3,
    "brief": "El radar de equipos registra «equipo código estado». Solo un equipo sigue el patrón H + 3 dígitos + mayúscula exacta: la marca viaja en su estado.",
    "goal": "Imprime de equipos.txt el ESTADO (tercer campo) de la fila cuyo código (2.º campo) es H seguido de 3 dígitos y una mayúscula, nada más.",
    "keywords": [
      "awk",
      "regex",
      "~"
    ],
    "hints": [
      "El operador ~ aplica una regex al campo: $2 ~ /^H./.",
      "Sin contadores {3} (algunos awk no los admiten): encadena [0-9][0-9][0-9].",
      "awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/ {print $3}' /home/agent/equipos.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/' f",
        "desc": "regex exacta sobre campo 2"
      },
      {
        "cmd": "awk '$3 !~ /ok/' f",
        "desc": "el !~ niega el match"
      }
    ],
    "teach": "awk hace regex por campo: $2 ~ /patrón/ casa SOLO el campo dos. Con el delimitador ^…$ evitas códigos parciales; y como el awk del sistema (mawk) no garantiza contadores {3}, encadenamos las clases: portable y seguro.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/ {print $3}' /home/agent/equipos.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 ~ /^H[0-9][0-9][0-9][A-Z]$/ {print $3} /home/agent/equipos.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 ~ /^H[0-9][0-9][0-9][A-Z]$/ {print $3}' /home/agent/equipos.txt"
  },
  {
    "id": "awk-l8",
    "track": "awk",
    "index": 8,
    "title": "El mejor lote",
    "subtitle": "awk: máximo del fichero con END",
    "xp": 60,
    "difficulty": 4,
    "brief": "lotes.txt lista «lote tonelaje». El lote mayor lleva la marca por nombre. awk mantiene al actual campeón mientras recorre y lo anuncia al FINAL.",
    "goal": "Imprime de lotes.txt el NOMBRE del lote de mayor tonelaje.",
    "keywords": [
      "awk",
      "END",
      "máximo"
    ],
    "hints": [
      "Sin END, el \"resultado\" solo vive dentro de línea a línea; con una variable y comparación guardas al mejor.",
      "END se ejecuta UNA VEZ, cuando acaba el fichero: es el sitio del resultado final.",
      "awk '$2 > max {max = $2; best = $1} END {print best}' /home/agent/lotes.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$2 > max {max=$2} END {print max}' f",
        "desc": "máximo de la 2.ª columna"
      },
      {
        "cmd": "awk 'END {print NR}' f",
        "desc": "total de líneas leídas"
      }
    ],
    "teach": "El esquema «comparar en cada línea, guardar al mejor, imprimir en END» es awk streaming: acumulas en variables mientras lee y cierras con la conclusión. Las variables no inicializadas valen 0: no hay que declarlas.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 > max {max = $2; best = $1} END {print best}' /home/agent/lotes.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 > max {max = $2; best = $1} END {print best} /home/agent/lotes.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 > max {max = $2; best = $1} END {print best}' /home/agent/lotes.txt"
  },
  {
    "id": "awk-l9",
    "track": "awk",
    "index": 9,
    "title": "Ensamblaje del sello",
    "subtitle": "awk concatenación + END",
    "xp": 60,
    "difficulty": 4,
    "brief": "trozos.txt guarda la marca partido en tres líneas: «trozo n fragmento». awk los junta en orden y al final los suelta de una tacada con END.",
    "goal": "Concatena los 3.er campos de las líneas trozo de trozos.txt (en el orden del fichero) e imprime TODO en una línea.",
    "keywords": [
      "awk",
      "concatenar",
      "END"
    ],
    "hints": [
      "awk permite manipular variables: s = s $3 añade el tercer campo a lo acumulado.",
      "Pago en una línea: END {print s} al terminar, no en el patrón.",
      "awk '/^trozo/ {s = s $3} END {print s}' /home/agent/trozos.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{s = s $1} END {print s}' f",
        "desc": "concatena los primeros campos"
      },
      {
        "cmd": "awk '{s = s $2 \", \"} END {print s}' f",
        "desc": "concatena con separador"
      }
    ],
    "teach": "awk no necesita bucles para ensamblar: la variable s acumula campos y END los vierte. La concatenación es por yuxtación: s = s $3 (sin +) une el campo tras la variable.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '/^trozo/ {s = s $3} END {print s}' /home/agent/trozos.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "/^trozo/ {s = s $3} END {print s} /home/agent/trozos.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '/^trozo/ {s = s $3} END {print s}' /home/agent/trozos.txt"
  },
  {
    "id": "awk-l10",
    "track": "awk",
    "index": 10,
    "title": "La sesión del trío",
    "subtitle": "awk arrays asociativos: ++c[$1]",
    "xp": 65,
    "difficulty": 4,
    "brief": "sesiones.log registra ids con registros repetidos. Un id aparece TRES veces; solo en su tercera repetición viaja la marca.",
    "goal": "Imprime de sesiones.log el SEGUNDO campo de la fila cuyo id (primer campo) llega a su tercera aparición.",
    "keywords": [
      "awk",
      "asociativo",
      "contenido"
    ],
    "hints": [
      "c[$1] es un array asociativo: cuenta apariciones por id.",
      "Con ++c[$1] == 3 el incremento es de PREFIJO: incrementa antes de comparar — dispara justo en la tercera aparición (el postfijo c[$1]++ lo haría en la cuarta).",
      "awk '++c[$1] == 3 {print $2}' /home/agent/sesiones.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '++c[$1] == 3 {print $2}' f",
        "desc": "3.ª aparición por grupo (prefijo)"
      },
      {
        "cmd": "awk '{c[$1]++} END {for (i in c) print i, c[i]}' f",
        "desc": "recuento por grupo"
      }
    ],
    "teach": "Los arrays asociativos de awk (c[$1]) cuentan, agrupan y deduplican sin sort ni uniq. ++c[$1]==3 usa el incremento de PREFIJO: primero incrementa, luego compara con el valor nuevo — con c[$1]++ (postfijo) dispararía en la cuarta.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '++c[$1] == 3 {print $2}' /home/agent/sesiones.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "++c[$1] == 3 {print $2} /home/agent/sesiones.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '++c[$1] == 3 {print $2}' /home/agent/sesiones.log"
  },
  {
    "id": "awk-l11",
    "track": "awk",
    "index": 11,
    "title": "Dos ficheros, una clave",
    "subtitle": "awk FNR==NR: joins",
    "xp": 70,
    "difficulty": 4,
    "brief": "claves.txt lista ids autorizados; valores.dat trae «id valor». Solo la fila del id que aparece en claves lleva la marca en el valor.",
    "goal": "Del par claves.txt + valores.dat: imprime el VALOR (2.º campo) de las filas cuyo id está presente en claves.txt.",
    "keywords": [
      "awk",
      "FNR",
      "NR",
      "join"
    ],
    "hints": [
      "Cuando hacka recibe dos ficheros, FNR==NR significa «estoy en el primero».",
      "En el primero: llenar el array; con next saltas sin procesar más.",
      "awk 'FNR==NR {cl[$1]; next} $1 in cl {print $2}' /home/agent/claves.txt /home/agent/valores.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'FNR==NR {k[$1]; next} $1 in k'",
        "desc": "join simple de dos ficheros"
      },
      {
        "cmd": "awk 'FILENAME == \"b\"' a b",
        "desc": "elige filas por nombre de fichero"
      }
    ],
    "teach": "FNR (contador por fichero) y NR (global) distinstinguen los ficheros: FNR==NR es el truco clásico que convierte awk en \"SQL del shell\": un índice en el primer fichero y consultas contra el segundo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'FNR==NR {cl[$1]; next} $1 in cl {print $2}' /home/agent/claves.txt /home/agent/valores.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "FNR==NR {cl[$1]; next} $1 in cl {print $2} /home/agent/claves.txt /home/agent/valores.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'FNR==NR {cl[$1]; next} $1 in cl {print $2}' /home/agent/claves.txt /home/agent/valores.dat"
  },
  {
    "id": "awk-l12",
    "track": "awk",
    "index": 12,
    "title": "Cadena del caudal",
    "subtitle": "awk acumulador con filtro",
    "xp": 80,
    "difficulty": 5,
    "brief": "El medidor de caudal escribe «estación valor token». Solo las estaciones con valor superior a 50 llevan fragmentos de la marca; el resto suelta señuelos.",
    "goal": "De caudal.txt: imprime la concatenación de los tokens (3.º campo) de las filas con valor superior a 50.",
    "keywords": [
      "awk",
      "acumulador",
      "END"
    ],
    "hints": [
      "Filtrar $2 > 50 deja solo las filas del caudal crítico.",
      "La variable t acumula el campo 3 de cada fila válida; END lo imprime.",
      "awk '$2 > 50 {t = t $3} END {print t}' /home/agent/caudal.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'cond {t = t $n} END {print t}' f",
        "desc": "acumulador con filtro"
      },
      {
        "cmd": "awk '{c += $2} END {print c}' f",
        "desc": "suma de la 2.ª columna"
      }
    ],
    "teach": "awk acumulando bajo una condición: filtro escalar + END. Con umbral numérico seleccionas y con la yuxtación t = t $3. ensamblas piezas repartidas por el fichero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 > 50 {t = t $3} END {print t}' /home/agent/caudal.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 > 50 {t = t $3} END {print t} /home/agent/caudal.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 > 50 {t = t $3} END {print t}' /home/agent/caudal.txt"
  },
  {
    "id": "awk-l13",
    "track": "awk",
    "index": 13,
    "title": "Detección dinámica",
    "subtitle": "awk match() + RSTART/RLENGTH",
    "xp": 85,
    "difficulty": 5,
    "brief": "pistas.txt mezcla prosa con marcas enterradas: la elegante FLAG{…} está dentro de la línea, no siempre al principio. match() la revela donde quiera que esté.",
    "goal": "De pistas.txt: imprime únicamente la subcadena FLAG{…} (con match() y substr()).",
    "keywords": [
      "awk",
      "match",
      "substr",
      "RSTART"
    ],
    "hints": [
      "match($0, /regex/) devuelve la posición 0-base: si casó, llena RSTART (inicio) y RLENGTH (longitud).",
      "substr(texto, RSTART, RLENGTH) recorta la subcadena.",
      "awk 'match($0, /FLAG[{][^}]*[}]/) {print substr($0, RSTART, RLENGTH)}' /home/agent/pistas.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'match($0, /p/) {print substr($0, RSTART, RLENGTH)}'",
        "desc": "extraer lo que casó"
      },
      {
        "cmd": "awk '{print index($0, \"x\")}' f",
        "desc": "posición de un texto"
      }
    ],
    "teach": "match(sel, regex) llena RSTART/RLENGTH con la posición del casamiento: no necesitas imprimir la línea entera. Con las llaves dentro de clases de caracteres ([{], [}]) el patrón es portable a cualquier awk (gawk, mawk).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}\nFLAG{eco min}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'match($0, /FLAG[{][^}]*[}]/) {print substr($0, RSTART, RLENGTH)}' /home/agent/pistas.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "match($0, /FLAG[{][^}]*[}]/) {print substr($0, RSTART, RLENGTH)} /home/agent/pistas.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'match($0, /FLAG[{][^}]*[}]/) {print substr($0, RSTART, RLENGTH)}' /home/agent/pistas.txt"
  },
  {
    "id": "awk-l14",
    "track": "awk",
    "index": 14,
    "title": "Boss: la firma del operador",
    "subtitle": "awk: doble filtro + acumulador + END",
    "xp": 130,
    "difficulty": 5,
    "brief": "canal.txt trae eventos «id estado señal token». Solo los eventos con estado OK y señal sig son firmas válidas: sus tokens unidos en orden componen la firma completa. El resto son trampas de caso o estado.",
    "goal": "Concatena de canal.txt los tokens (4.º campo) de las filas con estado OK (2.º campo) y señal sig exacta (3.º campo), e imprime la firma completa.",
    "keywords": [
      "awk",
      "boss",
      "filtro",
      "acumulador"
    ],
    "hints": [
      "Filtrar $2 == \"OK\" deja fuera los FAI y aviso de error.",
      "El 3.º campo debe ser EXACTO \"sig\": ni SIG ni ok minúscula estafan el estado.",
      "awk '$2 == \"OK\" && $3 == \"sig\" {t = t $4} END {print t}' /home/agent/canal.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'c1 && c2 {t = t $n} END {print t}' f",
        "desc": "doble filtro + acumular"
      },
      {
        "cmd": "awk '$3 == \"sig\"' f",
        "desc": "igualdad exacta en campo"
      }
    ],
    "teach": "El boss de awk es el oficio: dos filtros de campo (igualdad exacta) más acumulador y END. Con esto ensamblas cualquier salida «señal repartida por un fichero» directo del shell.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 == \"OK\" && $3 == \"sig\" {t = t $4} END {print t}' /home/agent/canal.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 == \"OK\" && $3 == \"sig\" {t = t $4} END {print t} /home/agent/canal.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 == \"OK\" && $3 == \"sig\" {t = t $4} END {print t}' /home/agent/canal.txt"
  },
  {
    "id": "grep-pro-l1",
    "track": "grep-pro",
    "index": 1,
    "title": "El ladrón de direcciones",
    "subtitle": "grep -oE: extracción con clases y cuantificadores",
    "xp": 60,
    "difficulty": 4,
    "brief": "El registro de contactos está lleno de nombres, notas y aprender tanto como se pueda: solo las direcciones de correo son la señal.",
    "goal": "Extrae de emails.log ÚNICAMENTE las direcciones de correo (una por línea); la línea del testigo lleva la marca y se lista aparte.",
    "keywords": [
      "grep",
      "-oE",
      "extraer",
      "correo"
    ],
    "hints": [
      "-o imprime solo la parte que casa; con -E tienes cuantificadores: +, {n,m}, alternancia |.",
      "El patrón canonical del correo: usuario@dominio.tld, con clases [a-z0-9._-]+ y el punto como [.].",
      "El testigo no tiene email: su línea completa sale aparte con grep 'FLAG{'.",
      "grep -oE '[a-z0-9._-]+@[a-z0-9.-]+[.][a-z]{2,4}' /home/agent/emails.log ; grep 'FLAG{' /home/agent/emails.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE 'patr\\\\.' f",
        "desc": "extrae solo lo que casa"
      },
      {
        "cmd": "grep -oE '[a-z0-9]+@\\\\S+' f",
        "desc": "otra forma de email"
      }
    ],
    "teach": "grep -oE convierte grep en extractor: cada coincidencia sale limpia en su propia línea. Con -E tienes {n,m}, clases por letra y punto; extrae el dato sin sed ni cut.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "agente.snorkel@dojo.exam\nsoporte@dojo.exam\nrelay@spam-farm.es\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE '[a-z0-9._-]+@[a-z0-9.-]+[.][a-z]{2,4}' /home/agent/emails.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE [a-z0-9._-]+@[a-z0-9.-]+[.][a-z]{2,4} /home/agent/emails.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/emails.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/emails.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -oE '[a-z0-9._-]+@[a-z0-9.-]+[.][a-z]{2,4}' /home/agent/emails.log ; grep 'FLAG{' /home/agent/emails.log"
  },
  {
    "id": "grep-pro-l2",
    "track": "grep-pro",
    "index": 2,
    "title": "El contador de errores",
    "subtitle": "grep -c: cuenta, no liste",
    "xp": 60,
    "difficulty": 4,
    "brief": "Tres servidores tributes a un solo log; el turno pide la cifra de errores, no la lista entera.",
    "goal": "De accidente.log imprime CUÁNTAS líneas contienen la palabra ERROR (número) y, aparte, la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-c",
      "contador"
    ],
    "hints": [
      "-c es el CONTADOR de líneas casadas: emite un número, no el listado.",
      "No confundir -C (mayúscula, contexto) con -c (minúscula, contador).",
      "El testigo también es de ERROR: su línea completa sale aparte con grep 'FLAG{'.",
      "grep -c 'ERROR' /home/agent/accidente.log ; grep 'FLAG{' /home/agent/accidente.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -c patrón f",
        "desc": "cuántas líneas casan"
      },
      {
        "cmd": "grep -cv patrón f",
        "desc": "cuántas NO casan"
      }
    ],
    "teach": "grep -c es el «wc -l del filtro»: la primera pregunta en diagnósticos siempre es «¿cuántas veces pasó?» antes de ver detalles.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "3\nERROR testigo de la marca: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -c 'ERROR' /home/agent/accidente.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-c ERROR /home/agent/accidente.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-c",
                "meaning": "cuenta coincidencias en vez de imprimirlas"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/accidente.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/accidente.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -c 'ERROR' /home/agent/accidente.log ; grep 'FLAG{' /home/agent/accidente.log"
  },
  {
    "id": "grep-pro-l3",
    "track": "grep-pro",
    "index": 3,
    "title": "Mayúsculas rebeldes, cuenta igual",
    "subtitle": "grep -ic: caso insensible + contador",
    "xp": 65,
    "difficulty": 4,
    "brief": "El registro usa error/Error/ERROR indistintamente. El informe de incidencias exige el total sin carecer del formato.",
    "goal": "De visitas.log imprime el NÚMERO de líneas con error en cualquier formato de letras y, aparte, la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-ic",
      "insensible",
      "contador"
    ],
    "hints": [
      "Las opciones de grep se APILAN: -i (insensible) + -c (contador).",
      "El resultado del contador es un único número.",
      "El testigo también se cuenta (formato errOr): su línea sale aparte con grep 'FLAG{'.",
      "grep -ic 'error' /home/agent/visitas.log ; grep 'FLAG{' /home/agent/visitas.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -ic pat f",
        "desc": "conteo sin mirar mayúsculas"
      },
      {
        "cmd": "grep -in pat f",
        "desc": "listado insensible numerado"
      }
    ],
    "teach": "Combinar opciones cortas -ic (o -i -c) suma efectos. La apilación es la razón por la que grep sigue útil en árboles grandes.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "6\nerrOr testigo: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -ic 'error' /home/agent/visitas.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-ic error /home/agent/visitas.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              },
              {
                "flag": "-c",
                "meaning": "cuenta coincidencias en vez de imprimirlas"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/visitas.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/visitas.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -ic 'error' /home/agent/visitas.log ; grep 'FLAG{' /home/agent/visitas.log"
  },
  {
    "id": "grep-pro-l4",
    "track": "grep-pro",
    "index": 4,
    "title": "El despertador del ruido",
    "subtitle": "grep -v: excluir comentarios y líneas vacías",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fichero tomcat.conf es 80% comentarios y líneas en blanco. Se lee bien cuando limpías.",
    "goal": "Imprime del fichero tomcat.conf únicamente las líneas de configuración real: quita los comentarios (# al principio) y las líneas vacías, EN DOS PASADAS.",
    "keywords": [
      "grep",
      "-v",
      "limpieza",
      "conf"
    ],
    "hints": [
      "Primera pasada: -v '^#' quita los comentarios.",
      "Las líneas vacías son '^$' (ancla inicio + ancla fin, nada en medio). Con espacios antes puede usar '\\s*' o [[:space:]]*.",
      "grep -v '^#' /home/agent/tomcat.conf | grep -v '^[[:space:]]*$'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -v '^#' f",
        "desc": "descarta comentarios de línea"
      },
      {
        "cmd": "grep -v '^[[:space:]]*$' f",
        "desc": "descarta vacías/blancas"
      },
      {
        "cmd": "grep -E -v '^(#|$)' f",
        "desc": "ambas en una regex"
      }
    ],
    "teach": "Los greps -v encadenados son el patrón clásico de limpieza. El ^ y el $ son impacrables: ^# solo casa SI la línea ARRANCA con #, y ^$ solo si está vacía.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "buffer = 16\nmodo = estricto\nusuario = agent\npuerto = 8080 FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -v '^#' /home/agent/tomcat.conf | grep -v '^[[:space:]]*$'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-v ^# /home/agent/tomcat.conf",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-v ^[[:space:]]*$",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -v '^#' /home/agent/tomcat.conf | grep -v '^[[:space:]]*$'"
  },
  {
    "id": "grep-pro-l5",
    "track": "grep-pro",
    "index": 5,
    "title": "Solo los nombres de ficheros con señal",
    "subtitle": "grep -rl: nombres, no contenido",
    "xp": 65,
    "difficulty": 4,
    "brief": "La auditoría sobre el árbol de negocio no quiere el detalle, solo SABER EN QUÉ ficheros aparece la señal.",
    "goal": "Del árbol negocio/, da la lista de ficheros que contienen «confidencial» (solo nombres) y deja a la vista la línea del testigo que lleva la marca.",
    "keywords": [
      "grep",
      "-l",
      "-r",
      "ficheros"
    ],
    "hints": [
      "-l cambia la salida: muestra SOLO nombres de ficheros; con -r lo haces recursivo.",
      "La línea del testigo con la marca sale a la vista con un grep aparte.",
      "grep -rl 'confidencial' /home/agent/negocio ; grep -r 'FLAG{' /home/agent/negocio"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -rl patrón dir",
        "desc": "recursivo: solo nombres"
      },
      {
        "cmd": "grep -l patrón f1 f2",
        "desc": "solo ficheros con match"
      }
    ],
    "teach": "grep -l es la herramienta del «¿qué ficheros toca?» antes de entrar. Tras ella, alimenta un for/xargs con los nombres.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/negocio/clientes/nota.txt\n/home/agent/negocio/secretos.txt\n/home/agent/negocio/proveedores/suministro.csv\n/home/agent/negocio/secretos.txt:confidencial: el testigo FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -rl 'confidencial' /home/agent/negocio",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-rl confidencial /home/agent/negocio",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              },
              {
                "flag": "-l",
                "meaning": "solo nombres de fichero con coincidencia"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep -r 'FLAG{' /home/agent/negocio",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r FLAG{ /home/agent/negocio",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -rl 'confidencial' /home/agent/negocio ; grep -r 'FLAG{' /home/agent/negocio"
  },
  {
    "id": "grep-pro-l6",
    "track": "grep-pro",
    "index": 6,
    "title": "Los ficheros SIN señal",
    "subtitle": "grep -L: el inverso de -l",
    "xp": 70,
    "difficulty": 4,
    "brief": "La auditoría legal pide la lista de ficheros que NUNCA citan el término «comprometido». Es lo contrario de -l.",
    "goal": "Del árbol auditoria/, imprime los NOMBRES de los ficheros que NO contienen «comprometido» y, aparte, la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-L",
      "inverso"
    ],
    "hints": [
      "-L (MAYÚSCULA) muestra los ficheros SIN ninguna coincidencia; -l minúscula los CON.",
      "La línea del testigo con la marca se enseña aparte con grep.",
      "grep -L 'comprometido' /home/agent/auditoria/* ; grep 'FLAG{' /home/agent/auditoria/testigo.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -L patrón *.txt",
        "desc": "ficheros que NO casan"
      },
      {
        "cmd": "grep -L patrón dir/*",
        "desc": "idem sobre la dir"
      }
    ],
    "teach": "grep -L es la luz reversa: te parla los ficheros donde NO hubo señal. En auditorías de fuga, cualquier fichero en esa lista es sospechoso.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/auditoria/acta.txt\n/home/agent/auditoria/bitacora.txt\n/home/agent/auditoria/resumen.txt\n/home/agent/auditoria/testigo.txt\nmalargue asunto: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -L 'comprometido' /home/agent/auditoria/*",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-L comprometido /home/agent/auditoria/*",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/auditoria/testigo.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/auditoria/testigo.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -L 'comprometido' /home/agent/auditoria/* ; grep 'FLAG{' /home/agent/auditoria/testigo.txt"
  },
  {
    "id": "grep-pro-l7",
    "track": "grep-pro",
    "index": 7,
    "title": "Solo la primera",
    "subtitle": "grep -m 1: para tras el primer match",
    "xp": 65,
    "difficulty": 4,
    "brief": "El beacon.log repite la misma señal cada segundo. Para diagnóstico, la PRIMERA es la que interes",
    "goal": "De beacon.log, imprime únicamente la PRIMERA línea que contenga BEACON.",
    "keywords": [
      "grep",
      "-m",
      "límite"
    ],
    "hints": [
      "-m 1 detiene la lectura del fichero tras el primer match (u -m N para N máximo).",
      "En ficheros grandes es una ganancia de rendimiento brutal: no escanea lo demás.",
      "grep -m 1 'BEACON' /home/agent/beacon.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -m 1 pat f",
        "desc": "solo el primer match"
      },
      {
        "cmd": "grep -m 3 pat f",
        "desc": "hasta 3 matches"
      }
    ],
    "teach": "-m N limita el nº de matches POR FICHERO. Con -m 1 pides el primer hallazgo y#----------------------------------------------------------------# para; en modo recursivo, cada fichero aportará su primera copia.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "t=001 BEACON primer latido: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -m 1 'BEACON' /home/agent/beacon.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-m 1 BEACON /home/agent/beacon.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-m",
                "meaning": "flag m del comando — revisa «man grep»"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -m 1 'BEACON' /home/agent/beacon.log"
  },
  {
    "id": "grep-pro-l8",
    "track": "grep-pro",
    "index": 8,
    "title": "El diccionario del operador",
    "subtitle": "grep -f: patrones desde fichero",
    "xp": 70,
    "difficulty": 5,
    "brief": "El equipo de filtrado tiene una lista de 3 palabras (patterns.txt) y un correo largo. Cargarlas una a una sería tontería.",
    "goal": "Usando patterns.txt como lista de patrones, imprime de carta.txt las líneas que contengan CUALQUIERA de esos patrones.",
    "keywords": [
      "grep",
      "-f",
      "patrones",
      "lista"
    ],
    "hints": [
      "-f fichero lee UN patrón POR LÍNEA del fichero dado; busca TODOS.",
      "Puedes combinar con -i, -E, -r, -n como cualquier otro grep.",
      "grep -if /home/agent/patterns.txt /home/agent/carta.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -f patrones.txt f",
        "desc": "múltiples patrones desde fichero"
      },
      {
        "cmd": "grep -Ff patrones.txt f",
        "desc": "idéntico pero patrón literal"
      }
    ],
    "teach": "grep -f fich-lista fich-destino construye una red de detección. Es clásico en filtrado de contenido: listas negras de IP, dominios de spam, etc.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "comunicado URGENTE del guardia\ninforme CONFIDENCIAL adjuntado: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nasuntos de crisis cerrando a tiempo"
      }
    ],
    "steps": [
      {
        "raw": "grep -f /home/agent/patterns.txt -i /home/agent/carta.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-f /home/agent/patterns.txt -i /home/agent/carta.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-f",
                "meaning": "flag f del comando — revisa «man grep»"
              },
              {
                "flag": "-i",
                "meaning": "insensible a mayúsculas"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -f /home/agent/patterns.txt -i /home/agent/carta.txt"
  },
  {
    "id": "grep-pro-l9",
    "track": "grep-pro",
    "index": 9,
    "title": "Pasado el hallazgo",
    "subtitle": "grep -A 2: contexto después",
    "xp": 65,
    "difficulty": 4,
    "brief": "El log de despliegue enraiza el trigger GO y, DESPUÉS, la salida. Necesitas ver lo que sigue.",
    "goal": "De deploy.log imprime la línea que contiene GO y las DOS SIGUIENTES (así estado está en esa zona).",
    "keywords": [
      "grep",
      "-A",
      "contexto"
    ],
    "hints": [
      "-A 2 imprime cada match y las DÚO líneas QUE SIGUEN.",
      "Cuando dos matches se superponen, el contexto puede incluir separadores --.",
      "grep -A 2 'GO' /home/agent/deploy.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -A 2 pat f",
        "desc": "match + 2 siguientes"
      },
      {
        "cmd": "grep -B 3 pat f",
        "desc": "3 ANTIERIORES (B de before)"
      }
    ],
    "teach": "A de after: incluye el contexto posterior. En logs de deploy es la vía rápida de leer «qué pasó tras el evento» sin abrir el fichero entero.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "GO activación de despliegue\nconfig aplicada: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nretora ciclos 2-3"
      }
    ],
    "steps": [
      {
        "raw": "grep -A 2 'GO' /home/agent/deploy.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-A 2 GO /home/agent/deploy.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -A 2 'GO' /home/agent/deploy.log"
  },
  {
    "id": "grep-pro-l10",
    "track": "grep-pro",
    "index": 10,
    "title": "El culpable anterior",
    "subtitle": "grep -B 2: contexto antes",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fallo crítico se entiende SOLO con lo anterior: los dos pasos ANTERIORES al abort.",
    "goal": "De pipeline.log imprime la línea ABORT y las DÚO ANTERIORES (ahí está la causa).",
    "keywords": [
      "grep",
      "-B",
      "contexto"
    ],
    "hints": [
      "-B 2 imprime cada match y las 2 líneas que lo PRECEDEN.",
      "B es de before: la contraparte de -A.",
      "grep -B 2 'ABORT' /home/agent/pipeline.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -B 2 pat f",
        "desc": "2 líneas antes + match"
      },
      {
        "cmd": "grep -A 3 -B 2 pat f",
        "desc": "asimétrica: 3 después, 2 antes"
      }
    ],
    "teach": "El diagnóstico de logs casi siempre mira atrás: -B N da el «qué produjo esto». Con -A N en el mismo grep (o -C) ves la banda completa.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "descargar fuentes (ok)\ncompilar módulo B con la marca: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nABORT pub-sub no responde"
      }
    ],
    "steps": [
      {
        "raw": "grep -B 2 'ABORT' /home/agent/pipeline.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-B 2 ABORT /home/agent/pipeline.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -B 2 'ABORT' /home/agent/pipeline.log"
  },
  {
    "id": "grep-pro-l11",
    "track": "grep-pro",
    "index": 11,
    "title": "La banda alrededor",
    "subtitle": "grep -C 2: ambos lados",
    "xp": 70,
    "difficulty": 5,
    "brief": "El bloque de SIGNAL (baliza) solo tiene su significado con 2 líneas de contexto a BOTH direcciones.",
    "goal": "De baliza.log imprime la línea de la señal BALIZA y DOS líneas de contexto en ambas direcciones.",
    "keywords": [
      "grep",
      "-C",
      "contexto"
    ],
    "hints": [
      "-C 2 = -A 2 + -B 2: contexto completo alrededor del match.",
      "Si el match llega al INICIO del fichero, no habría líneas anteriores que mostrar.",
      "grep -C 2 'BALIZA' /home/agent/baliza.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -C 3 pat f",
        "desc": "3 antes y 3 después"
      },
      {
        "cmd": "grep -A 4 -B 1 pat f",
        "desc": "asimétrica expresa"
      }
    ],
    "teach": "C de context: la herramienta del «muéstrame la escena completa». Con -A y -C combinadas puedes personalizar la banda.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "inicio de la ceremonia\nstress bajo en el generador 1\n>>> BALIZA encendida <<<\nstress alto en el generador 2\nrestaus del ciclo\nstress bajo de regreso\n>>> BALIZA encendida: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -C 2 'BALIZA' /home/agent/baliza.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-C 2 BALIZA /home/agent/baliza.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -C 2 'BALIZA' /home/agent/baliza.log"
  },
  {
    "id": "grep-pro-l12",
    "track": "grep-pro",
    "index": 12,
    "title": "Soporte de multiplicidad",
    "subtitle": "grep -E con |: alternancia",
    "xp": 65,
    "difficulty": 4,
    "brief": "Las líneas de interés viven en dos variantes: confirmada o declined. Ambas importan idénticamente.",
    "goal": "De respuestas.log imprime solo las líneas que contengan confirmada o declined (en una sola pasada).",
    "keywords": [
      "grep",
      "-E",
      "alternancia"
    ],
    "hints": [
      "-E activa la regex extendida, donde el | significa ALTERNANCIA.",
      "Sin -E, el | se interpreta literalmente y tendrías que escaparlo: \\|.",
      "grep -E 'confirmada|declined' /home/agent/respuestas.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E 'a|b' f",
        "desc": "acepta una u otra"
      },
      {
        "cmd": "grep -E '(foo|bar)baz' f",
        "desc": "alternancia dentro del patrón"
      }
    ],
    "teach": "La alternancia en -E (a|b) es el «Y/O» de grep: da igual la rama que case. Con más variantes: (confirmad[oa]|declined).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "ticket-2 confirmada por operador\nticket-4 declined por el cliente\nticket-5 confirmada seguida de FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -E 'confirmada|declined' /home/agent/respuestas.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E confirmada|declined /home/agent/respuestas.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E 'confirmada|declined' /home/agent/respuestas.log"
  },
  {
    "id": "grep-pro-l13",
    "track": "grep-pro",
    "index": 13,
    "title": "Anclado por el domingo",
    "subtitle": "grep -E con ^: el principio de línea",
    "xp": 65,
    "difficulty": 4,
    "brief": "El diario de la semana mezcla arranques de línea con menciones a mitad de texto: solo las que ARRANCAN son válidas.",
    "goal": "De chicas.log muestra las líneas que EMPIEZAN por la palabra domingo (y solo ellas).",
    "keywords": [
      "grep",
      "-E",
      "ancla",
      "inicio"
    ],
    "hints": [
      "^ ancla al INICIO DE LÍNEA: ^domingo casa solo si la línea empieza por esa palabra.",
      "El espacio tras domingo evita que casa el domingode otro texto siguiente.",
      "grep -E '^domingo ' /home/agent/chicas.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E '^ERROR' f",
        "desc": "líneas que empiezan por ERROR"
      },
      {
        "cmd": "grep -E 'done$' f",
        "desc": "líneas que terminan en done"
      }
    ],
    "teach": "Las ANCLAS en -E (^ y $) fijan el punto de inicio/fin de línea. En registros con timestamps, ^ es la base del filtrado por hora.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "domingo desayuno tardío\ndomingo a mitad de texto no vale\ndomingo correspondo real: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -E '^domingo ' /home/agent/chicas.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E ^domingo  /home/agent/chicas.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E '^domingo ' /home/agent/chicas.log"
  },
  {
    "id": "grep-pro-l14",
    "track": "grep-pro",
    "index": 14,
    "title": "La IP del incidente",
    "subtitle": "grep -oE de IPs IPv4",
    "xp": 70,
    "difficulty": 5,
    "brief": "El registro guarda muchas IPs, pero solo una es de la subred 10.0. Extraela LIMPIA (solo la IP, sin el resto del texto).",
    "goal": "Del registro connexion.log, extrae TODAS las IPs de la subred 10.0.X.X (formato D.D.D.D, una por línea); la línea del testigo (sin IP) sale aparte con su marca.",
    "keywords": [
      "grep",
      "-oE",
      "IP"
    ],
    "hints": [
      "Para extraer LIMPIO usa -oE; con clases 10[.]0[...[0-9]+ evitas escapar el punto.",
      "El patrón casa solo la subred 10.0 y deja fuera la IP mal formada 10.0d...",
      "La línea del testigo (sin IP) sale aparte con grep 'FLAG{'.",
      "grep -oE '10[.]0[.][0-9]+[.][0-9]+' /home/agent/connexion.log ; grep 'FLAG{' /home/agent/connexion.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE 'IP_pattern' f",
        "desc": "extrae IPs limpias"
      },
      {
        "cmd": "grep -oE '\\\\b(\\\\d{1,3}\\\\.){3}\\\\d{1,3}\\\\b' f",
        "desc": "todas las IP IPv4"
      }
    ],
    "teach": "Extraccion de IPs: \\b10\\.[0-9]+\\.[0-9]+\\b con -oE es el patrón más solicitado. No necesitas validar el rango 0-255 en logs normales.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "10.0.4.23\n10.0.255.200\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE '10[.]0[.][0-9]+[.][0-9]+' /home/agent/connexion.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE 10[.]0[.][0-9]+[.][0-9]+ /home/agent/connexion.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/connexion.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/connexion.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -oE '10[.]0[.][0-9]+[.][0-9]+' /home/agent/connexion.log ; grep 'FLAG{' /home/agent/connexion.log"
  },
  {
    "id": "grep-pro-l15",
    "track": "grep-pro",
    "index": 15,
    "title": "Rangos dentro de línea",
    "subtitle": "grep -E con {n} y clases",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero de fichas tiene muchos formatos, pero solo un formato pasa el test: un ID de SEIS dígitos exactos (aunque vaya rodeado de texto).",
    "goal": "De registros.txt imprime las líneas que contengan un número de EXACTAMENTE 6 dígitos (aunque el número forme parte de otro mayor).",
    "keywords": [
      "grep",
      "-E",
      "contadores",
      "clases"
    ],
    "hints": [
      "[0-9]{6} casa cualquier SECUENCIA de 6 dígitos consecutivos ( incluso como parte de un número más largo).",
      "Con -o verías solo el NUMERO extraído: pero aquí hay que imprimir la LÍNEA completa.",
      "grep -E '[0-9]{6}' /home/agent/registros.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -E '[0-9]{4}' f",
        "desc": "números de 4 cifras"
      },
      {
        "cmd": "grep -oE '[0-9]{6}' f",
        "desc": "extrae solo la secuencia de 6"
      }
    ],
    "teach": "Las llaves {n} en -E son contadores exactos. Con {n,m} fluctúa: {6} = exactamente 6, {6,} = 6 o más, {2,5} = entre 2 y 5.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "referencia de pago: 990210 correcto\ncódigo largo 1234567: incluso 7 dígitos\nlínea con nómina 050499 FLAG{d3b09a4f7c2e1b8d6041a5f3}\ndos candidata: 112233 y 445566"
      }
    ],
    "steps": [
      {
        "raw": "grep -E '[0-9]{6}' /home/agent/registros.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E [0-9]{6} /home/agent/registros.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -E '[0-9]{6}' /home/agent/registros.txt"
  },
  {
    "id": "grep-pro-l16",
    "track": "grep-pro",
    "index": 16,
    "title": "Profundo, con filtro",
    "subtitle": "grep -r --include",
    "xp": 70,
    "difficulty": 5,
    "brief": "En árboles de muchos tipos de fichero, solo interesa CON los .log. Filtrálo por el NOMBRE del fichero (no por contenido).",
    "goal": "Del árbol incidentes/, muestra las líneas que contengan intrusión pero UNICAMENTE entre los ficheros .log (a cualquier profundidad).",
    "keywords": [
      "grep",
      "recursivo",
      "--include",
      "-r"
    ],
    "hints": [
      "--include=\"*.log\" restringe la búsqueda recursiva a ese patrón de NOMBRE de fichero.",
      "--exclude=\"*.log.bak\" descarta patrones específicos (excluye).",
      "grep -r --include='*.log' 'intrusión' /home/agent/incidentes"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -r --include=\"*.log\" p dir",
        "desc": "solo ficheros .log"
      },
      {
        "cmd": "grep -r --exclude=\"*.bak\" p dir",
        "desc": "sin respaldos"
      }
    ],
    "teach": "En árboles grandes, --include/--exclude acotan por TIPO de fichero sin recurrir a find. Trabajan sobre el NOMBRE, no el contenido.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "/home/agent/incidentes/2026/10/evento.log:intrusión en la sub carpeta\n/home/agent/incidentes/2026/10/tip.log:intrusión registrada: FLAG{d3b09a4f7c2e1b8d6041a5f3}\n/home/agent/incidentes/oct.log:intrusión detectada en oct"
      }
    ],
    "steps": [
      {
        "raw": "grep -r --include='*.log' 'intrusión' /home/agent/incidentes",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-r --include=*.log intrusión /home/agent/incidentes",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-r",
                "meaning": "búsqueda recursiva en directorios"
              },
              {
                "flag": "--include=*.log",
                "meaning": "patrones de ficheros a incluir en la búsqueda"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep -r --include='*.log' 'intrusión' /home/agent/incidentes"
  },
  {
    "id": "grep-pro-l17",
    "track": "grep-pro",
    "index": 17,
    "title": "El puerto de la conexión",
    "subtitle": "grep -oE + cut: dos herramientas al servicio",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero describe conexiones ip:port. Necesitas aislar el PUERTO pero SOLO en IPs que empiecen por 10.4.",
    "goal": "De conexiones.log extrae el PUERTO (segundo campo tras :) de las conexiones hacia IPs 10.4.X.X, y deja a la vista la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-oE",
      "cut",
      "puerto"
    ],
    "hints": [
      "grep -oE con 10[.]4[...[0-9]+:[0-9]+ saca líneas «IP:PUERTO» solo de la subred 10.4.",
      "La tubería alimenta a cut; con -d: y -f2 coges el campo 2 (el puerto).",
      "La línea del testigo sale aparte con grep 'FLAG{'.",
      "grep -oE '10[.]4[.][0-9]+[.][0-9]+:[0-9]+' /home/agent/conexiones.log | cut -d: -f2 ; grep 'FLAG{' /home/agent/conexiones.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE 'IP_pattern' f",
        "desc": "extrae el match como texto"
      },
      {
        "cmd": "cut -d: -f2",
        "desc": "segundo campo separado por :"
      }
    ],
    "teach": "grep + cut es el pipeline típico para piezas de un match más largo. -oE limita la línea de partida; corte acompaña el array; ext menjadi más fácil de aplicar el campo correcto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "9999\n22\n8999\n4444\n10.4.22.4:4444 el puerto a coger: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE '10[.]4[.][0-9]+[.][0-9]+:[0-9]+' /home/agent/conexiones.log | cut -d: -f2",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE 10[.]4[.][0-9]+[.][0-9]+:[0-9]+ /home/agent/conexiones.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "cut",
            "args": "-d: -f2",
            "why": "corta columnas de texto por delimitador o por posición",
            "flags": [
              {
                "flag": "-d",
                "meaning": "carácter delimitador (con -f)"
              },
              {
                "flag": "-f",
                "meaning": "números de campo a conservar"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/conexiones.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/conexiones.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -oE '10[.]4[.][0-9]+[.][0-9]+:[0-9]+' /home/agent/conexiones.log | cut -d: -f2 ; grep 'FLAG{' /home/agent/conexiones.log"
  },
  {
    "id": "grep-pro-l18",
    "track": "grep-pro",
    "index": 18,
    "title": "El detector de dos etapa",
    "subtitle": "grep | grep: filtrado en cadena",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero ficha.txt repleta de patrones. Dos filtros en cadena son la opción más segura: primero el formato, luego la señal.",
    "goal": "De ficha.txt imprime las líneas con patrón uid: TENGAN cuatro dígitos y CONTÉNGAN la marca (tenga FLAG).",
    "keywords": [
      "grep",
      "pipeline",
      "AND"
    ],
    "hints": [
      "grep uid:[0-9]{6} lista las líneas con formato correcto.",
      "El segundo grep (FLAG) filtra la línea con la marca.",
      "grep -E 'uid: [0-9]{6}' /home/agent/ficha.txt | grep 'FLAG'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep 1 | grep 2",
        "desc": "filtro lógico AND"
      },
      {
        "cmd": "grep -E 'a.*b' f",
        "desc": "a y b en la misma línea"
      }
    ],
    "teach": "Un pipeline con 2 greps simplifica. El primero reduce espectro, el segundo afina: nunca resuelvas en una sola línea si no llega.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "uid: 432198 correcto: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -E 'uid: [0-9]{6}' /home/agent/ficha.txt | grep 'FLAG'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-E uid: [0-9]{6} /home/agent/ficha.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "FLAG",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -E 'uid: [0-9]{6}' /home/agent/ficha.txt | grep 'FLAG'"
  },
  {
    "id": "grep-pro-l19",
    "track": "grep-pro",
    "index": 19,
    "title": "La línea exacta",
    "subtitle": "grep -xF: exactitud de línea completa",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero acceso.txt miles de variantes. SOLO la línea EXACTA password:secreto es válida (ni indentada, ni con texto extra).",
    "goal": "De acceso.txt imprime SOLO la línea EXACTA password:secreto (línea completa, sin nada antes o después) y, aparte, la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-x",
      "-F",
      "exacto"
    ],
    "hints": [
      "-x casa TODO el patrón con la LÍNEA COMPLETA; -F hace el patrón LITERAL.",
      "La línea del testigo (password:correcto con la marca) NO es exacta: sale aparte con grep 'FLAG{'.",
      "grep -xF 'password:secreto' /home/agent/acceso.txt ; grep 'FLAG{' /home/agent/acceso.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -Ff lista.txt f",
        "desc": "patrones literales desde fichero"
      },
      {
        "cmd": "grep -xF cadena f",
        "desc": "solo si la línea ES LA CADENA"
      }
    ],
    "teach": "-x es exacto sobre una línea completa. -F convierte el patrón en literal. La fórmula -xF es la herramienta definitiva para «buscar esta cadena exacta como línea».",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "password:secreto\npassword:correcto FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -xF 'password:secreto' /home/agent/acceso.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-xF password:secreto /home/agent/acceso.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-x",
                "meaning": "flag x del comando — revisa «man grep»"
              },
              {
                "flag": "-F",
                "meaning": "patrón literal, sin regex"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/acceso.txt",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/acceso.txt",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -xF 'password:secreto' /home/agent/acceso.txt ; grep 'FLAG{' /home/agent/acceso.txt"
  },
  {
    "id": "grep-pro-l20",
    "track": "grep-pro",
    "index": 20,
    "title": "El tablero de rangos",
    "subtitle": "grep + sed: líneas con número en rango",
    "xp": 75,
    "difficulty": 5,
    "brief": "En el log, la marca PROFUNDO vive entre las líneas 4 y 8 (y solo hay).",
    "goal": "De marcas.txt imprime las líneas que contengan DEEP pero EXCLUSIVAMENTE entre las líneas 4 a 8 (incluyendo los extremos).",
    "keywords": [
      "grep",
      "head",
      "tail",
      "rango"
    ],
    "hints": [
      "Goala en la línea 4-8: head -n 8 da las primeras 8; tail -n +4 salta las 3 primeras.",
      "El último grep 'DEEP' filtra de ese bloque.",
      "head -n 8 /home/agent/marcas.txt | tail -n +4 | grep 'DEEP'"
    ],
    "cheatsheet": [
      {
        "cmd": "head -n 8 f | tail -n +4",
        "desc": "líneas 4 a 8"
      },
      {
        "cmd": "sed -n 4,8p f",
        "desc": "idem: imprime las líneas 4 a 8"
      }
    ],
    "teach": "No todas las subtareas son solo greps. Puedes combinar greps con head/tail/sed cut. Recuerda: la ventana de líneas 4-8 (head -n 8 | tail -n +4) tras un grep es una técnica común.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "cuatro DEEP en medio de todo\ncinco marca DEEP\nseis el resilient DEEP\nsiete DEEP profundo: FLAG{d3b09a4f7c2e1b8d6041a5f3}\nocho DEEP en el final"
      }
    ],
    "steps": [
      {
        "raw": "head -n 8 /home/agent/marcas.txt | tail -n +4 | grep 'DEEP'",
        "cmds": [
          {
            "cmd": "head",
            "args": "-n 8 /home/agent/marcas.txt",
            "why": "imprime el principio de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 5 = las primeras 5)"
              },
              {
                "flag": "-n 8",
                "meaning": "la flag -n ANTES de un número fija el número (aquí: 8)"
              }
            ]
          },
          {
            "cmd": "tail",
            "args": "-n +4",
            "why": "imprime el final de un fichero/flujo",
            "flags": [
              {
                "flag": "-n",
                "meaning": "cuántas líneas mostrar (-n 3 = las últimas 3)"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "DEEP",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "head -n 8 /home/agent/marcas.txt | tail -n +4 | grep 'DEEP'"
  },
  {
    "id": "grep-pro-l21",
    "track": "grep-pro",
    "index": 21,
    "title": "El corte asimétrico",
    "subtitle": "grep -B 3 -A 1: contexto distinto a cada lado",
    "xp": 75,
    "difficulty": 5,
    "brief": "El corte del log quiere 3 líneas ANTES y UNA después del evento MARCAR (distinto a cada lado).",
    "goal": "De flujo.log imprime el evento MARCAR con TRES líneas ANTERIORES y UNA línea POSTERIOR (la señal va en el posterior).",
    "keywords": [
      "grep",
      "-A",
      "-B",
      "contexto"
    ],
    "hints": [
      "-B 3 -A 1 es UNA orden con dos opciones, contexto distinto a cada lado.",
      "El orden de las opciones da igual: -A 1 -B 3 funciona igual.",
      "grep -B 3 -A 1 'MARCAR' /home/agent/flujo.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -B 3 -A 1 pat f",
        "desc": "asymétrica personalizada"
      },
      {
        "cmd": "grep -A 1 -B 3 pat f",
        "desc": "el mismo resultado"
      }
    ],
    "teach": "Combinar -A y -B en el mismo comando da la banda de interés personalizada; cuando necesitas uno ≠ otro, evita la -C simétrica.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "preludio 1\npreludio 2\npreludio 3\nMARCAR evento en el medio\npostludio única: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -B 3 -A 1 'MARCAR' /home/agent/flujo.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-B 3 -A 1 MARCAR /home/agent/flujo.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -B 3 -A 1 'MARCAR' /home/agent/flujo.log"
  },
  {
    "id": "grep-pro-l22",
    "track": "grep-pro",
    "index": 22,
    "title": "El contador de matched",
    "subtitle": "grep -o | wc: ratios de aparición vs líneas",
    "xp": 75,
    "difficulty": 5,
    "brief": "El log no quiere la LISTA ni el número de líneas: quiere el TOTAL TOKEN que aparece (incluso múltiples en una línea están).",
    "goal": "De testigos.log imprime el NÚMERO TOTAL de apariciones del token secret y, aparte, la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-o",
      "wc",
      "total"
    ],
    "hints": [
      "-c cuenta LÍNEAS; -o con wc -l cuenta el TOTAL de tokens.",
      "La línea del testigo con la marca sale aparte con grep.",
      "grep -o 'secret' /home/agent/testigos.log | wc -l ; grep 'FLAG{' /home/agent/testigos.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -o pat f | wc -l",
        "desc": "total de ocurrencias"
      },
      {
        "cmd": "grep -c pat f",
        "desc": "nº de líneas con match"
      }
    ],
    "teach": "grep -o patrón | wc -l es el conteo TOTAL de coincidencias (distinto de -c, que cuenta LÍNEAS). Es la diferencia crucial entre \"cuántas líneas\" y \"cuántas veces\".",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "6\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -o 'secret' /home/agent/testigos.log | wc -l",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-o secret /home/agent/testigos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              }
            ]
          },
          {
            "cmd": "wc",
            "args": "-l",
            "why": "cuenta: sin opciones imprime líneas/palabras/bytes",
            "flags": [
              {
                "flag": "-l",
                "meaning": "sólo nº de líneas"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/testigos.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/testigos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -o 'secret' /home/agent/testigos.log | wc -l ; grep 'FLAG{' /home/agent/testigos.log"
  },
  {
    "id": "grep-pro-l23",
    "track": "grep-pro",
    "index": 23,
    "title": "ISO extraction",
    "subtitle": "grep -oE de fechas AAAA-MM-DD",
    "xp": 75,
    "difficulty": 5,
    "brief": "El log guarda las fechas en varias formas (ISO y texto) y en distintas posiciones.",
    "goal": "De tiempos.log extrae SOLAMENTE las fechas AAAA-MM-DD (una por línea) y deja a la vista la línea del testigo con la marca.",
    "keywords": [
      "grep",
      "-oE",
      "fechas"
    ],
    "hints": [
      "{n} pide n dígitos consecutivos; con -oE cada fecha sale limpia en su línea.",
      "La línea del testigo con la marca sale aparte con grep.",
      "grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' /home/agent/tiempos.log ; grep 'FLAG{' /home/agent/tiempos.log"
    ],
    "cheatsheet": [
      {
        "cmd": "grep -oE '[0-9]{4}-[0-9]{2}' f",
        "desc": "AAAA-MM"
      },
      {
        "cmd": "grep -oE '[0-9]{2}:[0-9]{2}' f",
        "desc": "hh:mm"
      }
    ],
    "teach": "El patrón [0-9]{4}-[0-9]{2}-[0-9]{2} extrae las fechas ISO. La gracia -o + {n} es reemplazar el «recortar con cut/awk» por directamente un regex experto.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "2022-04-15\n2019-02-01\n2024-11-20\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' /home/agent/tiempos.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "-oE [0-9]{4}-[0-9]{2}-[0-9]{2} /home/agent/tiempos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-o",
                "meaning": "imprime solo la parte que coincide (no la línea entera)"
              },
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/tiempos.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/tiempos.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' /home/agent/tiempos.log ; grep 'FLAG{' /home/agent/tiempos.log"
  },
  {
    "id": "grep-pro-l24",
    "track": "grep-pro",
    "index": 24,
    "title": "Boss: triple filtro encadenado",
    "subtitle": "3 greps en tubería",
    "xp": 175,
    "difficulty": 5,
    "brief": "El log de tuna.log tiene eventos de 4 tipos: trig, span, offs y noise. Se quiere algo estricto.",
    "goal": "De tuna.log imprime SOLO las líneas que contengas trig PERO no noise Y QUE EMPIECE CON el timestamp 2026-10-25.",
    "keywords": [
      "grep",
      "boss",
      "cadena",
      "filtro"
    ],
    "hints": [
      "Encadenas tuberías: filtrar trig; excluir noise; conservar los timestamps ISO que empiezan por el año 2026.",
      "Un grep puede tanto INCLUIR (default) como EXCLUIR con -v, y ANCLA con ^",
      "grep 'trig' /home/agent/tuna.log | grep -v 'noise' | grep -E '^2026-10-25'"
    ],
    "cheatsheet": [
      {
        "cmd": "grep a f | grep -v b",
        "desc": "filtra + excluye"
      },
      {
        "cmd": "grep -E '^2026' f",
        "desc": "ancla año inicio"
      }
    ],
    "teach": "El triple-encadenado es el trabajo diario de los ingenieros de logs: filtra, excluye el ruido, y añade una ancla de fecha. El resultado final limpio.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "2026-10-25 08:01 trig sin más\n2026-10-25 09:02 trig limpio\n2026-10-25 10:00 trig música de fondo\n2026-10-25 11:07 trig con la marca: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "grep 'trig' /home/agent/tuna.log | grep -v 'noise' | grep -E '^2026-10-25'",
        "cmds": [
          {
            "cmd": "grep",
            "args": "trig /home/agent/tuna.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          },
          {
            "cmd": "grep",
            "args": "-v noise",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-v",
                "meaning": "invierte el filtro: descarta las que SÍ coinciden"
              }
            ]
          },
          {
            "cmd": "grep",
            "args": "-E ^2026-10-25",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": [
              {
                "flag": "-E",
                "meaning": "regex extendida (ERE: +, ?, |, alternancia)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "grep 'trig' /home/agent/tuna.log | grep -v 'noise' | grep -E '^2026-10-25'"
  },
  {
    "id": "awk-pro-l1",
    "track": "awk-pro",
    "index": 1,
    "title": "Campos con delimitador custom",
    "subtitle": "awk -F con split por los dos puntos",
    "xp": 60,
    "difficulty": 4,
    "brief": "El fichero roles.txt usa delimitador \":\". La 1.ª columna es el usuario, la 2.ª el rol. El dato relevante sólo es el ROL.",
    "goal": "De roles.txt imprime la SEGUNDA columna (el rol) respetando su delimitador del fichero.",
    "keywords": [
      "awk",
      "-F",
      "delimitador",
      "campos"
    ],
    "hints": [
      "awk separa por espacios cuando no le dices nada: -F: cambia el separador a «dos puntos».",
      "Con -F: el campo $2 es la columna delimitada por :.",
      "awk -F: '{print $2}' /home/agent/roles.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk -F: '{print $2}' f",
        "desc": "segundo campo separado por :"
      },
      {
        "cmd": "awk -F, '{print $1}' f",
        "desc": "primera columna de un CSV simple"
      }
    ],
    "teach": "-F es la FLAG de DELIMITADOR: sin él, awk asume espacios y tabs. Si tu data no va separada por espacios, este es el PRIMER paso. El $2 apunta SIEMPRE al segundo campo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "admin\nFLAG{d3b09a4f7c2e1b8d6041a5f3}\nlector\nadmin"
      }
    ],
    "steps": [
      {
        "raw": "awk -F: '{print $2}' /home/agent/roles.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "-F: {print $2} /home/agent/roles.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": [
              {
                "flag": "-F",
                "meaning": "cambia el separador de campos (p. ej. -F:)"
              }
            ]
          }
        ]
      }
    ],
    "raw": "awk -F: '{print $2}' /home/agent/roles.txt"
  },
  {
    "id": "awk-pro-l2",
    "track": "awk-pro",
    "index": 2,
    "title": "Umbral sobre columna",
    "subtitle": "awk $2 > N: filtro numérico",
    "xp": 60,
    "difficulty": 4,
    "brief": "El fichero procesos.dat trae usuario, memoria (MB), cpu. Son procesos de la columna memoria los CRÍTICOS.",
    "goal": "De procesos.dat, imprime las líneas cuya segunda columna (memoria) supere 500.",
    "keywords": [
      "awk",
      "umbral",
      "numérico",
      "filtro"
    ],
    "hints": [
      "awk compara NUMÉRICAMENTE si ambos operandos son numéricos: $2 > 500.",
      "No necesitas un if: la CONDICIÓN sola (sin acción) imprime la LÍNEA COMPLETA.",
      "awk '$2 > 500' /home/agent/procesos.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$2 > 500' f",
        "desc": "líneas con col. 2 > 500"
      },
      {
        "cmd": "awk '$2 >= 100 && $2 <= 1000' f",
        "desc": "rango numérico con &&"
      }
    ],
    "teach": "El caso clásico de awk: comparación numérica de columnas sin cut/while. La ACCIÓN por defecto ({ print $0 }) hace el trabajo de print total si no la processes.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "mysql 800 15\npython 620 22\njava 1500 2 FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 > 500' /home/agent/procesos.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 > 500 /home/agent/procesos.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 > 500' /home/agent/procesos.dat"
  },
  {
    "id": "awk-pro-l3",
    "track": "awk-pro",
    "index": 3,
    "title": "Suma acumulada",
    "subtitle": "awk suma de columna + END",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fichero ventas.dat trae producto, importe. El reporte necesita la SUMA de la segunda columna.",
    "goal": "De ventas.dat imprime cada línea tal cual (la nota suma 0) y al final el TOTAL de la 2.ª columna con formato «total: N».",
    "keywords": [
      "awk",
      "suma",
      "END",
      "acumulador"
    ],
    "hints": [
      "El bloque { s += $2; print $0 } se ejecuta para cada línea; END una sola vez al final.",
      "La variable s empieza en 0 (vacía por defecto); las notas con importe 0 no mueven el total.",
      "print $0 deja cada línea a la vista: la de la nota lleva la marca.",
      "awk '{ s += $2; print $0 } END { print \"total:\", s }' /home/agent/ventas.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{s += $2} END {print s}' f",
        "desc": "suma de la col. 2"
      },
      {
        "cmd": "awk 'END {print NR}' f",
        "desc": "nº de líneas leídas"
      }
    ],
    "teach": "El patrón {acumular} + END {imprimir} es el «streaming» de awk: procesas líneas en caché y inv'mas un sólo resultado. Tu código va HEAD (procesoMedia,NR) + TAIL (END).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "docs 100\nnight 50\nnights 250\nair 1250\nnotas 0 FLAG{d3b09a4f7c2e1b8d6041a5f3}\ntotal: 1650"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ s += $2; print $0 } END { print \"total:\", s }' /home/agent/ventas.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ s += $2; print $0 } END { print \"total:\", s } /home/agent/ventas.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ s += $2; print $0 } END { print \"total:\", s }' /home/agent/ventas.dat"
  },
  {
    "id": "awk-pro-l4",
    "track": "awk-pro",
    "index": 4,
    "title": "El máximo de la columna",
    "subtitle": "awk $2 > max + END con dos variables",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fichero medias.dat trae «id valor». Necesitas el id del VALOR MÁXIMO: la clave que encabeza al campeón es la señal.",
    "goal": "De medias.dat imprime el id (PRIMERA columna) de la fila con el valor MÁXIMO en la segunda columna.",
    "keywords": [
      "awk",
      "máximo",
      "END",
      "variables"
    ],
    "hints": [
      "max partierer sin declarar en 0: si el valor de la fila supera al máximo, guárdalo y guarda su id.",
      "END imprimi el id cuando todo el fichero ha sido procesado.",
      "awk '$2 > max {max = $2; id = $1} END {print id}' /home/agent/medias.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$2 > max {max=$2; id=$1} END {print id}' f",
        "desc": "el id con el valor máximo"
      },
      {
        "cmd": "awk '$2 > max {max=$2} END {print max}' f",
        "desc": "el valor máximo en sí"
      }
    ],
    "teach": "Patrón «compara-guarda-imprime» de awk: una variable max y una id, y el campeón se anuncia en END. Sin sort y sin bucles: el streaming atiende por ti.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '$2 > max {max = $2; id = $1} END {print id}' /home/agent/medias.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$2 > max {max = $2; id = $1} END {print id} /home/agent/medias.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$2 > max {max = $2; id = $1} END {print id}' /home/agent/medias.dat"
  },
  {
    "id": "awk-pro-l5",
    "track": "awk-pro",
    "index": 5,
    "title": "La línea n exacta",
    "subtitle": "awk NR == N",
    "xp": 60,
    "difficulty": 4,
    "brief": "El fichero lineas.log tiene la marca en la LÍNEA 7 (y SOLO esa).",
    "goal": "De lineas.log imprime EXACTAMENTE la línea 7.",
    "keywords": [
      "awk",
      "NR",
      "línea"
    ],
    "hints": [
      "NR es el contador de línea leídas (1-based): NR == 7 selecciona esa.",
      "Con solo la condición, awk imprime la LÍNEA entera por defecto.",
      "awk 'NR == 7' /home/agent/lineas.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'NR == 7' f",
        "desc": "solo la línea 7"
      },
      {
        "cmd": "awk 'NR % 2 == 0' f",
        "desc": "solo las líneas pares"
      }
    ],
    "teach": "awk NR cuenta las líneas procesadas: NR == 7 es un selector directo. Ante archivos enormes, es más rápido que sed -n 7p.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "línea-7 al adicion: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'NR == 7' /home/agent/lineas.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "NR == 7 /home/agent/lineas.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'NR == 7' /home/agent/lineas.log"
  },
  {
    "id": "awk-pro-l6",
    "track": "awk-pro",
    "index": 6,
    "title": "Ventana de líneas",
    "subtitle": "awk con doble condición en NR",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fichero escenas.log guarda la sección crítica entre las líneas 4 y 6 (inclusiva).",
    "goal": "De escenas.log, imprime SOLAMENTE las líneas 4 a 6 (INCLUIDAS).",
    "keywords": [
      "awk",
      "NR",
      "rango"
    ],
    "hints": [
      "DOBLE condición con el operador && sobre NR.",
      "NR es 1-based.",
      "awk 'NR >= 4 && NR <= 6' /home/agent/escenas.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'NR >= 4 && NR <= 6' f",
        "desc": "líneas 4 a 6"
      },
      {
        "cmd": "awk 'NR % 2 == 0' f",
        "desc": "solo las líneas pares"
      }
    ],
    "teach": "Con la doble condición en NR puedes reproducir el «sed -n 4,6p» con awk. Nota que el RANGO INCLUIVE ambos extremos (>= y <=).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "línea 4: humo\nlínea-5: el dato FLAG{d3b09a4f7c2e1b8d6041a5f3}\nlínea 6: humo"
      }
    ],
    "steps": [
      {
        "raw": "awk 'NR >= 4 && NR <= 6' /home/agent/escenas.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "NR >= 4 && NR <= 6 /home/agent/escenas.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'NR >= 4 && NR <= 6' /home/agent/escenas.log"
  },
  {
    "id": "awk-pro-l7",
    "track": "awk-pro",
    "index": 7,
    "title": "El hash perfecto",
    "subtitle": "awk longitud + regex de campo",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero hashes.log tiene usuario + hash (sin espacios). Necesitas las líneas cuyo campo SI y SÓLO SI es un hash hex de 32 dígitos EXACTOS.",
    "goal": "De hashes.log imprime las líneas cuyo SEGUNDO campo es un hash hex de 32 caracteres EXACTOS (uso la facil length + regex).",
    "keywords": [
      "awk",
      "length",
      "regex",
      "campo"
    ],
    "hints": [
      "length($2) == 32 es la COMPROBACIÓN de longitud EXACTA (hex 32 simbolos md5).",
      "$2 ~ /^[0-9a-f]+$/ es el REGEX de la forma exclusivamente hex.",
      "awk 'length($2) == 32 && $2 ~ /^[0-9a-f]+$/' /home/agent/hashes.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'length($2) == 32' f",
        "desc": "campo 2 con TAM 32"
      },
      {
        "cmd": "awk '$2 ~ /^[0-9a-f]+$/' f",
        "desc": "regex hex en campo 2"
      }
    ],
    "teach": "Confundir length($x) con la función length(). La combinación de length() + un regex con clases y ^$ es la forma robusta de validar un formato de CAMPO en awk (incluye mawk que no garantiza {32}).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "user-a 5f4dcc3b5aa765d61d8327deb882cf99\nuser-c 1234567890abcdef1234567890abcdef FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'length($2) == 32 && $2 ~ /^[0-9a-f]+$/' /home/agent/hashes.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "length($2) == 32 && $2 ~ /^[0-9a-f]+$/ /home/agent/hashes.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'length($2) == 32 && $2 ~ /^[0-9a-f]+$/' /home/agent/hashes.log"
  },
  {
    "id": "awk-pro-l8",
    "track": "awk-pro",
    "index": 8,
    "title": "El rey de la longitud",
    "subtitle": "awk length($0) + guardado del máximo",
    "xp": 65,
    "difficulty": 4,
    "brief": "En dumpe.log, hay una línea anómala MUY LARGA. À veces tiene la marca, a veces no.",
    "goal": "De dumpe.log imprime la línea MÁS LARGA (contenido, no la longitud).",
    "keywords": [
      "awk",
      "length",
      "if",
      "máximo"
    ],
    "hints": [
      "length($0) da el TAM de la línea ACTUAL.",
      "Guarda la línea si supera al máximo; al final imprímela con END.",
      "awk '{ if (length($0) > max) { max = length($0); line = $0 } } END { print line }' /home/agent/dumpe.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ print length($0) }' f",
        "desc": "longitud de cada línea"
      },
      {
        "cmd": "awk '{ if (length($0) > max) max = length($0) } END { print max }' f",
        "desc": "la MAYOR longitud"
      }
    ],
    "teach": "En awk, if dentro de una acción con llaves acumula el «tope» y guarda una copia de la línea todas las vezes que mejora. END imprime al final.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ if (length($0) > max) { max = length($0); line = $0 } } END { print line }' /home/agent/dumpe.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ if (length($0) > max) { max = length($0); line = $0 } } END { print line } /home/agent/dumpe.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ if (length($0) > max) { max = length($0); line = $0 } } END { print line }' /home/agent/dumpe.log"
  },
  {
    "id": "awk-pro-l9",
    "track": "awk-pro",
    "index": 9,
    "title": "El recortador de campos",
    "subtitle": "awk substr()",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fichero tokens.log trae alias + token. Necesitas los ÚLTIMOS 8 caracteres de cada token y, aparte, la LÍNEA que lleva la marca.",
    "goal": "De tokens.log imprime, por línea, los últimos 8 caracteres del TOKEN (2.ª columna) con substr; después imprime la línea completa que contiene la marca.",
    "keywords": [
      "awk",
      "substr",
      "recortar",
      "length"
    ],
    "hints": [
      "substr(texto, inicio) devuelve desde esa posición HASTA el final (sin 3er argumento).",
      "Para obtener los últimos 8: substr(s, length(s) - 7).",
      "El token del testigo es la marca entera: su línea se enseña aparte con grep.",
      "awk '{ print substr($2, length($2) - 7) }' /home/agent/tokens.log ; grep 'FLAG{' /home/agent/tokens.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ print substr($1, 1, 3) }' f",
        "desc": "primeras 3 letras del campo 1"
      },
      {
        "cmd": "awk '{ print substr($2, length($2) - 7) }' f",
        "desc": "últimos 8 chars del campo 2"
      }
    ],
    "teach": "substr(texto, inicio, longitud) corta CUALQUIER texto, por posición y tamaño. Combinando con length() puedes extraer «el final» solar de cualquier longitud.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "5b6a7980\nkkfeed\n90abcdef\n041a5f3}\ndani FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ print substr($2, length($2) - 7) }' /home/agent/tokens.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ print substr($2, length($2) - 7) } /home/agent/tokens.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/tokens.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/tokens.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ print substr($2, length($2) - 7) }' /home/agent/tokens.log ; grep 'FLAG{' /home/agent/tokens.log"
  },
  {
    "id": "awk-pro-l10",
    "track": "awk-pro",
    "index": 10,
    "title": "La posición del token",
    "subtitle": "awk index()",
    "xp": 65,
    "difficulty": 4,
    "brief": "El fichero posiciones.txt tiene textos largos con posibles FICHAS.",
    "goal": "De posiciones.txt imprime las LÍNEAS donde aparece el token MARK (usa index() como condición de línea).",
    "keywords": [
      "awk",
      "index",
      "posición"
    ],
    "hints": [
      "index(cadena, subcadena) devuelve posición 1-based (0 si no aparece).",
      "Como condición de línea, index($0, \"MARK\") es verdad SOLO en las líneas que lo contienen; awk imprime la línea entera.",
      "awk 'index($0, \"MARK\")' /home/agent/posiciones.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ print index($0, \"sub\") }' f",
        "desc": "posición de la subcadena"
      },
      {
        "cmd": "awk 'index($0, \"x\") > 0' f",
        "desc": "solo las líneas que la contengan"
      }
    ],
    "teach": "index(texto, subc) busca la posición 1-based de subc dentro de texto. Devuelve 0 si no aparece. Es la herramienta que awk da para «¿dónde está?» sin regex.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "un texto con MARK al medio\nMARK al principio directamente\nel token MARK esconde: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'index($0, \"MARK\")' /home/agent/posiciones.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "index($0, \"MARK\") /home/agent/posiciones.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'index($0, \"MARK\")' /home/agent/posiciones.txt"
  },
  {
    "id": "awk-pro-l11",
    "track": "awk-pro",
    "index": 11,
    "title": "La partida manual",
    "subtitle": "awk split()",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero rutas.dat trae catalogo/sección/item separados por :. Necesitas TERCER elemento (item).",
    "goal": "De rutas.dat, imprime el TERCER elemento de cada línea después de split por : (NO con $3).",
    "keywords": [
      "awk",
      "split",
      "array"
    ],
    "hints": [
      "split(cadena, array, sep) separa por el sep y LLENA el array con a[1], a[2]…",
      "El acceso a a[3] es la tercera parte (1-based).",
      "awk '{ split($0, a, \":\"); print a[3] }' /home/agent/rutas.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ split($0, a, \":\"); print a[2] }' f",
        "desc": "split manual y elemento 2"
      },
      {
        "cmd": "awk '{ n = split($0, a, \":\"); print n }' f",
        "desc": "split devuelve nº de piezas"
      }
    ],
    "teach": "split() separa una cadena en elementos ARRAY. Es útil cuando el delimitador varía por línea. Sin embargo, awk ya lo haga con $N… split y la ruta manual son m's comunes en el contexto actual.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "item-a\nFLAG{d3b09a4f7c2e1b8d6041a5f3}\nitem-c"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ split($0, a, \":\"); print a[3] }' /home/agent/rutas.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ split($0, a, \":\"); print a[3] } /home/agent/rutas.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ split($0, a, \":\"); print a[3] }' /home/agent/rutas.dat"
  },
  {
    "id": "awk-pro-l12",
    "track": "awk-pro",
    "index": 12,
    "title": "Primera sustitución",
    "subtitle": "awk sub()",
    "xp": 70,
    "difficulty": 5,
    "brief": "Sus líneas mezclan dominios con puntos. La clave: sub() con el punto escapado y una sola sustitución. Una de las líneas lleva la marca.",
    "goal": "De dominios.txt imprime cada línea con su PRIMER punto sustituido por guion bajo (solo la PRIMERA ocurrencia).",
    "keywords": [
      "awk",
      "sub",
      "sustitución"
    ],
    "hints": [
      "sub(regex, reemplazo) sustituye SOLO la primera aparición del regex en la línea actual.",
      "El punto hay que escaparlo: en regex casa cualquier carácter ( /\\./ ).",
      "awk '{ sub(/\\./, \"_\"); print }' /home/agent/dominios.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ sub(/a/, \"b\"); print }' f",
        "desc": "sustituye la PRIMERA a por b"
      },
      {
        "cmd": "awk '{ x = sub(/a/, \"b\"); print x }' f",
        "desc": "1 si hizo sustituciones, 0 si no"
      }
    ],
    "teach": "sub(regex, valor) cambia la PRIMERA coincidencia. Es la awk-equivalencia de sed s/…/…/ (1 vez). Usela cuando ya hay awk: así evitas una tubería adicional.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "mail_dominio.presto.es\nweb_dominio.secundaria.es\notro_dato.con.puntos: FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ sub(/\\./, \"_\"); print }' /home/agent/dominios.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ sub(/\\./, \"_\"); print } /home/agent/dominios.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ sub(/\\./, \"_\"); print }' /home/agent/dominios.txt"
  },
  {
    "id": "awk-pro-l13",
    "track": "awk-pro",
    "index": 13,
    "title": "Todas las apariciones",
    "subtitle": "awk gsub()",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero normalizado.txt tiene líneas con múltiples espacios seguidos. Necesitas de DOBLE-ESPACIO a UNO SOLO.",
    "goal": "De normalizado.txt imprime cada línea con TODOS los espacios consecutivos reducidos a UNO SOLO.",
    "keywords": [
      "awk",
      "gsub",
      "sustitución",
      "espacios"
    ],
    "hints": [
      "gsub(regex, valor) sustituye TODAS las apariciones de la línea.",
      "El regex [ ]+ casa UNO O MÁS espacios consecutivos (y se sustituye por UNO).",
      "awk '{ gsub(/[ ]+/, \" \"); print }' /home/agent/ruido.txt"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ gsub(/[ ]+/, \" \"); print }' f",
        "desc": "normaliza espacios"
      },
      {
        "cmd": "awk '{ n = gsub(/a/, \"b\"); print n }' f",
        "desc": "gium cuántas sustituciones hizo"
      }
    ],
    "teach": "gsub(regex, valor) es la sustitución GLOBAL: cambia TODAS las coincidencias. Puedes usar la situación para formatear la línea entera $0 sin extra print (sólo el print default).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "palabra con varios espacios\notra línea con dos separaciones\nla marca: FLAG{d3b09a4f7c2e1b8d6041a5f3} con espacios después"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ gsub(/[ ]+/, \" \"); print }' /home/agent/ruido.txt",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ gsub(/[ ]+/, \" \"); print } /home/agent/ruido.txt",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ gsub(/[ ]+/, \" \"); print }' /home/agent/ruido.txt"
  },
  {
    "id": "awk-pro-l14",
    "track": "awk-pro",
    "index": 14,
    "title": "Formato C-style en la salida",
    "subtitle": "awk printf()",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero metrica.dat trae clave y valor. Necesitas la salida con FORMA ESTRICTA: la clave en 6 caracteres alineada izquierda, espacio, el valor flotante con DOS decimales.",
    "goal": "De metrica.dat imprime cada línea formateada con printf: clave alineada a la izquierda en 6 espacios y valor con 2 decimales. La fila del testigo (no numérica) la muestras aparte tal cual.",
    "keywords": [
      "awk",
      "printf",
      "formato"
    ],
    "hints": [
      "printf de awk imprime con formato C-style: %-6s es campo de 6 alineado a la izquierda; %.2f es float de 2 decimales.",
      "printf NO añade salto automático: cierra el formato con \\n dentro del string del formato.",
      "La fila del testigo no es numérica (su «valor» da 0.00): muéstrala aparte con grep.",
      "awk '{ printf \"%-6s %.2f\\n\", $1, $2 }' /home/agent/metrica.dat ; grep 'FLAG{' /home/agent/metrica.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ printf \"%s\\\\n\", $1 }' f",
        "desc": "printf del campo 1"
      },
      {
        "cmd": "awk '{ printf \"%.2f\\\\n\", $1 }' f",
        "desc": "2 decimales de la col. 1"
      }
    ],
    "teach": "printf es C-style: imprime con formato; cada %obras substituye un argumento. Es la salida del awk, SIN salto automático (necesita \\n). Uso disponible para formatear la tabla ( %-6s, %.2f, %-8s etc).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "lat    12.35\nlon    -70.42\nalt    0.50\ntemp   23.00\nxco    0.00\nxco FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ printf \"%-6s %.2f\\n\", $1, $2 }' /home/agent/metrica.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ printf \"%-6s %.2f\\n\", $1, $2 } /home/agent/metrica.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/metrica.dat",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/metrica.dat",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ printf \"%-6s %.2f\\n\", $1, $2 }' /home/agent/metrica.dat ; grep 'FLAG{' /home/agent/metrica.dat"
  },
  {
    "id": "awk-pro-l15",
    "track": "awk-pro",
    "index": 15,
    "title": "Acumulación con sprintf",
    "subtitle": "awk sprintf + variable",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero informe.lst trae filas «id valor». Necesitas que la VARIABLE acumule la salida con el formato id=valor; manejado por sprintf.",
    "goal": "De informe.lst construye una ÚNICA cadena con todas las líneas en formato \"id=valor\" separadas por \";\" y imprímela al FINAL.",
    "keywords": [
      "awk",
      "sprintf",
      "variables"
    ],
    "hints": [
      "sprintf devuelve el STRING formateado (NO lo imprime).",
      "t = t sprintf(...) CONCATE con el acumulador de cada vez; END imprime una vez.",
      "awk '{ t = t sprintf(\"%s=%s;\", $1, $2) } END { print t }' /home/agent/informe.lst"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ a = sprintf(\"%03d\", $1); print a }' f",
        "desc": "variable de formato"
      },
      {
        "cmd": "awk '{ t = t $1 \"=\" $2 \";\" } END { print t }' f",
        "desc": "sin formato: acumular"
      }
    ],
    "teach": "sprintf es printf pero en texto: devuelve el valor en lugar de imprimir. Cumple con el patrón AWK-FORMATO-ACUMULAR-PRINTAR.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "alpha=FLAG{d3b09a4f7c2e1b8d6041a5f3};beta=2;gamma=3;alpha=10;"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ t = t sprintf(\"%s=%s;\", $1, $2) } END { print t }' /home/agent/informe.lst",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ t = t sprintf(\"%s=%s;\", $1, $2) } END { print t } /home/agent/informe.lst",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ t = t sprintf(\"%s=%s;\", $1, $2) } END { print t }' /home/agent/informe.lst"
  },
  {
    "id": "awk-pro-l16",
    "track": "awk-pro",
    "index": 16,
    "title": "El valor inicial: BEGIN",
    "subtitle": "awk BEGIN { FS = \";\" }",
    "xp": 70,
    "difficulty": 5,
    "brief": "Si no quieres usar -F, define el separador dentro del BEGIN.",
    "goal": "De datos.dat (delimitado por ;) imprime la SEGUNDA columna usando el BEGIN para declarar el separador FS (SIN usar -F).",
    "keywords": [
      "awk",
      "BEGIN",
      "FS"
    ],
    "hints": [
      "BEGIN { FS = \";\" } establece el separador ANTES de leer la primera línea.",
      "Equivale a -F; pero lo declaras en el SCRIPT, no en el thunk",
      "awk 'BEGIN { FS = \";\" } { print $2 }' /home/agent/datos.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'BEGIN { FS=\";\" } { print $2 }' f",
        "desc": "el separador creado por BEGIN"
      },
      {
        "cmd": "awk 'BEGIN { print \"inicio\" } { print $0 }' f",
        "desc": "BEGIN como banner"
      }
    ],
    "teach": "El bloque BEGIN se ejecuta UNA VEZ antes de processar líneas: ahí se inicializa FS (separador), OFS, variables, etc. Es la manera correcta cuando el separador es fijo.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "1\nFLAG{d3b09a4f7c2e1b8d6041a5f3}\n3"
      }
    ],
    "steps": [
      {
        "raw": "awk 'BEGIN { FS = \";\" } { print $2 }' /home/agent/datos.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "BEGIN { FS = \";\" } { print $2 } /home/agent/datos.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'BEGIN { FS = \";\" } { print $2 }' /home/agent/datos.dat"
  },
  {
    "id": "awk-pro-l17",
    "track": "awk-pro",
    "index": 17,
    "title": "Constructor de columnas",
    "subtitle": "awk OFS + reordenación",
    "xp": 70,
    "difficulty": 5,
    "brief": "El fichero amplio.dat usa espacios entre campos. Necesitas REORDENAR: TERCERO, PRIMERO y QUINTO, separados por |.",
    "goal": "De amplio.dat imprime en cada línea: campo 3, campo 1 y campo 5 (separados por |).",
    "keywords": [
      "awk",
      "OFS",
      "reordenar",
      "campos"
    ],
    "hints": [
      "Puedes printáAR campos en el ORDEN que quieras: $3, $1, $5.",
      "Puedes usar OFS: BEGIN { OFS = \"|\" } y luego print $3, $1, $5 (con comas).",
      "awk '{ print $3 \"|\" $1 \"|\" $5 }' /home/agent/amplio.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ print $3, $1 }' f",
        "desc": "reordena campos (OFS pred.)"
      },
      {
        "cmd": "awk 'BEGIN { OFS=\"|\" } { $1 = $1; print }' f",
        "desc": "reconstruye con OFS="
      }
    ],
    "teach": "En awk los campos $N se pueden impresar en CUALQUIER orden: no hay que reordenar el fichero. El separador de cada WORKING fue el que manualmente se case: si print con comas, awk separa con OFS (por defecto, espacio).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "tres|uno|cinco\ntres|uno|cinco\ntres|uno|FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ print $3 \"|\" $1 \"|\" $5 }' /home/agent/amplio.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ print $3 \"|\" $1 \"|\" $5 } /home/agent/amplio.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ print $3 \"|\" $1 \"|\" $5 }' /home/agent/amplio.dat"
  },
  {
    "id": "awk-pro-l18",
    "track": "awk-pro",
    "index": 18,
    "title": "Cuenta con arrays",
    "subtitle": "awk a[$1]++ + for (k in a)",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero hits.log trae IPs (una por línea). Necesitas el HISTOGRAMA: IP cuenta de hits (sin sort).",
    "goal": "De hits.log imprime el histograma «IP cuenta» (una por línea) y deja a la vista la línea del testigo que lleva la marca.",
    "keywords": [
      "awk",
      "array",
      "histograma",
      "END"
    ],
    "hints": [
      "a[$1]++ incrementa la cuenta por IP.",
      "En END, for (k in a) recorre las CLAVES y imprime indicator k y a[k].",
      "La línea del testigo con la marca se enseña aparte con grep.",
      "awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' /home/agent/hits.log ; grep 'FLAG{' /home/agent/hits.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' f",
        "desc": "histograma por la col. 1"
      },
      {
        "cmd": "awk '{ a[$1]++ } END { for (k in a) print k }' f",
        "desc": "solo las claves únicas"
      }
    ],
    "teach": "Los ARRAYS de awk (a[$1]++) mapean arbitrary (numéricos o strings). El bucle for (k in arr) itera TODAS las CLAVES. Es el histograma más corto de escribir.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "10.0.0.1 3\n10.0.0.2 2\n10.0.0.3 1\n10.0.0.2 FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' /home/agent/hits.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ a[$1]++ } END { for (k in a) print k, a[k] } /home/agent/hits.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      },
      {
        "raw": "grep 'FLAG{' /home/agent/hits.log",
        "cmds": [
          {
            "cmd": "grep",
            "args": "FLAG{ /home/agent/hits.log",
            "why": "filtra las líneas que coinciden con un patrón (regex básica por defecto)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ a[$1]++ } END { for (k in a) print k, a[k] }' /home/agent/hits.log ; grep 'FLAG{' /home/agent/hits.log"
  },
  {
    "id": "awk-pro-l19",
    "track": "awk-pro",
    "index": 19,
    "title": "Sólo los únicos",
    "subtitle": "awk idiom !a[$0]++",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero revisados.lst tiene valores repetidos. Necesitas SOLO la PRIMERA aparición de cada valor.",
    "goal": "De revisados.lst imprime cada valor UNA VEZ (PRIMERA aparición; en el orden de llegada).",
    "keywords": [
      "awk",
      "dedup",
      "array",
      "idioma"
    ],
    "hints": [
      "!a[$0]++ es el deduplicador famoso: la PRIMERA vez que se ve un valor imprime, ya que a[valor] era 0 (undefined→false), y las siguientes ya no.",
      "Con la negación !, awk hace \"si NO estaba presente, imprime\" y luego marca presente.",
      "awk '!a[$0]++' /home/agent/revisados.lst"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '!a[$0]++' f",
        "desc": "dedup por línea com.aleta"
      },
      {
        "cmd": "awk '!a[$1]++' f",
        "desc": "dedup por la col. 1"
      }
    ],
    "teach": "El idiom !a[k]++ es el revisor universal de duplicados: sin sort -u ni awk for-loop. Mantiene el ORDEN de llegada (a diferencia de sort -u).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "a\nb\nc\nd\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk '!a[$0]++' /home/agent/revisados.lst",
        "cmds": [
          {
            "cmd": "awk",
            "args": "!a[$0]++ /home/agent/revisados.lst",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '!a[$0]++' /home/agent/revisados.lst"
  },
  {
    "id": "awk-pro-l20",
    "track": "awk-pro",
    "index": 20,
    "title": "Dos ficheros, una clave",
    "subtitle": "awk FNR==NR + next",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero ids.txt lista los IDs permitidos; el fichero eventos.log trae líneas con id. Necesitas las líneas de eventos.log cuyo ID APARECE EN ids.txt.",
    "goal": "Con ambos ficheros (awk ficheroA ficheroB), imprime de eventos.log solo las líneas cuyo primer campo ESTÉ en ids.txt.",
    "keywords": [
      "awk",
      "FNR",
      "NR",
      "join"
    ],
    "hints": [
      "FNR == NR es \"estoy en el PRIMER fichero\": ahí llenas el array y haces NEXT.",
      "En el segundo fichero, $1 in a es el chequeo de membresía.",
      "awk 'FNR == NR { a[$1]; next } $1 in a' /home/agent/ids.txt /home/agent/eventos.log"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'FNR==NR { a[$1]; next } $1 in a' f1 f2",
        "desc": "join de 2 ficheros por clave"
      },
      {
        "cmd": "awk 'FNR==NR { a[$1]; next } !($1 in a)' f1 f2",
        "desc": "el inverso: los NO en f1"
      }
    ],
    "teach": "Cuando awk recibe DOS ficheros, FNR == NR es el patrón deIGNORE \"estoy en el primero\". En NEXT hay que saltar el procesos restos. El patrón: primero llenar un índice y en el segundo, consultar.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "101 evento del agent\n103 evento del usuario FLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'FNR == NR { a[$1]; next } $1 in a' /home/agent/ids.txt /home/agent/eventos.log",
        "cmds": [
          {
            "cmd": "awk",
            "args": "FNR == NR { a[$1]; next } $1 in a /home/agent/ids.txt /home/agent/eventos.log",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'FNR == NR { a[$1]; next } $1 in a' /home/agent/ids.txt /home/agent/eventos.log"
  },
  {
    "id": "awk-pro-l21",
    "track": "awk-pro",
    "index": 21,
    "title": "El extracted match()",
    "subtitle": "awk match() + substr + RSTART/RLENGTH",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero fragments.dat tiene líneas con texto ESENCIAL: hay un token FLAG con forma FLAG{abc}. Extrae SOLO ese token.",
    "goal": "De fragments.dat imprime SOLAMENTE la subcadena FLAG{…} de cada línea que la contenga.",
    "keywords": [
      "awk",
      "match",
      "RSTART",
      "RLENGTH"
    ],
    "hints": [
      "match(s, /regex/) busca el regex en s y LLENA RSTART y RLENGTH.",
      "awk extra con substr($0, RSTART, RLENGTH) obtiene el texto casado.",
      "awk 'match($0, /FLAG[{][^}]*[}]/) { print substr($0, RSTART, RLENGTH) }' /home/agent/fragments.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'match($0, /pat/) { print substr($0, RSTART, RLENGTH) }' f",
        "desc": "extrae el match (como grep -o)"
      },
      {
        "cmd": "awk 'match($0, /pat/) { print RSTART }' f",
        "desc": "solo la POSICIÓN"
      }
    ],
    "teach": "match(s, /regex/) llena RSTART/RLENGTH. Es lo que awk hace comparable a grep -o. Especificar las llaves ([{], [}]) ARGUMENTES para no escape it inside class char.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "FLAG{abc123}\nFLAG{zz}\nFLAG{d3b09a4f7c2e1b8d6041a5f3}"
      }
    ],
    "steps": [
      {
        "raw": "awk 'match($0, /FLAG[{][^}]*[}]/) { print substr($0, RSTART, RLENGTH) }' /home/agent/fragments.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "match($0, /FLAG[{][^}]*[}]/) { print substr($0, RSTART, RLENGTH) } /home/agent/fragments.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'match($0, /FLAG[{][^}]*[}]/) { print substr($0, RSTART, RLENGTH) }' /home/agent/fragments.dat"
  },
  {
    "id": "awk-pro-l22",
    "track": "awk-pro",
    "index": 22,
    "title": "Suma condicional",
    "subtitle": "awk '$1 == \"x\" { total += $2 } + END",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero entregas.dat trae acción y cantidad. Solo las líneas con ACCIÓN guardo acumulan en el total.",
    "goal": "De entregas.dat imprime las líneas cuyo PRIMER campo es \"guardo\" y al final el TOTAL (suma de la 2.ª columna) de esas líneas.",
    "keywords": [
      "awk",
      "condicional",
      "suma",
      "END"
    ],
    "hints": [
      "La condición $1 == \"guardo\" filtra; la ACCIÓN imprime la línea Y acumula $2.",
      "En END imprime el total acumulado.",
      "awk '$1 == \"guardo\" { print $0; total += $2 } END { print \"total:\", total }' /home/agent/entregas.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '$1 == \"x\" { s += $2 } END { print s }' f",
        "desc": "suma condicional"
      },
      {
        "cmd": "awk '{ tot += $2 } END { print tot/NR }' f",
        "desc": "promedio de la col. 2"
      }
    ],
    "teach": "La condición de awk solo deja pasar las líneas que casan; la ACCIÓN puede hacer varias cosas (imprimir + acumular) y END cierra con el total. Filtro y cálculo en una línea.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "guardo 10\nguardo 30\nguardo 50 FLAG{d3b09a4f7c2e1b8d6041a5f3}\ntotal: 90"
      }
    ],
    "steps": [
      {
        "raw": "awk '$1 == \"guardo\" { print $0; total += $2 } END { print \"total:\", total }' /home/agent/entregas.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "$1 == \"guardo\" { print $0; total += $2 } END { print \"total:\", total } /home/agent/entregas.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '$1 == \"guardo\" { print $0; total += $2 } END { print \"total:\", total }' /home/agent/entregas.dat"
  },
  {
    "id": "awk-pro-l23",
    "track": "awk-pro",
    "index": 23,
    "title": "El promedio contabilizado",
    "subtitle": "awk suma + END (promedio)",
    "xp": 75,
    "difficulty": 5,
    "brief": "El fichero puntajes.lst trae «id puntaje». Se necesita el PROMEDIO de la columna puntaje.",
    "goal": "De puntajes.lst imprime cada línea tal cual y al final el PROMEDIO de la 2.ª columna con printf (2 decimales).",
    "keywords": [
      "awk",
      "promedio",
      "NR",
      "END"
    ],
    "hints": [
      "tot += $2 acumula la base; NR es el número de líneas vistas.",
      "printf \"%.2f\\n\" redondea a dos decimales; el print intermedio deja a la vista la línea del testigo.",
      "awk '{ tot += $2; print $0 } END { printf \"media: %.2f\\n\", tot/NR }' /home/agent/puntajes.lst"
    ],
    "cheatsheet": [
      {
        "cmd": "awk '{ tot += $2 } END { print tot/NR }' f",
        "desc": "promedio col. 2 con NR"
      },
      {
        "cmd": "awk 'END { print NR }' f",
        "desc": "nº de líneas vistas"
      }
    ],
    "teach": "Promedio = acumular + contar + dividir en END. awk yprintf están. YOUR atajo aquí son las variables NR (contadores) y tot (sum).",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "a 4\nb 8\nc 6\nd FLAG{d3b09a4f7c2e1b8d6041a5f3}\nmedia: 4.50"
      }
    ],
    "steps": [
      {
        "raw": "awk '{ tot += $2; print $0 } END { printf \"media: %.2f\\n\", tot/NR }' /home/agent/puntajes.lst",
        "cmds": [
          {
            "cmd": "awk",
            "args": "{ tot += $2; print $0 } END { printf \"media: %.2f\\n\", tot/NR } /home/agent/puntajes.lst",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk '{ tot += $2; print $0 } END { printf \"media: %.2f\\n\", tot/NR }' /home/agent/puntajes.lst"
  },
  {
    "id": "awk-pro-l24",
    "track": "awk-pro",
    "index": 24,
    "title": "Boss: cayó en la lista negra",
    "subtitle": "awk join + exclusión + total",
    "xp": 175,
    "difficulty": 5,
    "brief": "Se necesitan dos ficheros: pagos.dat (usuario, monto) y blacklist.txt (usuario). El reporte pide el TOTAL de los usuarios que NO están en blacklist.",
    "goal": "Con ambos ficheros, imprime las líneas de pagos.dat cuyo usuario NO está en blacklist.txt y al final el TOTAL de sus montos (suma de la 2.ª columna).",
    "keywords": [
      "awk",
      "boss",
      "join",
      "acumulador",
      "END"
    ],
    "hints": [
      "En el primer fichero, llena el array (FNR==NR y next).",
      "En el segundo, si el usuario NO está en la lista: imprime la línea y suma el monto ($2).",
      "En END imprime el total. La línea del manager lleva la marca y pasa el filtro (no está en la lista).",
      "awk 'FNR == NR { a[$1]; next } !($1 in a) { print $0; total += $2 } END { print \"total:\", total }' /home/agent/blacklist.txt /home/agent/pagos.dat"
    ],
    "cheatsheet": [
      {
        "cmd": "awk 'FNR==NR { a[$1]; next } $1 in a { ... }' f1 f2",
        "desc": "f1 index → f2 filter"
      },
      {
        "cmd": "awk 'FNR==NR { a[$1]; next } !($1 in a) { ... } END { print total }' f1 f2",
        "desc": "excluye + suma + END"
      }
    ],
    "teach": "El boss de awk envuelve el \"SQL del shell\": un join (fichero de índices + consulta), un FILTRO NEGADO (NO está en la lista) y la SUMA con END. Es el patrón más potente en awk en un único comando.",
    "examples": [
      {
        "title": "salida esperada (flag demo)",
        "content": "admin 5000\nmanager 6000 FLAG{d3b09a4f7c2e1b8d6041a5f3}\ntotal: 11000"
      }
    ],
    "steps": [
      {
        "raw": "awk 'FNR == NR { a[$1]; next } !($1 in a) { print $0; total += $2 } END { print \"total:\", total }' /home/agent/blacklist.txt /home/agent/pagos.dat",
        "cmds": [
          {
            "cmd": "awk",
            "args": "FNR == NR { a[$1]; next } !($1 in a) { print $0; total += $2 } END { print \"total:\", total } /home/agent/blacklist.txt /home/agent/pagos.dat",
            "why": "procesa texto campo a campo: divide cada línea por espacios/tabs y actúa con un mini-lenguaje ({print $2} imprime el 2.º campo;END se ejecuta al final)",
            "flags": []
          }
        ]
      }
    ],
    "raw": "awk 'FNR == NR { a[$1]; next } !($1 in a) { print $0; total += $2 } END { print \"total:\", total }' /home/agent/blacklist.txt /home/agent/pagos.dat"
  }
];
export const TRACK_ORDER = ["fundamentos","filtrado","busqueda","procesado","permisos","procesos","redes","archivos","scripting","forense","boss","grep","awk","grep-pro","awk-pro"];
