#WORLD SST
#THINGS TO DO:
# 1. COMBINE WSSM AND WSST BUST LISTS
# 2. FIND WAY TO RANDOMIZE EWARP TO PRE-BUILT BUYER LIST
#    - COULD BE OPTIONAL, WITH THE STANDBY BEING THE BRUTE FORCE MODE FOR EARLY GAME
  

:vars
setVar $count 0
setVar $script "(world_SST)"
setVar $scriptname "$playerName's World SST"
setVar $version "v. 1.0"
setVar $bust_list GAMENAME & "-bust_list" & ".txt"
setArray $busts SECTORS
setArray $buyers SECTORS

#setVar $class0 1
#setVar $divisor 15
#setVar $restock "YES"
#setVar $this_ship 44
#setVar $other_ship 33
#setVar $short_xport 6
#setVar $check_dist "YES"
#setVar $search_mode "Brute Force"
setVar $last_visit 0
#setVar $rpr 2
setVar $rpr_count 1
setVar $checked_other "NO"
#setVar $fig_wave 4000

        :save_load_vars
        loadVar $TyWsstVarsSaved
                if ($TyWsstVarsSaved)
                   loadVar $ty_wsst_class0
                   loadVar $ty_wsst_divisor
                   loadVar $ty_wsst_restock
                   loadVar $ty_wsst_this_ship
                   loadVar $ty_wsst_other_ship
                   loadVar $ty_wsst_rpr
                   loadVar $ty_wsst_fig_wave
                else
                   setVar $ty_wsst_class0 1
                   setVar $ty_wsst_divisor 30
                   setVar $ty_wsst_restock "YES"
                   setVar $ty_wsst_this_ship 9
                   setVar $ty_wsst_other_ship 10
                   setVar $ty_wsst_rpr 2
                   setVar $ty_wsst_fig_wave 9999
                   
                   setVar $TyWsstVarsSaved 1
                   saveVar $TyWsstVarsSaved
                end

:chk_list_exist
echo ansi_15 "*$playerName's World SST Loading..."
echo ansi_15 "*Checking Bust List..."
fileExists $exists $bust_list
           if ($exists)
              setVar $bust_exist "YES"
           else
              setVar $bust_exist "NO"
           end

           if ($bust_exist = "YES")
              echo ansi_15 "*Would you Like to clear your busts ? (" ansi_12 "Y" ansi_15 "/" ansi_12 "N" ansi_15 ") : "
              getConsoleInput $choice SINGLEKEY
                              if ($choice = "y")
                                 setVar $void_clear "YES"
                                        :clear_busts
                                        setVar $count 1
                                               while ($count <= SECTORS)
                                                     setVar $busts[$count] 0
                                                     add $count 1
                                               end
                                        delete $bust_list
                              elseif ($choice = "n")
                                 setVar $void_clear "NO"
                                        :read_busts
                                        setVar $count 1
                                               while ($sector <> EOF)
                                                     read $bust_list $sector $count
                                                          if ($sector = EOF)
                                                             setVar $sector ""
                                                             goto :done_read_bust
                                                          end
                                                     setVar $busts[$sector] 1
                                                     add $count 1
                                               end
                                        :done_read_bust
                                        setVar $count 1
                              end
           end

setVar $count 1

#:build_xxb_list
#echo ansi_15 "*Building Port List..."
#setVar $count 1
#setVar $port_count 0
#       while ($count <= SECTORS)
#             getSector $count $sect
#                       if ($sect.port.buy_equip = "YES") AND ($sect.port.class <> 0)
#                          add $port_count 1
#                          setVar $buyers[$count] 1
#                          #echo ansi_15 "*Port Class : " $sect.port.class
#                       end
#             add $count 1
#       end
#echo ansi_15 "*List Created : " $port_count " xxB Ports found! "

#This is the Quick-Jump Array
#to allow TWX to randomly jump to a number in that array and have it be a
#xxB port
#this needs to be refined - to have a full-spectrum array (sector sized)
#for easier manipulability
# (i.e. adding a port to the array when seen)

