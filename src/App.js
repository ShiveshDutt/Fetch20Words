import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { saveAs } from "file-saver";
import data from "./data.txt";
import { Chart, registerables } from "chart.js";
// import { useEffect } from 'react';

Chart.register(...registerables);
const App = () => {
  // Colors in the bar
  const getBarColors = (count) => {
    if (count === 28) {
      return "#0066cc";
    } else if (count === 24) {
      return "#00ccbe";
    } else if (count === 22) {
      return "#03cc00";
    } else if (count === 19) {
      return "#cc6d00";
    } else if (count === 16) {
      return "#8500cc";
    }
    else if (count === 15) {
      return "#cc001f";
    }
    else if (count === 14) {
      return "#b400cc";
    }
    else if (count === 13) {
      return "#00cc03";
    }
    else if (count === 12) {
      return "#aa847d";
    }
    else if (count === 11) {
      return "#a1574a";
    }
    else if (count === 10) {
      return "#6f6581";
    }
    else if (count === 9) {
      return "#7a51c8";
    }
     else return "#3e1b7e";
  };
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetching the data
const fetchData = async () => {
    setLoading(true);
    const response = await fetch(data);
    const text = await response.text();
    // const words = text.split(/\s+/);

    const words = text.toLowerCase().match(/\b\w+\b/g);
    const wordCounts = {};
    words.forEach((word) => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    const sortedWords = Object.keys(wordCounts).sort(
      (a, b) => wordCounts[b] - wordCounts[a]
    ); 

    const top20Words = sortedWords.slice(0, 20);
    const histogramData = top20Words.map((word) => ({
      word,
      count: wordCounts[word],
    })
    );

    setHistogramData(histogramData);
    setLoading(false);
  };

  // Export button algo
  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      encodeURI(
        histogramData.map((row) => `${row.word},${row.count}`).join("\n")
      );
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "histogram.csv");
  };

  // Scrolling down
  const scrollDown = () => {
    const windowHeight = window.innerHeight;
    const scrollHeight = windowHeight / 4;

    window.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  };

  // Scrolling to the export button
  const scrollDowntoExport = () => {
    const windowHeight = window.innerHeight;
    const scrollHeight = windowHeight;

    window.scrollTo({
      top: scrollHeight,
      behavior: "smooth",
    });
  };

  // Scrolling to the top of the screen
  const scrollDowntoTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  setTimeout(scrollDown, 3000);
  setTimeout(scrollDowntoExport, 5000);
  setTimeout(scrollDowntoTop, 7000);

  return (
    <div>
      {/* Submit button */}
      <center>
      <button
        style={{
          cursor:"pointer",
          width: "100px",
          height: "45px",
          color: "#900c3f",
          backgroundColor: "#ffffff",
          fontWeight: "25",
          fontSize: "20px",
          border: "2px solid purple",
          padding: "8px",
          borderRadius: "2rem",
          marginBottom: "10px",
        }}
        onClick={() => {
          fetchData();
        }}
        display={loading}
      >
        {loading ? "Loading..." : "Fetch"}
      </button>
      </center>

      {histogramData.length > 0 && (

        <div>
          {/* Heading */}
          <center>
          <h2
            style={{
              // marginLeft: "600px",
              color: "#900c3f",
              backgroundColor: "#588bae",
              fontSize: "17px",
              border: "1px solid purple",
              padding: "7px",
              borderRadius: "2rem",
              marginTop:"50px",
              marginBottom: "12px",
              width: "180px",
            }}
          >
            Top 20 Words
          </h2>
          </center>

          {/* Bar component */}
          <Bar
            data={{
              labels: histogramData.map((row) => row.word),
              datasets: [
                {
                  marginTop: 100,
                  barThickness: 40,
                  label: "Word Count",
                  data: histogramData.map((row) => row.count),
                  borderColor: "#dd7973",
                  backgroundColor: histogramData.map((row) =>
                    getBarColors(row.count)
                  ),
                  borderWidth: 3,
                  borderRadius: 10,
                },
              ],
            }}
            options={{
              animation: {
                x: {
                  duration: 4000,
                  from: 0,
                },
                y: {
                  duration: 3000,
                  from: 0,
                },
              },
              scales: {
                y: {
                  min: 0,
                  max: 28,
                  beginAtZero: true,

                  ticks: {
                    color: "#993300",
                    stepSize: 1,
                    font: {
                      size: 18,
                    },
                  },
                },
                x: {
                  ticks: {
                    color: histogramData.map((row) => getBarColors(row.count)),
                    font: {
                      size: 20, 
                    },
                  },
                },
              },
            }}
          />

{/* Export button */}
<center>
          <button
            style={{
              cursor:"pointer",
              color: "#900c3f",
              backgroundColor: "#ffc300",
              fontSize: "20px",
              padding: "11px",
              width: "150px",
              borderRadius: "2rem",
              marginTop: "50px",
              border: "2px solid purple",
            }}
            onClick={handleExport}
          >
            Export CSV
          </button>
          </center>
        </div>
      )}
    </div>
  );
};

export default App;



