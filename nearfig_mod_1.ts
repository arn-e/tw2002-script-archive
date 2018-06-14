#nearfig

:settxt
	mergeText GAMENAME "-fig_grid" $filename
	mergeText $filename ".txt" $filename

:vars
setVar $count 0
setVar $script "(nearfig)"
setVar $scriptname "$playerName's nearfig"
setVar $version "0.1a"
lowerCase $script
lowerCase $scriptname
lowerCase $version
setVar $command "f"
setVar $breadth_mode "reverse"
setVar $range SECTORS
setArray $voided SECTORS
#setVar $voidcount 0
setVar $voidclear 0

:readmsg
echo ansi_12 "*reading list...*"

:readlist
add $count 1
read $filename $sector $count
if ($sector <> "EOF")
  setVar $figArray[$sector] 1
   goto :Readlist
else
   goto :choice
end

:choice
echo ansi_15 "*send over ss? (Y/N)*"
getConsoleInput $choice SINGLEKEY
if ($choice = "y")
  setVar $ss "Yes"
elseif ($choice = "n")
  setVar $ss "No"
end

:main
killalltriggers
echo ansi_15 "*To activate, press >*"
setTextOutTrigger goto :input ">"
setTextLineTrigger change_db :change_array "Deployed Fighters"
pause

:change_array
killalltriggers
getWord CURRENTLINE $test_change 1
        if ($test_change <> "Deployed")
           goto :main
        end
        
           :get_sector_number
                         getWord CURRENTLINE $dead_sector 5
                         stripText $dead_sector ":"
           :change_sector_array
           setVar $figArray[$dead_sector] 0
           goto :main

:input
killalltriggers
echo ansi_14 "*Enter desired Sector (commands : v, uv, va, de, p, fp)*"
getConsoleInput $input
isNumber $test $input
 if ($test = 1)
   goto :isnum
 else
   goto :readcomm
 end

:readcomm
  getWord $input $request 1
    if ($request = "v")
     # add $voidcount 1
      getWord $input $sector 2
      setVar $voided[$sector] 1
    elseif ($request = "uv")
     # subtract $voidcount 1
      getWord $input $sector 2
      setVar $voided[$sector] 0
    elseif ($request = "va")
      setVar $voidclear 1
        while ($voidclear <= SECTORS)
          setVar $voided[$voidclear] 0
          add $voidclear 1
        end 
    elseif ($request = "de")
       getWord $input $sector 2
       setVar $command "de"
       setVar $source $sector
       goSub :breadth_search
       goto :echo
    elseif ($request = "fde")
       getWord $input $sector 2
       setVar $command "fde"
       setVar $sorce $sector
       goSub :breadth_search
       goto :echo
    elseif ($request = "p")
      getWord $input $type 3
          if ($type = "bbs")
            setVar $class 1
          elseif ($type = "bsb")
            setVar $class 2
          elseif ($type = "sbb")
            setVar $class 3
          elseif ($type = "ssb")
            setVar $class 4
          elseif ($type = "sbs")
            setVar $class 5
          elseif ($type = "bss")
            setVar $class 6
          elseif ($type = "sss")
            setVar $class 7
          elseif ($type = "bbb")
            setVar $class 8
          else
            echo ansi_12 "*port type not recognized*"
            goto :main
          end
      setVar $command "p"
      getWord $input $sector 2
      setVar $source $sector
      goSub :breadth_search
      goto :echo
    elseif ($request = "fp")
      getWord $input $type 3
          if ($type = "bbs")
            setVar $class 1
          elseif ($type = "bsb")
            setVar $class 2
          elseif ($type = "sbb")
            setVar $class 3
          elseif ($type = "ssb")
            setVar $class 4
          elseif ($type = "sbs")
            setVar $class 5
          elseif ($type = "bss")
            setVar $class 6
          elseif ($type = "sss")
            setVar $class 7
          elseif ($type = "bbb")
            setVar $class 8
          else
            echo ansi_12 "*port type not recognized*"
            goto :main
          end
      setVar $command "fp"
      getWord $input $sector 2
      setVar $source $sector
      goSub :breadth_search
      goto :echo
    else
      echo ansi_15 "*command not recognized*"
    end

