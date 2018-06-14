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
setArray $avoid_adj 6
setVar $scan_count 0
send "sh"
setTextLineTrigger get_sector :get_adj_sector "Sector  :"
#setTextLineTrigger get_shielded :get_adj_shielded "(Shielded)"
#setTextLineTrigger get_fighters :get_adj_fighters "Fighters:"
#setTextTrigger done :done_scan "Command [TL=00:00:00]:[" & $target_jp & "]"
setTextTrigger done :done_scan "Warps to Sector(s)"
pause


:get_adj_sector
killalltriggers
setVar $scan_count ($scan_count + 1)
setVar $line CURRENTLINE
getWord $line $adj_scan_sector 3
setTextLineTrigger get_sector :get_adj_sector "Sector  :"
setTextLineTrigger get_shielded :get_adj_shielded "(Shielded)"
setTextLineTrigger get_fighters :get_adj_fighters "Fighters:"
#setTextTrigger done :done_scan "Command [TL=00:00:00]:[" & $target_jp & "]"
setTextTrigger done :done_scan "Warps to Sector(s)"
pause

:get_adj_shielded
killalltriggers
#send "'SHIELDED PLANET - in " $adj_scan_sector " - warp " $scan_count "*"
      if ($adj_scan_sector <> $target_jp)
         setVar $avoid_adj[$scan_count] 1
         if ($ss_msg = "ON")
            send "'" $script " SHIELDED PLANET : " $adj_scan_sector "*"
         end
         write $avoid_file $adj_scan_sector
         setVar $avoid_count ($avoid_count + 1)
      end
setTextLineTrigger get_sector :get_adj_sector "Sector  :"
setTextLineTrigger get_shielded :get_adj_shielded "(Shielded)"
setTextLineTrigger get_fighters :get_adj_fighters "Fighters:"
#setTextTrigger done :done_scan "Command [TL=00:00:00]:[" & $target_jp & "]"
setTextTrigger done :done_scan "Warps to Sector(s)"
pause

:get_adj_fighters
killalltriggers
setvar $line CURRENTLINE
getWord $line $scan_figs_adj 2
setVar $display_figs $scan_figs_adj
stripText $scan_figs_adj ","
          if ($scan_figs_adj > 10) AND ($adj_scan_sector <> $target_jp)
             setVar $avoid_adj[$scan_count] 1
             if ($ss_msg = "ON")
                send "'" $script " HIGH FIG COUNT [" $display_figs "] : " $adj_scan_sector "*"
             end
             write $avoid_file $adj_scan_sector
             setVar $avoid_count ($avoid_count + 1)
          end
setTextLineTrigger get_sector :get_adj_sector "Sector  :"
setTextLineTrigger get_shielded :get_adj_shielded "(Shielded)"
setTextLineTrigger get_fighters :get_adj_fighters "Fighters:"
#setTextTrigger done :done_scan "Command [TL=00:00:00]:[" & $target_jp & "]"
setTextTrigger done :done_scan "Warps to Sector(s)"
pause

:done_scan
killalltriggers

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

