#!/usr/bin/env bash

export DB_PORT=$(aws ssm get-parameters --region ap-northeast-2 --names /env/DB_PORT --query Parameters[0].Value | sed 's/"//g')
export DB_HOST=$(aws ssm get-parameters --region ap-northeast-2 --names /env/DB_HOST --query Parameters[0].Value | sed 's/"//g')
export DB_NAME=$(aws ssm get-parameters --region ap-northeast-2 --names /env/DB_NAME --query Parameters[0].Value | sed 's/"//g')
export DB_USER=$(aws ssm get-parameters --region ap-northeast-2 --names /env/DB_USER --query Parameters[0].Value | sed 's/"//g')
export DB_PASSWORD=$(aws ssm get-parameters --region ap-northeast-2 --names /env/DB_PASSWORD --query Parameters[0].Value | sed 's/"//g')
export PORT=$(aws ssm get-parameters --region ap-northeast-2 --names /env/PORT --query Parameters[0].Value | sed 's/"//g')
export NODE_ENV=$(aws ssm get-parameters --region ap-northeast-2 --names /env/NODE_ENV --query Parameters[0].Value | sed 's/"//g')
export JWT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names /env/JWT_SECRET --query Parameters[0].Value | sed 's/"//g')
export SALT_ROUNDS=$(aws ssm get-parameters --region ap-northeast-2 --names /env/SALT_ROUNDS --query Parameters[0].Value | sed 's/"//g')
export GITHUB_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names /env/GITHUB_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export GITHUB_CLIENT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names /env/GITHUB_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')
export GOOGLE_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names /env/GOOGLE_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export GOOGLE_CLIENT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names /env/GOOGLE_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')
export GOOGLE_REDIRECT_URI=$(aws ssm get-parameters --region ap-northeast-2 --names /env/GOOGLE_REDIRECT_URI --query Parameters[0].Value | sed 's/"//g')
export KAKAO_CLIENT_ID=$(aws ssm get-parameters --region ap-northeast-2 --names /env/KAKAO_CLIENT_ID --query Parameters[0].Value | sed 's/"//g')
export KAKAO_CLIENT_SECRET=$(aws ssm get-parameters --region ap-northeast-2 --names /env/KAKAO_CLIENT_SECRET --query Parameters[0].Value | sed 's/"//g')
export KAKAO_REDIRECT_URI=$(aws ssm get-parameters --region ap-northeast-2 --names /env/KAKAO_REDIRECT_URI --query Parameters[0].Value | sed 's/"//g')
export CORS_ORIGIN=$(aws ssm get-parameters --region ap-northeast-2 --names /env/CORS_ORIGIN --query Parameters[0].Value | sed 's/"//g')
export COOKIE_SIGN=$(aws ssm get-parameters --region ap-northeast-2 --names /env/COOKIE_SIGN --query Parameters[0].Value | sed 's/"//g')
export MAIL_AUTH_PASS=$(aws ssm get-parameters --region ap-northeast-2 --names /env/MAIL_AUTH_PASS --query Parameters[0].Value | sed 's/"//g')

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

sudo docker container prune -f # 쓰지않는 컨테이너 모두 삭제
sudo docker image prune -f # 쓰지않는 이미지 모두 삭제

sudo docker build -t linkgather .
sudo docker run --name linkgather -d -p $PORT:$PORT \
-e NODE_ENV=$NODE_ENV \
-e PORT=$PORT \
-e DB_PORT=$DB_PORT \
-e DB_HOST=$DB_HOST \
-e DB_NAME=$DB_NAME \
-e DB_USER=$DB_USER \
-e DB_PASSWORD=$DB_PASSWORD \
-e JWT_SECRET=$JWT_SECRET \
-e SALT_ROUNDS=$SALT_ROUNDS \
-e GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID \
-e GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET \
-e GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID \
-e GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET \
-e GOOGLE_REDIRECT_URI=$GOOGLE_REDIRECT_URI \
-e KAKAO_CLIENT_ID=$KAKAO_CLIENT_ID \
-e KAKAO_CLIENT_SECRET=$KAKAO_CLIENT_SECRET \
-e KAKAO_REDIRECT_URI=$KAKAO_REDIRECT_URI \
-e CORS_ORIGIN=$CORS_ORIGIN \
-e COOKIE_SIGN=$COOKIE_SIGN \
-e MAIL_AUTH_PASS=$MAIL_AUTH_PASS \
linkgather