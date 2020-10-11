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
  <script src=/index.js></script>
</head>
<body>
  <div class=container>
    <h1><a href=/>Milk</a></h1>
    <div class=row id=notlogin>
      <div class=column>
        <h2>Register</h2>
        <form onsubmit=register(event)>
          <input type=text placeholder=User name=username minlength=8 maxlength=32 required>
          <input type=password placeholder=Pass name=password minlength=8 maxlength=32 required>
          <input class=button-primary type=submit value=Register>
        </form>
      </div>
      <div class=column>
        <h2>Log In</h2>
        <form onsubmit=login(event)>
          <input type=text placeholder=User name=username minlength=8 maxlength=32 required>
          <input type=password placeholder=Pass name=password minlength=8 maxlength=32 required>
          <input class=button-primary type=submit value=Login>
        </form>
      </div>
    </div>
    <div class=row id=login>
      <div class=column>
        <p>Welcome back, <strong id=username></strong>! Let's note your precious memory in the secure vault :)</p>
        <form onsubmit=create(event)>
          <textarea name=body></textarea>
          <input class=button-primary type=submit value=Create>
        </form>
        <input class=button-clear type=button value=Logout onclick=logout()>
      </div>
    </div>
  </div>
  <script>
    const username = localStorage.getItem('username');

    if (username) {
      document.getElementById('notlogin').style.display = 'none';
      document.getElementById('username').textContent = username;
    } else {
      document.getElementById('login').style.display = 'none';
    }
  </script>
</body>
</html>