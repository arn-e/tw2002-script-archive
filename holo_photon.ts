#adjholophoton

:vars
setVar $count 0
setVar $scriptname "(foton'Z!)"
setVar $version 2.0b
lowerCase $version
setVar $noshoot 8
setVar $planet 0

:main
getWord CURRENTLINE $location 1
if ($location = "Command")
   goto :0
elseif ($location = "Citadel")
  goto :0
else
   echo "**bad prompt**"
      halt
end

:0
	mergeText GAMENAME "-safelist" $filename
	mergeText $filename ".txt" $filename

:01
read $filename $total 1
setArray $traders $total
setVar $count 1
setVar $tradercount 1
  while ($count <= ($total + 1))
    read $filename $temp $count
      isNumber $test $temp
         if ($test = 1)
           add $count 1
         else
           setVar $traders[$tradercount] $temp
           add $count 1
           add $tradercount 1
    end
end

:info
killalltriggers
  if ($location = "Citadel")
    goSub :getinfo
  end


:firstprompt
killalltriggers
echo ansi_15 "*holo-scan photon active, press > to activate*"
setTextOutTrigger hotkey :1 ">"
pause

:1
killalltriggers
getWord CURRENTLINE $location 1
if ($location = "Command")
   setVar $line CURRENTLINE
   getText $line $sector "]:[" "] (?="
elseif ($location = "Citadel")
if ($planet = 0)
  goSub :getinfo
end
   send "/"
   waitFor "Sect"
   getWord CURRENTLINE $sector 2
   stripText $sector "Turns"
   stripText $sector #179
else
   echo ansi_15 "*not a valid prompt*"
   goto :firstprompt
end

setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $adjsector $warpcount
setVar $count 1
while ($count <= $warpcount)
  setVar $adjsector[$count] SECTOR.WARPS[$sector][$count]
    add $count 1
end

if ($location = "Command")
   send "sh"
   setTextTrigger donescan :donescan "Warps to Sector(s)"
   pause
elseif ($location = "Citadel")
   send " q q sh"
   setTextTrigger donescan1 :donescan "Warps to Sector(s)"
   pause

:donescan
killalltriggers
if ($location = "Citadel")
    send " l " $planet " * c "
end

:2
goSub :vars1
while ($count <= $warpcount)
 setVar $adjsect $adjsector[$count]
 if ($adjsect = STARDOCK)
    goto :continue_loop
 end
 if ($adjsect < 11)
    goto :continue_loop
 end
  if (SECTOR.TRADERCOUNT[$adjsect] <> 0) 
    goto :3
   else
  :continue_loop
  add $count 1
 end
end

:notargets
echo ansi_14 "*Not taking shot - no isolated enemies*"
goto :firstprompt

:3
setVar $newcount 1


:4
setVar $tradercount 1
setVar $postarget SECTOR.TRADERS[$adjsect][$newcount]
goSub :striptext
while ($tradercount <= $total)
  if ($postarget = $traders[$tradercount])
     echo ansi_12 "*Safe-list Trader detected --> (" ansi_14 $adjsect ansi_12 ") - skipping sector*"
#       setVar $noshoot $adjsect
        goto :continue_loop
     else
     add $tradercount 1
end
end

:chk
setVar $tradercount SECTOR.TRADERCOUNT[$adjsect]
if ($newcount < $tradercount)
  add $newcount 1
    goto :4
end

:fire
#if ($noshoot = $adjsect)
#   echo ansi_9 "**corpie detected - holding fire **"
#    halt
#end	
send "c p y " $adjsect " * q "
send "'" $scriptname " " $sector " -> " $adjsect "*"	
waitFor "Message sent"

:move
killalltriggers
echo ansi_10 "*Warp In ? (Y/N)"
getConsoleInput $warpchoice SINGLEKEY
if ($warpchoice = "y")
  setVar $warpin "YES"
elseif ($warpchoice = "n")
  setVar $warpin "NO"
  goto :firstprompt
else
  goto :move
end

:warp
killalltriggers
  if ($location = "Command")
     send " m " $adjsect " * z a 999 z n z n "
     goto :firstprompt
  elseif ($location = "Citadel")
     echo ansi_10 "*warp planet in?*"
     getconsoleinput $wchoice SINGLEKEY
     if ($wchoice = "y")
        setVar $planetwarp "YES"
     elseif ($wchoice = "n")
        setVar $planetwarp "NO"
     else
       goto :warp
     end
  end

:warp2
killalltriggers
if ($planetwarp = "NO")
  send " q q m " $adjsect " * z a 999 z n f z q z 1 * z q z c z q z c z q z o * "
  goto :firstprompt
end

:warp3

if ($level < 4)
  echo ansi_12 "*ERROR : " ansi_13 " citadel must be at least level 4*"
  goto :firstprompt
end

