import { Button } from "@/components/ui/button"
import './chat.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUserRound, LogOut, MoreVertical, MoreVerticalIcon, User, UserPlus } from "lucide-react"
import { DialogDemo } from "./dialogBox";
import { useState } from "react";
import SignOut from "./signOut";

export function DropdownMenuBasic() {
  const [openDialog, setOpenDialog] = useState(false);
  const [signOutDrawer, setSignOutDrawer] = useState(false);
  return (
    <>
    
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <MoreVerticalIcon className="text-white cursor-pointer"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52">
        
        <DropdownMenuItem className="py-2! px-3! cursor-pointer"
        onClick={() => setOpenDialog(true)}
        >
          <span className="flex gap-2 items-center">
          <UserPlus className="w-5! h-5!"/>
            <p className="text-lg">Add New Group</p>
          </span>
          </DropdownMenuItem>
        <DropdownMenuItem className="py-2! px-3! cursor-pointer"
        onClick={() => setSignOutDrawer(true)}
        >
          <span className="flex gap-2 items-center">
          {/* <LogOut className="w-5! h-5!"/> */}
          <CircleUserRound className="w-5! h-5!"/>
             <p className="text-lg">View Profile</p>
          </span>
          {/* <p className="text-lg">Log Out</p> */}
          </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    <DialogDemo open={openDialog} setOpen={setOpenDialog} />
    <SignOut
            signOutDrawer={signOutDrawer}
            setSignOutDrawer={setSignOutDrawer}
          />
    </>
  )
}
