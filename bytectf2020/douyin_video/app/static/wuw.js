if (location.host != 'a.bytectf.live:30001') {
    document.domain = 'bytectf.live'
}
let u = new URL(location), p = u.searchParams, k = p.get('keyword') || ''
if ('' === k) history.replaceState('', '', '?keyword=')
axios.post('/search', `keyword=${encodeURIComponent(k)}`).then(resp => {
    result.innerHTML = ''
    for (i of Object.keys(resp.data)) {
        let p = document.createElement('pre')
	p.style = "display: none;"
        p.textContent = i
        result.appendChild(p)
    }
})

