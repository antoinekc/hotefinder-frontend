"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login } from "@/app/store/reducers/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup?: () => void;
};

export function LoginModal({
  open,
  onOpenChange,
  onSwitchToSignup,
}: LoginModalProps) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND;
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [emptyFields, setEmptyFields] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { toast } = useToast();

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitSignIn = async () => {
    setIsLoading(true);
    setEmptyFields(false);
    setErrorMessage("");

    if (!email || !password) {
      setEmptyFields(true);
      setErrorMessage("Veuillez remplir les champs nécessaires");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Format d'email invalide");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND}/users/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Données reçues côté client:", data)

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la connexion");
      }

      if (data.result) {
        dispatch(login({
          token: data.token,
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          address: data.user.address,
          city: data.user.city,
          postalCode: data.user.postalCode,
          isHost: data.user.isHost,
          services: data.user.services
          })
        );

        // Stockage du token dans localStorage
        localStorage.setItem('userToken', data.token)

        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${data.firstName} !`,
          variant: "default",
          duration: 3000,
          className: "bg-green-50",
        });

        onOpenChange(false);

      } else {
        setErrorMessage(data.error || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.log("Erreur lors de la connexion", error);
      setErrorMessage("Une erreur est survenue lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Se connecter</DialogTitle>
          <DialogDescription>
            Connectez-vous pour accéder à votre compte
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {errorMessage && (
            <div className="text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={emptyFields && !email ? "border-red-500" : ""}
            disabled={isLoading}
          />

          <div className="relative">
            <Input
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={emptyFields && !password ? "border-red-500" : ""}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button
            onClick={handleSubmitSignIn}
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? "Connexion en cours..." : "Connexion"}
          </Button>
          
          <p className="text-sm text-center text-gray-500">
            Pas encore inscrit ?{" "}
            <span 
              className="text-blue-500 cursor-pointer hover:underline"
              onClick={() => {
                onOpenChange(false);  // Ferme la modale de connexion
                onSwitchToSignup?.();  // Ouvre la modale d'inscription
              }}
            >
              Inscription
            </span>
          </p>

        </div>
      </DialogContent>
    </Dialog>
  );
}
