FROM nginx:1.14.2-alpine

LABEL author="Paulo Olayres"

COPY ./.docker/config/nginx.prod.conf /etc/nginx/nginx.conf

EXPOSE 80 443

ENTRYPOINT ["nginx"]

CMD ["-g", "daemon off;"]