goto :main

:isnum
setVar $sector $input
 if ($sector > $range)
   echo "*out of range*"
   goto :main
 end
setVar $source $sector
setVar $command "f"
goSub :breadth_search

:echo
echo ansi_12 $return_data
  if ($ss = "Yes")
    send "'" $script " " $source $return_data "*"
  end
goto :main

#------ SUBROUTINES--------
# ----- SUB :breadth_search -----
:breadth_search
    # (var $source should be passed from main)
    # (var $breadth_mode should be passed from main)
    # (var $command should be passed from main)
    setVar $database[1] $source
    setVar $array_size 1
    setVar $array_pos 0
    setVar $num_sectors SECTORS
    setArray $checked $num_sectors
    setVar $checked[$source] 1
    setArray $path $num_sectors
    setVar $path[$source] ""
    setArray $distance $num_sectors
    setVar $distance[$source] 0

    :SectorLoop
        add $array_pos 1
        if ($array_pos > $array_size)
            setVar $return_data "Array Pos exceeds Array Size - ABNORMAL EXIT FROM SUBROUTINE"
            return
        end
        setVar $current_sector $database[$array_pos]
        setVar $warpnum 0
        :checkwarps
            add $warpnum 1
            if ($breadth_mode = "reverse")
                setVar $target SECTOR.WARPSIN[$current_sector][$warpnum]
            else
                setVar $target SECTOR.WARPS[$current_sector][$warpnum]
            end
            if ($checked[$target] = 0)
                setVar $checked[$target] 1
                add $array_size 1
                setVar $database[$array_size] $target

                if ($breadth_mode = "reverse")
                    setVar $path[$target] $target & " " & $path[$current_sector]
                else
                    setVar $path[$target] $target & " " & $path[$current_sector]
                end

                setVar $distance[$target] $distance[$current_sector]
                add $distance[$target] 1

                if ($distance[$target] > 20)
                    setVar $return_data "Distance over 20 hops, halting request"
                    return
                end

                if ($command = "f")
                    if ($figArray[$target] <> 0)
                       if ($voided[$target] <> 1)
                        setVar $return_data " : " & $target & " - " & $distance[$target] & " hop(s)  -  [ " & $path[$target] & " " & $source & " ] "
			return
                       end
                    end
                elseif ($command = "de")
                    if (SECTOR.WARPCOUNT[$target] = 1)          
                       if ($voided[$target] <> 1)            
                        setVar $return_data " : " & $target & " (DE) - " & $distance[$target] & " hop(s)  -  [ " & $path[$target] & " " & $source & " ] "
                        return
                       end
                    end
                elseif ($command = "fde")
                    if ($figArray[$target] = 1) AND (SECTOR.WARPCOUNT[$target] = 1)          
                       if ($voided[$target] <> 1)            
                        setVar $return_data " : " & $target & " (DE) - " & $distance[$target] & " hop(s)  -  [ " & $path[$target] & " " & $source & " ] "
                        return
                       end
                    end
                elseif ($command = "p")
                   # if ($figArray[$target] <> 0)
                    if (PORT.CLASS[$target] = $class)
                       if ($voided[$target] <> 1)
                        setVar $return_data " : " & $target & " (" & $type & ") - " & $distance[$target] & " hop(s)  -  [ " & $path[$target] & " " & $source & " ] "
			return
                       end
                    end
                elseif ($command = "fp")
                  if ($figArray[$target] <> 0)
                    if (PORT.CLASS[$target] = $class)
                       if ($voided[$target] <> 1)
                        setVar $return_data " : " & $target & " (" & $type & ") - " & $distance[$target] & " hop(s)  -  [ " & $path[$target] & " " & $source & " ] "
			return
                       end
                    end
                  end
                else
                    setVar $return_data "Unknown function"
                    return
                end

            end
            if ($array_size = $num_sectors)
                setVar $return_data "None Found"
                return
            end
            if ($breadth_mode = "reverse")
                if ($warpnum < SECTOR.WARPINCOUNT[$current_sector])
                    goto :checkwarps
                end
            else
                if ($warpnum < SECTOR.WARPCOUNT[$current_sector])
                    goto :checkwarps
                end
            end
            goto :SectorLoop
