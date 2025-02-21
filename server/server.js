import "dotenv/config"; 
import express from "express";
import Stripe from "stripe"; 

const app = express();
app.use(express.json());

app.use(express.static("public")); // Serve static files from 'public' folder

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY); 

const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Shoes" }],
    [2, { priceInCents: 5000, name: "Hat" }], 
]);

app.post('/create-payment', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: req.body.items.map(item => {
                const storeItem = storeItems.get(item.id);
                return {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: storeItem.name,
                        },
                        unit_amount: storeItem.priceInCents,
                    },
                    quantity: item.quantity,
                };
            }),
            mode: "payment",
            success_url: "http://localhost:3000/success.html",
            cancel_url: "http://localhost:3000/cancel.html",
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Error creating payment session:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
