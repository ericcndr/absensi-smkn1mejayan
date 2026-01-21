interface ExportData {
  headers: string[]
  rows: string[][]
}

// Export data to CSV
export function exportToCSV(data: ExportData, filename: string) {
  const csvContent = [data.headers.join(","), ...data.rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join(
    "\n",
  )

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  downloadBlob(blob, `${filename}.csv`)
}

// Export data to Excel (XLSX format using CSV)
export function exportToExcel(data: ExportData, filename: string) {
  // Using CSV format which Excel can open
  // For true XLSX, would need library like xlsx
  exportToCSV(data, filename)
}

// Export data to PDF (simple text-based PDF)
export function exportToPDF(data: ExportData, filename: string, title: string) {
  let pdfContent = `${title}\n\n`
  pdfContent += data.headers.join(" | ") + "\n"
  pdfContent += "-".repeat(100) + "\n"

  data.rows.forEach((row) => {
    pdfContent += row.join(" | ") + "\n"
  })

  const blob = new Blob([pdfContent], { type: "application/pdf" })
  downloadBlob(blob, `${filename}.pdf`)
}

// Helper to download blob
function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Format attendance data for export
export function formatAttendanceForExport(records: any[]): ExportData {
  return {
    headers: [
      "Tanggal",
      "Nama",
      "ID Karyawan",
      "Departemen",
      "Check-In",
      "Check-Out",
      "Status",
      "Lokasi",
      "Jarak (m)",
      "Skor AI (%)",
    ],
    rows: records.map((record) => [
      record.date,
      record.user.name,
      record.user.employeeId,
      record.user.department,
      record.checkIn,
      record.checkOut || "-",
      record.status,
      record.location,
      record.distance.toString(),
      record.faceScore.toFixed(1),
    ]),
  }
}
