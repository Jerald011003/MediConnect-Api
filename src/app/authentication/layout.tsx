import { AuthProvider } from "@/contexts/AuthContext";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex items-center justify-center ">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </AuthProvider>
  )
}