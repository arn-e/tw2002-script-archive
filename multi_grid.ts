#UNLIM GAME GRIDDER


:vars
setVar $scriptname "(fIg smoker)"
setVar $count 0
setVar $count1 0
setVar $count2 0
setVar $count3 0
setVar $dest_count 11
setVar $path_count 1
setVar $sector_count SECTORS
setArray $fig_grid SECTORS


:create_txt
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $count 1

:read_txt
read $fig_file $sector $count

if ($sector = "EOF")
   goto :done_read_txt
end

setVar $fig_grid[$sector] 1
add $count 1
goto :read_txt

:done_read_txt
#SETTING CUSTOM AVOIDS
#setVar $fig_grid[730] 1
#setVar $fig_grid[6645] 1
#setVar $fig_grid[8632] 1
#setVar $fig_grid[13497] 1
#setVar $fig_grid[15206] 1
#setVar $fig_grid[148] 1
#setVar $count 1
goto :settrig

:settrig
killalltriggers
setVar $count 0
setVar $count1 0
setVar $count2 0
#echo ansi_15 "*to trigger - press >*"
#setTextOutTrigger setout :main ">"
#pause

:main
send "/"
setTextLineTrigger get_sect :get_sect "Sect"
pause

:get_sect
killalltriggers
getWord CURRENTLINE $sector 2
stripText $sector "Turns"
stripText $sector #179
goto :get_dest

:get_dest
killalltriggers
if ($sector = $dest_count)
   add $dest_count 1
   goto :get_dest
end
if ($fig_grid[$dest_count] = 0)
   setVar $dest $dest_count
   goto :plot
else
   add $dest_count 1
   goto :get_dest
end


:plot
killalltriggers
setVar $currsect $sector
send "cf" $currsect "*" $dest "*"

:triggers
killalltriggers
setTextLineTrigger chk :length "The shortest path"
setTextLineTrigger error :no_path "No route within 45"
pause

:no_path
killalltriggers
send "nq"
add $dest_count 1
goto :settrig

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
     
:4thline
setVar $count4 1
killalltriggers
setTextLineTrigger chk2 :chkline2
pause

:chkline2
setVar $line CURRENTLINE
getWord $line $test 1
  if ($test <> "0")
    stripText $line ">"
    stripText $line "("
    stripText $line ")"
    setVar $newlength2 ($newlength1 - $count3)
  else
    goto :donecalc
end

:gethops4
     if ($count4 <= $newlength2)
       getWord $line $hop $count4
         setVar $plength[$count1] $hop
          add $count1 1
          add $count4 1
           goto :gethops4
     end

:donecalc
send "q"
setVar $count 0
setVar $count1 0
#send "'" $scriptname " : " $sector " -> " $dest "  [" $length " hops]*"

:blast
killalltriggers
if ($count < $length)
  add $count 1
    if ($plength[$count] = STARDOCK) OR ($plength[$count] < 11)
      send "m" $plength[$count] " * z n "
      setVar $sector_var $plength[$count]
      if ($sector_var <> 0)
         setVar $fig_grid[$sector_var] 1
      end
      setDelayTrigger time_blast :blast 100
      pause
#        goto :blast
    else
      send "m" $plength[$count] " * z a 999 * z n f 1 * c d h z 2 z n z 1 n * z c z n "
      setVar $sector_var $plength[$count]
      if ($sector_var <> 0)
         setVar $fig_grid[$sector_var] 1
      end
      setDelayTrigger time_blast :blast 100
      pause
#        goto :blast
   end
end

:done
killalltriggers
add $path_count 1
send "'" $scriptname " path complete:: [" $path_count "]*"
setTextTrigger path_complete :path_complete " path complete::"
pause

:path_complete
killalltriggers
add $dest_count 1
goto :settrig




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
