"use client";
import { useSelector, useDispatch } from "react-redux";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Camera, Save, Edit } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { login } from "../store/reducers/user"; // Ajuste le chemin selon ta structure
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProfileImageUpload from "../../components/ProfileImageUpload";

const BACKEND_URL = "http://localhost:3001";

type User = {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  address: Address[];
  isHost: boolean;
  isActive: boolean;
  services: Services;
  profileImage?: string;
};

type RootState = {
  user: User;
};

type Address = {
  street: string;
  city: string;
  postalCode: string;
};

type Services = {
  creation_de_lannonce: boolean;
  gestion_du_menage: boolean;
  lavage_du_linge: boolean;
  optimisation_des_prix: boolean;
  remise_des_cles: boolean;
  checkin: boolean;
  checkout: boolean;
  boite_a_cles: boolean;
};

type EditedUser = {
  firstName: string;
  lastName: string;
  email: string;
  address: Address[];
  isHost: boolean;
  isActive: boolean;
  services: Services; // Au lieu de any[]
};

type AddressSuggestion = {
  properties: {
    label: string;
    postcode: string;
    city: string;
    name: string;
  };
};

// Composant pour l'affichage des champs en lecture seule
const InfoField = ({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) => (
  <div className="mb-4">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value || "-"}</p>
  </div>
);

