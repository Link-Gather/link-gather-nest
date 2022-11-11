#!/usr/bin/env bash

if [ -d /home/ubuntu/link-gather-nest/]; then
  sudo rm -rf /home/ubuntu/link-gather-nest
  echo ">delete folder"
fi
sudo mkdir -vp /home/ubuntu/link-gather-nest
echo ">mkdir"