# Notas:
Esta es una pequeña aplicación de consola en node con el objetivo de mostrar información al usuario sobre una ciudad en particular. Además, se utiliza la libreria "inquirer" para desplegar un menú más funcional para el usuario.

1) El usuario ingresa por consola un lugar a buscar, utilizando la API de MapBox se realiza una búsqueda de hasta 5 coincidencias de acuerdo a lo que el usuario ingresó.
2) Utilizando los datos de longitud y latitud del lugar seleccionado, se obtiene información del clima actual en dicho lugar, mediante la API de OpenWeather.
3) La aplicación lee los tokens de las API en las variables de entorno, las cuales son ingresadas en un archivo ".env". Ingresa tus tokens en el archivo "example.env" y renombralo solo a ".env".
