import React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";



interface ConciergeCardProps {
  concierge: Concierge;
  distance?: number;
}

export interface Concierge {
  _id: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  address: {
    city: string;
    coordinates: {
      coordinates: [number, number];
    };
  }[];
  services: {
    creation_de_lannonce: boolean;
    gestion_du_menage: boolean;
    lavage_du_linge: boolean;
    optimisation_des_prix: boolean;
    remise_des_cles: boolean;
    checkin: boolean;
    checkout: boolean;
    boite_a_cles: boolean;
  };
  distance?: number;
}

const serviceLabels = {
  creation_de_lannonce: "Création d'annonce",
  gestion_du_menage: "Gestion du ménage",
  lavage_du_linge: "Lavage du linge",
  optimisation_des_prix: "Optimisation des prix",
  remise_des_cles: "Remise des clés",
  checkin: "Check-in",
  checkout: "Check-out",
  boite_a_cles: "Boîte à clés"
};

const ConciergeCard = ({ concierge, distance }: ConciergeCardProps) => {
  const activeServices = Object.entries(concierge.services)
    .filter(([_, value]) => value)
    .map(([key]) => serviceLabels[key as keyof typeof serviceLabels]);

  const initials = `${concierge.firstName[0]}${concierge.lastName[0]}`;

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-52">
        <Avatar className="h-52 w-full rounded-none">
          {concierge.profileImage ? (
            <Image
              src={concierge.profileImage}
              alt={`${concierge.firstName} ${concierge.lastName}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <AvatarFallback className="h-full w-full text-4xl bg-gradient-to-br from-blue-100 to-blue-200">
              {initials}
            </AvatarFallback>
          )}
        </Avatar>
      </div>

      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">
              {concierge.firstName} {concierge.lastName}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {concierge.address[0]?.city}
              {distance && ` • ${distance.toFixed(1)} km`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {activeServices.slice(0, 3).map((service, index) => (
            <span 
              key={index}
              className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {service}
            </span>
          ))}
          {activeServices.length > 3 && (
            <span className="text-sm text-gray-500">
              +{activeServices.length - 3} services
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline">
          <MessageCircle className="w-4 h-4 mr-2" />
          Contacter
        </Button>
        <Button>
          Voir le profil
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ConciergeCard;