import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

import bodyParser from "body-parser";
import axios from "axios";

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// tes conn api
app.get('/api/test', (req, res) => {
  res.send('API is working!');
});

app.get('/api/data', (req, res) => {
  axios.post('http://192.168.3.8/UserDataP1Api/p1psg_all_personal_aktif', req.body)
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Hello from CodeX!",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Nilai yang lebih tinggi berarti model akan mengambil lebih banyak risiko.
      max_tokens: 3000, //Jumlah maksimum token untuk dihasilkan dalam penyelesaian.Sebagian besar model memiliki panjang konteks 2048 token (kecuali untuk model terbaru, yang mendukung 4096).
      top_p: 1, // alternatif untuk pengambilan sampel dengan suhu, disebut pengambilan sampel nucleus
      frequency_penalty: 0.5, //Nomor antara -2.0 dan 2.0.Nilai -nilai positif menghukum token baru berdasarkan frekuensi yang ada dalam teks sejauh ini, mengurangi kemungkinan model untuk mengulangi lini yang sama dengan kata demi kata.
      presence_penalty: 0, // Nomor antara -2.0 dan 2.0.Nilai -nilai positif menghukum token baru berdasarkan apakah mereka muncul dalam teks sejauh ini, meningkatkan kemungkinan model untuk berbicara tentang topik baru.
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(5000, () =>
  console.log("AI server started on http://localhost:5000")
);
