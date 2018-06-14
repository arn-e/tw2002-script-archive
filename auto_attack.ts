#ph00n auto-attack
#best used at SD
#uses target-list to scan for enemies in sector
#activates on the search of a sector, or a warp-in trigger
#will scan sector, then fire a macro appropriately
#automatically avoids fedsafe players at dock and fed

#IF more than 1 'targets' are present in sector, you have to manually
#select (by pressing 1, 2, 3, etc) the target
#POSSIBLE BUGS: standard aliens in sector
#INSPIRED BY SUPGTARGET- thanks to supG for menu code


:vars
setVar $count 1
setVar $script "(ph00n_attack)"
setVar $scriptname "$playerName's auto-attack"
setVar $version "v. 1.00a"
setVar $tracker 0
#setVar $figs 19999
#setVar $num_waves 2
setVar $n 0
setVar $target_found "No"
setVar $federals 0
setVar $howMany 0
setVar $target_track 0
#setVar $auto_trig "OFF"

loadVar $TyAttackVarsSaved
        if ($TyAttackVarsSaved)
           loadVar $ty_attack_figs
           loadVar $ty_attack_num_waves
           loadVar $ty_attack_auto_trig
        else
           setVar $ty_attack_figs 9999
           setVar $ty_attack_num_waves 1
           setVar $ty_attack_auto_trig "OFF"

#:save_vars
          saveVar $ty_attack_figs
          saveVar $ty_attack_num_waves
          saveVar $ty_attack_auto_trig
          setVar $TyAttackVarsSaved 1
          saveVar $TyAttackVarsSaved
        end

:settxt
	mergeText GAMENAME "-targetlist" $filename
	mergeText $filename ".txt" $filename
        fileExists $exists $filename
        if ($exists)
            setVar $listexist "Yes"
        else
            setVar $listexist "No"
        end

:chklist
if ($listexist = "No")
  echo "*target list not found - create one (y/n) :  *"
  getConsoleInput $yesno SINGLEKEY
     if ($yesno = "y")
        goto :create_list
     elseif ($yesno = "n")
        halt
     else
        goto :chklist
     end

elseif ($listexist = "Yes")
       :create_wipe_choice
       echo "*create New List - (y/n) : *"
       getconsoleInput $recreate_yesno SINGLEKEY
                       if ($recreate_yesno = "y") OR ($recreate_yesno = "Y")
                          delete $filename
                          goto :create_list
                       elseif ($Recreate_yesno = "n") OR ($recreate_yesno = "N")
                          goto :readlist
                       else
                          goto :create_wipe_choice
                       end

end

:create_list
echo "*how many target(s) :  *"
  getConsoleInput $numtarget

setVar $count 1

while ($count <= $numtarget)
   getConsoleInput $tname
   stripText $tname " "
   write $filename $tname
   add $count 1
end

setVar $count 1

:readlist
read $filename $tname $count
   if ($tname <> "EOF")
      add $tracker 1
      add $count 1
        goto :readlist
   else
        setVar $count 1
        goto :readlist_2
   end

:readlist_2
setVar $arraysize $tracker
setArray $tlist $arraysize

:create_array
if ($count <= $arraysize)
    read $filename $tname $count
    setVar $tlist[$count] $tname
    add $count 1
    goto :create_array
end

setVar $count 1

:main
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

echo ansi_14 "--" ansi_15 " target_list   : " ansi_9 "[" ansi_6 $filename ansi_9 "]*"
echo ansi_14 "--" ansi_15 " target(s)     : " ansi_9 "[" ansi_6 $arraysize ansi_9 "]*"
echo ansi_14 "1." ansi_15 " figs_per_wave : " ansi_9 "[" ansi_6 $ty_attack_figs ansi_9 "]*"
echo ansi_14 "2." ansi_15 " number_waves  : " ansi_9 "[" ansi_6 $ty_attack_num_waves ansi_9 "]*"
echo ansi_14 "3." ansi_15 " auto_triggers : " ansi_9 "[" ansi_6 $ty_attack_auto_trig ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY

if ($choice = "1")
  echo "*fig wave : "
  getConsoleInput $ty_attack_figs
  echo "[2J"
  goto :ansimenu
elseif ($choice = "2")
  echo "*number of waves : "
  getConsoleInput $ty_attack_num_waves
  echo "[2J"
  goto :ansimenu
