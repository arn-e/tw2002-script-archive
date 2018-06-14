#death blossom gridder

:vars
setVar $count 1
setVar $script "(warp_surround)"
setVar $scriptname "$playerName's twarp surround"
setVar $version "v. 1.0"
setArray $fig_grid SECTORS
setArray $ringed SECTORS
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $avoid_file GAMENAME & "-avoided_sectors" & ".txt"
setVar $fig_count 0
setVar $target_count 0
setVar $loop_count 0
setVar $drop_figs 1
setVar $mode "incremental"
setVar $ss_msg "OFF"



:main
getWord CURRENTLINE $location 1
        if ($location <> "Citadel")
           echo "*get to command prompt*"
           halt
        end

setVar $count 1

:read_txt
read $fig_file $sector $count

if ($sector = "EOF")
    goto :done_read_txt
end

setVar $fig_grid[$sector] 1
setVar $fig_count ($fig_count + 1)
add $count 1
goto :read_txt

:done_read_txt
setVar $count 1
goto :set_target_array

:set_target_array
setArray $target_array $fig_count
setVar $count 1
setVar $target_count 0
while ($count <= $fig_count)
      if ($fig_grid[$count] = 1)
         setVar $target_count ($target_count + 1)
         setVar $target_array[$target_count] $count
      end
      setVar $count ($count + 1)
end

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

echo ansi_14 "--" ansi_15 " fig file     : " ansi_9 "[" ansi_6 $fig_file ansi_9 "]*"
echo ansi_14 "--" ansi_15 " sects_figged : " ansi_9 "[" ansi_6 $fig_count ansi_9 "]*"
echo ansi_14 "1." ansi_15 " target(s)    : " ansi_9 "[" ansi_6 $how_many ansi_9 "]*"
echo ansi_14 "2." ansi_15 " mode         : " ansi_9 "[" ansi_6 $mode ansi_9 "]*"
echo ansi_14 "3." ansi_15 " figs to drop : " ansi_9 "[" ansi_6 $drop_figs ansi_9 "]*"
echo ansi_14 "4." ansi_15 " msg reports  : " ansi_9 "[" ansi_6 $ss_msg ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY


if ($choice = "1")
   echo "*How many sectors to hit : "
   getConsoleInput $how_many
   goto :ansimenu
   echo "[2J"
elseif ($choice = "2")
   if ($mode = "incremental")
                setVar $mode "random"
                echo "[2J"
                goto :ansimenu
   else
                setVar $mode "incremental"
                echo "[2J"
                goto :ansimenu
   end
elseif ($choice = "3")
       echo "*how many figs to drop :  "
       getConsoleInput $drop_figs
       echo "[2J"
       goto :ansimenu
elseif ($choice = "4")
       if ($ss_msg = "OFF")
          setVar $ss_msg "ON"
       else
          setVar $ss_msg "OFF"
       end
       echo "[2J"
       goto :ansimenu
elseif ($choice = "c")
   goto :done
else
echo "[2J"
goto :ansimenu
end

:done
killalltriggers
setVar $count 0
goSub :getinfo
#send "'on planet " $planet " and in sector " $sector "*"


:jet_grab_ore
send " q q j y l " $planet " * t n t 1 * c "
waitFor "Citadel command"
setVar $user_drop_figs $drop_figs

:get_target
killalltriggers
setVar $loop_count ($loop_count + 1)

       if ($loop_count >= $how_many)
          if ($ss_msg = "ON")
             send "'" $script " DONE : " $loop_count " sectors ringed*"
          end
          halt
       end

if ($mode = "incremental")
    setVar $target_jp $target_array[$loop_count]
else
    getRnd $rnd 11 $target_count
    setVar $target_jp $target_array[$rnd]
end

   if ($ringed[$target_jp] = 1)
      goto :get_target
   end

:echo_Warning
             if ($loop_count = 1)
                echo ansi_12 "*MAKE SURE TO HAVE A BEAMER, AND TWARP"
                echo ansi_14 "*PRESS > TO BEGIN  :  "
                setTextOutTrigger activate :activate ">"
                pause
             end

:activate
killalltriggers
#send "'" $script " loading...*"
send "b" $target_jp "*"
goto :safety_triggers

