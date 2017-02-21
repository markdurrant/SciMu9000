// needs cleaning up
// required to get around this issue ==> http://stackoverflow.com/questions/22812303/why-is-my-speech-synthesis-api-voice-changing-when-function-run-more-than-1-time
var speechVoices;

if ('speechSynthesis' in window) {
  speechVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = function() {
    speechVoices = window.speechSynthesis.getVoices();
  };
}
// end cleanup

function toggleSpeakingAnimation () {
  var sciMuSvg = document.querySelectorAll('.sci-mu svg')[0];

  if (sciMuSvg.classList.contains('speak')) {
    sciMuSvg.classList.remove('speak');
  } else {
    sciMuSvg.classList.add('speak');
  }
}

// get SciMu to talk
function sciMuSay (sayThis) {
  var speachText = sayThis;
  var synth = window.speechSynthesis;
  var myVoice = speechVoices[61];
  var utterThis = new SpeechSynthesisUtterance(speachText);
      utterThis.voice = myVoice;

  synth.speak(utterThis);
  toggleSpeakingAnimation();
  console.log('talking started');

  utterThis.onend = function(event) {
    console.log('talking ended');
    toggleSpeakingAnimation();
  }
}

// get something from the api
function getApiData (searchTerm) {
  var request = new XMLHttpRequest();
  request.open('GET', 'http://collection.sciencemuseum.org.uk//search/objects?q=' + searchTerm + '&page[number]=0&page[size]=1', true);
  request.setRequestHeader('Accept', 'application/vnd.api+json');

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var resp = this.response;

      // parse json and turn into text
      jsonToText(resp, searchTerm)
    } else {
      sciMuSay("I'm sorry dave. There was an error with the API request");
    }
  };

  request.onerror = function() {
    sciMuSay("I'm sorry dave. There was an error with the API request");
  };

  request.send();
}

function jsonToText (resp, searchTerm) {
  var jsonResp = JSON.parse(resp);
  var name = jsonResp.data[0].attributes.name[0].value;
  var description = jsonResp.data[0].attributes.description[0].value;
  var msg = "Dave I've found you a match for " + searchTerm + ". Your match is a " + name + ". " + description;

  sciMuSay(msg);
}