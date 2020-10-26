let u = new URL(location), p = u.searchParams, k = p.get('keyword') || '';
if ('' === k) history.replaceState('', '', '?keyword=');
axios.post('/search', `keyword=${encodeURIComponent(k)}`).then(resp => {
    result.innerHTML = '';
    if (document.domain == 'a.bytectf.live') {
        if(Object.keys(resp.data).length != 0){
            document.domain = 'bytectf.live'
                for (f of Object.keys(resp.data)) {
                    let i = document.createElement('iframe');
                    i.src = `http://b.bytectf.live:30001/send?keyword=${encodeURIComponent(f)}`;
                    result.appendChild(i);
                    setTimeout(
                        () => {
                            let u = window.frames[0].document.getElementById('result').children[0].innerText;
                            let e = document.createElement('iframe'); e.src = u; ;
                            window.frames[0].document.getElementById('result').append(e)
                        },2500)
                }
            } else {
                let i = document.createElement('iframe');
                i.src = `http://a.bytectf.live:30001/send?keyword=`; 
                result.appendChild(i);
                setTimeout(
                    () => {
                        let u = "https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f480000brb2q3t2v324gt56fosg&ratio=720p&line=0";
                        let e = document.createElement('iframe'); e.src = u;
                        window.frames[0].document.getElementById('result').append(e)
                    },2500)
        
            }
    }
})



