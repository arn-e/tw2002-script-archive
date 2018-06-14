#pdrop


:settxt
	mergeText GAMENAME "-fig_grid" $filename
	mergeText $filename ".txt" $filename

:vars
setVar $count 0
setVar $attckcount 0
setVar $script "(Fly Swatter)"
setvar $scriptname "$playerName's pdrop"
setVar $version "v. 1.00a"
setVar $mode "direct"
setVar $multi "No"
setVar $attck "No"
setVar $wave 0
setVar $perwave 0
setVar $delay "No"
setVar $ms 0
setVar $breadth_mode "forward"
setVar $command "f"

:main 
killalltriggers
getWord CURRENTLINE $location 1
  if ($location <> "Citadel")
     echo ansi_10 "*must start at cit prompt*"
     halt
  end

:readlist
add $count 1
read $filename $sector $count
if ($sector <> "EOF")
  setVar $figArray[$sector] 1
   goto :Readlist
else
   goto :info
end

:info
goSub :getinfo
goSub :getinfo1
	if ($citlvl < 4)
           echo ansi_15 "*Need at least a Lvl 4 to run*"
           halt
        end


getLength $scriptname $max
getLength $version $len
goSub :checkmax

:ansimenu
killalltriggers
echo "[2J"

echo ANSI_6 "**-" ansi_2 "=" ansi_9 "(" 
setVar $text $scriptname
goSub :addspc
setVar $scriptdisplay $text
echo ansi_15 $scriptdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-*"

echo ANSI_6 "-" ansi_2 "=" ansi_9 "(" 
setVar $text $version
goSub :addspc
setvar $verdisplay $text
echo ansi_15 $verdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-**"

echo ansi_14 "1." ansi_15 " pdrop mode    : " ansi_9 "[" ansi_6 $mode ansi_9 "]*"
echo ansi_14 "2." ansi_15 " multi         : " ansi_9 "[" ansi_6 $multi ansi_9 "]*"
echo ansi_14 "3." ansi_15 " auto attack   : " ansi_9 "[" ansi_6 $attck ansi_9 "]*"
echo ansi_14 "4." ansi_15 " attack waves  : " ansi_9 "[" ansi_6 $wave ansi_9 "]*"
echo ansi_14 "5." ansi_15 " figs per wave : " ansi_9 "[" ansi_6 $perwave ansi_9 "]*"
echo ansi_14 "6." ansi_15 " delay         : " ansi_9 "[" ansi_6 $delay ansi_9 "]*"
echo ansi_14 "7." ansi_15 " delay MS      : " ansi_9 "[" ansi_6 $ms ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY

if ($choice = 1)
  if ($mode = "direct")
     setVar $mode "adjacent"
 	if ($delay = "Yes") 
          setVar $delay "No"
          setVar $ms 0
        end
  elseif ($mode = "adjacent")
     setVar $mode "adj prelock"
 	if ($delay = "Yes") 
          setVar $delay "No"
	  setVar $ms 0
        end
  elseif ($mode = "adj prelock")
     setVar $mode "2 down"
 	if ($delay = "Yes") 
          setVar $delay "No"
	  setVar $ms 0
        end
  elseif ($mode = "2 down")
     setVar $mode "2 down prelock"
 	if ($delay = "Yes") 
          setVar $delay "No"
	  setVar $ms 0
        end
  elseif ($mode = "2 down prelock")
     setVar $mode "DE"
       if ($delay = "Yes") 
          setVar $delay "No"
	  setVar $ms 0
       end
  elseif ($mode = "DE")
      setVar $mode "direct"
          if ($delay = "Yes")
             setVar $delay "No"
             setVar $ms 0
          end
  end

echo "[2J"
goto :ansimenu

elseif ($choice = 2)
  if ($multi = "No")
     setVar $multi "Yes"
  elseif ($multi = "Yes")
     setVar $multi "No"
  end

echo "[2J"
goto :ansimenu

elseif ($choice = 3)
  if ($attck = "No")
     setVar $attck "Yes"
  elseif ($attck = "Yes")
     setVar $attck "No" 
     setVar $wave 0
     setVar $perwave 0
  end