elseif ($choice = "3")
       if ($ty_attack_auto_trig = "OFF")
          setVar $ty_attack_auto_trig "ON"
       else
          setVar $ty_attack_auto_trig "OFF"
       end
echo "[2J"
goto :ansimenu
elseif ($choice = "c")
  if ($ty_attack_figs = 0) OR ($ty_attack_num_waves = 0)
    echo "[2J"
    goto :ansimenu
  else
    goto :update_clv
  end

else
  echo "[2J"
  goto :ansimenu
end



:update_clv

#:save_vars
          saveVar $ty_attack_figs
          saveVar $ty_attack_num_waves
          saveVar $ty_attack_auto_trig
          setVar $TyAttackVarsSaved 1
          saveVar $TyAttackVarsSaved

killalltriggers
goSub :grab_clv
send "q"
waitFor "<Computer deactivated>"
#BEGINNING- resetting variables

:top
killalltriggers
setVar $count 1
setVar $target_found "No"
setVar $federals 0
setVar $howMany 0
setVar $target_track 0
setVar $n 0

#standard wait-for triggers

#BEGIN TRIGGERS, still part of :top 
if ($ty_attack_auto_trig = "ON")
   setTextLineTrigger lift :chk_list " blasts off from the StarDock"
   setTextLineTrigger twarp :chk_list " appears in a brilliant flash of warp energies!"
   setTextLineTrigger warp :chk_list " warps into the sector."
   setTextLineTrigger port :chk_list " lifts off from"
   setTextLineTrigger enter :chk_list " enters the game."
end

setTextLineTrigger move :rank_triggers "<Move>"
setTextlineTrigger check :rank_triggers "<Re-Display>"
setTextOutTrigger manual_trigger :manual_trigger ">"
pause

:manual_trigger
killalltriggers
setVar $count 1
echo "*"
echo ansi_15 $script
echo ansi_11 " : " ansi_10 " -PAUSED- by user*"
setTextOutTrigger manual_reset :manual_resume ">"
pause

:manual_resume
killalltriggers
goSub :grab_clv
send "q"
waitFor "<Computer deactivated>"
echo "*"
echo ansi_15 $script
echo ansi_11 " : " ansi_10 " -RESUMED- by user - CLV updated :: triggers set*"
goto :top

:chk_list
killalltriggers
setVar $count 1
setVar $line CURRENTLINE
stripText $line " warps into the sector."
stripText $line " blasts off from the StarDock"
stripText $line " appears in a brilliant flash of warp energies!"
stripText $line " lifts off from"
stripText $line " enters the game."
stripText $line " "

#while ($count <= $arraysize)

:chk_trader_array

if ($count > $arraysize)
   goto :top
end
   if ($tlist[$count] = $line)
#    setVar $targetperson $tlist[$count]
     goto :checker
   else 
     add $count 1
     goto :chk_trader_array
   end
#end

goto :top

:checker
setVar $count 1
killalltriggers
send "D"
waitfor "Re-Display"

#setting the triggers for player-ranks
#will count up the players
#COULD GLITCH ON STANDARD ALIENS

