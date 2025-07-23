import CommonForm from "@/components/common-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("signin");
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    error,
    isAuthenticated
  } = useContext(AuthContext);

  // Clear messages when switching tabs
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setLocalError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage, localError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  function handleTabChange(value) {
    setActiveTab(value);
    setLocalError(null);
    setSuccessMessage(null);
  }

  // Reset form data
  const resetFormData = (isSignIn = true) => {
    if (isSignIn) {
      setSignInFormData({
        userEmail: "",
        password: ""
      });
    } else {
      setSignUpFormData({
        userName: "",
        userEmail: "",
        password: ""
      });
    }
  };

  // Enhanced submit handlers
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    setSuccessMessage(null);
    
    try {
      await handleLoginUser(signInFormData);
      setSuccessMessage("Login successful! Redirecting...");
      resetFormData(true);
    } catch (err) {
      setLocalError(err.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLocalError(null);
    setSuccessMessage(null);
    
    try {
      await handleRegisterUser(signUpFormData);
      setSuccessMessage("Registration successful! Please sign in.");
      resetFormData(false);
      setActiveTab("signin");
    } catch (err) {
      setLocalError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">Skill Orbit</span>
        </Link>
      </header>
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
          className="w-full max-w-md"
          disabled={isSubmitting}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Sign in to your account</CardTitle>
                <CardDescription>
                  Enter your email and password to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={isSubmitting ? "Signing In..." : "Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={isSubmitting}
                  handleSubmit={handleSignIn}
                />
                {successMessage && (
                  <p className="text-green-500 text-sm">{successMessage}</p>
                )}
                {(localError || error) && (
                  <p className="text-red-500 text-sm">{localError || error}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card className="p-6 space-y-4">
              <CardHeader>
                <CardTitle>Create a new account</CardTitle>
                <CardDescription>
                  Enter your details to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CommonForm
                  formControls={signUpFormControls}
                  buttonText={isSubmitting ? "Signing Up..." : "Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={isSubmitting}
                  handleSubmit={handleSignUp}
                />
                {successMessage && (
                  <p className="text-green-500 text-sm">{successMessage}</p>
                )}
                {(localError || error) && (
                  <p className="text-red-500 text-sm">{localError || error}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;