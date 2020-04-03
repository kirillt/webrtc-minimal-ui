var Peer = require("simple-peer");

//so far, tested in Firefox only
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true
  }).then(processStream)
  .catch((e) => {
    console.error(e);
  });

function processStream(stream) {
  var peer = new Peer({
    initiator: location.hash === "#init",
    stream: stream,
    trickle: false
  });

  console.log("init?", location.hash === "#init");

  peer.on("signal", function (data) {
    console.log("signal");
    document.getElementById("thisId").value = JSON.stringify(data);
  })

  peer.on("data", function (data) {
    document.getElementById("messages").textContent += data + '\n';
  });

  peer.on("stream", function (stream) {
    var video = document.createElement("video");
    document.body.appendChild(video);

    if ("srcObject" in video) {
      video.srcObject = stream;
    } else {
      video.src = window.URL.createObjectURL(stream);
      //for older browsers
    }

    video.play();
  });

  document.getElementById("connect").addEventListener("click", function () {
    var otherId = JSON.parse(document.getElementById("otherId").value);
    peer.signal(otherId);
  });

  document.getElementById("send").addEventListener("click", function () {
    var yourMessage = document.getElementById("thisMessage").value;
    peer.send(yourMessage);
  });
}
