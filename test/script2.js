

window.onload = () => {
  
var CLIENT_ID = "179194878949-krr7ijas2hl6blghgov8skhlj8rq0if6.apps.googleusercontent.com", 
    API_KEY = "AIzaSyDU-D8p3dClGh_MX7EogyJMUdpNmXj-9OE", 
    DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"], 
    SCOPES = "https://www.googleapis.com/auth/drive", 
    signinButton = document.getElementsByClassName("signin")[0], 
    signoutButton = document.getElementsByClassName("signout")[0];
let tokenClient, 
    gapiInited = false, 
    gisInited = false;
  gapiLoaded();
  gisLoaded();


function gapiLoaded() {
  gapi.load("client", initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  });
  gapiInited = true;
  showSigninButton();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: ""
  });
  gisInited = true;
  showSigninButton();
}

function showSigninButton() {
  if (gapiInited && gisInited) 
    signinButton.style.display = "block";
}

signinButton.addEventListener("click", function() {
  tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) 
      throw (resp);
    signinButton.style.display = "none";
    signoutButton.style.display = "block";
    document.getElementById("message").innerHTML = "Signed in...";
    //checkFolder();
  };

  if (gapi.client.getToken() === null) 
    tokenClient.requestAccessToken({ prompt: "consent" });
  else 
    tokenClient.requestAccessToken({ prompt: "" });
});

signoutButton.addEventListener("click", function() {
  const token = gapi.client.getToken();

  if (token !== null) {
    google.accounts.oauth2.revoke(token.access_token);
    gapi.client.setToken("");
    signinButton.style.display = "block";
    signoutButton.style.display = "none";
    document.getElementById("message").innerHTML = "";
  }
});

}
