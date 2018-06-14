#$playerName planet gridder for use with CK saveme

:settxt
	mergeText GAMENAME "-fig_grid" $filename
	mergeText $filename ".txt" $filename


:vars
setVar $count 0
setVar $count1 0
setVar $count2 1
setArray $figArray SECTORS
setVar $script "(Planet_Gridder)"
setVar $version "v. 2.00a"
lowerCase $script
lowerCase $version
setVar $spoof "OFF"
setVar $10fig "OFF"
setVar $figlay 1
setVar $figs 999
setVar $denslimit 500
setVar $awaves 1
setVar $modedisplay "single ship"
setVar $mode "1SHIP"
setVar $xportship 0

:readlist
add $count 1
read $filename $sector $count
if ($sector <> "EOF")
  setVar $figArray[$sector] 1
   goto :Readlist
else
   goto :main
end

:main
getWord CURRENTLINE $location 1
  if ($location <> "Citadel")
    echo ansi_12 "*not at cit prompt, halting*"
      halt
  end

goSub :getinfo
goSub :rvars

#echo ansi_9 "*single ship (1) with driver (2)*"
#getconsoleInput $modechoice SINGLEKEY
#   if ($modechoice = 1)
##      setVar $mode "1SHIP"
 ##     setVar $modedisplay "single ship"
 #  elseif ($modechoice = 2)
#      setVar $mode "DRIVER"
 #     setVar $modedisplay "w/ driver"
#   else 
#      halt
#   end

:ansimenu
echo ansi_14 "*-" ansi_13 "=" ansi_10 " $playerName's planet gridder v. " $version ansi_13 " =" ansi_14 "-*"
echo ansi_11 "*(" ansi_15 "1" ansi_11 ") " ansi_12 ": grid method   : " ansi_14 $modedisplay
echo ansi_11 "*(" ansi_15 "2" ansi_11 ") " ansi_12 ": attack wave   : " ansi_14 $figs
echo ansi_11 "*(" ansi_15 "3" ansi_11 ") " ansi_12 ": density limit : " ansi_14 $denslimit
echo ansi_11 "*(" ansi_15 "4" ansi_11 ") " ansi_12 ": # of a-waves  : " ansi_14 $awaves
echo ansi_11 "*(" ansi_15 "5" ansi_11 ") " ansi_12 ": density spoof : " ansi_14 $spoof
echo ansi_11 "*(" ansi_15 "6" ansi_11 ") " ansi_12 ": 10 figs in DE : " ansi_14 $10fig
echo ansi_11 "*(" ansi_15 "7" ansi_11 ") " ansi_12 ": xport ship    : " ansi_14 $xportship
echo ansi_11 "*(" ansi_15 "C" ansi_11 ") " ansi_12 ": continue / start*"
getConsoleInput $choice SINGLEKEY
if ($choice = 1)
   if ($modedisplay = "single ship")
      setVar $mode "DRIVER"
      setVar $modedisplay "w/ driver"
   elseif ($modedisplay = "w/ driver")
      setVar $mode "1SHIP"
      setVar $modedisplay "single ship"
   end
   echo "[2J"
   goto :ansimenu
elseif ($choice = 2)
   echo ansi_12 "*-how many figs per wave?*"
   getConsoleInput $figs
   echo "[2J"
   goto :ansimenu
elseif ($choice = 3)
   echo ansi_12 "*-enter density limit*"
   getConsoleInput $denslimit
   echo "[2J"
   goto :ansimenu
elseif ($choice = 4)
   echo ansi_12 "*-enter # of attack waves*"
   getConsoleInput $awaves
   echo "[2J"
   goto :ansimenu
elseif ($choice = 5)
   if ($spoof = "OFF")
      setVar $spoof "ON"
   elseif ($spoof = "ON")
      setVar $spoof "OFF"
   end
   echo "[2J"
   goto :ansimenu
elseif ($choice = 6)
   if ($10fig = "OFF")
     setVar $10fig "ON"
   elseif ($10fig = "ON")
     setVar $10fig "OFF"
   end
   echo "[2J"
   goto :ansimenu
elseif ($choice = 7) 
   echo ansi_12 "*-enter x-port ship number*"
   getconsoleinput $xportship
   echo "[2J"
   goto :ansimenu
elseif ($choice = "c")
   goto :msg
end

#echo ansi_9 "*how many figs to attack with?*"
#getConsoleInput $figs
#echo ansi_9 "*density limit?*"
#getConsoleInput $denslimit
#echo ansi_9 "*# of attack waves?*"
#getConsoleInput $awaves
#echo ansi_9 "*density spoofing? (1/2)"
#getconsoleInput $spoofchoice SINGLEKEY
# if ($spoofchoice = 1)
#   setVar $spoof "ON"
##   setVar $figlay 9
# end
#echo ansi_9 "*lay 10 figs in DE's? (1/2)*"
#getconsoleinput $10figchoice SINGLEKEY
#  if ($10figchoice = 1)
#     setVar $10fig "ON"
#  end


:msg
send "'*" $script " " $version "  : //D_Limit: " $denslimit " D_Spoof: " $spoof " A_waves: " $awaves "//"
send "*" $script " grid mode : " $modedisplay "**"

