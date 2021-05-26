# UPM Quiz

Plataforma web realizada con Express para el backend y React para el frontend. Esta plataforma busca enfocarse
en la realización de cuestionarios virtuales en el aula de una manera ágil y gratuita, pudiendo enlazar los resultados
en dichos cuestionarios a tareas de Moodle.

## Comenzando 🚀

Estas instrucciones te permitirán arrancar una copia del proyecto en tu máquina local para propósitos de desarrollo y pruebas.

### Pre-requisitos 📋

Para el correcto funcionamiento de la aplicación es necesario tener instalados Node.js y Git.

**Node.js:** https://nodejs.org/es/download/

**Git:** https://git-scm.com/downloads

### Instalación 🔧

**En el backend**

Instalamos las dependencias
```
npm install
```

Arrancamos e inicializamos la base de datos
```
npm run migrate_local
npm run seed_local
```

**En el frontend**

Instalamos las dependencias
```
npm install
```

## Despliegue 📦

Para desplegar el proyecto basta con arrancar el frontend y el backend.
Para ello, en ambos sitios hacemos:
```
npm start
```

## Configuración ⚙️

En el fichero _frontend/src/config/config.JSON_ se encuentran unos parámetros
de configuración que modifican aspectos generales de la aplicación

| Parámetro | Descripción |  
| ------ | ------ | 
| MOODLE_URL | URL base del Moodle a utilizar por la aplicación
| LOGIN_METHOD | Método de inicio de sesión. Si es correo electrónico, se establece 'email'. En cualquier otro caso, se trata de nombre de usuario
| AUTO_LOGOUT_TIME | Tiempo de inactividad permitido antes de cerrar sesión automáticamente. Se debe introducir un valor en segundos mayor o igual que 600 (10 minutos). Si el valor es erróneo, se usa 3600 (1 hora)

Por ejemplo, este sería un archivo de configuración para usar Moodle UPM y tiempo de inactividad
permitido de 1 hora. El valor de LOGIN_METHOD es 'email' porque el método de inicio
de sesión del Moodle UPM es mediante correo electrónico.

```
{
  "MOODLE_URL": "https://moodle.upm.es/titulaciones/oficiales",
  "LOGIN_METHOD": "email",
  "AUTO_LOGOUT_TIME": 3600
}
```


## Construido con 🛠️

* [React](https://es.reactjs.org/) - La biblioteca JavaScript utilizada en el frontend
* [Redux](https://es.redux.js.org/) - Complemento de React para la gestión del estado de la aplicación
* [Express](https://expressjs.com/es/) - Infraestructura utilizada para los servicios REST
* [SQLite](https://www.sqlite.org/index.html) - Base de datos utilizada

## Autor ✒

**Pablo Montes Pineda**️