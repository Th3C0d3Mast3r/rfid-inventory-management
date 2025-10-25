"use client"

import{useAuth}from"@/context/auth-context"
import{useRouter}from"next/navigation"
import{useEffect,useState}from"react"
import{useInventory}from"@/hooks/use-inventory"
import{Header}from"@/components/header"
import{ScanInput}from"@/components/scan-input"
import{ItemModal}from"@/components/item-modal"
import{InventoryTable}from"@/components/inventory-table"
import AdminStaffTable from "@/components/adminStaffTable"

export default function Dashboard(){
  const{user,loading:authLoading}=useAuth()
  const router=useRouter()
  const{items,loading,fetchItems,addItem,updateItem,deleteItem}=useInventory()

  const[scannedRfid,setScannedRfid]=useState<string|null>(null)
  const[isItemModalOpen,setIsItemModalOpen]=useState(false)
  const[scannerMode,setScannerMode]=useState(false) // false=manual,true=IoT

  useEffect(()=>{
    if(!authLoading&&!user)router.push("/")
  },[user,authLoading,router])

  useEffect(()=>{
    if(user)fetchItems()
  },[user,fetchItems])

  // Poll RFID when IoT Scanner Mode is enabled
  useEffect(()=>{
    if(!scannerMode)return
    const interval=setInterval(async()=>{
      try{
        const res=await fetch("/api/scan")
        const data=await res.json()
        if(data.uid){
          handleScan(data.uid)
        }
      }catch(err){
        console.error("Error fetching scanned UID:",err)
      }
    },1000)
    return()=>clearInterval(interval)
  },[scannerMode])

  const handleScan=(rfid:string)=>{
    console.log("Scanned RFID:",rfid)
    const existingItem=items.find(item=>item.rfid===rfid)
    if(existingItem){
      const confirmDelete=window.confirm(`Do you wish to REMOVE itemId ${rfid}?`)
      if(confirmDelete)deleteItem(rfid)
    }else{
      setScannedRfid(rfid)
      setIsItemModalOpen(true)
    }
  }

  const handleAddItem=async(name:string,itemId:string)=>{
    if(!user?.emailId){
      console.error("Cannot add item: user email not loaded yet")
      return
    }

    try{
      await addItem(name,itemId,user.emailId)
      console.log("Item added successfully:",{name,itemId})
      await fetchItems() // refresh inventory table
    }catch(err){
      console.error("Add Item Failed:",err)
    }finally{
      setIsItemModalOpen(false)
      setScannedRfid(null)
    }
  }

  const handleIncrement=async(rfid:string)=>{
    const item=items.find(i=>i.rfid===rfid)
    if(item){
      const newQty=(item.quantity??0)+1
      await updateItem(rfid,{quantity:newQty})
    }
  }

  const handleDecrement=async(rfid:string)=>{
    const item=items.find(i=>i.rfid===rfid)
    if(item&&(item.quantity??0)>0){
      const newQty=Math.max(0,(item.quantity??0)-1)
      await updateItem(rfid,{quantity:newQty})
    }
  }

  if(authLoading){
    return(
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return(
    <div className="min-h-screen bg-background">
      <Header/>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SCANNER SECTION */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Scanner</h2>
                <label className="flex items-center gap-2 text-sm">
                  <span>IoT Scanner</span>
                  <input
                    type="checkbox"
                    checked={scannerMode}
                    onChange={e=>setScannerMode(e.target.checked)}
                    className="cursor-pointer accent-primary"
                  />
                </label>
              </div>

              <ScanInput onScan={handleScan} disabled={loading||scannerMode}/>
              {scannerMode&&(
                <p className="text-xs text-muted-foreground mt-2">
                  Listening for RFID scans from IoT device...
                </p>
              )}

              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-2">Quick Stats</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Total Items</span>
                    <span className="font-semibold text-foreground">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-foreground">Total Quantity</span>
                    <span className="font-semibold text-foreground">
                      {items.reduce((sum,item)=>sum+(item.quantity??0),0)}
                    </span>
                  </div>
                </div>
              </div>

              {user?.role==="ADMIN"&&(
                <AdminStaffTable
                  user={{
                    id:user._id,
                    name:user.name,
                    emailId:user.emailId,
                    role:user.role
                  }}
                />
              )}
            </div>
          </div>

          {/* INVENTORY TABLE */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Inventory</h2>
              <InventoryTable
                items={items.map(item=>({
                  rfid:item.rfid,
                  name:item.name,
                  quantity:item.quantity??0,
                  scannedAt:item.scannedAt?new Date(item.scannedAt).toISOString():new Date().toISOString(),
                }))}
                onIncrement={handleIncrement}
                onDecrement={handleDecrement}
                onDelete={deleteItem}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </main>

      {isItemModalOpen&&scannedRfid&&(
        <ItemModal
          rfid={scannedRfid}
          onSubmit={handleAddItem}
          onClose={()=>{
            setIsItemModalOpen(false)
            setScannedRfid(null)
          }}
          loading={loading}
        />
      )}
    </div>
  )
}
