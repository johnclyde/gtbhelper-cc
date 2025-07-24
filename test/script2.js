window.onload = () => {
  const CLIENT_ID = '179194878949-krr7ijas2hl6blghgov8skhlj8rq0if6.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDU-D8p3dClGh_MX7EogyJMUdpNmXj-9OE';
  const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
  const SCOPES = 'https://www.googleapis.com/auth/drive';
  const signinButton = document.getElementsByClassName('signin')[0];
  const signoutButton = document.getElementsByClassName('signout')[0];
  let tokenClient;
  let gapiInited = false;
  let gisInited = false;
  gapiLoaded();
  gisLoaded();

  function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
  }

  async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS
    });
    gapiInited = true;
    showSigninButton();
  }

  function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: ''
    });
    gisInited = true;
    showSigninButton();
  }

  function showSigninButton() {
    if (gapiInited && gisInited) signinButton.style.display = 'block';
  }

  signinButton.addEventListener('click', () => {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) throw resp;
      signinButton.style.display = 'none';
      signoutButton.style.display = 'block';
      document.getElementById('message').innerHTML = 'Signed in...';
      //checkFolder();
    };

    if (gapi.client.getToken() === null) tokenClient.requestAccessToken({ prompt: 'consent' });
    else tokenClient.requestAccessToken({ prompt: '' });
  });

  signoutButton.addEventListener('click', () => {
    const token = gapi.client.getToken();

    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token);
      gapi.client.setToken('');
      signinButton.style.display = 'block';
      signoutButton.style.display = 'none';
      document.getElementById('message').innerHTML = '';
    }
  });
};
