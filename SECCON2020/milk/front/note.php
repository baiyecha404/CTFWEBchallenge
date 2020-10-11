<!DOCTYPE html>
<html lang=en>
<head>
  <meta charset=UTF-8>
  <title>Milk</title>
  <link rel=stylesheet href=https://fonts.googleapis.com/css2?family=Comfortaa:wght@400&family=Roboto:ital,wght@0,300;0,700;1,300;1,700>
  <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/normalize.css/normalize.css>
  <link rel=stylesheet href=https://cdn.jsdelivr.net/npm/milligram/dist/milligram.css>
  <style>
    body { text-align: center; }
    h1 { font-family: Comfortaa; font-size: 20rem; margin-top: 10rem; }
  </style>
  <script src=https://code.jquery.com/jquery-3.5.1.min.js></script>
  <script src=https://milk-api.chal.seccon.jp/csrf-token?_=<?= htmlspecialchars(preg_replace('/\d/', '', $_GET['_'])) ?> defer></script>
  <script src=/index.js></script>
  <script>
    csrfTokenCallback = async (token) => {
      window.csrfTokenCallback = null;
      const paths = location.pathname.split('/');

      const data = await $.get({
        url: 'https://milk-api.chal.seccon.jp/notes/get',
        data: {id: paths[paths.length - 1], token},
        xhrFields: {
          withCredentials: true,
        },
      });

      document.getElementById('username').textContent = data.note.username;
      document.getElementById('body').textContent = data.note.body;

      document.querySelector('[name=url]').value = location.href;
    };
  </script>
</head>
<body>
  <div class=container>
    <h1><a href=/>Milk</a></h1>
    <p><strong id=username></strong>'s memory:</p>
    <blockquote id=body></blockquote>
    <form action=/report method=POST>
      <input type=hidden name=url>
      <input class=button-primary type=submit value=Report-to-admin>
    </form>
  </div>
</body>
</html>