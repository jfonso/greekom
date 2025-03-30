# Greekom - Proyecto PWM


### Integrantes del grupo
- Alejandro de Olózaga Ramírez
- Javier Alfonso Quintana


### Descripción del proyecto
El proyecto consiste en una wiki sobre la mitología griega. Esta
estará dividida por secciones, teniendo sus páginas para personajes, 
localizaciones, mitos y un foro. En el foro los usuarios podrán discutir
sobre la veracidad de los mitos contados, así como las múltiples versiones
existentes de estos.

### Servidor HTML

Para ver la página es necesario un servidor para los ficheros HTML, como por ejemplo la extensión Live Server de Visual Studio Code.

### Servidor JSON

Para el correcto funcionamiento de la página, es necesario instalar el modulo npm json-server.

```
npm i -g json-server
```

La base de datos debe crearse copiando el archivo data/db.json.example fuera de la carpeta del proyecto quitando la extension _.example_.

```
cp ./data/db.json.example ../db.json
```

Finalmente se debe ejectuar json-server.

```
json-server --watch ../db.json
```


### Requisitos funcionales
- Registro: el usuario tendrá la opción de registrarse en la web.
- Inicio de sesión: el usuario registrado tendrá la opción de iniciar sesión en la web.
- Participación en foro: el usuario con sesión iniciada podrá participar en el foro. Esto conlleva poder publicar una
respuesta en cualquier hilo y crear nuevos hilos.
- Guardado de información/hilos: el usuario con sesión iniciada podrá guardar artículos o hilos en una pestaña de favoritos,
accesibles desde el propio perfil.


### Listado de páginas
En el listado de páginas que se presenta, se especifica la siguiente información:
{Nombre del archivo (.html)} : "{Nombre atribuido al _header_ correspondiente en los Mock Up's}" -> {Descripción de la página}.
- index.html 		: "Main Page" -> la página principal.
- article.html 		: "Character Page", "Location Page", "Myth Page" -> las páginas de artículos que contienen la información de cada entidad.
- forum.html 		: "Forum Page" -> la página del foro.
- login.html 		: "Log In Page" -> la página de inicio de sesión.
- profile.html 		: "Profile Page" (6 pages) -> la página general de la información del perfil. Esta estará en desuso, ya que su implementación se hará en un Sprint posterior.
- profile-change-password : "Profile - Change Password" -> la página del perfil para cambiar la contraseña.
- profile-favourite 	: "Profile - Favourite Characters" -> la página del perfil que muestra los personajes, localizaciones, mitos e hilos favoritos.
- profile-information  	: "Profile - Personal Information" -> la página del perfil general que muestra la información del perfil.
- signup.html 		: Sign Up Page -> la página de registro de cuenta.
- thread.html 		: Thread Page -> la página de hilo.


### Listado de templates
En el listado de templates que se presenta, se especifica la siguiente información:
{Nombre del archivo (.html)} : {Descripción de lo que representa}.
- article.html 		: Corresponde con el cuerpo de los artículos que mostrarán las páginas de la wiki de personajes,
localizaciones y mitos. Estas tres páginas siguen el mismo formato.
- footer.html 		: Corresponde con el pie de página (_footer_) que se mostrará en todas las páginas.
- gallery-image.html	: Corresponde con la galería de imágenes de los artículos.
- header.html 		: Corresponde con la cabecera (_header_) que se mostrará en todas las páginas.
- ilustrated-link.html 	: Corresponde con la caja de información destacada de cada artículo.
- infobox-section.html 	: Corresponde con la caja de información que se mostrará a un lado en las páginas de la wiki de personajes, localizaciones y mitos. Estas cajas contendrán un resumen de la información más relevante acerca del artículo correspondiente.
- navbar.html 		: Corresponde con la barra de navegación (_navbar_) que se mostrará en todas las páginas.
- authenticated.html 	: Corresponde a la sección de autenticación de la barra de navegación cuando se ha iniciado sesión (sale username).
- authentication.html 	: Corresponde a la sección de autenticación de la barra de navegación cuando se no ha iniciado sesión (sale opción de inicio de sesión y registro).
- catalog-item.html 	: 
- post.html 		: Corresponde con una publicación (_post_) en la página del hilo correspondiente.
- thread.html 		: Corresponde con el formato en el que se representa el hilo.
- thread-item.html 	: Corresponde cada una de las publicaciones del foro en la página del foro.
- change-password.html 	: Corresponde con la sección del perfil para cambiar la contraseña (se usará más adelante).
- favorites.html 	: Corresponde con la sección del perfil para ver los favoritos (se usará más adelante).
- personal-information 	: Corresponde con la sección del perfil para ver la información de la cuenta (se usará más adelante).


### Archivos
Enlace al [Figma](https://www.figma.com/design/ySMqSx0vWv5DjfnFFZCj4j/Greekom-(Desktop)?node-id=0-1&t=mFqJf5kNvSar8JCH-1).