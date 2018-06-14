#surround

:vars
setVar $count 0
setVar $count1 0
setVar $missed 0

:main
getWord CURRENTLINE $location 1
if ($location = "Command")
   setVar $loc "SPACE"
elseif ($location = "Citadel")
   setVar $loc "PLANET"
else
   echo ansi_11 "**bad prompt**"
   halt
end

:start
killalltriggers
if ($location = "Command")
   setVar $line CURRENTLINE
   getText $line $sector "]:[" "] (?"	
elseif ($location = "Citadel")
   send "qd"
   waitFor "Planet #"
   setVar $line CURRENTLINE
   getWord $line $planet 2
   getWord $line $sector 5
   stripText $planet "#"
   stripText $sector ":"
end

:build
killalltriggers
setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $adjwarps $warpcount
setVar $count 1
while ($count <= $warpcount)
   setVar $adjwarps[$count] SECTOR.WARPS[$sector][$count]
   add $count 1
end

:holo
if ($location = "Citadel")
  send " q sh"
  setTextTrigger warning_l5 :warning_l5 "(Shielded)"
  setTextTrigger done :donetrig "Warps to Sector(s) :"
  pause
elseif ($location = "Command")
  send "sh"
  #:l5_check_point
  setTextTrigger warning_l5 :warning_l5 "(Shielded)"
  setTextTrigger done :donetrig "Command [TL"
  pause
end

:warning_l5
killalltriggers
echo ansi_12 "**L5 DETECTED -" ansi_11 " PROCEED ? " ansi_14 "( y / n ) "
getConsoleInput $warning_choice SINGLEKEY
                if ($warning_choice = "y") OR ($warning_choice = "Y")
                   goto :donetrig
                elseif ($warning_choice = "n") OR ($warning_choice = "N")
                       halt
                else
                   goto :warning_l5
                end

:donetrig
killalltriggers
goto :chkpaths

:chkpaths
killalltriggers
setVar $count 1
setvar $count1 1
while ($count <= $warpcount)
   setVar $temp_adj_warp $adjwarps[$count]
   getdistance $dist $adjwarps[$count] $sector
   if ($temp_adj_warp = STARDOCK) OR ($temp_adj_warp < 11) OR ($dist > 1)
      setVar $missed ($missed + 1)
      setVar $misscount[$count1] $adjwarps[$count]
      add $count1 1
      setVar $adjwarps[$count] 0
   end
   add $count 1
end

setVar $count 1

:figloop
killalltriggers
if ($count <= $warpcount)
  setVar $target $adjwarps[$count]
  if ($target = 0) 
     add $count 1
     goto :figloop
  end
  setVar $test SECTOR.FIGS.OWNER[$target]
  if ($test = "belong to your Corp")
     setVar $adjwarps[$count] 0
  elseif ($test = "yours")
     setVar $adjwarps[$count] 0
  end
add $count 1
goto :figloop
end

:move
killalltriggers
setVar $count 1

:go
killalltriggers
while ($count <= $warpcount)
  if ($adjwarps[$count] <> 0)
    setVar $target $adjwarps[$count]
    send "m " $target " * z a 999 * z n f 1 * c o m " $sector " * z a 999 * z n "
    if ($sector <> STARDOCK) AND ($sector > 10)
       send " f 1 * c o "
    end
    add $count 1
  else
    add $count 1
  end
end

:end
killalltriggers
setVar $count1 1
echo ansi_10 "*" $missed 
while ($count1 <= $missed)
  echo ansi_12 "* MISSED [" $count1 "]: " ansi_13 $misscount[$count1] 
  add $count1 1
end
echo ansi_10 "* SURROUNDED*"
if ($location = "Citadel")
  send "l " $planet " * m * * * c "
end
if ($missed = 0)
send "'(surround)  sector " $sector " ringed*"

else
setVar $count1 1
send "'*(surround)  sector " $sector " NOT ringed - avoided " $missed " sector(s)"
while ($count1 <= $missed)
  send "*avoid [" $count1 "] : " $misscount[$count1] 
  add $count1 1
end
end
send "**  "

halt

