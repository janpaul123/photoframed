 var _Timer = null;
 
 function UpdateContent() {
  var http = new XMLHttpRequest();
 
   http.open("GET", "map.php", true);
    http.onreadystatechange = function() {
        if(http.readyState==4) {
          if(http.status==200) {
            MakeVisible('files', http.responseText == 'on');
          }
        }
    };
    
    try {
        http.send(null);
    }
    catch(e) {
        alert(e);
    }
  
  
}

/* Text quotes update */
function UpdateText() {
  var http = new XMLHttpRequest();
 
   http.open("GET", "quote.php", true);
    http.onreadystatechange = function() {
        if(http.readyState==4) {
          if(http.status==200) {
            document.getElementById('quotes').innerHTML = http.responseText;
          }
        }
    };
    
    try {
        http.send(null);
    }
    catch(e) {
        alert(e);
    }
}

function MakeVisible(id, v) {
  document.getElementById(id).style.display = v?"block":"none";
}

function UpdateTime() {
  var date = new Date();
  document.getElementById('hours').innerHTML = (date.getHours());
  var minutes = ""+date.getMinutes();
  if(minutes.length<2) { minutes = "0"+minutes;}
  document.getElementById('minutes').innerHTML = (minutes);
}

function UpdatePictures() {
  document.getElementById("background").src = "random_picture.php?"+Math.random();  
  document.getElementById('filemap').src = "http://www.traphic.nl/generated/verkeersinformatie.png";
}

function DisplayStart() {
  DisplayUpdate();
}

function DisplayUpdate() {
  if(_Timer!=null) {
    window.clearTimeout(_Timer);
    _Timer = null;
  }
  UpdateTime();
  UpdateContent();
  UpdatePictures();
  UpdateText();
  _Timer = window.setTimeout("DisplayUpdate()", DisplayInterval);
}