#:create_jump_array
#echo ansi_15 "*Creating Quick-Jump Port Array..."
#setVar $count 1
#setVar $jump_count 0
#setArray $jump_buyers $port_count
#         while ($count <= SECTORS)
#               if ($buyers[$count] = 1)
#                  add $jump_count 1
#                  setVar $jump_buyers[$jump_count] $count
#               end
#               add $count 1
#         end

setVar $count 1
#      echo ansi_15 "*Quick-Jump Array Created! "
echo ansi_15 "*Loading Menu..."

:main
getLength $scriptname $max
getLength $version $len
goSub :checkmax

:ansimenu
killalltriggers
echo "[2J"                                                                                                                            $ty_wsst_class0

echo ANSI_6 "**-" ansi_2 "=" ansi_9 "(" 
setVar $text $scriptname
goSub :addspc                                                                                          $ty_wsst_restock
setVar $scriptdisplay $text
echo ansi_15 $scriptdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-*"

echo ANSI_6 "-" ansi_2 "=" ansi_9 "(" 
setVar $text $version
goSub :addspc                                                                                              $ty_wsst_this_ship
setvar $verdisplay $text
echo ansi_15 $verdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-**"

echo ansi_14 "1." ansi_15 " Class 0 Location  : " ansi_9 "[" ansi_6 $ty_wsst_class0 ansi_9 "]*"              $ty_wsst_divisor
echo ansi_14 "2." ansi_15 " Steal Divisor     : " ansi_9 "[" ansi_6 $ty_wsst_divisor ansi_9 "]*"
echo ansi_14 "3." ansi_15 " Restock           : " ansi_9 "[" ansi_6 $ty_wsst_restock ansi_9 "]*"
echo ansi_14 "4." ansi_15 " This Ship         : " ansi_9 "[" ansi_6 $ty_wsst_this_ship ansi_9 "]*"
echo ansi_14 "5." ansi_15 " Other Ship        : " ansi_9 "[" ansi_6 $ty_wsst_other_ship ansi_9 "]*"
echo ansi_14 "6." ansi_15 " Runs Per Refurb   : " ansi_9 "[" ansi_6 $ty_wsst_rpr ansi_9 "]*"
echo ansi_14 "7." ansi_15 " Fig Attack Wave   : " ansi_9 "[" ansi_6 $ty_wsst_fig_wave ansi_9 "]*"
#echo ansi_14 "8." ansi_15 " Search Mode       : " ansi_9 "[" ansi_6 $search_mode ansi_9 "]*"
echo ansi_14 "C." ansi_15 " Run Script **"

getConsoleInput $choice SINGLEKEY

if ($choice = 1)
   echo ansi_15 "*Enter Class 0 Location : "
   getConsoleInput $ty_wsst_class0
   echo "[2J"
   goto :ansimenu
elseif ($choice = 2)
   echo ansi_15 "*Enter Steal Divisor : "
   getConsoleInput $ty_wsst_divisor
   echo "[2J"
   goto :ansimenu
elseif ($choice = 3)
       if ($ty_wsst_restock = "YES")
          setVar $ty_wsst_restock "NO"
       else
          setVar $ty_wsst_restock "YES"
       end
       echo "[2J"
       goto :ansimenu
elseif ($choice = 4)
       echo ansi_15 "*Enter This Ship : "
       getConsoleInput $ty_wsst_this_ship
       echo "[2J"
       goto :ansimenu
elseif ($choice = 5)
       echo ansi_15 "*Enter Other Ship : "
       getConsoleInput $ty_wsst_other_ship
       echo "[2J"
       goto :ansimenu
elseif ($choice = 6)
       echo ansi_15 "*How Many Runs Before Refurbing  : "
       getConsoleInput $ty_wsst_rpr
       echo "[2J"
       goto :ansimenu
elseif ($choice = 7)
       echo ansi_15 "*How Many Figs Per Attack : "
       getConsoleInput $ty_wsst_fig_wave
       echo "[2J"
       goto :ansimenu
#elseif ($choice = 8)
#       if ($search_mode = "Brute Force")
#          setVar $search_mode "Port List"
#       else
#          setVar $search_mode "Brute Force"
#       end
#       echo "[2J"
#       goto :ansimenu
elseif ($choice = "c")
       if ($ty_wsst_other_ship <> 0) AND ($ty_wsst_rpr <> 0) AND ($ty_wsst_this_ship <> 0)
          goto :begin_script
       else
          echo "[2J"
          goto :ansimenu
       end
