"use client"
import{useState}from"react"

interface ScanInputProps{
  onScan:(rfid:string)=>void
  disabled?:boolean
}

export function ScanInput({onScan,disabled}:ScanInputProps){
  const[value,setValue]=useState("")

  const handleKeyDown=(e:React.KeyboardEvent<HTMLInputElement>)=>{
    if(e.key==="Enter"&&value.trim()){
      e.preventDefault()
      onScan(value.trim()) // Trigger scan
      setValue("") // Reset input
    }
  }

  return(
    <input
      type="text"
      placeholder="Scan or type RFID tag"
      value={value}
      onChange={e=>setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
    />
  )
}
