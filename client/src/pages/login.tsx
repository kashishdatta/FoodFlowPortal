import LoginPage from "@/components/login-page";
import { useParams } from "wouter";

export default function Login() {
  const params = useParams();
  const role = params.role === "supplier" ? "supplier" : "storeManager";

  return <LoginPage role={role} />;
}
