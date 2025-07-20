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
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    loading, // Assuming loading state is available in context
    error, // Assuming error state is available in context
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
  }

  // Check if the SignIn form is valid
  function checkIfSignInFormIsValid() {
    const { userEmail, password } = signInFormData;
    return userEmail !== "" && password !== "";
  }

  // Check if the SignUp form is valid
  function checkIfSignUpFormIsValid() {
    const { userName, userEmail, password } = signUpFormData;
    return userName !== "" && userEmail !== "" && password !== "";
  }

  // Validate email (basic validation)
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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
          disabled={loading} // Disable tabs while loading
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
                  buttonText={loading ? "Signing In..." : "Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid() || loading}
                  handleSubmit={handleLoginUser}
                />
                {signInFormData.userEmail && !validateEmail(signInFormData.userEmail) && (
                  <p className="text-red-500 text-sm">Please enter a valid email.</p>
                )}
                {signInFormData.password === "" && (
                  <p className="text-red-500 text-sm">Password cannot be empty.</p>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>} {/* Show error message if any */}
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
                  buttonText={loading ? "Signing Up..." : "Sign Up"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid() || loading}
                  handleSubmit={handleRegisterUser}
                />
                {signUpFormData.userName === "" && (
                  <p className="text-red-500 text-sm">Username cannot be empty.</p>
                )}
                {signUpFormData.userEmail === "" && (
                  <p className="text-red-500 text-sm">Email cannot be empty.</p>
                )}
                {signUpFormData.password === "" && (
                  <p className="text-red-500 text-sm">Password cannot be empty.</p>
                )}
                {signUpFormData.userEmail && !validateEmail(signUpFormData.userEmail) && (
                  <p className="text-red-500 text-sm">Please enter a valid email.</p>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>} {/* Show error message if any */}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AuthPage;
