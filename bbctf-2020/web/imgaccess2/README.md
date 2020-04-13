# ImgAccess
## Deployment
- `docker-compose up`

## Known exploits
- python source code can be leaked by /uploads endpoint
- source code contains hint about apache
- apache allows config override using .htaccess
