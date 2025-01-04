#!/bin/bash

# Build the production image
docker build -t resumeguide:prod .

# Run the container
docker run -d \
  --name resumeguide \
  -p 80:80 \
  --restart unless-stopped \
  resumeguide:prod 