else
       echo "[2J"
       goto :ansimenu
end

:begin_script
send "w z n * " 
setVar $count 0

getWord CURRENTLINE $location 1
        if ($location <> "Command")
           echo ansi_15 "*Not at the Command Prompt*"
           halt
        end
        :get_curr_sector
        getText CURRENTLINE $sector "]:[" "] (?"
        setVar $starting_sector $sector
        send "cunq"

send "x"
setTextLineTrigger getrange :getrange "has a transport range"
setTextLineTrigger getship :getship "Corp"
setTextLineTrigger done :donecheck "Exit Transporter"
pause

:getrange
killalltriggers
setVar $line CURRENTLINE
getText $line $x_range "of " " hops."

:check_x_triggers
killalltriggers
setTextLineTrigger getship :get_ship "Corp"
setTextLineTrigger done :done_x_check "Exit Transporter"
pause

:get_ship
killalltriggers
setVar $line CURRENTLINE
getWord $line $temp_ship 1
getWordPos $line $corp_pos "Corp"
cutText $line $temp_dist ($corp_pos + 24) 3
stripText $temp_dist " "
        if ($temp_ship = $ty_wsst_other_ship)
           if ($temp_dist <> 0)
              if ($temp_dist > $x_range)
                echo ansi_15 "*Other Ship (" $ty_wsst_other_ship ") too far away!*"
                halt
              end
           end
           send "qwn" $other_ship "*"
           echo ansi_15 "*Locked On Other Ship!*"
          # send "q"
           goto :locate_1_port
        end
goto :check_x_triggers

:done_x_check
killalltriggers
echo ansi_15 "*Other Ship Not Found! [" $ty_wsst_other_ship "]*"
halt

#This is the Brute Force method of searching for ports - the simple Scan, find xxB
#repeat, find, trade, etc
#the Advanced locate port-thru DB feature will be implemented at a later date
#after bruce force is fully functional
#Brute Force is meant to work in any circumstance, even early game with little or no
#ZTM Data

:locate_1_port
setArray $pair 2
killalltriggers
send "sh"
waitFor "Long Range Scan"
setTextLineTrigger done_1_scan :done_1_scan "Warps to Sector(s)"
pause

:done_1_scan
killalltriggers
setVar $pair_count 0
#echo ansi_15 "****" $sector "****"
getSector $sector $sect
          if (($sect.port.buy_equip = "YES") and ($sector > 10) and ($sector <> STARDOCK))
             if ($sect.port.class <> 0)
                if ($busts[$sector] = 0)
                   add $pair_count 1
                   setVar $buyers[$sector] 1
                   setVar $pair[$pair_count] $sector
                end
             end
          end

:check_adj
setVar $count 1
setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $adj_warp $warpcount
         :check_adj_loop
         while ($count <= $warpcount)
               setVar $adj_warp[$count] SECTOR.WARPS[$sector][$count]
               setVar $temp_sect $adj_warp[$count]
               getDistance $dist $temp_sect $sector
               getSector $temp_sect $sect
                           if ($dist > 1)
                             # echo ansi_15 "*Sector " $temp_sect " is a One-Way*"
                              add $count 1
                              goto :check_adj_loop
                           end 

                           if (($sect.port.buy_equip = "YES") and ($temp_sect > 10) and ($temp_sect <> STARDOCK))
                              if ($sect.port.class <> 0)
                                 if ($sect.port.exists = 1)
                                    setVar $buyers[$temp_sect] 1
                                    if ($busts[$temp_sect] = 0)
                                     add $pair_count 1
                                     setVar $pair[$pair_count] $temp_sect
                                            if ($pair_count = 2)
                                                goto :check_pair
                                            end
                                    end
                                 end
                              end        
                           end    
              add $count 1
         end

:check_safety
if ($pair_count = 0)
  # echo ansi_15 "*No xxB Ports Found!*"
   goto :search_move
