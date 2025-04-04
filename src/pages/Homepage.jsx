import { useState } from "react";
import { Button, TextField, Container, Typography, Paper, Grid } from "@mui/material";
import PieChart from "../components/PieChart";
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import axios from "axios"; 

const Homepage = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [category, setCategory] = useState(""); 
  const [hatePhrases, setHatePhrases] = useState([]); 
  const [confidenceData, setConfidenceData] = useState([0, 0]); 

  const handleAnalyze = async () => {
    if (!text.trim()) {
      alert("Please enter some text to analyze.");
      return;
    }

    try {
      const response = await axios.post("https://hate-speech-api-kkar.onrender.com/", {
        text: text, 
      });

      const { hate_speech, type, description, confidence } = response.data.prediction;

      const [hateConfidence, noHateConfidence] = confidence[0];

      // Set the confidence for hate speech and non-hate speech
      const hateConfidencePercentage = (hateConfidence * 100).toFixed(2);
      const noHateConfidencePercentage = (noHateConfidence * 100).toFixed(2);

      // Update the state to reflect the prediction result and confidence percentages
      const result = hate_speech ? "Hate Speech Detected" : "No Hate Speech Detected";
      const randomCategory = hate_speech ? type : "";
      const detectedPhrases = hate_speech ? description.split("\n") : [];

      setAnalysis(result);
      setCategory(randomCategory);
      setHatePhrases(detectedPhrases);
      setConfidenceData([hateConfidencePercentage, noHateConfidencePercentage]);

    } catch (error) {
      console.error("Error during analysis:", error);
      setAnalysis("Error during analysis. Please try again later.");
    }
  };

  return (
    <Container maxWidth="md" sx={{
      mt: 4, 
      mb:4,
      display: "flex", 
      flexDirection: "column", 
      gap: 2, 
      minHeight: "100vh",  // Ensures the container takes full viewport height
      justifyContent: "flex-start",  // Align content to the top
      flexGrow: 1, // Ensures the content grows to fill the available space
    }}>
      <Typography variant="h4" align="center">Arabic Hate Speech Detector</Typography>

      <TextField
        label="Enter text here..."
        multiline
        rows={8}
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          width: "70%", 
          mb: 2, 
          alignSelf: "center", 
          flexGrow: 0,  // Prevent the text field from growing
        }}
      />

      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleAnalyze} 
        sx={{
          width: "30%", 
          alignSelf: "center", 
          flexGrow: 0,  // Prevent the button from growing
        }}>
        Analyze
      </Button>

      {analysis && (
        <>
          <Paper elevation={3} sx={{ p: 2, mt: 2, textAlign: "center", bgcolor: analysis.includes("No") ? "lightgreen" : "lightcoral" }}>
            <Typography variant="h6">{analysis}</Typography>
          </Paper>

          {!analysis.includes("No") && (
            <>
              <Grid container sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                <Grid item xs={12} sm={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <PieChart confidenceData={confidenceData} />
                </Grid>

                <Grid item container spacing={2} direction="column" xs={12} sm={6}>
                  <Grid item>
                    <Paper elevation={3} sx={{ p: 2, bgcolor: "lightyellow" }}>
                      <Typography variant="h6" sx={{ textAlign: "center", fontWeight: "bold" }}>Category</Typography>
                      <Typography variant="body1" sx={{ textAlign: "center" }}>{category}</Typography>
                    </Paper>
                  </Grid>

                  {hatePhrases.length > 0 && (
                    <Grid item sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", maxHeight: "220px", overflowY: "auto" }}>
                      <Paper elevation={3} sx={{ p: 2, bgcolor: "lightgray" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold", position: "sticky", top: 0, bgcolor: "lightgray", textAlign: "center" }}>Hate Speech Phrases</Typography>
                        <ul style={{ padding: 0 }}>
                          {hatePhrases.map((phrase, index) => (
                            <li key={index} style={{ marginBottom: "8px", marginLeft: "20px" }}>
                              <Typography variant="body1">{phrase}</Typography>
                            </li>
                          ))}
                        </ul>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Button 
                variant="contained" 
                color="secondary" 
                endIcon={<LibraryBooksIcon />}
                sx={{ width: "30%", alignSelf: "center", mt: 2 }}>
                View Text
              </Button>
            </>
          )}
        </>
      )}
    </Container>
  );
}

export default Homepage;
