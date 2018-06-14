#dscan shot
#fires at trader densities

:vars
setVar $count 0
setVar $script "(photon) [custom d_scan]"

:activate
killalltriggers
echo "*activate ]*"
setTextOutTrigger activate_script :main "]"
pause

:main
killalltriggers
getWord CURRENTLINE $location 1
        if ($location <> "Command")
           echo "*need command prompt*"
           halt
        end

:start
gettext CURRENTLINE $sector "]:[" "] (?"

setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $warptotal $warpcount
setArray $arraydens $warpcount
#setArray $arraydens2 $warpcount
#send "'" $script " [d_scan] : active my TA*"

goto :eval

:eval
setVar $count 1
	while ($count <= $warpcount)
		setVar $warptotal[$count] SECTOR.WARPS[$sector][$count]
		add $count 1
	end
	goto :getinitial

:getinitial
        setVar $count 1
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
	setVar $arraydens[$count] $initialdens
	        if ($initialdens = 140) OR ($initialdens = 145) OR ($initialdens = 45) OR ($initialdens = 40) OR ($initialdens = 540) or ($initialdens = 545) OR ($initialdens = 640) or ($initialdens = 645)
	           goto :fire
	        end
	add $count 1
	goto :denstriggers

        :doneinitial
        killalltriggers
        echo "*no targets found*"
        goto :activate

        :fire
        killalltriggers
        send " c p y " $adjsector "* q "
        send "'" $script " : " $sector " -> " $adjsector "*"
             goto :warp_option

             :warp_option
             killalltriggers
             waitfor "(photon)"
             echo ansi_15 "***Warp In : " ansi_14 "(Y/N) : "
             getConsoleInput $choice SINGLEKEY
                             if ($choice = "y")
                                goto :warp_in
                             elseif ($choice = "n")
                                goto :activate
                             else
                                goto :activate
                             end

                             :warp_in
                             killalltriggers
                             send " m " $adjsector " * z a 999 * z n f z q z 1 * z q z c z q z c z q z o *"
                             goto :activate