elseif ($pair_count = 1)
  if ($pair[1] = $sector)
     goto :search_move
  end

   #pause
   if ($pair[1] <> $last_visit)
     # echo ansi_15 "*Only 1 xxB Port Found - Warping..."
     # echo ansi_15 "* xxB 1 : " $pair[1] "*"
      send "m" $pair[1] " * z a " $ty_wsst_fig_wave " * z n "
           if ($pair[1] > 10) AND ($pair[1] <> STARDOCK)
              send " f 1 * c d "
           end
      setVar $last_visit $sector
      setVar $sector $pair[1]
   else
      :get_rnd_adj
     # echo ansi_15 "*xxB = Last Visit - Getting Random Sector..."
      if ($warpcount = 1)
         echo ansi_15 "*In Dead End - Warping Out..."
         setvar $last_visit $sector
         send "m" $adj_warp[1] " * z a " $ty_wsst_fig_wave " * z n "
              if ($adj_warp[1] > 10) AND ($adj_warp[1] <> STARDOCK)
                 send " f 1 * c d "
              end
         setVar $sector $adj_warp[1]
      else
         getRnd $rnd_adj 1 $warpcount
             if ($adj_warp[$rnd_adj] = $last_visit)
                goto :get_rnd_adj
             end
         setVar $last_visit $sector
         setVar $sector $adj_warp[$rnd_adj]
         send "m" $adj_warp[$rnd_adj] " * z a " $fig_wave " * z n "
              if ($adj_warp[$rnd_adj] > 10) AND ($adj_warp[$rnd_adj] <> STARDOCK)
                 send " f 1 * c d "
              end
      end
   end
   goto :locate_1_port
end

:search_move
killalltriggers
setVar $high_warp 0
setVar $high_sect 0
setVar $warpcount SECTOR.WARPCOUNT[$sector]
setVar $sect_array $warpcount
setVar $warp_array $warpcount
setVar $count 1
send "sd"
waitFor "Relative Density Scan"
:d_scan_Triggers
killalltriggers
setTextLineTrigger 1 :get_sector "==>"
setTextTrigger 2 :done_d_scan "]:["
pause

:get_sector
killalltriggers
#send "'dscan trig*"
setVar $line CURRENTLINE
getWordPos $line $sect_pos "Sector"
cutText $line $adj_sect ($sect_pos + 7) 8
stripText $adj_sect "("
stripText $adj_sect ")"
stripText $adj_sect " "
stripText $adj_sect "="
stripText $adj_sect ">"
getWordPos $line $warp_pos "Warps"
cutText $line $warps ($warp_pos + 7) 3
stripText $warps " "
#echo ansi_15 "*Sector : " $adj_sect " <Warps > : " $warps
#setVar $sect_array[$count] $sector
       if ($warps > $high_warp)
          if ($warpcount = 1)
             setVar $high_sect $adj_sect
             setVar $high_warp $warps
          end
          if ($adj_sect <> $last_visit)
             setVar $high_sect $adj_sect
             setVar $high_warp $warps
            # send "'New High Warp : " $high_sect " " $high_warp "*"

          end
       end
add $count 1
goto :d_scan_triggers

:done_d_scan
killalltriggers
setVar $count 1
#send "'high sect : " $high_sect "*"
setVar $move_target $high_sect

:check
setvar $count 1
#echo ansi_15 "*Script Error : Should not get Here [1]*"

:move_target
killalltriggers
#send "m " $move_target " * z a " $fig_wave " * z n "
send "m " $move_target " * z a " $ty_wsst_fig_wave " * * "
     if ($move_target > 10) AND ($move_target <> STARDOCK)
        send " f 1 * c d *"
     end
setVar $last_visit $sector


#thinking of having a no-match array, like a 'don't go there, nothin to be found'
#but content with just avoidin the last sector, for now

setVar $sector $move_target
#send "'sector : " $sector " going to locate_1_port*"
goto :locate_1_port



#Note : At the Moment, I have not planned to incorporate a breadth-wide search routine
#to the Brute-Force method
#In a sense, so far the Brute Force method is going to be a Wssm Routine with SST instead
#of SSM with the 250ms delay

:check_pair
#echo ansi_15 "*Arrived : Check Pair!"
#echo ansi_15 "*Port 1 : " $pair[1]
#echo ansi_15 "*Port 2 : " $pair[2]
#echo "**"
#send "'pair located : " $pair[1] " and " $pair[2] "*"

