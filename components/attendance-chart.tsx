"use client"

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface AttendanceData {
  day: string
  hadir: number
  terlambat: number
  tidak_hadir: number
}

export function AttendanceChart() {
  // Mock data - replace with real data
  const data: AttendanceData[] = [
    { day: "Sen", hadir: 145, terlambat: 3, tidak_hadir: 2 },
    { day: "Sel", hadir: 142, terlambat: 5, tidak_hadir: 3 },
    { day: "Rab", hadir: 148, terlambat: 2, tidak_hadir: 0 },
    { day: "Kam", hadir: 140, terlambat: 7, tidak_hadir: 3 },
    { day: "Jum", hadir: 138, terlambat: 8, tidak_hadir: 4 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Kehadiran Mingguan</CardTitle>
        <CardDescription>Ringkasan presensi karyawan minggu ini</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            hadir: {
              label: "Hadir",
              color: "hsl(142, 76%, 36%)",
            },
            terlambat: {
              label: "Terlambat",
              color: "hsl(38, 92%, 50%)",
            },
            tidak_hadir: {
              label: "Tidak Hadir",
              color: "hsl(0, 84%, 60%)",
            },
          }}
          className="h-80"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="hadir" fill="hsl(142, 76%, 36%)" name="Hadir" radius={[4, 4, 0, 0]} />
              <Bar dataKey="terlambat" fill="hsl(38, 92%, 50%)" name="Terlambat" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tidak_hadir" fill="hsl(0, 84%, 60%)" name="Tidak Hadir" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
