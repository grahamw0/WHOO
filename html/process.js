function process(){
    var accessToken = "c87528439d4f4a2aa097f1aec7d414e3";
    var baseUrl = "https://api.api.ai/v1/";
    $(document).ready(function() {
	$("#input").keypress(function(event) {
	    if (event.which == 13 && $("#input").val().replace(/\s/g, "") != "") {
		event.preventDefault();
		send();
	    }
	});
	$("#rec").click(function(event) {
	    switchRecognition();
	});
    });
    var recognition;
    function startRecognition() {
	recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) {
	    updateRec();
	};
	recognition.onresult = function(event) {
	    var text = "";
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
		text += event.results[i][0].transcript;
	    }
	    setInput(text);
	    stopRecognition();
	};
	recognition.onend = function() {
	    stopRecognition();
	};
	recognition.lang = "en-US";
	recognition.start();
    }
    
    function stopRecognition() {
	if (recognition) {
	    recognition.stop();
	    recognition = null;
	}
	updateRec();
    }
    function switchRecognition() {
	if (recognition) {
	    stopRecognition();
	} else {
	    startRecognition();
	}
    }
    function setInput(text) {
	$("#input").val(text);
	send();
    }
    function updateRec() {
	$("#rec").text(recognition ? "Stop" : "Speak");
    }
    function send() {
	var text = $("#input").val();
	setResponse(text);
	$.ajax({
	    type: "POST",
	    url: baseUrl + "query?v=20150910",
	    contentType: "application/json; charset=utf-8",
	    dataType: "json",
	    headers: {
		"Authorization": "Bearer " + accessToken
	    },
	    data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),
	    success: function(data) {
		setResponse(JSON.stringify(data.result.fulfillment.speech, undefined, 2));
	    },
	    error: function() {
		setResponse("Internal Server Error");
	    }
	});
	// setResponse("Loading...");
    }
    function setResponse(val) {
	$("#input").val("");
	$("#response").append(val + "\n\n");
	$("#response").scrollTop($("#response")[0].scrollHeight);
    }
}
