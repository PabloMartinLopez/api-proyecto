# Usa la imagen oficial ligera de Node.js v20 (soporte LTS)
FROM node:24-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia los archivos de resolución de dependencias
COPY package*.json ./

# Instala todas las dependencias (solo de producción si NODE_ENV=production, o todas para desarrollo)
# Como la base depende del NODE_ENV, instalaremos todas normalmente o puedes usar npm ci
RUN npm install

# Copia el código fuente al contenedor
COPY . .

# Expone el puerto que usa Express por defecto
EXPOSE 3000

# Comando para iniciar la aplicación
CMD [ "npm", "start" ]
