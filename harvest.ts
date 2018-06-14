#ore harvester

:vars
setVar $count 1
setVar $script "(harvester)"
setVar $scriptname "$playerName's ore harvester"
setVar $torp 20
setvar $det 20
setVar $torp_max 20
setVar $det_max 20
setVar $total_moved 0

:main
getWord CURRENTLINE $location 1
   if ($location <> "Command")
     echo "*not command prompt*"
     halt
   end
   
:get_input
echo "*enter planet to ore/base planet*"
getconsoleinput $base_planet
echo "*enter sector*"
getconsoleinput $base_sector
echo "*how much ore to move?*"
getconsoleinput $limit

:get_info
echo "*START WITH FULL TORPS/DETS*"

:launch
killalltriggers
send " u y * ::ore::* c "
setVar $torp ($torp - 1)

:land
send "l"
waitFor "Registry# and"
setTextLineTrigger 1 :planet "::ore::"
pause

:planet
killalltriggers
setVar $line CURRENTLINE
getWord $line $target_planet 2
stripText $target_planet ")"
stripText $target_planet ">"
send $target_planet "*"

:chk_values
setTextLineTrigger chk_fuel :chk_fuel "Fuel Ore"
pause

:chk_fuel
killalltriggers
setVar $line CURRENTLINE
getWord $line $ore 6
stripText $ore ","

if ($ore <> 0)
  goto :move_product
else 
  goto :det
end

:det
killalltriggers
send " z d y    "
setVar $det ($det - 1)
setTextTrigger destroyed :destroyed "For blowing up this planet"
pause

:destroyed
killalltriggers
if ($torp < 2) OR ($det  = 0)
  goto :refill
end

goto :launch

:move_product
setVar $loops ($ore / 255)
setVar $count 1

:move_loop
killalltriggers
if ($count <= $loops)
   send "t n t 1 * q l " $base_planet " * t n l 1 * q l " $target_planet " * "
   add $count 1
   setDelayTrigger move_pause :move_loop 100
   pause
end

setVar $total_moved ($total_moved + $ore)
if ($total_moved > $limit)
   echo "*ore moved, halting*"
   halt
end
setvar $count 1
goto :det

:refill
killalltriggers
setVar $torps_needed ($torp_max - $torp)
setVar $dets_needed ($det_max - $det)
send " j y "
send " l " $base_planet " * t n t 1 * q "
setVar $dock STARDOCK
send " m " $dock " * "

:torp
send "p s h t"
setTextTrigger 1 :chk1 ") [0] ?"
pause

:chk1
killalltriggers
setVar $line CURRENTLINE
getWord $line $torpnum 9
stripText $torpnum ")"
send $torpnum "*"
setVar $torp 20

:det
send "a"
setTextTrigger 2 :chk2 ") [0] ?"
pause

:chk2
killalltriggers
setVar $line CURRENTLINE 
getWord $line $detnum 9
stripText $detnum ")"
send $detnum "*"
setVar $det 20

:return
send " q q m " $base_sector " * y y  "
setTextTrigger returned :returned "Command [TL=00:00:00]:[" & $base_sector & "]"
pause

:returned
killalltriggers
goto :launch
