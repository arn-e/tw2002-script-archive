#e z grid

  ClientMessage "To Activate press ]"
:settxt
	mergeText GAMENAME "-fig_grid" $filename
	mergeText $filename ".txt" $filename

:vars
setVar $count 0
setVar $count1 0
setArray $figArray SECTORS

:readlist
add $count 1
read $filename $sector $count
if ($sector <> "EOF")
  setVar $figArray[$sector] 1
   goto :Readlist
else
   goto :start
end

:start
getinput $figs "How many fighters do you wish to attack with? "

:firstclear
killalltriggers
setTextOutTrigger gotosector :gotosector "]"
pause

:gotosector
	getWord CURRENTLINE $location 1
	if ($location <> "Command")
        	echo ANSI_10&"*Waiting for Command Prompt**"
        	waitFor "Command [TL="
	end
	getText CURRENTLINE $sector "]:[" "] (?"
setVar $warpCount SECTOR.WARPCOUNT[$sector] 
setArray $adjDens $warpCount
setArray $adjSector $warpCount
setArray $yesno $warpcount
setArray $densreport $warpcount
setArray $adjanom $warpcount
setArray $adjwarpnum $warpcount
setVar $count1 1
while ($count1 <= $warpCount)
      setVar $adjSector[$count1] SECTOR.WARPS[$sector][$count1]
          setVar $chkgrid $adjSector[$count1]
            if ($figArray[$chkgrid] = 0)
              setVar $yesno[$count1] ansi_12&"NO  "
             else
              setVar $yesno[$count1] ansi_11&"YES "
            end
             # echo ansi_3 "*DOOR : " ansi_12 $count1 ansi_14 " does " ansi_12 "NOT" ansi_14 " contains our figs"
             #end
      add $count1 1
end

:getinitial
setVar $count1 1
	send "sd"
	waitFor "Select"
	goto :denstriggers

:denstriggers
	setTextLineTrigger 1 :setsector "==>"
	setTextTrigger 2 :done "Command "
	pause

:setsector
	killtrigger 1
	killtrigger 2
        setVar $line CURRENTLINE 
          getWordPos $line $arrowpos "==>"
          getWordPos $line $anompos "Anom"
          getWordPos $line $warppos "Warps"
            cutText $line $initialdens ($arrowpos + 9) 10
            cutText $line $anom ($anompos + 6) 5
            cutText $line $warps ($warppos + 7) 3
        stripText $initialdens " "
        striptext $initialdens ","
        stripText $anom " "
        stripText $warps " "
        setVar $adjanom[$count1] $anom
          if ($adjanom[$count1] = "No")
            setVar $adjanom[$count1] ansi_11&"NO "
          elseif ($adjanom[$count1] = "Yes")
            setVar $adjanom[$count1] ansi_10&"YES"
          end
        setVar $adjwarpnum[$count1] $warps
	setVar $adjDens[$count1] $initialdens
          if ($adjDens[$count1] = 0)
             setVar $densreport[$count1] ANSI_11&"EMPTY"
          elseif ($adjdens[$count1] = 5)
             setVar $densreport[$count1] ANSI_11&"FIG"
          elseif ($adjdens[$count1] = 40)
             setVar $densreport[$count1] ANSI_14&"TRADER"
          elseif ($adjdens[$count1] = 45)
             setVar $densreport[$count1] ANSI_11&"PORT + "&ANSI_14&"TRADER"
          elseif ($adjdens[$count1] = 100)
             setVar $densreport[$count1] ANSI_11&"PORT"
          elseif ($adjdens[$count1] = 105)
             setVar $densreport[$count1] ANSI_11&"PORT + FIG"
          elseif ($adjdens[$count1] = 140)
             setVar $densreport[$count1] ANSI_11&"PORT + "&ANSI_14&"TRADER"
          elseif ($adjdens[$count1] = 145)
             setVar $densreport[$count1] ANSI_11&"PORT + "&ANSI_14&"TRADER + "&ANSI_11&"FIG"
          elseif ($adjdens[$count1] = 500)
             setVar $densreport[$count1] ANSI_12&"PLANET"
          elseif ($adjdens[$count1] = 505)
             setVar $densreport[$count1] ANSI_12&"PLANET + "&ANSI_11&"FIG"
          elseif ($adjdens[$count1] = 545)
             setVar $densreport[$count1] ANSI_12&"PLANET + "&ANSI_14&"TRADER + "&ANSI_11&"FIG"
          elseif ($adjdens[$count1] = 600)
             setVar $densreport[$count1] ANSI_12&"PLANET + "&ANSI_11&"PORT"
          elseif ($adjdens[$count1] = 605)
             setVar $densreport[$count1] ANSI_12&"PLANET + "&ANSI_11&"PORT + FIG"
          elseif ($adjdens[$count1] = 645)
             setVar $densreport[$count1] ANSI_12&"PLANET + "&ANSI_14&"TRADER + "&ANSI_11&"PORT + FIG"
          elseif ($adjdens[$count1] > 650)
             setVar $densreport[$count1] ANSI_10&"HIGH UNKNOWN DENSITY : "&ANSI_11&"CAUTION"
          else
             setVar $densreport[$count1] ANSI_13&"UNKNOWN / ODD DENSITY"
        END
	add $count1 1
	goto :denstriggers

:done
killalltriggers
setVar $count1 1
  while ($count1 <= $warpCount)
     echo ansi_15 "*[-" ansi_11 $count1 ansi_15 "-] :" ansi_15 " [F]: " $yesno[$count1] ansi_15 "[W]: " ansi_11 $adjwarpnum[$count1] ansi_15 " [A]: " $adjanom[$count1] ansi_15 " [D-R] : " $densreport[$count1] 
      add $count1 1
   end

:start
echo "*"
getconsoleinput $door SINGLEKEY
  if ($door = "q")  
   goto :firstclear
  elseif ($door = "s")
   send "sh"
    waitFor "Command"
     goto :firstclear
  elseif ($door > SECTOR.WARPCOUNT[$sector])
     echo ansi_11 "**out of bounds**"
       goto :gotosector
  end
setVar $Move_sector $adjSector[$door]
send "m" $Move_sector " * z a " $figs "* z n f 1 * c dd" 
setVar $figArray[$move_sector] 1
killalltriggers
goto :firstclear

