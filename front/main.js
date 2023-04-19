async function requestGPT(question, temperature = 150, max_tokens = 600,response) {
    console.log("Question : " + question)

        var response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{"role": "system", "content": "Bonjour, comment puis-je vous aider ?" },
                {"role": "user", "content": question}],
            temperature: temperature,
            max_tokens: max_tokens,
          }),
        });
        
        var json = await response.json();

        // Check if the response is valid
        json = JSON.stringify(json, null, 2);

        json = JSON.parse(json);
        console.log(json);
        
        if (json.choices) {
            return json.choices[0].message.content;
        } else {
            console.error("Error GPTDiff: " + json.error);
            return "Error GPTDiff: " + json.error.message;
        }
}

function appendDiv() {
    var div = document.getElementById('chatbot-container');

    var form = document.getElementById('chatbox-form');

    var input = document.getElementById('chatbox-input');
    input.type = "text";

    var answer = document.getElementById('chatbox');
    answer.className = "answer";


    var temp = 1;
    var tokens = 800;
    
    
    form.onsubmit = async function(e) {
        e.preventDefault();
        answer.innerHTML = "Chargement en cours...";
        var response = await requestGPT(
          input.value,
          parseFloat(temp),
          parseInt(tokens)
        );
        //transforme \n en <br>, if two \n, then only one <br>
    
        response = response.replace(/\n/g, "<br>");
        response = response.replace(/<br><br>/g, "<br>");

        answer.innerHTML = response;
        
        
    }
    // add a scrollbar to the div
    
    

    document.onkeydown = function(e) {
        // keycode of ² is 192
        if (e.keyCode == 113) {
            e.preventDefault();
            div.classList.toggle("active");

            if (div.classList.contains("active")) {
                input.focus();
            }

            
        }
    }
}
appendDiv();