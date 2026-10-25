/*
 * gen-expansion-sql — genera el track `sql` (SQLite real: /usr/bin/sqlite3).
 * Mecánica estándar del dojo:
 *   · setup crea /home/agent/dojo.sqlite con tablas temáticas y la $DOJO_FLAG
 *     (o fragmentos que se ensamblan con GROUP_CONCAT / substr / concatenación).
 *   · solution = query SQL de referencia que REVELA la marca.
 * Regenerar: node scripts/gen-expansion-sql.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const YAML = require(path.join(repoRoot, 'node_modules/yaml'));

const HOME = '/home/agent';

function sqlSetup(sql) {
  return `sqlite3 <dbpath> "${sql.replace(/\n/g, ' ')}"`;
}

const SQL = [
  {
    index: 1, title: 'La primera consulta', subtitle: 'SELECT y FROM', xp: 55, difficulty: 2,
    brief: 'La base del dojo es real: una SQLite con la bitácora de los agentes. La primera herramienta siempre es SELECT: «muéstrame estas columnas de esta tabla».',
    goal: 'Sobre /home/agent/dojo.sqlite: muestro la tabla sellos (SELECT * FROM sellos). La marca del dojo viaja en la columna sello.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE sellos (id INTEGER PRIMARY KEY, sello TEXT); INSERT INTO sellos VALUES (1,'trozo-1'),(2,'$DOJO_FLAG'),(3,'trozo-3');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT * FROM sellos;"`,
    hints: [
      'sqlite3 FICHERO "QUERY" es la forma CLI: abre la base y ejecuta la consulta.',
      'SELECT * pide todas las columnas; FROM sellos elige la tabla.',
      `sqlite3 ${HOME}/dojo.sqlite "SELECT * FROM sellos;"`,
    ],
    teach: 'SELECT col FROM tabla es el latín de las bases de datos. El CLI sqlite3 recibe la base como primer parámetro y la consulta entrecomillada. En SQLite (a diferencia del MySQL) casi todo lo demás tiene la MISMA sintaxis.',
    cheatsheet: [
      { cmd: 'sqlite3 db.sqlite "SELECT * FROM t;"', desc: 'leer una tabla entera' },
      { cmd: '.tables', desc: 'listar las tablas (modo interactivo)' },
    ],
    keywords: ['sql', 'sqlite', 'select', 'from'],
    examples: [{ title: 'salida esperada (flag demo)', content: '1|trozo-1\n2|FLAG{…}\n3|trozo-3' }],
  },
  {
    index: 2, title: 'El asunto filtrado', subtitle: 'WHERE: filas que cuentan', xp: 60, difficulty: 3,
    brief: 'SELECT sin WHERE devuelve TODO. La disciplina del consultor: filtrar. Solo UNA fila de patrullas es del agente borrado y lleva la marca.',
    goal: 'De tabla patrullas: muestra las filas cuyo agente sea «kaito». La marca está en su notana (columna nota).',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE patrullas (id INTEGER PRIMARY KEY, agente TEXT, nota TEXT); INSERT INTO patrullas VALUES (1,'juna','patrulla normal'),(2,'kaito','$DOJO_FLAG'),(3,'kaito','día libre'),(4,'sora','entrenamiento');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT nota FROM patrullas WHERE agente='kaito' AND nota LIKE '%FLAG%';"`,
    hints: [
      "WHERE agente='kaito' reduce a sus dos filas; añade AND nota LIKE '%FLAG%' para cazar la marca.",
      `sqlite3 ${HOME}/dojo.sqlite "SELECT nota FROM patrullas WHERE agente='kaito';"`,
    ],
    teach: 'WHERE es el filtro de fila: se evalúa en CADA fila y decide si va o no. Combinas condiciones con AND/OR; LIKE permite comodines (%). Ojo: en SQL el = case-sensitive según collation de SQLite (por defecto NO distinguir mayúsculas: careful).',
    cheatsheet: [
      { cmd: "WHERE col='v'", desc: 'igualdad' },
      { cmd: "WHERE a='x' AND b LIKE '%F%'", desc: 'combinar filtros' },
    ],
    keywords: ['sql', 'where', 'like', 'filtro'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 3, title: 'El patrón del escondite', subtitle: 'LIKE y comodines: % y _', xp: 60, difficulty: 3,
    brief: 'El escondite no es exacto: es un patrón. LIKE con % (cualquier cadena) y _ (UN carácter exacto) es la lupa SQL.',
    goal: 'De tabla escondites: encuentra las filas cuyo objeto sea «lanterna%» (empieza con lanterna); la marca está en el notably (columna pista).',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE escondites (id INTEGER PRIMARY KEY, objeto TEXT, pista TEXT); INSERT INTO escondites VALUES (1,'lanterna-escudo','escudo normal'),(2,'farol-rojo','no es esto'),(3,'lanterna-secreta','$DOJO_FLAG'),(4,'lanterna3','un número y nada más');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT pista FROM escondites WHERE objeto LIKE 'lanterna%' AND pista LIKE '%FLAG%';"`,
    hints: [
      "LIKE 'lanterna%' menciona TODO lo que empiece con lanterna (lanterna-escudo, lanterna-secreta y lanterna3).",
      'Entre las coincidencias, la pista que lleva la marca es de lanterna-secreta: puedes encadenar AND pista LIKE "%FLAG%".',
      `sqlite3 ${HOME}/dojo.sqlite "SELECT pista FROM escondites WHERE objeto LIKE 'lanterna%' AND pista LIKE '%FLAG%';"`,
    ],
    teach: 'LIKE % = cero o más caracteres; _ = UNO exacto. Encadenadas: filtro de patrón + filtro de contenido (`pista LIKE %FLAG%`) es la doble lupa típica. NOT LIKE invierte. Para case-sensitividad HOWA: GLOB distingue mayúsculas.',
    cheatsheet: [
      { cmd: "LIKE 'pre%'", desc: 'empieza con pre' },
      { cmd: "LIKE '_x%'", desc: 'segundo carácter x' },
      { cmd: "LIKE '%mid%'", desc: 'contiene mid' },
    ],
    keywords: ['sql', 'like', 'glob', 'comodines'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 4, title: 'El podio de puntuaciones', subtitle: 'ORDER BY ... DESC LIMIT', xp: 65, difficulty: 4,
    brief: 'La gente se rinde: ¿quién es el PRIMERO? ORDER BY ordena y LIMIT corta. La primera fila del podio guarda la marca.',
    goal: 'De tabla podios: la fila del AGENTE con la puntuación MÁS ALTA (puntos DESC LIMIT 1); su insignia lleva la marca.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE podios (id INTEGER PRIMARY KEY, agente TEXT, puntos INT, insignia TEXT); INSERT INTO podios VALUES (1,'juna',480,'bronce'),(2,'sora',920,'plata'),(3,'kaito',1500,'$DOJO_FLAG'),(4,'tsuru',30,'participación');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT insignia FROM podios ORDER BY puntos DESC LIMIT 1;"`,
    hints: [
      'ORDER BY puntos DESC de mayor a menor; LIMIT 1 queda con la primera.',
      'Muestra TODO para inspeccionar: SELECT * FROM podios ORDER BY puntos DESC LIMIT 1; luego extrae la columna insignia.',
      `sqlite3 ${HOME}/dojo.sqlite "SELECT insignia FROM podios ORDER BY puntos DESC LIMIT 1;"`,
    ],
    teach: 'ORDER BY col [ASC|DESC] ordena; LIMIT N corta. La combinación es el ID de TOP-N universal. Ojo con los empates: añade un segundo criterio (agente) para hacer el orden total.',
    cheatsheet: [
      { cmd: 'ORDER BY col DESC', desc: 'mayor a menor' },
      { cmd: 'LIMIT 1', desc: 'quedarse con una fila' },
    ],
    keywords: ['sql', 'order', 'limit', 'top'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 5, title: 'El recuento de la tribu', subtitle: 'COUNT/GROUP BY/HAVING', xp: 70, difficulty: 4,
    brief: 'El dojo quiere CUÁNTOS asistentes hubo por gremio. GROUP BY agrupa y los agregados (COUNT, SUM...) resumen cada grupo. HAVING filtra después de agrupar.',
    goal: 'De tabla eventos: cuenta cuántos asistentes (personas) evento por gremio, agrupando; la serie que da la marca: entre los grupos más grandes (4 personas) el nombre del gremio ES la firma.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE eventos (id INTEGER PRIMARY KEY, gremio TEXT, asistentes INT); INSERT INTO eventos VALUES (1,'lint','3'),(2,'kendo','4'),(3,'dojusi','3'),(4,'kendo','$DOJO_FLAG');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT gremio, COUNT(*), GROUP_CONCAT(asistentes, ' ') FROM eventos GROUP BY gremio ORDER BY COUNT(*) DESC;"`,
    hints: [
      'GROUP BY gremio agrupa y COUNT(*) cuenta filas por gremio.',
      'GROUP_CONCAT(asistentes) junta los valores del grupo: la marca arriba en el grupo de kendo.',
      `sqlite3 ${HOME}/dojo.sqlite "SELECT gremio, COUNT(*), GROUP_CONCAT(asistentes, ' ') FROM eventos GROUP BY gremio ORDER BY COUNT(*) DESC;"`,
    ],
    teach: 'GROUP BY col: UNA fila de salida por grupo; otros cálculos aquí se CONSOLIDAN (COUNT, SUM, AVG, MIN, MAX). HAVING filtra GRUPOS (WHERE filtra FILAS antes). Es el triángulo de los reporting.',
    cheatsheet: [
      { cmd: 'GROUP BY col', desc: 'agrupar y resumir' },
      { cmd: 'HAVING COUNT(*)>N', desc: 'filtrar grupos' },
      { cmd: 'COUNT(DISTINCT col)', desc: 'valores únicos por grupo' },
    ],
    keywords: ['sql', 'group by', 'having', 'count'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'kendo|2 (fila extra con el FLAG en asistentes)' }],
  },
  {
    index: 6, title: 'El lienzo combinado', subtitle: 'JOIN entre dos tablas', xp: 75, difficulty: 4,
    brief: 'La información está dividida: una tabla de ENCARGOS y otra de AGENTES. La marca solo aparece al UNIR ambas por la clave.',
    goal: 'UNE encargos con agentes por id de agente (JOIN); muestra los encargos de kaito: en la tabla encarg unsuspending campo detalle lleva la marca.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE agentes (id INTEGER PRIMARY KEY, nombre TEXT); CREATE TABLE encargos (id INTEGER PRIMARY KEY, agente_id INT, detalle TEXT); INSERT INTO agentes VALUES (1,'juna'),(2,'kaito'),(3,'sora'); INSERT INTO encargos VALUES (10,1,'lavándula'),(11,2,'$DOJO_FLAG'),(12,1,'poda'),(13,3,'riego');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT e.detalle FROM encargos e JOIN agentes a ON e.agente_id=a.id WHERE a.nombre='kaito';"`,
    hints: [
      'JOIN agentes a ON encargos.agente_id=a.id une por la clave.',
      'Filtrar por a.nombre = kaito y pedir e.detalle.',
      `sqlite3 ${HOME}/dojo.sqlite "SELECT e.detalle FROM encargos e JOIN agentes a ON e.agente_id=a.id WHERE a.nombre='kaito';"`,
    ],
    teach: 'JOIN ... ON une filas de dos tablas por una columna compartida (clave). Los ALIAS (a, e) abrevian. INNER JOIN = solo coincidencias; LEFT JOIN conserva las filas sin pareja (con NULL). El 90% del SQL de reporting es esto.',
    cheatsheet: [
      { cmd: 'FROM t1 JOIN t2 ON t1.k=t2.k', desc: 'unión por clave' },
      { cmd: 'LEFT JOIN t2', desc: 'incluye t1 sin pareja' },
    ],
    keywords: ['sql', 'join', 'on', 'clave'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 7, title: 'La corrección del registro', subtitle: 'UPDATE ... SET ... WHERE', xp: 70, difficulty: 4,
    brief: 'Una fila de inventario quedó MAL: estado «konfuso» pero stock -5. Sentencia UPDATE para corregir el estado (a ok) y luego consultas para ver el arreglo.',
    goal: 'De inventario: cambie el estado de la fila con SKU 42 a «ok» (UPDATE ... SET estado=ok) y también AÚNELA la marca: la columna nota de esa fila debe pasar a contener la FIRMA en vez de vacío (nota = FLAG).',
    setup: `printf '%s\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit && chmod 0644 /var/.dojo-hit
sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE inventario (id INTEGER PRIMARY KEY, sku INT, estado TEXT, nota TEXT); INSERT INTO inventario VALUES (1,42,'konfuso','algo'),(2,7,'ok','sin incidencias');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "UPDATE inventario SET estado='ok' WHERE sku=42 AND estado='konfuso';" && sqlite3 ${HOME}/dojo.sqlite "SELECT estado, nota FROM inventario WHERE sku=42;" && cat /var/.dojo-hit`,
    hints: [
      'UPDATE tabla SET col=val WHERE cond: SIEMPRE con WHERE (o cambias TODAS las filas).',
      'Tras el UPDATE muestra con SELECT ... WHERE sku=42 para VER el resultado.',
      `sqlite3 ${HOME}/dojo.sqlite "UPDATE inventario SET estado='ok' WHERE sku=42;" && sqlite3 ... "SELECT * FROM inventario WHERE sku=42;"`,
    ],
    teach: 'UPDATE modifica filas CASADAS por WHERE. Regla de oficio: primero el SELECT equivalente, luego el UPDATE (ver CASAQUE va a tocar). En SQLite, sin BEGIN los cambios van a disco al cerrar; no hay un buffer de imagen.',
    cheatsheet: [
      { cmd: "UPDATE t SET c=v WHERE cond", desc: 'actualizar filas' },
      { cmd: 'SELECT changes();', desc: 'filas afectadas por el último write' },
    ],
    keywords: ['sql', 'update', 'set', 'where', 'changes'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'ok|FLAG{…}' }],
  },
  {
    index: 8, title: 'La fila borrada', subtitle: 'DELETE + validación de resultados', xp: 70, difficulty: 4,
    brief: 'El dojo quiere que PRACTIQUES el borrado: la fila de prueba debe IRSE del altar y únicamente quedan 3 registros (la firma va en la fila restante más rara).',
    goal: 'De tabla altaro: borra LA fila cuyo id=99 (DELETE WHERE id=99) y COMPRUEBA con SELECT COUNT(*) que quedan el resto. La marca está en la fila del id 1 (columna obj).',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE altaro (id INTEGER PRIMARY KEY, obj TEXT); INSERT INTO altaro VALUES (1,'$DOJO_FLAG'),(2,'cabeza'),(3,'hueso'),(99,'prueba-borrar');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "DELETE FROM altaro WHERE id=99;" && sqlite3 ${HOME}/dojo.sqlite "SELECT COUNT(*) FROM altaro; SELECT obj FROM altaro WHERE id=1;"`,
    hints: [
      'DELETE FROM tabla WHERE cond borra SOLO las filas concordas; sin WHERE borra TODAS.',
      'Verifica con COUNT(*) tras borrar (should = 3).',
      `sqlite3 ${HOME}/dojo.sqlite "DELETE FROM altaro WHERE id=99;" && sqlite3 db "SELECT COUNT(*) FROM altaro;"`,
    ],
    teach: 'DELETE WHERE remueve filas; sin WHERE remueve LA TABLA entera. La práctica de doble confirm (contar luego) es de los senior: transactions lo hacen reversible (BEGIN; DELETE; ROLLBACK;).',
    cheatsheet: [
      { cmd: 'DELETE FROM t WHERE cond', desc: 'borrar filas concordas' },
      { cmd: 'DELETE FROM t', desc: ' ¡borra TODO! (peligro)' },
    ],
    keywords: ['sql', 'delete', 'where', 'count'],
    examples: [{ title: 'salida esperada (flag demo)', content: '3\nFLAG{…}' }],
  },
  {
    index: 9, title: 'El registro nuevo', subtitle: 'INSERT INTO ... VALUES', xp: 65, difficulty: 3,
    brief: 'El dojo recibe UN NUEVO ALTARISTA (instructor) y quiere SU REGISTRO insertado con la estación temporal: INSERT de una fila completa.',
    goal: 'De tabla cadetes: INSERTA una fila (id 5, nombre instructor, rango 3) y con la columna nota de la fila ID 2 (la referencia de estaculo), la marca aparece.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE cadetes (id INTEGER PRIMARY KEY, nombre TEXT, rango INT, nota TEXT); INSERT INTO cadetes VALUES (1,'juna',1,''),(2,'kaito',2,'$DOJO_FLAG');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "INSERT INTO cadetes VALUES (5,'instructor',3,'');" && sqlite3 ${HOME}/dojo.sqlite "SELECT nota FROM cadetes WHERE id=2;"`,
    hints: [
      'INSERT INTO tabla VALUES (…): una fila por llamada; los tipos pueden diferir pero NOS conviene exactos.',
      'Tras la inserción, la tabla listará la fila 5 al hacer SELECT *.',
      `sqlite3 db "INSERT INTO cadetes (id, nombre, rango) VALUES (5,'instructor',3);"`,
    ],
    teach: 'INSERT INTO tabla (cols) VALUES (vals): la forma completa (listar columnas explícitas previene descolocar las columnas). SQLite el ROWID auto con INTEGER PRIMARY KEY.',
    cheatsheet: [
      { cmd: "INSERT INTO t (cols) VALUES (vals)", desc: 'insertar fila' },
      { cmd: 'INSERT OR IGNORE', desc: "evita duplicar la PRIMARY KEY" },
    ],
    keywords: ['sql', 'insert', 'values', 'primary key'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 10, title: 'La forja del esqueleto', subtitle: 'CREATE TABLE con restricciones', xp: 75, difficulty: 5,
    brief: 'El dojo auténtico SE CONSTRUYE: crea TU propia tabla (con PRIMARY KEY y NOT NULL) y llena UNA fila con la marca.',
    goal: 'Crea una tabla torre (id INTEGER PRIMARY KEY NOT NULL UNIQUE, planta TEXT NOT NULL) y guarda en una fila la marca (valor en planta). Validación: id=1 nombre de columna planta debe ser el sello.',
    setup: `printf '%s\\\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit && chmod 0644 /var/.dojo-hit\nrm -f ${HOME}/dojo.sqlite\ntrue`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE IF NOT EXISTS torre (id INTEGER PRIMARY KEY NOT NULL UNIQUE, planta TEXT NOT NULL);" && sqlite3 ${HOME}/dojo.sqlite "INSERT INTO torre VALUES (1, '$(cat /var/.dojo-hit)');" && sqlite3 ${HOME}/dojo.sqlite "SELECT planta FROM torre WHERE id=1;"`,
    hints: [
      'CREATE TABLE torre (id INTEGER PRIMARY KEY, planta TEXT NOT NULL);',
      "INSERT con sustitución de shell: sqlite db \"INSERT INTO torre VALUES (1, '$(cat /var/.dojo-hit)');\" o desde la caja con la marca en una variable.",
      `sqlite3 db "CREATE TABLE IF NOT EXISTS torre (id INTEGER PRIMARY KEY, planta TEXT NOT NULL);" && sqlite3 db "INSERT INTO torre (id, planta) VALUES (1, '$(cat /var/.dojo-hit)');"`,
    ],
    teach: 'CREATE TABLE define el esqueleto: tipos afines (INTEGER, TEXT, REAL...), PRIMARY KEY, NOT NULL, UNIQUE, DEFAULT. INTEGER PRIMARY KEY es ROWID implícito (rápido y compacto). Los de REAL/BLOB NO NULL impone integridad.',
    cheatsheet: [
      { cmd: 'CREATE TABLE t (id INTEGER PRIMARY KEY, c TEXT NOT NULL);', desc: 'esqueleto de tabla' },
      { cmd: '.schema torre', desc: 'ver el CREATE exacto de una tabla' },
    ],
    keywords: ['sql', 'create table', 'primary key', 'not null'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 11, title: 'La espina del esqueleto', subtitle: '.schema y PRAGMA table_info', xp: 70, difficulty: 4,
    brief: 'ANTES de tocar, se DELUYE ES A FAZER: la estructura. .schema muestra los CREATE TABLES y PRAGMA table_info(columns) las COLUMNAS con tipos.',
    goal: 'Sobre la tabla torre (ya existe): imprime su estructura con .schema torre (y también PRAGMA table_info(torre);). La marca está en /var/.dojo-hit: cat para IMPRIMIR.',
    setup: `printf '%s\\\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit && chmod 0644 /var/.dojo-hit\nsqlite3 ${HOME}/dojo.sqlite "CREATE TABLE torre (id INTEGER PRIMARY KEY NOT NULL, planta TEXT NOT NULL DEFAULT 'vacia');" >/dev/null\ntrue`,
    solution: `printf '.schema torre\\n.PRAGMA table_info(torre);\\n' | sqlite3 ${HOME}/dojo.sqlite; PRAGMA=$( ...) 2>/dev/null || true; sqlite3 ${HOME}/dojo.sqlite "PRAGMA table_info(torre);"; cat /var/.dojo-hit`,
    hints: [
      '.schema torre imprime el CREATE TABLE de la tabla (es un punto-comando, NO SQL).',
      'PRAGMA table_info(torre) devuelve las columnas con tipo/pk (instrucción específica de SQLite).',
      `sqlite3 db ".schema torre"; sqlite3 db "PRAGMA table_info(torre);"`,
    ],
    teach: 'Antes de escribir se aprende el ESQUELETO existente. .schema (dot-command del CLI) y PRAGMA (función interna de SQLite) son los dos modos oficiales. PRAGMA table_info es el que usan todos los exploradores DB.',
    cheatsheet: [
      { cmd: '.schema tabla', desc: 'el CREATE TABLE completo' },
      { cmd: 'PRAGMA table_info(tabla);', desc: 'columnas con tipo y pk' },
    ],
    keywords: ['sql', 'schema', 'pragma', 'columns'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'CREATE TABLE torre(id…)\n\n0|id|INTEGER|0|…\nFLAG{…}' }],
  },
  {
    index: 12, title: 'La frase en fragmentos', subtitle: 'GROUP_CONCAT: ensamblar', xp: 80, difficulty: 5,
    brief: 'La marca llegó PARTIDA: cinco FRAGMENTOS en el orden de su id. GROUP_CONCAT los junta en UNA autrícula.',
    goal: 'De tabla fragmento: JUNTA los valores de trozos con ORDER BY id (concatenación con separador → cadena "una-palabra": GROUP_CONCAT). Obtén la firma completa como resultado.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE fragmento (id INTEGER PRIMARY KEY, trozos TEXT); WITH RECURSIVE c(n) AS (SELECT 1 UNION ALL SELECT n+1 FROM c WHERE n<4) INSERT INTO fragmento SELECT n, substr('${'$'}DOJO_FLAG', 1+(n-1)*8, 8) FROM c;" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT GROUP_CONCAT(trozos, '') FROM (SELECT trozos FROM fragmento ORDER BY id);"`,
    hints: [
      'Los fragmentos están en el orden de su id; GROUP_CONCAT con separador vacío los pega.',
      "Con la subconsulta ordenada evitas el ORDER BY interno de GROUP_CONCAT (SQLite 3.44+): SELECT GROUP_CONCAT(trozos, '') FROM (SELECT trozos FROM fragmento ORDER BY id);",
      `sqlite3 db "SELECT GROUP_CONCAT(trozos, '') FROM (SELECT trozos FROM fragmento ORDER BY id);"`,
    ],
    teach: 'GROUP_CONCAT es el ARMA de las «cadenas mil partes» (participants, logs, chunks). Con separador "" pega por orden; con sep explicit,", " les junta con comas. El ORDER BY DENTRO del GROUP_CONCAT es SQLite ≥ 3.44 (si no, subconsulta ordenada).',
    cheatsheet: [
      { cmd: 'GROUP_CONCAT(col, sep)', desc: 'juntar columna en cadena' },
      { cmd: 'GROUP_CONCAT(c, sep ORDER BY id)', desc: 'juntar ORDENADO (3.44+)' },
    ],
    keywords: ['sql', 'group_concat', 'concatenar', 'fragmento'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{abc111…}' }],
  },
  {
    index: 13, title: 'La consulta dentro', subtitle: 'subconsultas (SELECT dentro de SELECT)', xp: 80, difficulty: 5,
    brief: 'Las subconsultas filtrar CON EL RESULTADO de otra: el agente cuyo rango es el máximo. Profundidad de lectura: primero interior, después exterior.',
    goal: 'De tabla rangos: selecciona el agente cuyo rango IGUALA el máximo (SELECT MAX(rango)): esa ES la fila del sello.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE rangos (id INTEGER PRIMARY KEY, agente TEXT, rango INT, sello TEXT); INSERT INTO rangos VALUES (1,'juna',300,''),(2,'sora',920,''),(3,'kaito',1500,'$DOJO_FLAG');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT sello FROM rangos WHERE rango=(SELECT MAX(rango) FROM rangos);"`,
    hints: [
      'Subconsulta: (SELECT MAX(rango) FROM rangos) devuelve EL máximo → 1500.',
      'En WHERE: WHERE rango = (…): de la subconsulta sai x cola UNA sola fila (un número).',
      `sqlite3 db "SELECT sello FROM rangos WHERE rango=(SELECT MAX(rango) FROM rangos);"`,
    ],
    teach: 'Una subconsulta es un SELECT DENTRO de otro: se evalúa primero (como variable) y el exterior la consume. IN: cuando devuelve VARIAS filas; = cuando UNA. Correlacionadas (que heredan la fila actual) las encadenas con EXISTS.',
    cheatsheet: [
      { cmd: 'WHERE c=(SELECT MAX(c) FROM t)', desc: 'igualar al agregado' },
      { cmd: 'WHERE id IN (SELECT …)', desc: 'lista de la subconsulta' },
    ],
    keywords: ['sql', 'subconsulta', 'max', 'nested'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 14, title: 'La caja de búsqueda', subtitle: 'FULL TEXT y el índice de búsqueda', xp: 75, difficulty: 5,
    brief: 'SQLite trae la BÚSQUEDA de TEXTO REAL: FTS5 crea la tabla de BÚSQUEDA por índice (inverso). Crea tu índice índice virtual y buscas en SEGUNDOS.',
    goal: 'Crea VIRTUAL TABLE torre_fts con FTS5 (CREATE VIRTUAL TABLE ... USING fts5(...)), INSERTA la fila con la cuenta de la marca (columna docs = FLAG) y BUSCA MATCH contra "dojo": devuelven la marca.',
    setup: `printf '%s\\\\n' '${'$'}DOJO_FLAG' > /var/.dojo-hit && chmod 0644 /var/.dojo-hit\nrm -f ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "CREATE VIRTUAL TABLE torre_fts USING fts5(docs);" && sqlite3 ${HOME}/dojo.sqlite "INSERT INTO torre_fts VALUES ('dojo $(cat /var/.dojo-hit)');" && sqlite3 ${HOME}/dojo.sqlite "SELECT docs FROM torre_fts WHERE torre_fts MATCH 'dojo';"`,
    hints: [
      'La tabla virtual: CREATE VIRTUAL TABLE torre_fts USING fts5(docs);',
      'MATCH busca dentro del índice: SELECT docs FROM torre_fts WHERE torre_fts MATCH "dojo";',
      `sqlite3 db "INSERT INTO torre_fts (docs) VALUES ('$cat /var/.dojo-hit');"`,
    ],
    teach: 'FTS5 es un MOTOR DE BÚSQUEDA DENTRO de SQLite: crea UNA tabla virtual con índice INVERSO. La columna MATCH busca por palabras. Es LA herramienta de los logs y datasets de texto sin instalar APIs externas.',
    cheatsheet: [
      { cmd: 'CREATE VIRTUAL TABLE t USING fts5(c);', desc: 'tabla de búsqueda' },
      { cmd: "WHERE t MATCH 'palabra'", desc: 'búsqueda por índice' },
    ],
    keywords: ['sql', 'fts5', 'match', 'fulltext'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'dojo FLAG{…}' }],
  },
  {
    index: 15, title: 'La transacción a prueba', subtitle: 'BEGIN/COMMIT/ROLLBACK', xp: 80, difficulty: 5,
    brief: 'El dótre del UPDATE peligroso: hágelo DENTRO de una transacción para poder ROLLBACK si te equivocas (atomía).',
    goal: 'BEGIN TRANSACTION; DELETE plano; verificación de resultados (¿quedaron 3 filas?); COMMIT; y luego SELECT … la marca tras el commit en la fila restante.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE mudarm (id INTEGER PRIMARY KEY, obj TEXT); INSERT INTO mudarm VALUES (1,'$DOJO_FLAG'),(2,'piedra'),(3,'piedra'),(4,'piedra'),(99,'prueba-rollback');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "BEGIN; DELETE FROM mudarm WHERE id=99; COMMIT; SELECT obj FROM mudarm WHERE id=1;"`,
    hints: [
      'BEGIN; …COMMIT; haz TODAS las sentencias atómicas: si algo falla en el medio, ROLLBACK devuelto el estado inicial.',
      "El DELETE dentro de BEGIN: DELETE FROM mudarm WHERE id=99; más luego el COMMIT.",
      `sqlite3 db "BEGIN; DELETE FROM mudarm WHERE id=99; COMMIT; SELECT * FROM mudarm;"`,
    ],
    teach: 'BEGIN marca el inicio de la transacción; COMMIT la sella; ROLLBACK cipher DESHACE TODO desde el BEGIN. En SQLite cada escritura ES una transacción implícita y begin... toca UNA pattern de producción para «grabes todo O nada».',
    cheatsheet: [
      { cmd: 'BEGIN; … COMMIT;', desc: 'grupo atómico de escrituras' },
      { cmd: 'ROLLBACK;', desc: 'deshacer desde el BEGIN' },
    ],
    keywords: ['sql', 'transaction', 'begin', 'commit', 'rollback'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
  {
    index: 16, title: 'Boss SQL', subtitle: 'JOIN + GROUP BY + HAVING + ORDER BY', xp: 170, difficulty: 5,
    brief: 'El examen final de SQL: une AGENTES con MISIONES, AGRUPA por agente, MUESTRA el que más misiones cumplió y con estracto SELLO... la máxima graduación.',
    goal: 'Con JOIN entre agentes y misiones por id: GROUP BY agente → contando misiones, el agente con MÁS (COUNT DESC LIMIT 1)... su columna sello DE agentes ES la marca final.',
    setup: `sqlite3 ${HOME}/dojo.sqlite "CREATE TABLE agentess (id INTEGER PRIMARY KEY, nombre TEXT, sello TEXT); CREATE TABLE misiones (id INTEGER PRIMARY KEY, agente_id INT, tarea TEXT); INSERT INTO agentess VALUES (1,'juna','bronce'),(2,'sora','plata'),(3,'kaito','$DOJO_FLAG'); INSERT INTO misiones VALUES (1,1,'reparto'),(2,1,'limpieza'),(3,2,'conducción'),(4,3,'seguridad'),(5,3,'ronda'),(6,3,'opcional');" && chmod 644 ${HOME}/dojo.sqlite && chown agent:agent ${HOME}/dojo.sqlite`,
    solution: `sqlite3 ${HOME}/dojo.sqlite "SELECT a.sello FROM agentess a JOIN misiones m ON m.agente_id=a.id GROUP BY a.id ORDER BY COUNT(*) DESC LIMIT 1;"`,
    hints: [
      'JOIN agentess a ON m.agente_id=a.id y GROUP BY a.id (o a.nombre).',
      'ORDER BY COUNT(*) DESC LIMIT 1: solo el que más misiones (kaito, con 3).',
      `sqlite3 db "SELECT a.sello FROM agentess a JOIN misiones m ON m.agente_id=a.id GROUP BY a.id ORDER BY COUNT(*) DESC LIMIT 1;"`,
    ],
    teach: 'El boss mezcla TODO: un JOIN (una fila por combinación), GROUP BY (colapso por agente), los AGREGADOS (COUNT), el orden por agregado y LIMIT para el TOP-1. Con ese patrón escribes reportes y dashboards a la primera.',
    cheatsheet: [
      { cmd: 'GROUP BY a.id ORDER BY COUNT(*) DESC LIMIT 1', desc: 'TOP-1 por grupo' },
      { cmd: 'JOIN + GROUP BY', desc: 'tríada del reporting' },
    ],
    keywords: ['boss', 'sql', 'join', 'group by', 'ord'],
    examples: [{ title: 'salida esperada (flag demo)', content: 'FLAG{…}' }],
  },
];

function emit(track, items, startIndex) {
  const dir = path.join(repoRoot, 'levels', track);
  fs.mkdirSync(dir, { recursive: true });
  let done = 0;
  items.forEach((it, i) => {
    const idx = startIndex + i + 1;
    const y = {
      id: `${track}-l${idx}`,
      track,
      index: idx,
      title: it.title,
      subtitle: it.subtitle ?? '',
      xp: it.xp,
      difficulty: it.difficulty,
      brief: it.brief,
      goal: it.goal,
      setup: `\#!/bin/bash\nset -e\n${it.setup}`,
      solution: it.solution,
      hints: it.hints,
      teach: it.teach,
      cheatsheet: it.cheatsheet,
      keywords: it.keywords,
      profile: 'default',
      examples: it.examples ?? [],
    };
    fs.writeFileSync(path.join(dir, `l${idx}.yaml`), YAML.stringify(y, { lineWidth: 90 }));
    done++;
  });
  return done;
}

const n = emit('sql', SQL, 0);
console.log(`gen-expansion-sql: sql +${n} niveles`);
