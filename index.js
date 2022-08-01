var BASE_URL = 'https://integration-catalyst.herokuapp.com';
var AF_URL = window.location.host;


function setCookie(cookie_key, cookie_value, days_of_expiration) {
  var date = new Date();
  date.setTime(date.getTime() + (days_of_expiration*24*60*60*1000));
  var expires = "expires="+ date.toUTCString();
  document.cookie = cookie_key + "=" + cookie_value + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function afCallAPI(data) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {};
  xhttp.open("POST", BASE_URL, true);
  xhttp.setRequestHeader("Content-type", "application/json");
  
  data['current_page_url'] = btoa(window.location.href);
  data['base_url']    = btoa(AF_URL);
  data['af_id']       = getCookie("af_id");
  data['script_name'] = af_script;

  var p = Object.keys(data).map(key => key + '=' + data[key]).join('&');
  xhttp.send(p);
}

var AffTracker = {
  
}