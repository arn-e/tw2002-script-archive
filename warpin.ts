#auto-warp in

:vars
setVar $count 0
setVar $script "(auto_warpin)"

:main
getWord CURRENTLINE $location 1
        if ($location = "Command") OR ($location = "Citadel")
           setVar $go "YES"
           goto :start_script
        else
           setVar $go "NO"
           echo "*must be at Command or Citadel prompt*"
           halt
        end
        
        
:start_script

:get_location
if ($location = "Command")
   getText CURRENTLINE $sector "]:[" "] (?"
else
   send "/"
   waitFor "Sect"
   getWord CURRENTLINE $sector 2
   stripText $sector "Turns"
   stripText $sector #179
end

:set_array
setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $adj_warp $warpcount
setVar $count 1
       while ($count <= $warpcount)
             setVar $adj_warp[$count] SECTOR.WARPS[$sector][$count]
             setVar $temp_adj $adj_warp[$count]
             if (SECTOR.TRADERCOUNT[$temp_adj] <> 0)
                setVar $target $temp_adj
                goto :warp_in
             end
             add $count 1
       end
       
       :no_target_found
       setVar $count 1
       echo ansi_15 "*No targets found - halting*"
       halt
       
       :warp_in
       setVar $count 1
       if ($location = "Citadel")
          echo ansi_15 "**Warp planet? " ansi_12 "(" ansi_11 "Y" ansi_12 "/" ansi_11 "N" ansi_12 ")"
          getConsoleInput $warp_choice SINGLEKEY
                          if ($warp_choice = "y")
                             setVar $planet_warp "YES"
                             goto :planet_warp
                          else
                             setVar $planet_warp "NO"
                             send "q q "
                             goto :move
                          end
                          
       else
           goto :move
       end
       
:move
send "m " $target " * z a 987 * z n f z q z 1 * z q z c z q z o *"
echo "*WARPED*"
halt

:planet_warp
getDistance $dist $target $sector
            if ($dist <> 1)
               echo ansi_12 "**ERROR " ansi_15 " : " $target " IS A 1-WAY - halting*"
               halt
            end
goSub :getinfo
      if ($level < 4)
         echo ansi_12 "**NOT A LVL 4 PLANET - HALTING**"
         halt
      end
      
         :move_warp
         send "q q m " $target " * z a 987 * z n f z q z 1 * z q z c z q z o * m " $sector " * z n z n l " $planet " * m n t * c p" $target " * y "
         echo "**WARPED**"
         halt


#-----------SUBROUTINES--------------

:getinfo
    send "qd"
    waitfor "Planet #"
    getword CURRENTLINE $planet 2
    getword CURRENTLINE $sector 5
    striptext $planet "#"
    striptext $sector ":"
    waitfor "Planet has a level"
    getword CURRENTLINE $level 5
    send "c"
    waitfor "Citadel command (?=help)"
    return