echo "[2J"
goto :ansimenu

elseif ($choice = 4)
if ($attck = "No")
  echo "[2J"
  goto :ansimenu
end

echo ansi_15 "*Enter desired # of WAVES to launch :*"
getConsoleInput $wave

echo "[2J"
goto :ansimenu

elseif ($choice = 5)

if ($attck = "No")
  echo "[2J"
  goto :ansimenu
end

echo ansi_15 "*Enter desired # of FIGS per wave :*"
getConsoleInput $perwave

  echo "[2J"
  goto :ansimenu

elseif ($choice = 6)
    if ($mode = "adj prelock") OR ($mode = "2 down prelock")
	if ($delay = "No")
           setVar $delay "Yes"
        elseif ($delay = "Yes")
           setVar $delay "No"
        end
     end
  echo "[2J"
  goto :ansimenu

elseif ($choice = 7)
    if ($delay = "Yes")
       echo ansi_15 "*Enter desired delay (in MS) :*"
       getConsoleInput $ms
    end

  echo "[2J"
  goto :ansimenu

elseif ($choice = "c")
    goto :chkchoices

end

:chkchoices
if ($attck = "Yes")
   if ($wave = 0)
     echo ansi_12 "*# of attack waves not specified*"
     goto :ansimenu
   end
   if ($perwave = 0)
     echo ansi_12 "*# of figs per wave not specified*"
     goto :ansimenu
   end
end
if ($delay = "Yes")
   if ($ms = 0)
     echo ansi_12 "*# of milliseconds of delay not specified*"
     goto :ansimenu
   end
end
goto :start

:start
killalltriggers
send "'" $script " : Drop [" $mode "] / Attack [" $attck "] / Delay [" $delay "] / Multi [" $multi "]*"
 
:triggers
killalltriggers
echo ansi_12 "*mode : " $mode "*"
setTextLineTrigger 1 :fighit "Deployed Fighters"
setDelayTrigger msg :start 300000
pause

:fighit
killalltriggers
setVar $line CURRENTLINE
getWord $line $test 1
 if ($test <> "Deployed")
   goto :triggers
 end
getWord $line $target 5
stripText $target ":"
setVar $figArray[$target] 0
setVar $count 0

:1
killalltriggers

if ($mode = "direct")
     send "p" $target " *y"
     setTextTrigger warped :warped "Planet is now in"
     setTextTrigger nolock :nolock "You do not have any fighters"
     pause
end

if ($mode = "adjacent")
    setVar $warpcount SECTOR.WARPCOUNT[$target]
    setArray $adjtar $warpcount
    setArray $adjfig $warpcount
    setVar $count 1
    setVar $howMany 0
        while ($count <= $warpcount)
           setVar $adjtar[$count] SECTOR.WARPS[$target][$count]
	   setVar $adjtarget $adjtar[$count]
           if ($figArray[$adjtarget] = 1)
               goto :adjwarp
           end
           add $count 1
        end

goto :triggers
end

