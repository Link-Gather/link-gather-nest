#!/usr/bin/env bash

cd /home/ubuntu/link-gather-nest/

echo "> deploy"

CONTAINER_ID=$(docker container ls -f "name=linkgather" -q)

echo "> 컨테이너 ID ${CONTAINER_ID}"

if [ -z ${CONTAINER_ID} ]
then
  echo "> 현재 구동중인 애플리케이션이 없으므로 종료하지 않습니다."
else
  echo "> docker stop ${CONTAINER_ID}"
  sudo docker stop ${CONTAINER_ID}
  echo "> docker rm ${CONTAINER_ID}"
  sudo docker rm ${CONTAINER_ID}
fi

sudo docker build -t linkgather .
sudo docker run --name linkgather -d -e active=prod -p $PORT:$PORT linkgather