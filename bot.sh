#!/bin/bash
node entry.js
until test -e ./norestart
do
  sleep 5
  node entry.js
done