:check_distance
if ($pair[1] <> $sector)
   send "cf" $pair[1] "*" $pair[2] "*"
   send "f" $pair[2] "*" $pair[1] "*q"
   waitfor "<Computer deactivated>"
   goto :get_path_dist
else
   send "cf" $pair[2] "*" $pair[1] "*q"
   waitfor "<Computer deactivated>"
   goto :get_path_dist
end

:get_path_dist
killalltriggers
getDistance $p_length $pair[2] $pair[1]
getDistance $p_length_2 $pair[1] $pair[2]

        if ($p_length > 2)
           send "'dist_error 1 : " $p_length "*"
           setVar $move_target $pair[2]
           goto :move_target
        elseif ($p_length_2 > 2) AND ($pair[1] <> $sector)
           send "'dist error 2 : " $p_length_2 "*"
           setVar $move_target $pair[1]
           goto :move_target
        end

:pass_test
killalltriggers
#send "'distance check : passed*"
goto :set_up

:set_up
send "w"
send "m" $pair[2] "* z a " $ty_wsst_fig_wave " * z n "
     if ($pair[2] > 10) AND ($pair[2] <> STARDOCK)
        send " f 1 * c d "
     end
setVar $ty_wsst_this_ship_sector $pair[2]
#send "'ship 1 : moved " $pair[2] "*"
     if ($pair[1] <> $sector)
        send "x " $ty_wsst_other_ship " * q m " $pair[1] " * z a " $ty_wsst_fig_wave " * z n "
             if ($pair[1] > 10) AND ($pair[1] <> STARDOCK)
                send " f 1 * c d "
             end
        setVar $other_ship_sector $pair[1]
       # send "'ship 2 : moved " $pair[1] "*"
        send "x " $ty_wsst_this_ship " * q "
       # setVar $curr_ship $other_ship
     else
       # send "'ship 2 : already at port*"
        setVar $other_ship_sector $pair[1]
        setVar $curr_ship $ty_wsst_this_ship
     end

:upgrade
send "o 3 33 * q "
#send "'port 1 : upgraded*"
send " j y "
send " x " $ty_wsst_other_ship "* q o 3 33 * q "
send " j y "
#send "'port 2 : upgraded*"
send " x " $ty_wsst_this_ship "* q "


#-----------------------------SST ROUTINE---------------------------------#
:begin_sst
#send "'beginning sst *"
send "i"
waitFor "Rank and Exp"
getWord CURRENTLINE $exp 5
stripText $exp ","
setVar $steal_holds_exp ($exp / $ty_wsst_divisor)
waitFor "Total Holds"
getWord CURRENTLINE $total_holds 4
if ($steal_holds_exp > $total_holds)
   setVar $steal_holds_this $total_holds
else
   setVar $steal_holds_this $steal_holds_exp
end

setVar $steal_holds_other $steal_holds_this

killalltriggers

setVar $count 1

       :chk_other_holds
       if ($rpr > 1)
          send "xi" $ty_wsst_other_ship "** q "
          waitFor "Total Holds"
          getWord CURRENTLINE $chk_other_holds 4
                  if ($chk_other_holds = 0)
                     goto :chk_other_holds
                     send "'ERROR : holds read at 0, rechecking*"
                  end
                  if ($steal_holds_exp > $chk_other_holds)
                     setVar $steal_holds_other $chk_other_holds
                  end
       end

                  #if ($chk_other_holds < $steal_holds)
                  #   setVar $steal_holds $chk_other_holds
                  #end

       :msg
       #send "'exp : " $exp " stealing " $steal_holds_exp " holds, divisor : " $ty_wsst_divisor " *"

:main_sst
setVar $curr_ship $ty_wsst_this_ship
send "p r * sz"
setTextTrigger fake :busted_sst "Do you want instructions (Y/N)"
setTextTrigger good :contmain "Which product?"
pause

:contmain
KillAllTriggers
#send "p r * s 3 " $steal_holds_this " * "
send " 3 " $steal_holds_this " * "
setTextTrigger 1 :success_sst "Success!"
setTextTrigger 2 :busted_sst "Suddenly you're Busted!"
pause

:success_sst
killalltriggers
send " x " $ty_wsst_other_ship " * q "
setVar $curr_ship $ty_wsst_other_ship
send "p r * sz"
setTextTrigger fake :busted_sst "Do you want instructions (Y/N)"
setTextTrigger good :contsst "Which product?"
pause

