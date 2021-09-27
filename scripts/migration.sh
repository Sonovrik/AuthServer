#!/bin/bash

# ./migration.sh generate <name>
# ./migration.sh run

arg=$1
name=$2

docker exec -it nestjs-container /bin/bash -c " \
  if [ \"$arg\" = \"run\" ] && [ \"$#\" -eq 1 ]; then \
    npm run typeorm:migration:run; \
  elif [ \"$arg\" = \"create\" ] && [ \"$#\" -eq 2 ]; then \
    npm run typeorm:migration:create \"$name\"; \
  elif [ \"$arg\" = \"generate\" ] && [ \"$#\" -eq 2 ]; then \
    npm run typeorm:migration:generate \"$name\"; \
  else \
    echo \"Invalid params\"; \
  fi \
";

docker exec -it authServer-container /bin/bash -c " \
  if [ \"$arg\" = \"run\" ] && [ \"$#\" -eq 1 ]; then \
    npm run typeorm:migration:run; \
  elif [ \"$arg\" = \"create\" ] && [ \"$#\" -eq 2 ]; then \
    npm run typeorm:migration:create \"$name\"; \
  elif [ \"$arg\" = \"generate\" ] && [ \"$#\" -eq 2 ]; then \
    npm run typeorm:migration:generate \"$name\"; \
  else \
    echo \"Invalid params\"; \
  fi \
";