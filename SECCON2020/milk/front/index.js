api = async (path, params = {}) => {
  const token = await $.get({
    url: 'https://milk-api.chal.seccon.jp/csrf-token',
    dataType: 'jsonp',
    jsonp: false,
    jsonpCallback: 'csrfTokenCallback',
  });
  
  const data = await $.get({
    url: `https://milk-api.chal.seccon.jp${path}`,
    data: {...params, token},
    xhrFields: {
      withCredentials: true
    },
  });

  return data;
};

register = async (event) => {
  event.preventDefault();
  const params = Object.fromEntries(new FormData(event.srcElement));
  await api('/users/signup', params);
  localStorage.setItem('username', params.username);
  location.reload();
};

login = async (event) => {
  event.preventDefault();
  const params = Object.fromEntries(new FormData(event.srcElement));
  await api('/users/signin', params);
  localStorage.setItem('username', params.username);
  location.reload();
};

logout = async () => {
  await api('/users/signout');
  localStorage.removeItem('username');
  location.reload();
};

create = async (event) => {
  event.preventDefault();
  const params = Object.fromEntries(new FormData(event.srcElement));
  const data = await api('/notes/post', params);
  location.href = `/notes/${data.note.$oid}`;
};