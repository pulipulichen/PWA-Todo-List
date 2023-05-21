#Specify the version of nodejs.
FROM node:12.0

#Update stretch repositories
RUN sed -i s/deb.debian.org/archive.debian.org/g /etc/apt/sources.list
RUN sed -i 's|security.debian.org|archive.debian.org/|g' /etc/apt/sources.list
RUN sed -i '/stretch-updates/d' /etc/apt/sources.list

#Install required packages in os(It is recommended to write it as a spell)
RUN apt-get update
RUN apt-get install -y \
    #Because non-root users use root privileges
    sudo \
    #Get tools from internet
    wget \
    vim \
    apt-utils

#Creating an application directory
RUN mkdir /app
#Use app directory as development directory
WORKDIR /app

#Package in container.json and packate-lock.Make sure that two of json are copied
#COPY .babelrc ./
COPY postcss.config.js ./

CMD ["npm","run", "4.webpack-build-production"]

# package.Install the package described in json.
COPY package.json ./
RUN npm i

#installed node_Copy files such as module to the container side.
#COPY . .

#RUN ls /app/*