const AddressAutocomplete = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (address: Address) => void;
}) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const searchAddresses = async () => {
      if (query.length > 2 && isFocused) {
        // On ajoute la condition isFocused
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
              query
            )}&limit=5`
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

  return (
    <div className="relative">
      <Input
        placeholder="Rechercher une adresse"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)} // Gérer le focus
        onBlur={() => {
          // Petit délai pour permettre le clic sur une suggestion
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
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => {
                // Changé onClick pour onMouseDown
                e.preventDefault(); // Empêche la perte de focus
                setQuery(suggestion.properties.label);
                setOpen(false);
                onChange({
                  street: suggestion.properties.name,
                  city: suggestion.properties.city,
                  postalCode: suggestion.properties.postcode,
                });
              }}
            >
              {suggestion.properties.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const availableServices = [
    { key: "creation_de_lannonce", name: "Création de l'annonce" },
    { key: "gestion_du_menage", name: "Gestion du ménage" },
    { key: "lavage_du_linge", name: "Fourniture et lavage du linge" },
    { key: "optimisation_des_prix", name: "Optmisation des prix" },
    { key: "remise_des_cles", name: "Remise des clés" },
    { key: "checkin", name: "Check-in des voyageurs" },
    { key: "checkout", name: "Check-out des voyageurs" },
    { key: "boite_a_cles", name: "Boîte à clés" },
  ];

  console.log("User state:", user);
  console.log("isHost:", user.isHost);

  // Initialisation des états avec des valeurs par défaut
  const [editedUser, setEditedUser] = useState<EditedUser>({
    firstName: "",
    lastName: "",
    email: "",
    address: [
      {
        street: "",
        city: "",
        postalCode: "",
      },
    ],
    isHost: false,
    isActive: false,
    services: {
      creation_de_lannonce: false,
      gestion_du_menage: false,
      lavage_du_linge: false,
      optimisation_des_prix: false,
      remise_des_cles: false,
      checkin: false,
      checkout: false,
      boite_a_cles: false,
    },
  });

  // Mise à jour de editedUser quand user change
  useEffect(() => {
    console.log("User Services :", user.services);
    setEditedUser({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      address: [
        {
          street: user.address?.[0]?.street || "",
          city: user.address?.[0]?.city || "",
          postalCode: user.address?.[0]?.postalCode || "",
        },
      ],
      isHost: user.isHost || false,
      isActive: user.isActive || false,
      services: user.services || {
        creation_de_lannonce: false,
        gestion_du_menage: false,
        lavage_du_linge: false,
        optimisation_des_prix: false,
        remise_des_cles: false,
        checkin: false,
        checkout: false,
        boite_a_cles: false,
      },
    });
  }, [user]);

  if (!user.token) {
    redirect("/");
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/users/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editedUser),
      });

      const data = await response.json();

      if (data.result) {
        dispatch(login(data.user));
        setIsEditing(false);
      } else {
        console.error("Erreur lors de la mise à jour:", data.error);
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const handleAddressChange = (newAddress: Address) => {
    setEditedUser({
      ...editedUser,
      address: [newAddress],
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      {/* En-tête avec bouton d'édition */}

      {/* En-tête avec boutons */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mon Profil</h1>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <Button
                variant="destructive"
                onClick={() => {
                  setEditedUser({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    email: user.email || "",
                    address: [
                      {
                        street: user.address?.[0]?.street || "",
                        city: user.address?.[0]?.city || "",
                        postalCode: user.address?.[0]?.postalCode || "",
                      },
                    ],
                    isHost: user.isHost || false,
                    isActive: user.isActive || false,
                    services: user.services || {
                      creation_de_lannonce: false,
                      gestion_du_menage: false,
                      lavage_du_linge: false,
                      optimisation_des_prix: false,
                      remise_des_cles: false,
                      checkin: false,
                      checkout: false,
                      boite_a_cles: false,
                    },
                  });
                  setIsEditing(false);
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="w-4 h-4" />
              Modifier
            </Button>
          )}
        </div>
      </div>

      {/* Section profil */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Photo de profil */}
          <div className="relative flex-shrink-0 flex items-start">
            <ProfileImageUpload
              currentImage={user.profileImage} // Ajoutez cette prop dans votre type User
              onUploadSuccess={async (url) => {
                // Mettre à jour l'URL de l'image dans votre backend
                try {
                  const response = await fetch(
                    `${BACKEND_URL}/users/profile/update`,
                    {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                      },
                      body: JSON.stringify({
                        ...editedUser,
                        profileImage: url,
                      }),
                    }
                  );
                  const data = await response.json();
                  if (data.result) {
                    dispatch(login(data.user));
                  }
                } catch (error) {
                  console.error(
                    "Erreur lors de la mise à jour de l'image:",
                    error
                  );
                }
              }}
            />
          </div>

          {/* Informations personnelles */}
          <div className="flex-1 space-y-6">
            {/* Nom et Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      placeholder="Votre prénom"
                      value={editedUser.firstName}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Votre nom"
                      value={editedUser.lastName}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <InfoField label="Prénom" value={user.firstName} />
                  <InfoField label="Nom" value={user.lastName} />
                </>
              )}
            </div>

            {/* Email et Adresse */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={editedUser.email}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <AddressAutocomplete
                      value={editedUser.address[0]?.street || ""}
                      onChange={handleAddressChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <InfoField label="Email" value={user.email} />
                  <InfoField
                    label="Adresse"
                    value={
                      user.address?.[0]
                        ? `${user.address[0].street}, ${user.address[0].city}, ${user.address[0].postalCode}`
                        : "Non renseignée"
                    }
                  />
                </>
              )}
            </div>

            {/* Statut Concierge et Disponibilité */}
            <div className="border-t pt-6 mt-6 space-y-4">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="space-y-1">
                  <Label className="text-base">Je suis un concierge</Label>
                </div>
                <Switch
                  checked={editedUser.isHost}
                  disabled={!isEditing}
                  onCheckedChange={(checked) =>
                    setEditedUser({ ...editedUser, isHost: checked })
                  }
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
              </div>

              {editedUser.isHost && (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-base">Je suis disponible</Label>
                  </div>
                  <Switch
                    checked={editedUser.isActive}
                    disabled={!isEditing}
                    onCheckedChange={(checked) =>
                      setEditedUser({ ...editedUser, isActive: checked })
                    }
                    className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      {(isEditing ? editedUser.isHost : user.isHost) && (
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Mes Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableServices.map((service) => (
              <div
                key={service.key}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  id={service.key}
                  checked={editedUser.services[service.key as keyof Services]}
                  disabled={!isEditing}
                  onCheckedChange={() => {
                    if (isEditing) {
                      setEditedUser({
                        ...editedUser,
                        services: {
                          ...editedUser.services,
                          [service.key]:
                            !editedUser.services[service.key as keyof Services],
                        },
                      });
                    }
                  }}
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" // Ajout de cette ligne
                />
                <label htmlFor={service.key} className="text-sm">
                  {service.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