getdistance $dist $adjsect $sector
if ($dist > 1)
  echo ansi_12 "*ERROR : " ansi_13 $adjsect " is a one-way warp*"
  goto :firstprompt
else
  send " q q m " $adjsect " * z a 999 z n f z q z 1 * z q z c z q z o * < l " $planet " * c p " $adjsect " * y "
  send "s"
  goto :firstprompt
end


:manual
send "sh"
waitFor "Command"
goSub :vars1
while ($count <= $warpcount)
echo ansi_10 "*" $count " - " $adjsector[$count] " "
  add $count 1
end
echo ansi_15 "**Target : *"
getConsoleInput $shoot SINGLEKEY

if ($shoot = 1)
  #send "c p y " $adjsector[1] " * q "
    send "'ph00nTon v. " $version " | fired into : " $adjsector[1] "*"
      halt
elseif ($shoot = 2) AND ($shoot <= $warpcount)
#send "c p y " $adjsector[2] " * q "
send "'ph00nTon v. " $version " | fired into : " $adjsector[2] "*"
halt
elseif ($shoot = 3) and ($shoot <= $warpcount)
   #send "c p y " $adjsector[3] " * q "
      send "'ph00nTon v. " $version " | fired into : " $adjsector[3] "*"
         halt
elseif ($shoot = 4) and ($shoot <= $warpcount)
#send "c p y " $adjsector[4] " * q "
      send "'ph00nTon v. " $version " | fired into : " $adjsector[4] "*"
         halt
elseif ($shoot = 5) and ($shoot <= $warpcount)
#send "c p y " $adjsector[5] " * q "
      send "'ph00nTon v. " $version " | fired into : " $adjsector[5] "*"
         halt
elseif ($shoot = 6) and ($shoot <= $warpcount)
#send "c p y " $adjsector[6] " * q "
      send "'ph00nTon v. " $version " | fired into : " $adjsector[6] "*"
         halt
elseif ($shoot = 0)
   echo ansi_15 "*halting*"
     halt
else 
  echo "*invalid choice*"
   goto :manual
end

:getinfo
    send "qd"
    waitfor "Planet #" 	
    getword CURRENTLINE $planet 2
    getword CURRENTLINE $sector 5
    striptext $planet "#"
    striptext $sector ":"
    waitfor "Planet has a level"
    getword CURRENTLINE $level 5
    send "c"
    waitfor "Citadel command (?=help)"
    return

:vars1
setVar $count 1
return

:striptext
striptext $postarget "Civilian "
striptext $postarget "Private 1st Class "
striptext $postarget "Private "
striptext $postarget "Lance Corporal "
striptext $postarget "Corporal "
striptext $postarget "Staff Sergeant "
striptext $postarget "Gunnery Sergeant "
striptext $postarget "1st Sergeant "
striptext $postarget "Sergeant Major "
striptext $postarget "Sergeant "
striptext $postarget "Chief Warrant Officer " 
striptext $postarget "Warrant Officer "
striptext $postarget "Ensign "
striptext $postarget "Lieutenant J.G. "
striptext $postarget "Lieutenant Commander "
striptext $postarget "Lieutenant "
striptext $postarget "Commander "
striptext $postarget "Captain "
striptext $postarget "Commodore "
striptext $postarget "Rear Admiral "
striptext $postarget "Vice Admiral "
striptext $postarget "Admiral "
striptext $postarget "Fleet Admiral "
striptext $postarget "Annoyance "
striptext $postarget "Nuisance 1st Class "
striptext $postarget "Nuisance 2nd Class "
striptext $postarget "Nuisance 3rd Class "
striptext $postarget "Menace 1st Class "
striptext $postarget "Menace 2nd Class "
striptext $postarget "Menace 3rd Class "
striptext $postarget "Smuggler 1st Class "
striptext $postarget "Smuggler 2nd Class "
striptext $postarget "Smuggler 3rd Class "
striptext $postarget "Smuggler Savant "
striptext $postarget "Robber "
striptext $postarget "Terrorist " 
striptext $postarget "Infamous Pirate "
striptext $postarget "Notorious Pirate "
striptext $postarget "Dread Pirate "
striptext $postarget "Pirate "
striptext $postarget "Galactic Scourge "
striptext $postarget "Enemy of the State "
striptext $postarget "Enemy of the People "
striptext $postarget "Enemy of Humankind "
striptext $postarget "Heinous Overlord "
striptext $postarget " [1]"
striptext $postarget " [2]"
striptext $postarget " [3]"
striptext $postarget " [4]"
striptext $postarget " [5]"
striptext $postarget " [6]"
striptext $postarget " [7]"
striptext $postarget " [8]"
striptext $postarget " [9]"
striptext $postarget " [10]"
striptext $postarget " [11]"
striptext $postarget " [12]"
return


