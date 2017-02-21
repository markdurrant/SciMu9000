function toggleSpeaking () {
  var sciMuSvg = document.querySelectorAll('.sci-mu svg')[0];

  if (sciMuSvg.classList.contains('speak')) {
    sciMuSvg.classList.remove('speak');
  } else {
    sciMuSvg.classList.add('speak');
  }
}