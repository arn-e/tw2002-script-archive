#adjacent photon
                                        
:vars
setvar $count 1
setvar $script "(foton'Z!)"
setvar $scriptname "$playerName's adjacent photon"
setVar $version "v. 0.1"

:main
killalltriggers
getWord CURRENTLINE $location 1
if ($location = "Command")
   setvar $line CURRENTLINE
   getText $line $sector "]:[" "] (?"
   goto :get_adj
else
   send "/"
   setTextLineTrigger 1 :get_sector "Sect"
   pause
end

   :get_sector
   killalltriggers
   setVar $line CURRENTLINE
   getWord $line $sector 2
   stripText $sector "Turns"
   stripText $sector #179
   
             :get_adj
             setVar $count 1
             setVar $warpcount SECTOR.WARPCOUNT[$sector]
             setArray $adj_warp 6
                while ($count <= $warpcount)
                    setVar $adj_warp[$count] SECTOR.WARPS[$sector][$count]
                    add $count 1
                end

                :set_trig_vars
                setVar $adj_1 $adj_warp[1]
                setVar $adj_2 $adj_warp[2]
                setVar $adj_3 $adj_warp[3]
                setVar $adj_4 $adj_warp[4]
                setvar $adj_5 $adj_warp[5]
                setVar $adj_6 $adj_warp[6]

                       :set_triggers
                       killalltriggers
                       send "'" $script " [adj] : active*"
                       setTextTrigger l_1 :fire_1 "Limpet mine in " & $adj_1 & " activated"
                       setTextTrigger l_2 :fire_2 "Limpet mine in " & $adj_2 & " activated"
                       setTextTrigger l_3 :fire_3 "Limpet mine in " & $adj_3 & " activated"
                       setTextTrigger l_4 :fire_4 "Limpet mine in " & $adj_4 & " activated"
                       setTextTrigger l_5 :fire_5 "Limpet mine in " & $adj_5 & " activated"
                       setTextTrigger l_6 :fire_6 "Limpet mine in " & $adj_6 & " activated"
                       setTextTrigger 1 :fire_1 "Report Sector " & $adj_1 & ":"
                       setTextTrigger 2 :fire_2 "Report Sector " & $adj_2 & ":"
                       setTextTrigger 3 :fire_3 "Report Sector " & $adj_3 & ":"
                       setTextTrigger 4 :fire_4 "Report Sector " & $adj_4 & ":"
                       setTextTrigger 5 :fire_5 "Report Sector " & $adj_5 & ":"
                       setTextTrigger 6 :fire_6 "Report Sector " & $adj_6 & ":"
                       settextOutTrigger pause :pause ">"
                       pause

                            :fire_1
                            killalltriggers
                            send "c p y " $adj_1 "* q "
                            #send $adj_1 "* q"
                            send "'" $script " [adj] : " $sector " -> " $adj_1 "*"
                            goto :pause


                            :fire_2
                            killalltriggers
                            send "c p y " $adj_2 "* q "
                            #send $adj_2 "* q"
                            send "'" $script " [adj] : " $sector " -> " $adj_2 "*"
                            goto :pause


                            :fire_3
                            killalltriggers
                            send "c p y " $adj_3 "* q "
                            #send $adj_3 "* q"
                            send "'" $script " [adj] : " $sector " -> " $adj_3 "*"
                            goto :pause

                            :fire_4
                            killalltriggers
                            send "c p y " $adj_4 "* q "
                            #send $adj_4 "* q"
                            send "'" $script " [adj] : " $sector " -> " $adj_4 "*"
                            goto :pause


                            :fire_5
                            killalltriggers
                            send "c p y " $adj_5 "* q "
                            #send $adj_5 "* q"
                            send "'" $script " [adj] : " $sector " -> " $adj_5 "*"
                            goto :pause


                            :fire_6
                            killalltriggers
                            send "c p y " $adj_6 "* q "
                            #    send $adj_6 "* q"
                            send "'" $script " [adj] : " $sector " -> " $adj_6 "*"
                            goto :pause

                        :pause
                        killalltriggers
                        send "'" $script " [adj] : paused*"
                        setTextOutTrigger re_activate :main ">"
                        pause




