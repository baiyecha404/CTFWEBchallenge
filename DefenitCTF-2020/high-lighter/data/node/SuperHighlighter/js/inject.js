var { pathname, host } = window.location;

if (pathname === '/read' && host === 'highlighter.ctf.defenit.kr') {

    let post = document.getElementById('content');
    let keyword = location.hash.substr(1);

    if (post && post.innerText && keyword) {
        chrome.runtime.sendMessage(
            { content: post.innerText, keyword },
            function (response) {
                post.innerHTML = response;
            }   
        );
    }

}