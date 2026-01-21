"use client"

import { useState } from "react"
import { Download, FileText, FileSpreadsheet, FileDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { exportToCSV, exportToExcel, exportToPDF, formatAttendanceForExport } from "@/lib/export"
import { cn } from "@/lib/utils"

interface ExportDialogProps {
  data: any[]
}

export function ExportDialog({ data }: ExportDialogProps) {
  const [open, setOpen] = useState(false)
  const [exportFormat, setExportFormat] = useState("excel")
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: new Date(),
  })

  const handleExport = () => {
    const filename = `presensi_${format(dateRange.from, "yyyy-MM-dd")}_${format(dateRange.to, "yyyy-MM-dd")}`
    const exportData = formatAttendanceForExport(data)

    switch (exportFormat) {
      case "csv":
        exportToCSV(exportData, filename)
        break
      case "excel":
        exportToExcel(exportData, filename)
        break
      case "pdf":
        exportToPDF(exportData, filename, "Laporan Presensi Karyawan")
        break
    }

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Laporan Presensi</DialogTitle>
          <DialogDescription>Pilih format dan periode data yang ingin diekspor</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Format Export</Label>
            <RadioGroup value={exportFormat} onValueChange={setExportFormat}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excel" id="excel" />
                <Label htmlFor="excel" className="flex items-center gap-2 cursor-pointer font-normal">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  Excel (.csv)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer font-normal">
                  <FileText className="h-4 w-4 text-blue-600" />
                  CSV (.csv)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer font-normal">
                  <FileDown className="h-4 w-4 text-red-600" />
                  PDF (.pdf)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Periode</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP", { locale: id }) : "Dari tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "flex-1 justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP", { locale: id }) : "Sampai tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
