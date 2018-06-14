#prelock dock-attack script

:vars
setVar $count 1
setvar $script "(burstkill)"
setVar $scriptname "burstkill"
setVar $version "v. 0.1"
setVar $federals 0
setVar $empty_sector 0

if ($saved)
   loadVar $target_name
   loadVar $target_pos
   loadVar $fig_Wave
   loadVar $extra_waves
   loadvar $autoland
   loadVar $continuous
else
    setVar $target_name ""
    setVar $target_pos 0
    setVar $fig_wave 9999
    setVar $extra_waves "OFF"
    setvar $autoland "ON"
    setVar $continuous "OFF"
end

:main
getWord CURRENTLINE $test_prompt 1
        if ($test_prompt <> "Command")
           echo "*not at command prompt*"
           halt
        end

:get_current_sector
setVar $line CURRENTLINE
getText $line $sector "]:[" "] (?"
        if ($sector = STARDOCK)
           setVar $location "DOCK"
        elseif ($sector = "1")
           setVar $location "TERRA"
        else
           setVar $location "PORT"
        end
       
:quick_menu
killalltriggers
echo ansi_15 "*---( $playerName's burstkill-mod " $version " )---*"
echo ansi_14 "1." ansi_15 " trader name  : " ansi_9 "[" ansi_6 $target_name ansi_9 "]*"
echo ansi_14 "2." ansi_15 " target pos   : " ansi_9 "[" ansi_6 $target_pos ansi_9 "]*"
echo ansi_14 "3." ansi_15 " figs per wave: " ansi_9 "[" ansi_6 $fig_wave ansi_9 "]*"
echo ansi_14 "4." ansi_15 " 2nd wave     : " ansi_9 "[" ansi_6 $extra_waves ansi_9 "]*"
echo ansi_14 "5." ansi_15 " auto land    : " ansi_9 "[" ansi_6 $autoland ansi_9 "]*"
echo ansi_14 "6." ansi_15 " continuous   : " ansi_9 "[" ansi_6 $continuous ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY

if ($choice = "1")
   echo ansi_15 "*Enter target name :  "
   getConsoleInput $target_name
   echo "*"
   goto :quick_menu
elseif ($choice = "2")
   echo ansi_15 "*Enter target pos (in player list) :  "
   getConsoleInput $target_pos
   echo "*"
   goto :quick_menu
elseif ($choice = "3")
   echo ansi_15 "*How many figs per attack :  "
   getConsoleInput $fig_wave
   echo "*"
   goto :quick_menu
elseif ($choice = "4")
       if ($extra_waves = "OFF")
          setVar $extra_waves "ON"
       else
          setVar $extra_waves "OFF"
       end
       echo "*"
       goto :quick_menu
elseif ($choice = "5")
   if ($autoland = "ON")
      setVar $autoland "OFF"
   else
      setVar $autoland "ON"
   end
   echo "*"
   goto :quick_menu
elseif ($choice = "6")
   if ($continuous = "OFF")
      setVar $continuous "ON"
   else
      setVar $continuous "OFF"
   end
   echo "*"
   goto :quick_menu
elseif ($choice = "c")
   echo "*"
   goSub :save_var
   goto :check_sector
else
   echo "*"
   goto :quick_menu
end

:check_sector
killalltriggers
send "d"

:fed_triggers
setTextLineTrigger feds1 :federals "Captain Zyrain"
setTextLineTrigger feds2 :federals "Admiral Clausewitz"
setTextLineTrigger feds3 :federals "Admiral Nelson"
setTextLineTrigger donesearch :done_fed_search "Warps to Sector(s)"
pause

:federals
killalltriggers
setVar $federals ($federals + 1)
goto :fed_triggers

:done_fed_search
killalltriggers
setVar $unmanned SECTOR.SHIPCOUNT[$sector]