:rank_triggers
killalltriggers
setTextLineTrigger sector :getsector "Sector  :"
#waitFor "Sector  :"
setTextLineTrigger feds1 :federals "Captain Zyrain"
setTextLineTrigger feds2 :federals "Admiral Clausewitz"
setTextLineTrigger feds3 :federals "Admiral Nelson"
setTextLineTrigger a1 :getname "Civilian "
setTextLineTrigger a2 :getname "Private 1st Class "
setTextLineTrigger a3 :getname "Private "
setTextLineTrigger a4 :getname "Lance Corporal "
setTextLineTrigger a5 :getname "Corporal "
setTextLineTrigger a6 :getname "Staff Sergeant "
setTextLineTrigger a7 :getname "Gunnery Sergeant "
setTextLineTrigger a8 :getname "1st Sergeant "
setTextLineTrigger a9 :getname "Sergeant Major "
setTextLineTrigger a10 :getname "Sergeant "
setTextLineTrigger a11 :getname "Chief Warrant Officer " 
setTextLineTrigger a12 :getname "Warrant Officer "
setTextLineTrigger a13 :getname "Ensign "
setTextLineTrigger a14 :getname "Lieutenant J.G. "
setTextLineTrigger a15 :getname "Lieutenant Commander "
setTextLineTrigger a16 :getname "Lieutenant "
setTextLineTrigger a17 :getname "Commander "
setTextLineTrigger a18 :getname "Captain "
setTextLineTrigger a19 :getname "Commodore "
setTextLineTrigger a20 :getname "Rear Admiral "
setTextLineTrigger a21 :getname "Vice Admiral "
setTextLineTrigger a22 :getname "Admiral "
setTextLineTrigger a23 :getname "Fleet Admiral "
setTextLineTrigger a24 :getname "Annoyance "
setTextLineTrigger a25 :getname "Nuisance 1st Class "
setTextLineTrigger a26 :getname "Nuisance 2nd Class "
setTextLineTrigger a27 :getname "Nuisance 3rd Class "
setTextLineTrigger a28 :getname "Menace 1st Class "
setTextLineTrigger a29 :getname "Menace 2nd Class "
setTextLineTrigger a30 :getname "Menace 3rd Class "
setTextLineTrigger a31 :getname "Smuggler 1st Class "
setTextLineTrigger a32 :getname "Smuggler 2nd Class "
setTextLineTrigger a33 :getname "Smuggler 3rd Class "
setTextLineTrigger a34 :getname "Smuggler Savant "
setTextLineTrigger a35 :getname "Robber "
setTextLineTrigger a36 :getname "Terrorist " 
setTextLineTrigger a37 :getname "Infamous Pirate "
setTextLineTrigger a38 :getname "Notorious Pirate "
setTextLineTrigger a39 :getname "Dread Pirate "
setTextLineTrigger a40 :getname "Pirate "
setTextLineTrigger a41 :getname "Galactic Scourge "
setTextLineTrigger a42 :getname "Enemy of the State "
setTextLineTrigger a43 :getname "Enemy of the People "
setTextLineTrigger a44 :getname "Enemy of Humankind "
setTextLineTrigger a45 :getname "Heinous Overlord "
setTextLineTrigger donesearch :done_sector_search "Warps to Sector(s)"
pause

:getsector
killalltriggers
getWord CURRENTLINE $sector 3
goto :rank_triggers

:federals
killalltriggers
setVar $federals ($federals + 1)
goto :rank_triggers

:getname
killalltriggers
setVar $line CURRENTLINE
goSub :stripText
getWordPos $line $comma ","
cutText $line $target 0 ($comma - 1)
setVar $count 1

#Cycles through the attack Array

   :check_name

   if ($count > $arraysize)
      goto :done_check
   end

   if ($tlist[$count] = $target)
     if ($sector = STARDOCK) OR ($sector < 11)
      if ($player_align[$count] = 1)
         goto :set_attack
      else
         add $count 1
         goto :check_name
      end
     else
       goto :set_attack
     end
   else
      add $count 1
      goto :check_name
   end

#flags the var $target_found to "Yes", to indicate a target located, and the target's position
# in the player attack order

:set_attack
killalltriggers
setVar $target_found "Yes"
setVar $howMany ($howMany + 1)
setVar $target_pos $n
setVar $target_track ($target_track + 1)
setVar $target_array[$target_track] $target
setVar $pos_array[$target_track] $target_pos
setVar $n ($n + 1)
goto :rank_triggers

:done_check
setVar $count 1
add $n 1
goto :rank_triggers



#done searching sector - first checking for targets found, then their position, then grabbing
#$n info

:done_sector_search
killalltriggers
#getText CURRENTLINE $sector "]:[" "] (?"
if ($target_found = "No")
   setVar $n 0
   echo "*No Targets Found - resetting*"
   goto :top
else
   goto :check_targets
end

:check_targets
killalltriggers
setVar $shot_count 0
if ($howMany > 1)
   goto :multiple_targets
else
   goto :single_target
end

:multiple_targets
setVar $count 1
echo ansi_11 "**[" ansi_12 $howMany ansi_11 "] " ansi_14 " targets found!*"

:multiple_attack_menu
while ($count <= $howMany)
   echo ansi_14 "*" $count ". " ansi_11 $target_array[$count]
   add $count 1
end
echo ansi_14 "*Q. " ansi_12 "ABORT*"

getConsoleInput $choice SINGLEKEY

setVar $count 1

if ($choice = "q")
   goto :top
end

setVar $target_pos $pos_array[$choice]
#setVar $target $target_array[$choice]


goto :single_target

:single_target
killalltriggers
setVar $target_pos ($target_pos + $federals)
setVar $target_pos ($target_pos + SECTOR.SHIPCOUNT[$sector])

#target_pos = amount of n's necessary

