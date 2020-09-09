<?php

$user = NULL;
$is_admin = 0;

if (isset($_GET["source"])) {
    highlight_file(__FILE__);
    exit;
}

if (isset($_POST["username"]) && isset($_POST["password"])) {
    $username = $_POST["username"];
    $password = $_POST["password"];

    $db = new PDO("sqlite:../database.db");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    try {
        $db->exec("CREATE TABLE IF NOT EXISTS users (username TEXT UNIQUE, password TEXT, is_admin BOOL);");

        $q = "username, is_admin FROM users WHERE username = '$username' AND password = '$password'";
        if (preg_match("/SELECT/i", $q)) {
            throw new Exception("only select is a forbidden word");
        }

        $rows = $db->query("SELECT " . $q, PDO::FETCH_ASSOC);
        foreach ($rows as $row) {
            $user = $row["username"];
            $is_admin = $row["is_admin"];
        }
    }
    catch (Exception $e) {
        exit("EXCEPTION!");
    }


}

?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Just SQLi</title>
</head>
<body>
    <h1>Just SQLi</h1>    
    <div><a href="?source=1">view source</a>

    <?php if ($user) { ?>
    <div>Nice Login <?= $user ?></div>
        <?php if ($is_admin) { ?>
        <div>And Nice to Get the Admin Permission!</div>
        <div> <?= include("../flag.php"); ?></div>
        <?php } ?>
    <?php } ?>

    <form action="" method="POST">
        <div>username: <input type="text" name="username" required></div>
        <div>password: <input type="text" name="password" required></div>

        <div>
            <input type="submit" value="Login">
        </div>
    </form>

</body>
</html>