:safety_triggers
killalltriggers
setTextLineTrigger safe_1 :no_dist "This planetary transporter does not"
setTextLineTrigger safe_2 :no_fig "No locating beam found"
setTextLineTrigger safe_3 :figged "Locating beam pinpointed,"
pause

:no_dist
killalltriggers
echo "*INSUFFICIENT BEAMER DISTANCE - HALTING*"
halt

:no_fig
killalltriggers
#echo "*NO FIG AT TARGET JP - RESETTING*"
      if ($ss_msg = "ON")
         send "'" $script " could not lock on sector " $target_jp "*"
      end
send "n"
goto :get_target

:figged
killalltriggers
if ($ss_msg = "ON")
send "'" $script " warping*"
end
send " y z n f " $drop_figs " * c d "
waitFor "Command [TL=00:00:00]:[" & $target_jp & "]"
goto :holo

#THE HOLO SCAN
#WORKS NICE, COULD GET A DSCAN MODE AS WELL AS FULL SPEED MODE

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
          if ($scan_figs_adj > 10000) AND ($adj_scan_sector <> $target_jp)
             setVar $avoid_adj[$scan_count] 1
             if ($ss_msg = "ON")
                send "'" $script " HIGH FIG COUNT [" $display_figs "] : " $adj_scan_sector "*"
             end
             write $avoid_file $adj_scan_sector
          end
setTextLineTrigger get_sector :get_adj_sector "Sector  :"
setTextLineTrigger get_shielded :get_adj_shielded "(Shielded)"
setTextLineTrigger get_fighters :get_adj_fighters "Fighters:"
#setTextTrigger done :done_scan "Command [TL=00:00:00]:[" & $target_jp & "]"
setTextTrigger done :done_scan "Warps to Sector(s)"
pause

:done_scan
killalltriggers
#echo "**" $scan_count "**"
#pause
#BUILDING WARP DATA, AVOIDS, ETC
#COULD MOVE TO PRE BWARP FOR SPEED
#AS WELL AS BEING MORE EFFICIENT CONSERVING TURNS BY NOT JUMPING IF NO ADJ UNFIGGED SECTORS
#EXIST

:set_surround
killalltriggers
setVar $count 1
setVar $warpcount SECTOR.WARPCOUNT[$target_jp]
setArray $adj_warp $warpcount
       while ($count <= $warpcount)
             setVar $adj_warp[$count] SECTOR.WARPS[$target_jp][$count]
             setVar $temp_adj $adj_warp[$count]
                    if ($fig_grid[$temp_adj] = 1)
                       setVar $adj_warp[$count] 0
                    end
                    getDistance $dist $temp_adj $target_jp
                    if ($dist > 1)
                       setVar $adj_warp[$count] 0
                    end
                    if ($avoid_adj[$count] = 1)
                       setVar $adj_warp[$count] 0
                    end
                    if ($temp_adj = STARDOCK) OR ($temp_adj < 11)
                       setVar $adj_warp[$count] 0
                    end
             setVar $count ($count + 1)
       end
setVar $count 1
goto :surround_jp

#THE ACTUAL MOVE LOOP

:surround_jp
        while ($count <= $warpcount)
              if ($adj_warp[$count] <> 0)
                 setVar $target_adj $adj_warp[$count]
                 if (SECTOR.WARPCOUNT[$target_adj] = 1)
                    setVar $drop_figs 10
                 end
                    send " m " $target_adj " * z a 9876 * z n f " $drop_figs " * c d < z n "
                 setVar $fig_grid[$target_adj] 1
                 setVar $count ($count + 1)
              else
                 setVar $count ($count + 1)
              end
        end

:surrounded
#echo "*sector surrounded*"

:return_home
send " m " $sector " * y y l " $planet " * t n t 1 * m * * * c "

:return_trigger
killalltriggers
setTextTrigger returned :returned "Citadel command"
pause

:returned
killalltriggers
if ($ss_msg = "ON")
   send "'" $script " sector " $target_jp " surrounded*"
end
setVar $drop_figs $user_drop_figs
setVar $ringed[$target_jp] 1
goto :get_target




#----------------------SUBROUTINES-----------------------------#

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
