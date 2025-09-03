import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import CollectionDetails from "./components/CollectionDetails";
import Cart from "./components/Cart";
import { SignIn } from "./components/SignIn";
import { NavBar } from "./components/Navbar";
import { SignUp } from "./components/SignUp";

function App() {
  const [suggestion, setSuggestion] = useState("");
  const [city, setCity] = useState("Loading...");

  const tamilNaduDistricts = [
    "Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Vellore", "Erode",
    "Thanjavur", "Kanchipuram", "Karur", "Dharmapuri", "Nagapattinam", "Dindigul", "Tiruppur",
    "Thoothukudi", "Ramanathapuram", "Pudukkottai", "Cuddalore", "Virudhunagar", "Tiruvarur",
    "Villupuram", "Kanyakumari", "Namakkal", "Sivagangai", "Ariyalur", "Krishnagiri",
    "Perambalur", "Kallakurichi", "The Nilgiris", "Tenkasi", "Ranipet", "Chengalpattu"
  ];

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation not supported");
      setCity("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const { latitude, longitude } = coords;

      try {
        const response = await fetch("http://localhost:5000/suggest-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude, longitude }),
        });
        const data = await response.json();

        if (response.ok) {
          setSuggestion(data.suggestion);
        } else {
          console.error("Backend Error:", data.message);
        }
      } catch (err) {
        console.error("Error calling suggest-food:", err);
      }

      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
          headers: { 'User-Agent': 'ZomatoClone/1.0' },
        });
        const data = await res.json();
        const cityName = data.address.city || data.address.town || data.address.village || data.address.state;
        setCity(cityName || "City not found");
      } catch (err) {
        console.error("Nominatim Error:", err);
        setCity("Error fetching city");
      }
    }, (error) => {
      console.error("Geolocation error:", error);
      setCity("Geolocation error");
    });
  }, []);

  const handleManualLocationChange = async (selectedCity) => {
    setCity(selectedCity);

    try {
      const response = await fetch("http://localhost:5000/suggest-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: selectedCity }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuggestion(data.suggestion);
      } else {
        console.error("Backend error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching suggestion:", error.message);
    }
  };

  const collections = [
    
  {
    id: 1,
    title: "Cafes & Coffee Shops",
    description: "Find the most popular cafes and coffee shops.",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
    items: [
      // Add cafe and coffee shop items here
      {
        id: 101,
        name: "Chai Kings",
        image: "https://images.unsplash.com/photo-1612197527276-d99c7b5a0078?auto=format&fit=crop&w=800&q=80",
        price: 90,
      },
      {
        id: 102,
        name: "Starbucks - Anna Nagar",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
        price: 280,
      },
      {
        id: 103,
        name: "Third Wave Coffee",
        image: "https://images.unsplash.com/photo-1558873693-1cfe0b08e184?auto=format&fit=crop&w=800&q=80",
        price: 230,
      },
      {
        id: 104,
        name: "Cafe Coffee Day - Mount Road",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
        price: 150,
      },
      {
        id: 105,
        name: "Writer’s Cafe",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        price: 175,
      },
      {
        id: 106,
        name: "Amelie's Cafe",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        price: 190,
      },
      {
        id: 107,
        name: "Cafe Mercara Express",
        image: "https://images.unsplash.com/photo-1582281298051-5f50d9e07208?auto=format&fit=crop&w=800&q=80",
        price: 240,
      },
      {
        id: 108,
        name: "Higginbothams Brew",
        image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80",
        price: 200,
      },
      {
        id: 109,
        name: "Elixir Café",
        image: "https://images.unsplash.com/photo-1511296265580-88b1be7c72c4?auto=format&fit=crop&w=800&q=80",
        price: 165,
      },
      {
        id: 110,
        name: "The Brew Room",
        image: "https://images.unsplash.com/photo-1509402251671-d3b709fe1f72?auto=format&fit=crop&w=800&q=80",
        price: 210,
      },
      {
        id: 111,
        name: "Ciclo Café",
        image: "https://images.unsplash.com/photo-1527169402691-a4d92e1f6c73?auto=format&fit=crop&w=800&q=80",
        price: 225,
      },
      {
        id: 112,
        name: "The Board Game Cafe",
        image: "https://images.unsplash.com/photo-1511993226959-6a6f1f87b16f?auto=format&fit=crop&w=800&q=80",
        price: 140,
      },
      {
        id: 113,
        name: "Tea Trails",
        image: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3?auto=format&fit=crop&w=800&q=80",
        price: 120,
      },
      {
        id: 114,
        name: "Barrista Lavazza",
        image: "https://images.unsplash.com/photo-1611967164522-1c8dba1b1842?auto=format&fit=crop&w=800&q=80",
        price: 180,
      },
      {
        id: 115,
        name: "The Coffee Place",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        price: 160,
      },
      {
        id: 116,
        name: "Drizzle Café",
        image: "https://images.unsplash.com/photo-1608453385135-f9ae528bff7b?auto=format&fit=crop&w=800&q=80",
        price: 150,
      },
      {
        id: 117,
        name: "Fika Chennai",
        image: "https://images.unsplash.com/photo-1510626176961-4bfb7e17f42d?auto=format&fit=crop&w=800&q=80",
        price: 250,
      },
      {
        id: 118,
        name: "Azzuri Bay Cafe",
        image: "https://images.unsplash.com/photo-1525286116112-b59af11adad1?auto=format&fit=crop&w=800&q=80",
        price: 270,
      },
      {
        id: 119,
        name: "Sandy's Chocolate Lab",
        image: "https://images.unsplash.com/photo-1521302080334-4bebac2762be?auto=format&fit=crop&w=800&q=80",
        price: 280,
      },
      {
        id: 120,
        name: "Zuka Choco-La",
        image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=800&q=80",
        price: 190,
      },
      {
        id: 121,
        name: "The Madras Diner",
        image: "https://images.unsplash.com/photo-1524230572899-a752b3835841?auto=format&fit=crop&w=800&q=80",
        price: 200,
      },
      {
        id: 122,
        name: "Café CakeBee",
        image: "https://images.unsplash.com/photo-1528747045269-390fe33c19d4?auto=format&fit=crop&w=800&q=80",
        price: 130,
      },
      {
        id: 123,
        name: "Black & White Café",
        image: "https://images.unsplash.com/photo-1541976076758-25b93e13c977?auto=format&fit=crop&w=800&q=80",
        price: 175,
      },
      {
        id: 124,
        name: "Downtown Cafe",
        image: "https://images.unsplash.com/photo-1591047139829-81cdbb27c0d4?auto=format&fit=crop&w=800&q=80",
        price: 185,
      },
      {
        id: 125,
        name: "Brewhouse India",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        price: 260,
      },
    ]
  },
  {
    id: 2,
    title: "Top Restaurants",
    description: "Explore the best restaurants in your area.",
    image: "https://images.unsplash.com/photo-1555992336-cbf8f063b4a5?auto=format&fit=crop&w=800&q=80",
    items: [
      {
        id: 101,
        name: "Chai Kings",
        image: "https://images.unsplash.com/photo-1612197527276-d99c7b5a0078?auto=format&fit=crop&w=800&q=80",
        price: 90,
      },
      {
        id: 102,
        name: "Starbucks - Anna Nagar",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
        price: 280,
      },
      {
        id: 103,
        name: "Third Wave Coffee",
        image: "https://images.unsplash.com/photo-1558873693-1cfe0b08e184?auto=format&fit=crop&w=800&q=80",
        price: 230,
      },
      {
        id: 104,
        name: "Cafe Coffee Day - Mount Road",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
        price: 150,
      },
      {
        id: 105,
        name: "Writer’s Cafe",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        price: 175,
      },
      {
        id: 106,
        name: "Amelie's Cafe",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        price: 190,
      },
      {
        id: 107,
        name: "Cafe Mercara Express",
        image: "https://images.unsplash.com/photo-1582281298051-5f50d9e07208?auto=format&fit=crop&w=800&q=80",
        price: 240,
      },
      {
        id: 108,
        name: "Higginbothams Brew",
        image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80",
        price: 200,
      },
      {
        id: 109,
        name: "Elixir Café",
        image: "https://images.unsplash.com/photo-1511296265580-88b1be7c72c4?auto=format&fit=crop&w=800&q=80",
        price: 165,
      },
      {
        id: 110,
        name: "The Brew Room",
        image: "https://images.unsplash.com/photo-1509402251671-d3b709fe1f72?auto=format&fit=crop&w=800&q=80",
        price: 210,
      },
      {
        id: 111,
        name: "Ciclo Café",
        image: "https://images.unsplash.com/photo-1527169402691-a4d92e1f6c73?auto=format&fit=crop&w=800&q=80",
        price: 225,
      },
      {
        id: 112,
        name: "The Board Game Cafe",
        image: "https://images.unsplash.com/photo-1511993226959-6a6f1f87b16f?auto=format&fit=crop&w=800&q=80",
        price: 140,
      },
      {
        id: 113,
        name: "Tea Trails",
        image: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3?auto=format&fit=crop&w=800&q=80",
        price: 120,
      },
      {
        id: 114,
        name: "Barrista Lavazza",
        image: "https://images.unsplash.com/photo-1611967164522-1c8dba1b1842?auto=format&fit=crop&w=800&q=80",
        price: 180,
      },
      {
        id: 115,
        name: "The Coffee Place",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        price: 160,
      },
      {
        id: 116,
        name: "Drizzle Café",
        image: "https://images.unsplash.com/photo-1608453385135-f9ae528bff7b?auto=format&fit=crop&w=800&q=80",
        price: 150,
      },
      {
        id: 117,
        name: "Fika Chennai",
        image: "https://images.unsplash.com/photo-1510626176961-4bfb7e17f42d?auto=format&fit=crop&w=800&q=80",
        price: 250,
      },
      {
        id: 118,
        name: "Azzuri Bay Cafe",
        image: "https://images.unsplash.com/photo-1525286116112-b59af11adad1?auto=format&fit=crop&w=800&q=80",
        price: 270,
      },
      {
        id: 119,
        name: "Sandy's Chocolate Lab",
        image: "https://images.unsplash.com/photo-1521302080334-4bebac2762be?auto=format&fit=crop&w=800&q=80",
        price: 280,
      },
      {
        id: 120,
        name: "Zuka Choco-La",
        image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=800&q=80",
        price: 190,
      },
      {
        id: 121,
        name: "The Madras Diner",
        image: "https://images.unsplash.com/photo-1524230572899-a752b3835841?auto=format&fit=crop&w=800&q=80",
        price: 200,
      },
      {
        id: 122,
        name: "Café CakeBee",
        image: "https://images.unsplash.com/photo-1528747045269-390fe33c19d4?auto=format&fit=crop&w=800&q=80",
        price: 130,
      },
      {
        id: 123,
        name: "Black & White Café",
        image: "https://images.unsplash.com/photo-1541976076758-25b93e13c977?auto=format&fit=crop&w=800&q=80",
        price: 175,
      },
      {
        id: 124,
        name: "Downtown Cafe",
        image: "https://images.unsplash.com/photo-1591047139829-81cdbb27c0d4?auto=format&fit=crop&w=800&q=80",
        price: 185,
      },
      {
        id: 125,
        name: "Brewhouse India",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        price: 260,
      },
    ],
  },
  {
    id: 3,
    title: "Bars & Nightlife",
    description: "Explore vibrant bars and nightlife options.",
    image: "https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?auto=format&fit=crop&w=800&q=80",
    items: [
      {
        id: 101,
        name: "Chai Kings",
        image: "https://images.unsplash.com/photo-1612197527276-d99c7b5a0078?auto=format&fit=crop&w=800&q=80",
        price: 90,
      },
      {
        id: 102,
        name: "Starbucks - Anna Nagar",
        image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
        price: 280,
      },
      {
        id: 103,
        name: "Third Wave Coffee",
        image: "https://images.unsplash.com/photo-1558873693-1cfe0b08e184?auto=format&fit=crop&w=800&q=80",
        price: 230,
      },
      {
        id: 104,
        name: "Cafe Coffee Day - Mount Road",
        image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80",
        price: 150,
      },
      {
        id: 105,
        name: "Writer’s Cafe",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        price: 175,
      },
      {
        id: 106,
        name: "Amelie's Cafe",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80",
        price: 190,
      },
      {
        id: 107,
        name: "Cafe Mercara Express",
        image: "https://images.unsplash.com/photo-1582281298051-5f50d9e07208?auto=format&fit=crop&w=800&q=80",
        price: 240,
      },
      {
        id: 108,
        name: "Higginbothams Brew",
        image: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=800&q=80",
        price: 200,
      },
      {
        id: 109,
        name: "Elixir Café",
        image: "https://images.unsplash.com/photo-1511296265580-88b1be7c72c4?auto=format&fit=crop&w=800&q=80",
        price: 165,
      },
      {
        id: 110,
        name: "The Brew Room",
        image: "https://images.unsplash.com/photo-1509402251671-d3b709fe1f72?auto=format&fit=crop&w=800&q=80",
        price: 210,
      },
      {
        id: 111,
        name: "Ciclo Café",
        image: "https://images.unsplash.com/photo-1527169402691-a4d92e1f6c73?auto=format&fit=crop&w=800&q=80",
        price: 225,
      },
      {
        id: 112,
        name: "The Board Game Cafe",
        image: "https://images.unsplash.com/photo-1511993226959-6a6f1f87b16f?auto=format&fit=crop&w=800&q=80",
        price: 140,
      },
      {
        id: 113,
        name: "Tea Trails",
        image: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3?auto=format&fit=crop&w=800&q=80",
        price: 120,
      },
      {
        id: 114,
        name: "Barrista Lavazza",
        image: "https://images.unsplash.com/photo-1611967164522-1c8dba1b1842?auto=format&fit=crop&w=800&q=80",
        price: 180,
      },
      {
        id: 115,
        name: "The Coffee Place",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80",
        price: 160,
      },
      {
        id: 116,
        name: "Drizzle Café",
        image: "https://images.unsplash.com/photo-1608453385135-f9ae528bff7b?auto=format&fit=crop&w=800&q=80",
        price: 150,
      },
      {
        id: 117,
        name: "Fika Chennai",
        image: "https://images.unsplash.com/photo-1510626176961-4bfb7e17f42d?auto=format&fit=crop&w=800&q=80",
        price: 250,
      },
      {
        id: 118,
        name: "Azzuri Bay Cafe",
        image: "https://images.unsplash.com/photo-1525286116112-b59af11adad1?auto=format&fit=crop&w=800&q=80",
        price: 270,
      },
      {
        id: 119,
        name: "Sandy's Chocolate Lab",
        image: "https://images.unsplash.com/photo-1521302080334-4bebac2762be?auto=format&fit=crop&w=800&q=80",
        price: 280,
      },
      {
        id: 120,
        name: "Zuka Choco-La",
        image: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=800&q=80",
        price: 190,
      },
      {
        id: 121,
        name: "The Madras Diner",
        image: "https://images.unsplash.com/photo-1524230572899-a752b3835841?auto=format&fit=crop&w=800&q=80",
        price: 200,
      },
      {
        id: 122,
        name: "Café CakeBee",
        image: "https://images.unsplash.com/photo-1528747045269-390fe33c19d4?auto=format&fit=crop&w=800&q=80",
        price: 130,
      },
      {
        id: 123,
        name: "Black & White Café",
        image: "https://images.unsplash.com/photo-1541976076758-25b93e13c977?auto=format&fit=crop&w=800&q=80",
        price: 175,
      },
      {
        id: 124,
        name: "Downtown Cafe",
        image: "https://images.unsplash.com/photo-1591047139829-81cdbb27c0d4?auto=format&fit=crop&w=800&q=80",
        price: 185,
      },
      {
        id: 125,
        name: "Brewhouse India",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        price: 260,
      },
    ],
  },


  ];

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen font-sans bg-gray-100">
          <NavBar foodSuggestion={suggestion} />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  {/* Hero Section */}
                  <div
                    className="relative h-[500px] bg-cover bg-center"
                    style={{ backgroundImage: "url('./search zomato.avif')" }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white bg-black bg-opacity-50">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Zomato_logo.png/600px-Zomato_logo.png"
                        alt="Zomato Logo"
                        className="h-20 mb-8"
                      />
                      <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                        Find the best restaurants, cafés, and bars in {city}
                      </h2>
                      <div className="relative z-50 flex flex-col w-full max-w-2xl gap-2 md:flex-row">
                        <select
                          className="w-full p-3 text-black bg-white rounded shadow-md md:w-1/3"
                          value={city}
                          onChange={(e) => handleManualLocationChange(e.target.value)}
                        >
                          <option value="">{city || "Select City"}</option>
                          {tamilNaduDistricts.map((district, index) => (
                            <option key={index} value={district}>{district}</option>
                          ))}
                        </select>

                        <input
                          type="text"
                          placeholder="Search for restaurants or cuisines..."
                          className="w-full p-3 text-black rounded"
                        />
                        <button className="px-6 py-3 text-white bg-red-500 rounded">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Collections */}
                  <div className="px-4 py-10">
                    <div className="max-w-6xl mx-auto">
                      <div className="mb-6 text-left">
                        <h3 className="mb-2 text-2xl font-semibold">Collections</h3>
                        <p className="text-sm text-gray-600">
                          Explore curated lists of top restaurants, cafés, pubs, and bars in {city}, based on trends
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                        {collections.map((item) => (
                          <Link to={`/collection/${item.id}`} key={item.id}>
                            <div className="overflow-hidden transition bg-white rounded shadow hover:shadow-lg">
                              <div className="flex">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="object-cover w-1/2 h-40"
                                />
                                <div className="flex flex-col justify-center w-1/2 p-4">
                                  <h4 className="font-semibold text-md">{item.title}</h4>
                                  <p className="text-sm text-gray-500">{item.description}</p>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              }
            />
            <Route path="/collection/:id" element={<CollectionDetails collections={collections} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
