#dscan phot

:vars
setVar $count 1
setVar $script "(foton'Z!)"
setvar $count1 1
setvar $count2 1
setVar $scancount 1

:main
getWord CURRENTLINE $location 1
if ($location <> "Command")
  echo ansi_12 "*not at command prompt*"
  halt
else
  goto :chk
end

:chk
send "/"
waitFor "Command"
send "d"
waitFor "Sector"
getWord CURRENTLINE $sector 3
setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $warptotal $warpcount
setArray $arraydens $warpcount
setArray $arraydens2 $warpcount
send "'" $script " [d_scan] : active my TA*"
goto :eval

:eval
	while ($count <= $warpcount)
		setVar $warptotal[$count] SECTOR.WARPS[$sector][$count]
		add $count 1
	end
	goto :getinitial

:getinitial
	send "sd"
	waitFor "Select"
	goto :denstriggers

:denstriggers
	setTextLineTrigger 1 :setsector "==>"
	setTextTrigger 2 :doneinitial "Command "
	pause

:setsector
	killtrigger 1
	killtrigger 2
	getWord CURRENTLINE $initialdens 4
        striptext $initialdens ","
	getWord CURRENTLINE $adjsector 2
	setVar $arraydens[$count1] $initialdens
	add $count1 1
	goto :denstriggers

:doneinitial
        add $scancount 1
          if ($scancount = 40)
             goto :sendss
           else
	killTrigger 1
	setVar $count1 0
	setVar $count2 0
          end

:scan
	send "sd"
waitFor "Select"
#	pause
	goto :denstriggers2


:denstriggers2
#	pause
	killAllTriggers
	setTextLineTrigger 4 :checksector "==>"
	setTextTrigger 5 :doneinitial "[TL=00"
	pause

:checksector
	killtrigger 4
	killtrigger 5
	add $count1 1
	add $count2 1
	getWord CURRENTLINE $dens 4
        striptext $dens ","
	getWord CURRENTLINE $adjsector1 2
	setVar $arraydens2[$count2] $dens
	if ($arraydens2[$count2] <> $arraydens[$count1])
   		goto :fire
	else
		goto :denstriggers2
	end


:fire
killalltriggers
echo ansi_11 "**density change noticed**"
send "c p y " $adjsector1 "* q "
send "'" $script " " $sector " -> " $adjsector1 "*"
halt

:sendss
killalltriggers
send "'" $script " [d_scan] : active my TA*"
setVar $scancount 1
goto :doneinitial
