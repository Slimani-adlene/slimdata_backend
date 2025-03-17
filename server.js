const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

const MONGO_URI = "mongodb+srv://adlene48:Fcbayern01!@slimdatadb.lthmf.mongodb.net/slimdataDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

mongoose.connection.once("open", () => console.log("🟢 Connexion MongoDB OK"));
mongoose.connection.on("error", (err) => console.error("🔴 Erreur MongoDB :", err));

app.use(cors());
app.use(express.json());

const demandeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  category: String,
  description: String,
  date: { type: Date, default: Date.now }
});

const Demande = mongoose.model("Demande", demandeSchema);

app.post("/api/contact", async (req, res) => {
  console.log("📥 Nouvelle demande reçue :", req.body);

  try {
    const nouvelleDemande = new Demande(req.body);
    await nouvelleDemande.save();
    res.status(200).json({ message: "✅ Demande enregistrée avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});

app.listen(PORT, () => console.log(`✅ Serveur démarré sur http://localhost:${PORT}`));

