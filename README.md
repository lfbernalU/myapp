# Instrucciones para la Ejecución del Proyecto Habits

1. **Clonar el repositorio:**
    ```sh
    git clone https://github.com/lfbernalU/myapp.git
    ```

2. **Navegar al directorio del proyecto:**
    ```sh
    cd myapp
    ```

3. **Configurar el archivo `.env`:**
        Crea un archivo llamado `.env` en la raíz del proyecto y agrega las siguientes variables de entorno:
        ```plaintext
            MONGO_URI=mongodb+srv://<usuario>:<contraseña>@cluster0.z7mez.mongodb.net/db?retryWrites=true&w=majority&appName=Cluster0
        ```

4. **Instalar las dependencias:**
    ```sh
    npm install
    ```

5. **Ejecutar el proyecto:**
    ```sh
    npm start
    ```

6. **Abrir en el navegador:**
    Abre tu navegador y navega a `http://localhost:3000` para ver la aplicación en funcionamiento.

