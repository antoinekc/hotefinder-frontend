"use client";

import { Button } from "@/components/ui/button";
import { ConciergeList } from "../Concierge-list";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";

const BACKEND_URL = "http://localhost:3001";

type AddressSuggestion = {
  properties: {
    label: string;
    city: string;
    name: string;
  };
  geometry: {
    coordinates: [number, number];
  };
};

export const Hero = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{
    city: string;
    coordinates: [number, number] | null;
  }>({ city: "", coordinates: null });
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const searchAddresses = async () => {
      if (query.length > 2 && isFocused) {
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`
          );
          const data = await response.json();
          setSuggestions(data.features);
          setOpen(true);
        } catch (error) {
          console.error("Erreur lors de la recherche d'adresses:", error);
        }
      } else {
        setSuggestions([]);
        setOpen(false);
      }
    };

    const debounce = setTimeout(searchAddresses, 300);
    return () => clearTimeout(debounce);
  }, [query, isFocused]);

  const handleSearch = () => {
    if (selectedLocation.coordinates) {
      setIsSearching(true);
    }
  };

  return (
    <div className="w-full">
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
        <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100" />
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">
            Trouvez le concierge idéal pour votre maison
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            hotefinder réunit tous les meilleurs concierges de votre ville
          </p>

          <div className="max-w-2xl mx-auto relative">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Input 
                  className="h-12 text-lg"
                  placeholder="Votre ville..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => {
                    setTimeout(() => {
                      setIsFocused(false);
                      setOpen(false);
                    }, 200);
                  }}
                />
                
                {open && suggestions.length > 0 && isFocused && (
                  <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-auto">
                    {suggestions.map((suggestion) => (
                      <div
                        key={suggestion.properties.label}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-left"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setQuery(suggestion.properties.label);
                          setSelectedLocation({
                            city: suggestion.properties.city,
                            coordinates: suggestion.geometry.coordinates
                          });
                          setOpen(false);
                        }}
                      >
                        {suggestion.properties.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Button 
                size="lg" 
                className="h-12 px-8 text-lg"
                onClick={handleSearch}
              >
                <Search className="w-5 h-5 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des concierges */}
      {isSearching && (
        <div className="w-full bg-white">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <ConciergeList 
              searchCity={selectedLocation.city}
              coordinates={selectedLocation.coordinates}
            />
          </div>
        </div>
      )}
    </div>
  );
};