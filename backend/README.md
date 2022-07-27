# Backend AWS Lambdas

How to run
- add .env for every lambda with `DB_USERNAME`, `DB_PASSWORD`, `DB_HOST`, `DB_NAME` variables leading to some PostgreSQL database
- run `script.sql` on that database
- `zip -r deploy.zip ./` to build lambda deployment
- upload file to AWS Lambda