if ($mode = "adj prelock")

   :loop
    setVar $warpcount SECTOR.WARPCOUNT[$target]
    setArray $adjtar $warpcount
    setArray $adjfig $warpcount
    setVar $count 1
    setVar $howMany 0
        while ($count <= $warpcount)
           setVar $adjtar[$count] SECTOR.WARPS[$target][$count]
	   setVar $adjtarget $adjtar[$count]
           if ($figArray[$adjtarget] = 1)
               setVar $adjfig[$count] "Yes"
               add $howMany 1
           else
               setVar $adjfig[$count] "No"
           end
           add $count 1
        end
   
    :drop
    if ($howMany = 0)
	goto :triggers
    end
    if ($howMany <= 2)
    setVar $count 1
       while ($count <= $warpcount)
          if ($adjfig[$count] = "Yes")
             setVar $adjtarget $adjtar[$count]
             if ($mode = "adjacent")
               goto :adjwarp
             elseif ($mode = "adj prelock")
               goto :adjprelock
             end
          end
          add $count 1
       end
    end

    if ($howmany > 2)
    setArray $figgedadj $howMany
    setVar $count 1
    setVar $count1 1
       while ($count <= $warpcount)
          if ($adjfig[$count] = "Yes")
           # echo ansi_11 "*" $adjtar[$count] "  "
           # echo ansi_11 $count "*"
            setVar $figgedadj[$count1] $adjtar[$count]
            add $count1 1
          end
          add $count 1
       end
    
    getRnd $goto 1 $howMany
   # echo ansi_11 "******" $goto "******"
    setVar $adjtarget $figgedadj[$goto]
   # echo ansi_12 "**" $goto "*"
   # pause
     if ($mode = "adjacent")
       goto :adjwarp
     elseif ($mode = "adj prelock")
       goto :adjprelock
     end

    end
   # echo ansi_12 "**" $mode "**"
   # pause

    :adjwarp
    killalltriggers
    setVar $target $adjtarget
    send "p" $target " *y"
    setTextTrigger warped :warped "Planet is now in"
    setTextTrigger nolock :nolock "You do not have any fighters"
    pause
    
    :adjprelock
    killalltriggers
    setVar $target $adjtarget
    send "p" $target "*"
    setTextTrigger locked :locked "All Systems Ready"
    setTextTrigger nolock :nolock "You do not have any fighters"
    pause

:locked
killalltriggers
#setTextTrigger react :react "Report Sector " & $target & ":"
if ($delay = "Yes")
  setDelayTrigger delaywarp :engage $ms
end
setTextTrigger hitlock :hitlock "Deployed Fighters"
pause

:hitlock
killalltriggers
setVar $line CURRENTLINE
getWord $line $test 1
 if ($test <> "Deployed")
   goto :triggers
 end
getWord $line $testit 5
stripText $testit ":"
setVar $figArray[$testit] 0
setVar $count 0

if ($testit = $target)
#:react
#killalltriggers
:engage
   send "y"
   setTextTrigger warped :warped "Planetary TransWarp Drive"
   setTextTrigger nolock :nolock "You do not have any fighters"
   pause
end

if ($testit <> $target)
   goto :locked
end

end
#END ADJ#

#BEGIN 2-DOWN#

if ($mode = "2 down") OR ($mode = "2 down prelock")
    setVar $source $target 
    setVar $command "f"
    goSub :breadth_search
  if ($return_data = "None Found")
    goto :triggers
  end
    setVar $adjtarget $returntarget
  if ($mode = "2 down") 
     goto :adjwarp
  elseif ($mode = "2 down prelock")
     goto :adjprelock
  end
end

#END 2-DOWN#
#BEGIN DE

if ($mode = "DE")
    setVar $source $target
    setVar $command "de"
    goSub :breadth_search
  if ($return_data = "None Found")
    goto :triggers
  end
  if ($returndist > 4)
    goto :triggers
  end
    setVar $adjtarget $returntarget
    goto :adjwarp
end

#END DE

:warped
killalltriggers
setVar $sector $target
if ($attck = "Yes")
  # send "s"
#	setTextTrigger sectchk :sectchk "Citadel command (?="
     #   pause
  goto :sectchk
else
  goto :multi
end

# CHECKS SECTOR FOR TRADERS - MOVING INTO ATTACKING SUBROUTINE FROM ALEXATTCK.TS

:sectchk
killalltriggers
goSub :alexattck


if ($returndata = "waves fired")
  goto :multi
elseif ($returndata = "sector empty")
  goto :multi
elseif ($returndata = "done shooting")
  goto :multi
elseif ($returndata = "abnormal exit")
  goto :multi
elseif ($returndata = "only corpie")
  goto :multi
end

:multi
killalltriggers

if ($multi = "No")
   send "'" $script " : successful drop to sector " $sector " - shutting down*"
halt
end

send "'" $script " : successful drop to sector " $sector " - resetting triggers*"

goto :triggers

:nolock
killalltriggers
setVar $figarray[$target] 0
goto :triggers

   





