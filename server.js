const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// 📌 Connexion à MongoDB (Atlas ou local)
const MONGO_URI = "mongodb+srv://adlene48:Fcbayern01!@slimdatadb.lthmf.mongodb.net/slimdataDB?retryWrites=true&w=majority";
// Si tu veux utiliser MongoDB en local, utilise ceci à la place :
// const MONGO_URI = "mongodb://127.0.0.1:27017/slimdataDB";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch((err) => console.error("❌ Erreur de connexion MongoDB :", err));

// Middleware
app.use(cors());
app.use(express.json());

// 📌 Schéma pour les demandes de contact
const demandeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  category: String,
  description: String,
  date: { type: Date, default: Date.now }
});

const Demande = mongoose.model("Demande", demandeSchema);

// 📌 Route pour enregistrer une demande de contact
app.post("/api/contact", async (req, res) => {
  console.log("📥 Nouvelle demande reçue :", req.body);

  const { name, email, phone, category, description } = req.body;
  if (!name || !email || !phone || !category || !description) {
    return res.status(400).json({ message: "❌ Tous les champs sont obligatoires" });
  }

  try {
    const nouvelleDemande = new Demande({ name, email, phone, category, description });
    await nouvelleDemande.save();
    res.status(200).json({ message: "✅ Demande enregistrée avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur lors de l'enregistrement", error });
  }
});

// 📌 Route pour récupérer toutes les demandes
app.get("/api/demandes", async (req, res) => {
  try {
    const demandes = await Demande.find();
    res.status(200).json(demandes);
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur lors de la récupération des demandes", error });
  }
});

// 📌 Démarrer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
