#!/bin/bash

npm install
nest update
npm run build
npm run typeorm:migration:run
npm run start:dev