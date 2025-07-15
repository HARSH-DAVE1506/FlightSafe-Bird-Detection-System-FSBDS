import React, { useState } from "react";
import axios from "axios";
import { Upload, Activity, Shield, BarChart3, Bird, Image } from "lucide-react";

function App() {
  const [video, setVideo] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);

  const handleUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  const processVideo = async () => {
    if (!video) return alert("Please upload a video first");
    setIsProcessing(true);
    setResults(null); 

    const formData = new FormData();
    formData.append("file", video);

    try {
      const res = await axios.post("http://127.0.0.1:8000/process-video/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      alert("Error processing video");
    } finally {
      setIsProcessing(false);
    }
  };

  const riskColor = (risk) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-700 border-red-400";
      case "Moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-400";
      default:
        return "bg-green-100 text-green-700 border-green-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-xl p-6 flex items-center space-x-4">
          <div className="p-3 bg-blue-600 rounded-lg">
            <Bird className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bird Detection & Risk Assessment
            </h1>
            <p className="text-gray-600">AI-powered Airport Safety Monitoring</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="w-5 h-5 mr-2 text-blue-600" /> Upload Video
          </h2>
          <input
            type="file"
            accept="video/*"
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
          {video && (
            <p className="text-sm text-gray-600 mt-2">Selected: {video.name}</p>
          )}
          <button
            onClick={processVideo}
            disabled={isProcessing}
            className="mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow hover:opacity-90 disabled:opacity-50 flex items-center"
          >
            {isProcessing ? (
              <>
                <Activity className="animate-spin w-5 h-5 mr-2" /> Processing...
              </>
            ) : (
              "Start Detection"
            )}
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Risk Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-1">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Overall Risk
              </h3>
              <div
                className={`p-4 border rounded-lg text-center text-xl font-bold ${riskColor(
                  results.overall_risk
                )}`}
              >
                {results.overall_risk}
              </div>
              <div className="mt-4 text-gray-700">
                <p>Total Birds Detected: {results.max_birds}</p>
              </div>
            </div>

            {/* Species Table */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
              <h3 className="text-lg font-semibold flex items-center mb-4">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Species Detected
              </h3>
              {results.species_list.length > 0 ? (
                <table className="w-full text-left border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="py-2 px-3">Species</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.species_list.map((s, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-2 px-3">{s.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">No species classified</p>
              )}
            </div>

            {/* Classified Image */}
            {results.classified_image_url && (
              <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-3">
                <h3 className="text-lg font-semibold flex items-center mb-4">
                  <Image className="w-5 h-5 mr-2 text-blue-600" />
                  Classified Frame
                </h3>
                <img
                  src={results.classified_image_url}
                  alt="Classified Birds"
                  className="rounded-lg shadow-md max-h-96 mx-auto border"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