:contsst
KillAllTriggers
#send " p r * s 3 " $steal_holds_other " * "
send " 3 " $steal_holds_other " * "
setTextTrigger 1 :success_2_sst "Success!"
setTextTrigger 2 :busted_sst "Suddenly you're Busted!"
pause

:success_2_sst
killalltriggers
send " x " $ty_wsst_this_ship " * q "
setVar $curr_ship $ty_wsst_this_ship
#send " p t * * 0 * z n 0 * z n "
send " p t * * 0 * 0 * "
send "p r * s 3 " $steal_holds_this " * "
setTextTrigger 1 :success_3_sst "Success!"
setTextTrigger 2 :busted_sst "Suddenly you're Busted!"
pause

:success_3_sst
killalltriggers
send " x " $ty_wsst_other_ship " * q "
setVar $curr_ship $ty_wsst_other_ship
#send " p t * * 0 * z n 0 * z n "
send " p t * * 0 * 0 * "
send "p r * s 3 " $steal_holds_other " * "
setTextTrigger 1 :success_2_sst "Success!"
setTextTrigger 2 :busted_sst "Suddenly you're Busted!"
pause

:busted_sst
killalltriggers
if ($curr_ship = $ty_wsst_other_ship)
   setVar $bust_sector $other_ship_sector
else
    setVar $bust_sector $ty_wsst_this_ship_sector
end
setVar $busts[$bust_sector] 1
write $bust_list $bust_sector
setVar $bust_ship $curr_ship
#send "'busted : ship " $curr_ship " in sector " $bust_sector "! *"

:refurb
setVar $count 1
if ($curr_ship = $ty_wsst_this_ship)
   setVar $tow_target $other_ship_sector
else
   setVar $tow_target $ty_wsst_this_ship_sector
end
#send "'tow target sector : " $tow_target "*"

:move_to_tow
getDistance $dist $bust_sector $tow_target
            if ($dist > 1)
               goto :move_2
            else
               #send "'tow target adj*"
               send " m " $tow_target " * z n "
               goto :lock_move
            end
            
               :move_2
               #send "'tow target not adj!*"
               getCourse $short_course $bust_sector $tow_target
               send " m " $short_course[1] " * z n m " $short_course[2] " * z n m " $short_course[3] " * * "
               goto :lock_move
               
                    :lock_move
                    if ($curr_ship <> $ty_wsst_this_ship)
                       send " x " $ty_wsst_this_ship " * q "
                    end
                    send " w n " $ty_wsst_other_ship " *"
                    echo ansi_15 "*Locked And Ready to Refurb Holds!*"
                         if ($rpr > 1)
                            goto :multiple_runs
                         end
                         goto :move_terra

                         :multiple_runs
                         setVar $rpr_count ($rpr_count + 1)
                                if ($rpr_count >= $ty_wsst_rpr)
                                   setVar $rpr_count 0
                                   goto :move_terra
                                end
                       #  send "'beginning run " $rpr_count " - total before refurb : " $rpr "*"
                         setVar $sector $tow_target
                         goto :locate_1_port
:move_terra
setVar $sector $tow_target
setVar $dest $ty_wsst_class0
setVar $figattack $ty_wsst_fig_wave
goSub :lawn_mow
send "/"
waitFor "Creds"
getWord CURRENTLINE $chk_sect 2
stripText $chk_sect "Turns"
stripText $chk_sect #179
          if ($chk_sect <> $ty_wsst_class0)
            # send "'error : Not In Sector 1 - instead in sector " $chk_sect "!*"
             send "'error : not at class 0*"
             pause
          end
#send "'Arrived : Refurb Sector 1*"
send "w"

:re_furb
if ($bust_ship <> $ty_wsst_this_ship)
   send " x * " $other_ship " * q "
   setVar $curr_ship $ty_wsst_other_ship
else
   setVar $curr_ship $ty_wsst_this_ship
end

:dock_refurb_port
send "pt"
waitFor "You have"
getWord CURRENTLINE $credits 3
stripText $credits ","