#-------------------------==== SUBROUTINES ====------------------------------------------------------------#


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
    waitfor "Planet has a level"
    getword CURRENTLINE $citlvl 5
    send "c"
    waitfor "Citadel command (?=help)"
    return

:addspc
getLength $text $len
if ($len < $max)
	setVar $spaces ($max - $len)
	if ($spaces = 1)
		setVar $text " " & $text
	else
		setVar $spaces ($spaces / 2)
		setVar $cnt 0
		:addfront
		if ($cnt < $spaces)
			add $cnt 1
			setVar $text " " & $text
			goto :addfront
		end
		setVar $cnt 0
		:addback
		if ($cnt < $spaces)
			add $cnt 1
			setVar $text $text & " " 
			goto :addback
		end
		getLength $text $len
		if ($len < $max)
			setVar $text " " & $text
		end
	end
end
return

:checkMax
if ($len > $max)
	setVar $max $len
end
return

:getinfo1
    send "i"
    waitFor "Corp"
    getWord CURRENTLINE $my_corporation 3
    striptext $my_corporation ","
return

#ATTACKING SUBROUTINE-----------------------------------------------------
#vars $wave and $perwave must be imported from MAIN

:alexattck
setVar $hits 0
     send "s* "

      :sectortriggers
      setTextLineTrigger getsect :getsect "Sector  :"
      setTextTrigger update :update "Citadel"
      pause
	
       :getsect
        killalltriggers
        getWord CURRENTLINE $sector 3
        goto :sectortriggers

	:update
	 killalltriggers
	 

if (sector.tradercount[$sector] = 0)
#   send "'" $script " : " $version " : sector empty ||done||*"
     setVar $returndata "sector empty"
#echo ANSI_12 "***" sector.tradercount[$sector] "***"
#echo ansi_12 "*" $sector "*"
     return
end

setVar $enters 0
setVar $corpie 0

:trader_loop
killAllTriggers
setTextLineTrigger traders :traders ", w/"
setTextTrigger 1 :done "Ships   :"
setTextTrigger 2 :done "Citadel"	
pause

:traders
killTrigger 1
killTrigger 2
getText CURRENTLINE $other_corporation "[" "]"
getWord CURRENTLINE $federal 1

if ($federal = "Federals:")
     setVar $enters ($enters + 1)
     goto :trader_loop
end

if ($other_corporation = $my_corporation)
     setVar $enters ($enters + 1)
     setVar $corpie ($corpie + 1)
     goto :trader_loop
else
     setVar $enters ($enters + sector.shipcount[$sector])
end

if ($corpie = sector.tradercount[$sector])
     setVar $returndata "only corpie"
     return
end

if ($location = "Citadel") 
     send "qq"
end

setVar $attack_enters 1
while ($hits < $wave)
        send "a"
        while ($attack_enters <= $enters)
                send "*"
                setVar $attack_enters ($attack_enters + 1)  
        end
        send "y " $perwave " * "
        setVar $hits ($hits + 1)
        setVar $attack_enters 1
end

if ($location = "Citadel") 
     send "l " $planet " * m * * * c "
end
#send "'" $script " : " $version " : waves fired ||done||*"
setVar $returndata "waves fired"
#killalltriggers
return

:done
#killalltriggers
echo "**wow this triggered...*"
setVar $returndata "abnormal exit"
return

# END ATTACKING SUBROUTINE
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
                      if ($distance[$target] > 1)
                        setVar $return_data "Nearest Fig is " & $distance[$target] & " hops  -  << " & $path[$target] & " " & $source & " >> "
                        setVar $returntarget $target
			return
		      end
                    end
                elseif ($command = "de")
                    if ($figArray[$target] = 1) AND (SECTOR.WARPCOUNT[$target] = 1)
                        setVar $return_data "Nearest Non-Fig is " & $distance[$target] & " hops)  -  << " & $path[$target] & " " & $source & " >> "
                        setVar $returntarget $target
                        setVar $returndist $distance[$target]
			return
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


