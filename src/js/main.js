function toggleSpeakingAnimation () {
  var sciMuSvg = document.querySelectorAll('.sci-mu svg')[0];

  if (sciMuSvg.classList.contains('speak')) {
    sciMuSvg.classList.remove('speak');
  } else {
    sciMuSvg.classList.add('speak');
  }
}

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

function sciMuSay (sayThis) {
  var speachText = sayThis;
  var synth = window.speechSynthesis;
  var myVoice = speechVoices[61];
  var utterThis = new SpeechSynthesisUtterance(speachText);
      utterThis.voice = myVoice;

  synth.speak(utterThis);
  toggleSpeakingAnimation();

  utterThis.onend = function(event) {
    toggleSpeakingAnimation();
  }
}