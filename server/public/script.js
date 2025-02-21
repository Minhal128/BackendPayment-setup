const button = document.querySelector("button");

button.addEventListener("click", async () => {
    console.log("I got clicked");

    try {
        const response = await fetch('/create-payment', {  
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                items: [
                    { id: 1, quantity: 2 },
                    { id: 2, quantity: 2 }
                ]
            })
        });

        if (!response.ok) {
            throw new Error("Payment request failed");
        }

        const json = await response.json();
        console.log("Payment Response:", json);

        if (json.url) {
            console.log(json.url);  
            window.location.href = json.url; 
        } else {
            throw new Error("Missing payment URL in response");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