:start
killalltriggers
goSub :rvars
echo ansi_12 "*PLANET SCANNER RECOMMENDED"
echo ansi_11 "*script paused - press ] to activate*"
setTextOutTrigger grid :grid "]"
setTextTrigger halt :halt "has just materialized"
pause

:halt
killalltriggers
send "'*" $script " : planet warp-in detected - script paused"
send "*" $script " : to un-pause send 'walker_reload' over sub **"

:halttrig
killalltriggers
setTextTrigger unpause :unpause "walker_reload"
pause

:unpause
killalltriggers
getWord CURRENTLINE $trigtest 1
  if ($trigtest = "S:")
    goto :halttrig
  elseif ($trigtest = "R")
    setVar $reactivated "corpie"
  elseif ($trigtest = "'walker_reload")
    setVar $reactivated "user"
  end
send "'" $script " : un-paused by " $reactivated "*"
goto :start

:grid
killalltriggers
send "/"
waitFor "Sect"
setVar $line CURRENTLINE
getWordPos $line $sectpos "Sect"
cutText $line $sector ($sectpos + 4) 6
stripText $sector " "
stripText $sector "t"
stripText $sector #179
stripText $sector "T"
stripText $sector "u"
stripText $sector "r"



:adjinfo
setVar $warpCount SECTOR.WARPCOUNT[$sector] 
setArray $adjDens $warpCount
setArray $adjSector $warpCount
setArray $yesno $warpcount
setArray $densreport $warpcount
setArray $adjanom $warpcount
setArray $adjwarpnum $warpcount
setVar $count 1

while ($count <= $warpCount)
      setVar $adjSector[$count] SECTOR.WARPS[$sector][$count]
          setVar $chkgrid $adjSector[$count]
            if ($figArray[$chkgrid] = 0)
              setVar $yesno[$count] ansi_12&"NO  "
             else
              setVar $yesno[$count] ansi_11&"YES "
            end
      add $count 1 
end

:1scan
	setVar $count1 1
     if ($spoof = "ON")
	send "q m n l 12 * q f 1 * c d sd"
     else
        send "q q sd"
     end
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

if ($spoof = "ON")
  send " f 9 * c d l " $planet " * c "
else
  send " l " $planet " * c "
end

waitFor "Citadel"

setVar $count1 1
  while ($count1 <= $warpCount)
     echo ansi_15 "*[-" ansi_11 $count1 ansi_15 "-] :" ansi_15 " [F]: " $yesno[$count1] ansi_15 "[W]: " ansi_11 $adjwarpnum[$count1] ansi_15 " [A]: " $adjanom[$count1] ansi_15 " [D-R] : " $densreport[$count1] 
      add $count1 1
   end

:input
killalltriggers
echo "*"
getconsoleinput $door SINGLEKEY
  if ($door = "q")  
   goto :start
  elseif ($door = "s")
   goSub :planetscan
     goto :input
  elseif ($door > SECTOR.WARPCOUNT[$sector])
     echo ansi_11 "**out of bounds**"
       goto :input 
  end

setVar $Move_sector $adjSector[$door]

if ($figArray[$move_sector] = 1)
   echo "*sector should be figged - testing...*"
     send "p" $move_sector "*"
      setTextTrigger nofig :nofigdown "You do not have any fighters"
      setTextTrigger fig :figdown "Locating beam pinpointed,"
      pause

:nofigdown
killalltriggers
goto :2scan

:figdown
killalltriggers
send "ys"
send "'" $script " : pwarped : " $move_sector "*"
goto :start

end


:2scan
killalltriggers
if ($mode = "1SHIP")
    
  :testdistance
  getDistance $testdist $move_sector $sector

    if ($testdist > 1)
       echo ansi_14 "*ERROR : " ansi_11 " sector " $move_sector " is a one-way warp, resetting...*"
       goto :start
    end

end

if ($mode = "DRIVER")
  send " c u n q "
  waitFor "Should TransWarp drive"
end

send " q q s d"
waitFor $Move_sector
setVar $line CURRENTLINE
getWordPos $line $arrowpos "==>"
cutText $line $2dens ($arrowpos + 9) 10
        stripText $2dens " "
        striptext $2dens ","
 if ($2dens <> $adjDens[$door])
   send "l " $planet " * c "
     waitFor "Citadel"
   send "'" $script " : density CHANGE S:(" $move_sector ") : " $adjDens[$door] " to " $2dens "*"
     goto :input
 elseif ($2dens > $denslimit)
   send "l " $planet " * c "
     waitFor "Citadel"
   send "'" $script " : HIGH density S:(" $move_sector ") : " $2dens "*"
      goto :input
 else
    send "l " $planet " * "
end

:callsaveme
#ONLY NECESSARY FOR COMPABILITY WITH SE SCRIPTS
#getlength $move_sector $length
#if ($length = 2)
#  send "'000" $move_sector "=saveme*"
#elseif ($length = 3)
#   send "'00" $move_sector "=saveme*"
#elseif ($length = 4)
#   send "'0" $move_sector "=saveme*"
#elseif ($length = 5)
#   send "'" $move_sector "=saveme*"
#end

