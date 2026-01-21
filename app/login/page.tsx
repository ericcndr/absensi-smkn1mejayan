"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Shield, Camera, Sparkles, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { getUserByEmail, setCurrentUser, initializeDefaultData } from "@/lib/storage"
import { setupMobileViewport, requestNotificationPermission } from "@/lib/mobile-optimization"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useState(() => {
    initializeDefaultData()
    setupMobileViewport()
    requestNotificationPermission()
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const user = getUserByEmail(email)

      if (!user) {
        throw new Error("Email tidak ditemukan")
      }

      setCurrentUser(user)

      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/attendance")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Email atau password salah")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4 relative overflow-hidden safe-area">
      <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-accent/20 blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl mb-4 shadow-lg pulse-glow">
            <Building2 className="h-10 w-10 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight gradient-text">SMKN 1 Mejayan</h1>
            <p className="text-sm text-muted-foreground mt-1">Sistem Presensi GPS AI</p>
          </div>
          <p className="text-sm text-muted-foreground">Teknologi kehadiran yang modern dan aman</p>
        </div>

        {/* Login Card */}
        <Card className="border-primary/20 shadow-xl backdrop-blur-sm bg-white/50 dark:bg-slate-900/50">
          <CardHeader>
            <CardTitle className="text-primary">Login Presensi</CardTitle>
            <CardDescription>Masukkan akun sekolah Anda untuk memulai</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-950">
                  <AlertDescription className="text-red-700 dark:text-red-300">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-primary font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@smkn1mejayan.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-primary font-semibold">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="border-primary/20 focus:border-primary bg-white/50 dark:bg-slate-800/50"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full gradient-bg text-white font-semibold h-11 hover:shadow-lg transition-all"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner className="h-4 w-4 mr-2" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Masuk
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center space-y-2 p-3 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 hover:border-primary/20 transition-all">
            <div className="mx-auto w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-medium text-foreground">GPS Tracking</p>
          </div>
          <div className="text-center space-y-2 p-3 rounded-lg bg-accent/5 border border-accent/10 hover:bg-accent/10 hover:border-accent/20 transition-all">
            <div className="mx-auto w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-medium text-foreground">Face Recognition</p>
          </div>
          <div className="text-center space-y-2 p-3 rounded-lg bg-secondary/5 border border-secondary/10 hover:bg-secondary/10 hover:border-secondary/20 transition-all">
            <div className="mx-auto w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <p className="text-xs font-medium text-foreground">Anti-Spoofing</p>
          </div>
        </div>

        <div className="space-y-2 bg-blue-50 dark:bg-blue-950 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="font-semibold text-blue-900 dark:text-blue-100 text-xs block">Demo Account SMKN 1 Mejayan:</p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Admin:</p>
                <p className="text-blue-700 dark:text-blue-300 font-mono">admin@smkn1mejayan.sch.id</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 bg-white dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
              <div>
                <p className="font-medium text-blue-900 dark:text-blue-100">Siswa:</p>
                <p className="text-blue-700 dark:text-blue-300 font-mono">budi@smkn1mejayan.sch.id</p>
              </div>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-center font-medium">Password: apa saja</p>
          </div>
        </div>
      </div>
    </div>
  )
}
