# Backend AWS Lambdas

How to run
- add .env for every lambda with variables leading to some PostgreSQL database
- run `script.sql` on that database
- `zip -r deploy.zip ./` to build lambda deployment
- upload file to AWS Lambda