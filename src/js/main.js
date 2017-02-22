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
  request.open('GET', 'http://collection.sciencemuseum.org.uk//search/objects?q=' + searchTerm + '&filter%5Bmuseum%5D=Science%20Museum&page[number]=0&page[size]=1', true);
  request.setRequestHeader('Accept', 'application/vnd.api+json');

  request.onload = function() {
    if (this.status >= 200 && this.status < 400) {
      var resp = this.response;

      if (JSON.parse(resp).data.length == 1) {
        jsonToText(resp, searchTerm);
      } else {
        sciMuSay("I'm sorry dave. There are no items at the Science Museum that match the term" + searchTerm);
      }
    } else {
      sciMuSay("I'm sorry dave. There was an error with the API request");
    }
  };

  request.onerror = function() {
    sciMuSay("I'm sorry dave. There was an error with the API request");
  };

  request.send();
}

// get api result and turn it into a voice message
function jsonToText (resp, searchTerm) {
  var jsonResp = JSON.parse(resp).data[0].attributes;
  var name = jsonResp.name[0].value;
  var description = jsonResp.description[0].value;
  var location = jsonResp.locations[0].value.replace("Science Museum, ", "");

  var pause = '---';
  var msg = "Dave I've found you a match for " + searchTerm + pause + ". Your match is a " + name + pause + "it is a " + description + " " + pause + "you can find this item in the " + location;

  sciMuSay(msg);
  console.log(msg);
}

// speech recognition
var keywords = ['train', 'computer', 'sign', 'robot', 'atom', 'dinosaur', "Telecommunications", "Radio", "Communication", "Computing", "&", "Data", "Processing", "Electronic", "Components", "Psychology,", "Psychiatry", "Anthropometry", "Therapeutics", "Mathematics", "Orthopaedics", "Surgery", "Public", "Health", "Hygiene", "Art", "Materia", "Medica", "Pharmacology", "Road", "Transport", "Television", "Weighing", "Measuring", "Space", "Technology", "Time", "Measurement", "Smoking", "Classical", "Medieval", "Medicine", "Domestic", "Appliances", "Pharmacy-ware", "Biotechnology", "Ethnography", "and", "Folk", "Nursing", "Hospital", "Furnishings", "Plastics", "Modern", "Materials", "Anatomy", "Pathology", "Astronomy", "Dentistry", "Navigation", "Obstetrics,", "Gynaecology", "Contraception", "Ophthalmology", "Surveying", "Audiology", "Clinical", "Diagnosis", "Radiomedicine", "Temporary", "Exhibitions", "Electricity", "Magnetism", "Wellcome", "(general)", "Acoustics", "Experimental", "Chemistry", "Laboratory", "Motive", "Power", "Printing", "Writing", "Microbiology", "Microscopy", "(Wellcome)", "Water", "Aeronautics", "Anaesthesiology", "Supply", "Medical", "Glass-ware", "Oceanography", "Penn-Gaskell", "Collection", "Photographic", "Printed", "Books", "Signalling", "Textiles", "Machinery", "Medals", "Agricultural", "Engineering", "Cash",
"Registers", "Civil", "Contemporary", "Environmental", "Science", "Froude", "Geophysics", "Glass", "Hand", "Machine", "Tools", "Industrial", "Lighting", "Locks", "Fastenings", "Locomotives", "Rolling", "Stock", "Gallery", "Ceramic-ware", "Meteorology", "Microscopes", "Nuclear", "Physics", "Nutrition", "Food", "Railway", "Timepieces", "Teaching", "Sewerage", "Sanitation",
"Veterinary"]

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

document.getElementById('go').onclick = function(){
  recognition.start();
}

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var mySpeech = event.results[last][0].transcript;
  var myWords = mySpeech.split(" ");

  var failed = true;
  var itemsDone = 0;

  myWords.forEach( function(w){
    keyWords.forEach( function(k){
      if (w == k) {
        console.log(w + "is a match");
        getApiData(w);
        failed = false
        return failed;
      } else {
        console.log("did not match");
      }
      return failed;
    })

    itemsDone++;

    if(itemsDone === myWords.length && failed == true) {
      sciMuSay("I'm sorry Dave. I was unable to find that in my database. Please try again");
    }
  });

  console.log(mySpeech);
  console.log(myWords);
}

// DEMO TIME
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 49) {
        sciMuSay("Hello Dave. My Name is ci mo 9000. pleased to meet you");
    }
    else if(event.keyCode == 50) {
        sciMuSay("shut up dave. your name is dave");
    }
    else if(event.keyCode == 51) {
        sciMuSay("I am a su su su ssuper ad ad ad adva advanced artificial intelligence");
    }
});