:dock_triggers_check_limpet
setTextTrigger chk_1 :limpet "and removal? :"
setTextTrigger chk_2 :clean "Commerce report"
pause

     :limpet
     killalltriggers
     send "y"
     goto :dock_refurb_2

     :clean
     killalltriggers
     goto :dock_refurb_2

:dock_refurb_2
waitFor "Cargo holds"
getWord CURRENTLINE $holds_needed 10
send "a" $holds_needed "*y"
        if ($ty_wsst_restock = "YES")
           waitFor "Fighters"
           getWord CURRENTLINE $fig_price 4
           getWord CURRENTLINE $figs_avail 8
           #send "'figs avail : " $figs_avail "*"
                if ($figs_avail = 0)
                   goto :buy
                end
           if ($credits < 800000)
             # send "'not buying figs : insufficient credits*"
              goto :buy
           end
           setVar $avail_credits ($credits - 800000)
           setVar $pos_buy_figs ($avail_credits / $fig_price)
                  if ($figs_avail < $pos_buy_figs)
                     setVar $pos_buy_figs $figs_avail
                   #  send "'buying : " $pos_buy_figs "*"
                  end
                     send "b" $pos_buy_figs "*"
        end
:buy
#   send "'buying : " $holds_needed " holds*"

#OPTIONAL ADD ON : BUY SHIELDS


send "q"
     if ($rpr > 1)
        if ($checked_other = "NO")
           echo ansi_15 "*Checking Other Ship..."
          # send "'checking other ship*"
                if ($curr_ship = $ty_wsst_this_ship)
                   if ($ty_wsst_class0 = 1)
	                   send " x * " $ty_wsst_other_ship " * q "
	           else
	                   send " x " $ty_wsst_other_ship " * q "
		   end	           
                   setVar $curr_ship $ty_wsst_other_ship
                   setVar $checked_other "YES"
                   SetVar $WaitLine "[" & $ty_wsst_class0 & "]"
		   WaitFor $WaitLine
#                   send "'(furb_trig)*"
 #                  waitFor "(furb_trig)"
                   goto :dock_refurb_port
                elseif ($curr_ship = $ty_wsst_other_ship)
                   if ($ty_wsst_class0 = 1)
	                   send " x * " $ty_wsst_this_ship " * q "
	           else
	                   send " x " $ty_wsst_this_ship " * q "
		   end
                   setVar $curr_ship $ty_wsst_this_ship
                   setVar $checked_other "YES"
                   SetVar $WaitLine "[" & $ty_wsst_class0 & "]"
		   WaitFor $WaitLine
#                   send "'(furb_trig)*"
#                   waitFor "(furb_trig)"
                   goto :dock_refurb_port
                end
        end
    end

if ($curr_ship <> $ty_wsst_this_ship)
   send " x * " $ty_wsst_this_ship " * q "
end


send " w n " $other_ship " * "
#send "'furbed : tow locked : ready to roll out*"

:get_next_target
getRnd $random_jump 11 SECTORS
       if ($busts[$random_jump] = 1)
          goto :get_next_target
       end


:move_to_random
setVar $checked_other "NO"
setVar $sector $ty_wsst_class0
setVar $dest $random_jump
setVar $figattack $fig_wave
goSub :lawn_mow
send "/"
waitFor "Creds"
getWord CURRENTLINE $chk_sect 2
stripText $chk_sect "Turns"
stripText $chk_sect #179
          if ($chk_sect <> $random_jump)
             send "'error : Not In Sector " $random_jump " - instead in sector " $chk_sect "!*"
             pause
          end
#send "'Arrived : Jump Sector : " $random_jump "*"
setVar $sector $random_jump
goto :locate_1_port

#----------------------------SUBROUTINES---------------------------------#
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

#LAWNMOWING SUB #

:lawn_mow
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
#send "'(charge) " $sector " -> " $dest "  [" $length " hops]*"

:blast
killalltriggers
if ($count < $length)
  add $count 1
    if ($plength[$count] = STARDOCK) OR ($plength[$count] < 11)
      send "m" $plength[$count] " * z n "
      setDelayTrigger go_blast1 :blast 100
      pause
    else
      send "m" $plength[$count] " * z a " $figattack " * z n f z q z 1 * z q z c z q z d * "
      setDelayTrigger go_blast :blast 100
      pause
   end
end

:done
return
