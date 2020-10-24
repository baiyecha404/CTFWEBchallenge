<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">-->
    <link rel="stylesheet" href="css/bulma.min.css">
    <!--<script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>-->
    <script defer src="js/fa.js"></script>
    <title>Docker Manager</title>
  </head>
  <body>
    <section class="section">
      <div class="container">
        <h1 class="title">Docker Manager</h1>
<?php
error_reporting(0);
?>
        <form action="view.php" method="POST">
          <div class="field">
            <label class="label">HOST</label>
            <div class="control has-icons-left">
              <input class="input" name="host" type="text" placeholder="http://127.0.0.1/">
              <span class="icon is-small is-left">
                <i class="fas fa-image"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">CERT</label>
            <div class="control has-icons-left">
              <input class="input" name="cert" type="text" placeholder="optional">
              <span class="icon is-small is-left">
                <i class="fas fa-image"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">KEY</label>
            <div class="control has-icons-left">
              <input class="input" name="key" type="text" placeholder="optional">
              <span class="icon is-small is-left">
                <i class="fas fa-image"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">CACERT</label>
            <div class="control has-icons-left">
              <input class="input" name="cacert" type="text" placeholder="optional">
              <span class="icon is-small is-left">
                <i class="fas fa-image"></i>
              </span>
            </div>
          </div>
          <div class="field">
            <label class="label">MODE</label>
            <div class="control has-icons-left">
              <input class="input" name="mode" type="text" placeholder="containers">
              <span class="icon is-small is-left">
                <i class="fas fa-image"></i>
              </span>
            </div>
          </div>
          <div class="control">
            <button class="button is-primary">Submit</button>
          </div>
        </form>
      </div>
    </section>
  </body>
</html>