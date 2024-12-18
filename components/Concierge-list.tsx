"use client";

import { useState, useEffect } from "react";
import ConciergeCard from "./ConciergeCard";
import { Card } from "@/components/ui/card";

interface ConciergeListProps {
  searchCity?: string;
  coordinates?: [number, number] | null;
}

// Utiliser l'interface Concierge que vous avez déjà définie
import type { Concierge } from './ConciergeCard';

const BACKEND_URL = "http://localhost:3001";

export const ConciergeList = ({ searchCity, coordinates }: ConciergeListProps) => {
  // Spécifier le type du tableau de concierges
  const [concierges, setConcierges] = useState<Concierge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNearby, setIsNearby] = useState(false);

  useEffect(() => {
    const fetchConcierges = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `${BACKEND_URL}/users/concierges`;
        const params = new URLSearchParams();
        
        if (searchCity) params.append('city', searchCity);
        if (coordinates) {
          params.append('lat', coordinates[1].toString());
          params.append('lon', coordinates[0].toString());
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }
        
        const data = await response.json();
        
        if (data.result) {
          setConcierges(data.concierges);
          setIsNearby(data.isNearby || false);
        } else {
          setError(data.error || 'Erreur lors de la récupération des concierges');
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des concierges:", err);
        setError('Impossible de charger les concierges pour le moment');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConcierges();
  }, [searchCity, coordinates]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      {searchCity && (
        <h2 className="text-2xl font-semibold mb-6">
          {!isNearby 
            ? `Les concierges à ${searchCity}`
            : "Les concierges à proximité de chez vous"}
        </h2>
      )}

      {concierges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {concierges.map((concierge) => (
            <ConciergeCard 
              key={concierge._id}
              concierge={concierge}
              distance={isNearby ? concierge.distance : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchCity 
              ? "Aucun concierge trouvé dans cette zone"
              : "Aucun concierge disponible pour le moment"}
          </p>
        </div>
      )}
    </div>
  );
};