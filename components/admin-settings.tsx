"use client"

import { useState, useEffect } from "react"
import { getSettings, updateSettings } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Settings, CheckCircle } from "lucide-react"

export function AdminSettings() {
  const [settings, setSettings] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; message: string } | null>(null)

  useEffect(() => {
    const currentSettings = getSettings()
    setSettings(currentSettings)
  }, [])

  const handleInputChange = (field: string, value: string | number) => {
    setSettings((prev: any) => ({
      ...prev,
      [field]: typeof value === "number" ? Number(value) : value,
    }))
  }

  const handleSave = () => {
    setIsSaving(true)
    try {
      updateSettings({
        radiusMeters: settings.radiusMeters,
        officeLatitude: settings.officeLatitude,
        officeLongitude: settings.officeLongitude,
        officeName: settings.officeName,
        officeAddress: settings.officeAddress,
      })
      setSaveMessage({ type: "success", message: "Pengaturan berhasil disimpan!" })
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      setSaveMessage({ type: "error", message: "Gagal menyimpan pengaturan" })
    } finally {
      setIsSaving(false)
    }
  }

  if (!settings) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 border-b border-primary/20">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-primary">Pengaturan Lokasi GPS</CardTitle>
              <CardDescription>Atur lokasi kantor dan radius area presensi yang diizinkan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="officeName" className="text-sm font-semibold">
                Nama Kantor/Sekolah
              </Label>
              <Input
                id="officeName"
                value={settings.officeName}
                onChange={(e) => handleInputChange("officeName", e.target.value)}
                placeholder="Contoh: SMKN 1 Mejayan"
                className="border-primary/20 focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="radius" className="text-sm font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Radius Area (Meter)
              </Label>
              <Input
                id="radius"
                type="number"
                value={settings.radiusMeters}
                onChange={(e) => handleInputChange("radiusMeters", Number(e.target.value))}
                placeholder="Contoh: 1000"
                min="100"
                step="100"
                className="border-primary/20 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {settings.radiusMeters >= 1000
                  ? `${(settings.radiusMeters / 1000).toFixed(1)}km`
                  : `${settings.radiusMeters}m`}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="officeAddress" className="text-sm font-semibold">
              Alamat Lengkap
            </Label>
            <Input
              id="officeAddress"
              value={settings.officeAddress}
              onChange={(e) => handleInputChange("officeAddress", e.target.value)}
              placeholder="Masukkan alamat lengkap kantor/sekolah"
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="latitude" className="text-sm font-semibold">
                Latitude (Garis Lintang)
              </Label>
              <Input
                id="latitude"
                type="number"
                value={settings.officeLatitude}
                onChange={(e) => handleInputChange("officeLatitude", Number(e.target.value))}
                placeholder="Contoh: -7.641"
                step="0.0001"
                className="border-primary/20 focus:border-primary font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Koordinat Y (utara-selatan)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude" className="text-sm font-semibold">
                Longitude (Garis Bujur)
              </Label>
              <Input
                id="longitude"
                type="number"
                value={settings.officeLongitude}
                onChange={(e) => handleInputChange("officeLongitude", Number(e.target.value))}
                placeholder="Contoh: 111.5088"
                step="0.0001"
                className="border-primary/20 focus:border-primary font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">Koordinat X (timur-barat)</p>
            </div>
          </div>

          {saveMessage && (
            <Alert
              variant={saveMessage.type === "success" ? "default" : "destructive"}
              className={
                saveMessage.type === "success"
                  ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-800"
                  : ""
              }
            >
              {saveMessage.type === "success" && (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              <AlertDescription className={saveMessage.type === "success" ? "text-green-700 dark:text-green-300" : ""}>
                {saveMessage.message}
              </AlertDescription>
            </Alert>
          )}

          <Button
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full gap-2 gradient-bg text-white font-bold hover:shadow-lg transition-all"
          >
            <CheckCircle className="h-5 w-5" />
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
            <p className="font-semibold mb-2">💡 Cara Menemukan Koordinat GPS:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Buka Google Maps dan cari lokasi kantor Anda</li>
              <li>Klik kanan pada marker lokasi</li>
              <li>Salin koordinat (latitude, longitude) yang muncul</li>
              <li>Atau gunakan GPS smartphone untuk mendapatkan koordinat presisi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
