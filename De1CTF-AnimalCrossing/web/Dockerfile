FROM chromedp/headless-shell

WORKDIR /app

RUN echo 'flag{I_l1k4_}' > /flag
COPY ./build_linux /app/web
COPY ./public /app/public

ENTRYPOINT ["/app/web"]
