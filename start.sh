#!/bin/bash
cd /root/turnos/api/

echo "Instalando dependencias"
npm prune

echo "corriendo app"
npm run start
