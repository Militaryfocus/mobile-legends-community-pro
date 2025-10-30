#!/bin/bash
export NODE_ENV=production
export PORT=3100
sudo pkill -9 node
sleep 2
npm start
