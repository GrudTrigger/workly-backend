FROM postgres:10.3

COPY ./auth/up.sql /docker-entrypoint-initdb.d/1.sql

CMD ["postgres"]