goto :fire_wave

:fire_wave
setVar $count 1
send " a "
  while ($count <= $target_pos)
    send " z n "
    add $count 1
  end
send " y z q z " $ty_attack_figs " * "
setVar $shot_count ($shot_count + 1)
       if ($shot_count >= $ty_attack_num_waves)
          setVar $shot_count 0
          goto :fire_menu
       else
          goto :fire_wave
       end
goto :fire_menu

:fire_menu
killalltriggers
waitFor "(?=Help)? :"
echo ansi_12 "*ATTACK COMPLETED " ansi_14 " post-attack options :  "
echo ansi_10 "*[" ansi_11 "1" ansi_10 "] :" ansi_13 " repeat last attack-macro "
echo ansi_10 "*[" ansi_11 "2" ansi_10 "] :" ansi_13 " add N to last attack-macro (if ship capped) "
echo ansi_10 "*[" ansi_11 "Q" ansi_10 "] :" ansi_13 " RESET*"

#the post-attack menu

getConsoleInput $choice SINGLEKEY

if ($choice = "1")
   goto :fire_wave
elseif ($choice = "2")
   setVar $target_pos ($target_pos + 1)
   goto :fire_wave
elseif ($choice = "q")
   goto :top
else
   goto :top 
end




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

:striptext
striptext $line "Civilian "
striptext $line "Private 1st Class "
striptext $line "Private "
striptext $line "Lance Corporal "
striptext $line "Corporal "
striptext $line "Staff Sergeant "
striptext $line "Gunnery Sergeant "
striptext $line "1st Sergeant "
striptext $line "Sergeant Major "
striptext $line "Sergeant "
striptext $line "Chief Warrant Officer " 
striptext $line "Warrant Officer "
striptext $line "Ensign "
striptext $line "Lieutenant J.G. "
striptext $line "Lieutenant Commander "
striptext $line "Lieutenant "
striptext $line "Commander "
striptext $line "Captain "
striptext $line "Commodore "
striptext $line "Rear Admiral "
striptext $line "Vice Admiral "
striptext $line "Admiral "
striptext $line "Fleet Admiral "
striptext $line "Annoyance "
striptext $line "Nuisance 1st Class "
striptext $line "Nuisance 2nd Class "
striptext $line "Nuisance 3rd Class "
striptext $line "Menace 1st Class "
striptext $line "Menace 2nd Class "
striptext $line "Menace 3rd Class "
striptext $line "Smuggler 1st Class "
striptext $line "Smuggler 2nd Class "
striptext $line "Smuggler 3rd Class "
striptext $line "Smuggler Savant "
striptext $line "Robber "
striptext $line "Terrorist " 
striptext $line "Infamous Pirate "
striptext $line "Notorious Pirate "
striptext $line "Dread Pirate "
striptext $line "Pirate "
striptext $line "Galactic Scourge "
striptext $line "Enemy of the State "
striptext $line "Enemy of the People "
striptext $line "Enemy of Humankind "
striptext $line "Heinous Overlord "
striptext $line " [1]"
striptext $line " [2]"
striptext $line " [3]"
striptext $line " [4]"
striptext $line " [5]"
striptext $line " [6]"
striptext $line " [7]"
striptext $line " [8]"
striptext $line " [9]"
striptext $line " [10]"
striptext $line " [11]"
striptext $line " [12]"
stripText $line "Traders : "
stripText $line " "
return

:grab_clv
killalltriggers
setArray $player_align $arraysize

send "clv"
waitFor "---------------------"
setTextLineTrigger get_clv :get_clv_line
setTextLineTrigger done_clv :done_clv "Computer command [TL"
pause

#CLV sub, will flag the player's align fed, or not

:get_clv_line
killalltriggers
setVar $line CURRENTLINE
getWord $line $test 1
   if ($test = "Computer") OR ($test = 0)
      goto :done_clv
   end
getWord $line $exp 2
getWord $line $align 3
stripText $exp ","
stripText $align ","
cutText $line $name 30 31
stripText $name " "
setVar $count 1

    while ($count <= $arraysize)
        if ($tlist[$count] = $name)
          if ($exp >= 1000) OR ($align < 0)
             setVar $player_align[$count] 1
          else
             setVar $player_align[$count] 0
          end
        end
        add $count 1
    end

setVar $count 1
setTextLineTrigger get_clv :get_clv_line
pause

:done_clv
killalltriggers
return
