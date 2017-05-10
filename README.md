# maze
Bodorrio de natxete:

Todo esto lo hice ayer por la tarde asi que las quejas al maestro armero:

Se trata de un laberinto, la idea es hacerle una cuenta (tal vez de paypal) con la pastuki y dejarle la contraseña de la cuenta en forma de codigo QR que podra obetener sin mas que dibujar el QR en una hoja excel, por ejemplo, despues de recorrerlo a lo DOOM. (Podemos alegrarle un poco la vida dejando un SHA de la contraseña y dejarsela en alguna rainbow table perdida del mundo de internet, muahahahahahahaha, esto tendria el extra de que, no se bien como funcionan los QR, pero es probable que si no lo hace bien busque un hash que no exista XD)

Actualmente se hace el laberinto y esta puesto para que los cubos que lo forman no tengan colisiones. Esto esta asi pq si no le tendriamos que dar una plantilla con todos los huecos inaccesibles y no es plan.... que trabaje, que se gane la vida!. Aun asi para la version final debieramos poner el tema de activar/desactivar las colisiones en alguna tecla para facilitarle un poco la vida.... (1)

Hacen falta fotos de natxo y habra que mirar como se ponen que actualmente no esta puesto. Mi idea es tener varios tipos de materiales (que son las texturas que se dibujan dando cuerpo a los cubos) con diferentes fotos (4 por material) e irlas rotando (o rotar los cubos) aleatoriamente de modo que consiguieramos 4n paredes de cubo diferentes y asi nos pueda odiar mas. :). Imagino que sera fabricar varios cubos con las diferentes texturas, clonarlos y rotarlos... pero no lo se...(2)

Tambien hay que hacer un gran MESH, que parece que es una buena optimizacion -pero esto solo al final y si sobra tiempo-. (3)

Ofuscar con esto:

https://javascriptobfuscator.com/Javascript-Obfuscator.aspx

PD:
(1): Hecho, al pulsar 'Q' se activa  se desactiva el wallhack :P.
(2): Hecho. Era exactamente eso: hacer materiales, rotar cubos aleatoriamente y 'clonarlos' aleatoriamente ('clonarlos' es 'instanciarlos' pq al clonarlos, entre otras cosas, clona tambien el material (no le veo la utilidad a clonar una forma en un juego si no es para reutilizar ese tipo de cosas... babylonJS tiene cosas sin mucho sentido)
(3): Descartado: uso multimateriales y seria un pollo. Ademas no hay problemas de rendimiento.