:set_pos
setVar $player_pos $target_pos
setVar $target_pos ($target_pos + $federals)
setVar $target_pos ($target_pos + $unmanned)
setVar $lock_pos ($target_pos - 1)
setVar $count 1

:lock_on
killalltriggers
setVar $count 1
send "a"
if ($lock_pos = 0)
   setVar $empty_sector 1
end

       while ($count <= $lock_pos)
             send "n"
             add $count 1
       end
       setVar $count 1
       goto :locked


:locked
send "'" $script " target : [" $target_name "] location : [" $location "]*"

:create_triggers
killalltriggers
setVar $trigger_line_1 $trader_name & " lifts"
setVar $trigger_line_2 $trader_name & " blasts"
setVar $trigger_line_3 $trader_name & " appears"
setVar $trigger_line_4 $trader_name & " warps into"
setVar $trigger_flee $trader_name & " warps out"

:lock_triggers
killalltriggers
setTextLineTrigger 1 :attack $trigger_line_1
setTextLineTrigger 2 :attack $trigger_line_2
setTextLineTrigger 3 :attack $trigger_line_3
setTextLineTrigger 4 :attack $trigger_line_4
pause

:attack
killalltriggers
if ($empty_sector = 1)
   send "a"
end
   send "ny " $fig_wave "*"
   sound mrlif.wav
   :post_attack_triggers
   killalltriggers
   setTextLineTrigger miss :miss "You notice the un-Godly bulk of the Intrepid"
   setTextLineTrigger cap :cap "The ship is abandoned! Its all yours!"
   setTextLineTrigger pod :pod_flee "An Escape Pod warps out of this sector!"
   setTextLineTrigger trap :pod_trap "tried to warp out of the sector"
   pause

   :miss
   killalltriggers
   if ($extra_waves = "ON")
      goto :follow_up_attack
   end
   if ($continuous = "ON")
      send "'" $script " resetting...*"
      goto :check_sector
   else
      halt
   end

   :cap
   killalltriggers
   setVar $target_pos ($target_pos + 1)
   setVar $count 1

   :follow_up_attack
   send "a"
          while ($count <= $target_pos)
                send "n"
                add $count 1
          end
          send " y " $fig_wave " *"

               :post_cap_triggers
               killalltriggers
               setTextLineTrigger cap :cap "The ship is abandoned! Its all yours!"
               setTextLineTrigger pod :pod_flee "An Escape Pod warps out of this sector!"
               setTextLineTrigger trap :pod_trap "tried to warp out of the sector"
               setTextLineTrigger podkill :pod_kill "you have obliterated the target!"
               setTextLineTrigger miss :miss_post_cap "You notice the un-Godly bulk of the Intrepid"
               pause

          :pod_kill
          killalltriggers
          goto :done

          :miss_post_cap
          killalltriggers
          if ($continuous = "ON")
             send "'" $script " resetting...*"
             goto :check_sector
          else
              goto :done
          end

   :pod_flee
   killalltriggers
          if ($continuous = "ON")
             send "'" $script " resetting...*"
             goto :check_sector
          else
              goto :done
          end

   :pod_trap
   killalltriggers
   setVar $count 1
   goto :follow_up_attack
   
:done
killalltriggers
if ($auto_land = "ON")
   goto :land
else
   send "'" $script " shutting down*"
   halt
end

:land
killalltriggers
if ($location = "DOCK")
   send "ps"
   setTextTrigger 2 :safe "<StarDock> Where"
   pause
   
   :safe
   killalltriggers
   send "'" $script " safely landed : [" $location "]*"
   halt

elseif ($location = "TERRA")
   send "l1*"
   setTextTrigger 3 :safe "Do you wish to (L"
   pause


#---------------------------SUBROUTINES------------------------#

:save_var
    saveVar $target_name
    saveVar $target_pos
    saveVar $fig_wave
    saveVar $extra_waves
    savevar $autoland
    saveVar $continous
    setVar $saved 1
    saveVar $saved
    return

