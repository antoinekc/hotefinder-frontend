// components/layout/AuthButtons.tsx

"use client";
import { LoginModal } from "./LoginModal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "@/app/store/reducers/user";
import { useToast } from "@/hooks/use-toast";
import { SignupModal } from "./SignupModal";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export function AuthButtons() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const router = useRouter();

  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());

    toast({
      title: "Vous êtes bien déconnecté",
      description: `A bientôt !`,
      variant: "default",
      duration: 3000,
      className: "bg-orange-50",
    });
  };

  const switchToSignup = () => {
    setLoginModalOpen(false);
    setSignUpModalOpen(true);
  };

  const switchToLogin = () => {
    setSignUpModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleProfilePage = () => {

  };

  return (
    <div className="flex gap-4 items-center">
      {!user.token ? (
        // Boutons quand l'utilisateur n'est pas connecté
        <>
          <Button variant="default" onClick={() => setLoginModalOpen(true)}>
            Se connecter
          </Button>
          <Button variant="default" onClick={() => setSignUpModalOpen(true)}>
            S'inscrire
          </Button>
          <LoginModal 
            open={loginModalOpen} 
            onOpenChange={setLoginModalOpen}
            onSwitchToSignup={() => setSignUpModalOpen(true)}  // Ajout de la prop
          />
          <SignupModal
            open={signUpModalOpen}
            onOpenChange={setSignUpModalOpen}
          />
        </>
      ) : (
        <>
          <Button variant="default" className="gap-2" onClick={ () => router.push('/profile') }>
            <User className="h-4 w-4" />
            {user.firstName ? user.firstName : "Profil"}
          </Button>
          <Button variant="default" onClick={handleLogout}>
            Déconnexion
          </Button>
        </>
      )}
    </div>
  );
}
