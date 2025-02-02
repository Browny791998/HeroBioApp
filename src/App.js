import React, { useState } from "react";
import axios from "axios";


const App = () => {
  const [transcript, setTranscript] = useState("");
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const startSpeechRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = (event) => {
      const spokenWord = event.results[0][0].transcript;
      setTranscript(spokenWord);
      searchHeroBio(spokenWord);
    };

    recognition.onerror = (event) => {
      setError("Error occurred in speech recognition: " + event.error);
    };
  };

  const searchHeroBio = async (heroName) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://hero-api-node.vercel.app/api/search/${heroName}`
      );
      if (response.data.results && response.data.results.length > 0) {
       
        setHeroData(response.data);
      } else {
        setError("သင်ရှာနေသောဟီးရိုးကိုရှာမတွေ့ပါ");
      }
    } catch (err) {
      setError("Failed to fetch hero data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
    style={{
      backgroundImage: `url("/assets/herobg.jpg")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
    }}
    className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-pink-400">ဟီးရိုးတွေအကြောင်းစပ်စုမယ်</h1>
      <button
        onClick={startSpeechRecognition}
        className="bg-emerald-500 text-white px-6 py-2 rounded-lg mb-4 hover:bg-emerald-300 transition duration-300"
      >
       အသံဖြင့်ရှာရန်
      </button>
      <input
        type="text"
        value={transcript}
        readOnly
        placeholder="Spoken word will appear here"
        className="w-80 p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-300"
      />
      {loading && <p className="text-gray-600 bg-white">ခဏစောင့်ပါ...</p>}
      {error && <p className="text-red-500 font-extrabold bg-white">{error}</p>}
      {heroData && (
        <div className="w-full max-w-4xl mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 bg-gray-50 p-3 rounded-lg shadow-md">
            Results for: <span className="text-blue-600">{heroData["results-for"]}</span>
          </h2>
          <div className="space-y-6">
            {heroData.results.map((hero) => (
              <div key={hero.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-col md:flex-row md:items-center">
                  <img
                    src={hero.image.url}
                    alt={hero.name}
                    className="w-32 h-32 rounded-full mx-auto md:mx-0 md:mr-6"
                  />
                  <div className="flex-1 mt-4 md:mt-0">
                    <h3 className="text-xl font-bold text-gray-900">{hero.name}</h3>
                    <p className="text-gray-600">
                      <span className="font-semibold">Full Name:</span> {hero.biography["full-name"]}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Publisher:</span> {hero.biography.publisher}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Alignment:</span> {hero.biography.alignment}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Power Stats</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(hero.powerstats).map(([stat, value]) => (
                      <div key={stat} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 capitalize">{stat}</p>
                        <p className="text-lg font-bold text-blue-600">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Biography</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Aliases:</span> {hero.biography.aliases.join(", ")}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Place of Birth:</span> {hero.biography["place-of-birth"]}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">First Appearance:</span> {hero.biography["first-appearance"]}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Appearance</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Gender</p>
                      <p className="text-lg font-bold text-blue-600">{hero.appearance.gender}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Race</p>
                      <p className="text-lg font-bold text-blue-600">{hero.appearance.race}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Height</p>
                      <p className="text-lg font-bold text-blue-600">{hero.appearance.height.join(" / ")}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Weight</p>
                      <p className="text-lg font-bold text-blue-600">{hero.appearance.weight.join(" / ")}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Connections</h4>
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      <span className="font-semibold">Group Affiliation:</span> {hero.connections["group-affiliation"]}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Relatives:</span> {hero.connections.relatives}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="w-[60%] mx-auto p-3 mt-5  text-center font-bold bg-white rounded-lg shadow-md">Developed by Ye Htet Aung</div>
    </div>
  );
};

export default App;