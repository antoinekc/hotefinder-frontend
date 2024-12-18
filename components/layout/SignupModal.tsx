"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Dispatch } from "redux";
import { login } from "@/app/store/reducers/user";
import { useToast } from "@/hooks/use-toast";

export function SignupModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND;

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [emptyFields, setEmptyFields] = useState(false);
  const { toast } = useToast();

  const dispatch = useDispatch();

  // Validation du format de l'Email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmitSignUp = async () => {
    setIsLoading(true);

    if (!email || !password) {
      setIsLoading(false);
      setErrorMessage("Veuillez remplir les champs obligatoires");
      setEmptyFields(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Le format de l'email n'est pas valide");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      setIsLoading(false);
      return;
    }

    try {
      // Requête pour vérifier qu'un utilisateur n'existe pas déjà avec cette adresse mail
      const checkUser = await fetch(`${BACKEND}/users/check-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkUser.json();

      if (checkData.exists) {
        setErrorMessage("Un compte existe déjà avec cet email");
        setIsLoading(false);
        return;
      }

      // Requête pour procéder à l'inscription
      const response = await fetch(`${BACKEND}/users/signup`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, password, firstName }),
      });

      const data = await response.json();
      console.log('Signup response data:', data);

      if (!data.result) {
        console.log('Signup failed:', data);
        throw new Error(data.message || "Erreur lors de l'inscription ");
      }

      if (data.result) {

        console.log('About to dispatch login with:', {
          token: data.user.token,
            email: data.user.email,
            firstName: data.user.firstName,
        });

        dispatch(
          login({
            token: data.user.token,
            email: data.user.email,
            firstName: data.user.firstName,
          })
        );

        console.log('State after dispatch')
        
        // Stockage du token dans localStorage
        localStorage.setItem('userToken', data.user.token)

        toast({
          title: "Connexion réussie !",
          description: `Bienvenue ${data.user.firstName} !`,
          variant: "default",
          duration: 3000,
          className: "bg-green-50",
        });

        onOpenChange(false);
      } else {
        setErrorMessage(data.error || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.log("Erreur lors de l'inscription", error);
      setErrorMessage("Une erreur est survenue lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>S'inscrire</DialogTitle>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
          <DialogDescription>
            Inscription sur hotefinder
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Prénom"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              placeholder="Mot de passe"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div className="relative">
            <Input
              placeholder="Confirmer le mot de passe"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          <Button
            onClick={handleSubmitSignUp}
            disabled={isLoading}
            className="relative"
          >
            {isLoading ? "Inscription en cours..." : "Inscription"}
          </Button>

          <p className="text-sm text-center">Ou</p>

          <Button onClick={() => signIn("google")} variant="outline">
            <Image
              src="/google.svg"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            S'inscrire avec Google
          </Button>
          <p className="text-sm text-center text-gray-500">
            Déjà inscrit ?{" "}
            <span className="text-blue-500 cursor-pointer hover:underline">
              Connexion par ici
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
