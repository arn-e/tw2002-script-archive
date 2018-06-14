:vars
setVar $scriptname "(fIg smoker)"
setVar $count 0
setVar $count1 0
setVar $count2 0
setVar $count3 0

:settrig
killalltriggers
setVar $count 0
setVar $count1 0
setVar $count2 0
getinput $figattack "how many figs to attack with ?"
getinput $scan "scan type? ( 1 - none :: 2 - density :: 3 -holo )"
         if ($scan = 1)
            setVar $scan_type ""
         elseif ($scan = 2)
            setVar $scan_type " sd"
         elseif ($scan = 3)
            setVar $scan_type " sh"
         else
            setVar $scan_type ""
         end

:trigger_start
killalltriggers
setVar $count 0
setVar $count1 0
setVar $count2 0
echo ansi_15 "*to trigger - press ]*"
setTextOutTrigger setout :main "]"
pause

:main
getWord CURRENTLINE $location 1
  if ($location <> "Command")
    echo ansi_12 "**not at command prompt**"
       halt
   end
setVar $line CURRENTLINE 
getText $line $sector "]:[" "] (?"

:choice
#echo ansi_14 "*How to blast? (1- CF plot, 2- TWX DB plot)*"
#getconsoleinput $choice SINGLEKEY
#  if ($choice = "1")
    goto :chart
#  elseif ($choice = "2")
#    goto :start 
#
#  end

:chart
getInput $dest "Enter Destination"

:plot
killalltriggers
setVar $currsect $sector
send "cf" $currsect "*" $dest "*"

:triggers
killalltriggers
setTextLineTrigger chk :length "The shortest path"
pause

:length
killalltriggers
setVar $line CURRENTLINE
getText $line $length "ath (" " hops"
setArray $plength $length

:triggers1
killalltriggers
setTextLineTrigger 1 :course ">"
pause

:course
killalltriggers
setVar $line CURRENTLINE
getWord $line $chk 1
  if ($chk <> $currsect)
    setTextLineTrigger 2 :course
      pause
  end
stripText $line ">"
stripText $line "("
stripText $line ")"
setVar $count 1
setVar $count1 1

:gethops
  if ($count <= $length)
    add $count 1
      getWord $line $hop $count
       if ($hop <> 0)
          setVar $plength[$count1] $hop
          add $count1 1
          goto :gethops 
       else
          subtract $count 2
          goto :2ndline
  end
end

:2ndline
setVar $count2 1
killalltriggers
setTextLineTrigger chk :chkline 
pause

:chkline
setVar $line CURRENTLINE
getWord $line $test 1
  if ($test <> "0")
    stripText $line ">"
    stripText $line "("
    stripText $line ")"
    setVar $newlength ($length - $count)
  else
    goto :donecalc
end


:gethops2
     if ($count2 <= $newlength)
       getWord $line $hop $count2
         if ($hop = 0)
           setVar $count2 ($count2 - 1)
           goto :3rdline
         end
         setVar $plength[$count1] $hop
          add $count1 1
          add $count2 1
           goto :gethops2
     end

:3rdline
setVar $count3 1
killalltriggers
setTextLineTrigger chk1 :chkline1 
pause

:chkline1
setVar $line CURRENTLINE
getWord $line $test 1
  if ($test <> "0")
    stripText $line ">"
    stripText $line "("
    stripText $line ")"
    setVar $newlength1 ($newlength - $count2)
  else
    goto :donecalc
end

:gethops3		
     if ($count3 <= $newlength1)
       getWord $line $hop $count3
         setVar $plength[$count1] $hop
          add $count1 1
          add $count3 1
           goto :gethops3
     end

:donecalc
send "q"
setVar $count 0
setVar $count1 0
send "'" $scriptname " " $sector " -> " $dest "  [" $length " hops]*"

:blast
killalltriggers
if ($count < $length)
  add $count 1
    if ($plength[$count] = STARDOCK) OR ($plength[$count] < 11)
      send "m" $plength[$count] " * z n "
      setDelayTrigger go_blast1 :blast 100
      pause
    else
      send "m" $plength[$count] " * z a " $figattack " * z n f z q z 1 * z q z c z q z d * " $scan_type
      setDelayTrigger go_blast :blast 100
      pause
   end
end

:done
if ($dest = STARDOCK) 
  send "p s"
end
goto :trigger_start


:start
getInput $dest "Enter Destination"
setVar $currsect $sector
getCourse $path $currsect $dest
if ($path = 1)
  goto :single
elseif ($path < 0)
   echo ansi_12 "*no ZTM data - halting*"
     halt
else
  goto :prepath
end

:single
send "m" $dest "* z a 999* z n f 1 * c d"
echo ansi_15 "*path blasted*"
  halt

:prepath
send "'(ph00n-m0wer) v. 1.01a | charging : " $sector " to " $dest " : " $path " hops*"

:path
if ($count < $path)
  add $count 1
    if ($path[$count] = STARDOCK) OR ($path[$count] < 11)
      send "m" $path[$count] " * z n "
       goto :path
    else
      send "m" $path[$count] " * z a 999* z n f 1 * c d "
       goto :path
  end
end

if ($dest = STARDOCK)
   send "m" $dest " * p s"
elseif ($dest < 11)
   send "m" $dest " * z n"
else
   send "m" $dest " * z a 999 * z n f 5* c d"
end

:done
goto :settrig