if ($mode = "DRIVER")
  send "'" $move_Sector "=saveme*"
end

#if ($mode = "1SHIP")
#  send "'" $script " : gridding : " $move_sector "*"
#end
:pickfigs
if ($spoof = "ON")
   send " q f 1 * c d l " $planet " * "
else
  goto :warp
end

:warp
killalltriggers
send " q "
if ($awaves > 1)
  send "m" $move_sector " * "
    while ($count2 <= $awaves)
      send " z a " $figs " * z n "
      add $count2 1
    end
  send " f 1 * c d"
goto :setarray

else
  send " m" $Move_sector " * z a " $figs "* z n f " $figlay " * c d " 
end

:setarray      
setVar $figArray[$move_sector] 1

if ($mode = "DRIVER")
  goto :land
end

:1ship
if ($mode = "1SHIP")
send " < y z q z y z q z * l " $planet " * c  *  *  "

setTextTrigger 1s :landed "Citadel"
setTextTrigger 1ig :interdictor "An Interdictor Generator"
setTextTrigger 1noplanet :interdictor "That planet is not"
setTextTrigger 1noplanet2 :interdictor "There isn't a planet"
pause
end

:interdictor
killalltriggers
 if ($xportship <> 0)
   send "x " $xportship "*"
    setTextTrigger xportyes :xported "Security code accepted,"
    setTextTrigger noship :auto "That is not an available ship."
    setTextTrigger xportno :auto "only has a transport range"
    pause
 end
:auto
killalltriggers
send " * "
send "x"
setTextLineTrigger getrange :getrange "has a transport range"
setTextLineTrigger getship :getship "Corp"
setTextLineTrigger done :donecheck "Exit Transporter"
setTextTrigger noxport :noxport "You do not own any"
pause

:noxport
killalltriggers
send "'" $script " : evac xport failed (no xport ship)*"
send "'" $move_sector "=saveme*"
halt

:getrange 
killalltriggers
setVar $line CURRENTLINE
getText $line $range "range of " " hops"

:triggers
killalltriggers
setTextLineTrigger getship :getship "Corp"
setTextLineTrigger done :donecheck "Exit Transporter"
pause

:getship
killalltriggers
setVar $line CURRENTLINE
getWord $line $xportship 1
getWordPos $line $corppos "Corp"
cuttext $line $distance ($corppos + 24) 3
stripText $distance " "
if ($distance <= $range)
   send $xportship "*"
     setTextTrigger xportyes :xported "Security code accepted,"
     setTextTrigger xportno :misscalc "only has a transport range"
     pause
end

:triggers2
setTextLineTrigger getship :getship "Corp"
setTextLineTrigger done :donecheck "Exit Transporter"
pause

:donecheck
killalltriggers
send "q"
send "'" $script " : evac export failed - may be screwed*"
send "'" $move_sector "=saveme*"
halt

:xported
killalltriggers
send "'" $script " : o-shit x-port-ed to ship " $xportship "*"
send "q"
halt

:misscalc
killalltriggers
send "q" 
goto :donecheck

:land
    send " l " $planet "* z n "
    send " l " $planet "* z n "
    send " l " $planet "* z n "    
    send " l " $planet "* z n "   	
    send " l " $planet "* z n "  
     setTextTrigger landed :landed "Planet command (?"
     setTextTrigger notlanded :notlanded "There isn't a planet"
     pause

:landed
killalltriggers

if ($mode = "DRIVER")
  send " q *  *  * c c u y q "
elseif ($mode = "1SHIP")
    send " p " $move_sector " * ys"
    send " q m * * * c "
end

if ($10fig = "ON")
   if (SECTOR.WARPINCOUNT[$move_sector] = 1)
       send " q q f 10 * c d l " $planet " * m *  *  *  c  "
   end
end

if ($mode = "DRIVER")
send "'" $script " : gridder landed safely!*"
goto :start

elseif ($mode = "1SHIP")
send "'" $script " : pwarped : " $move_sector "*"
goto :start

end

:notlanded
killalltriggers
send "'" $script " : no planet in sector, i may be screwed*"
halt


:getinfo
    send "/"
    waitfor "Ship"
    getword CURRENTLINE $ship 3
    send "qd"
    waitfor "Planet #" 	
    getword CURRENTLINE $planet 2
    getword CURRENTLINE $sector 5
    striptext $planet "#"
    striptext $sector ":"
    send "c"
    waitfor "Citadel command (?=help)"
    return

:rvars
setVar $count 0
setVar $count1 0
return

:planetscan
echo ansi_10 "*1. D-Scan 2. Holo*"
getConsoleInput $scanpref SINGLEKEY
if ($scanpref = 1)
  send "'" $script " : executing quick planet macro...*"
   waitFor "Citadel"
  send "q q sdl " $planet " * c "
   waitFor "Citadel"
elseif ($scanpref = 2)
  send "'" $script " : executing quick planet macro...*"
   waitFor "Citadel"
  send "q q shl " $planet " * c "
    waitFor "Citadel"
else 
  goto :planetscan
end
return	
