#quick world buydown

:vars
setVar $count 0
setArray $port_list SECTORS
#setArray $bust_list SECTORS
setArray $bought_down SECTORS
setArray $fig_list SECTORS
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $bought_file GAMENAME & "-bought_ports" & ".txt"
setVar $runs 0
setVar $sector ""

:get_holds
send "i"
waitFor "Total Holds"
setVar $line CURRENTLINE
getWord $line $Holds 4
        :debug
        send "'wbuydown : DEBUG : Holds : " $holds "*"

        goSub :getinfo

:run_choice_prompt
getInput $run_choice "*How many ports to buy down?*"

echo ansi_11 "*Read previously bought down list? (Y/N)*"
getConsoleInput $bought_choice SINGLEKEY
                if ($bought_choice = "y") OR ($bought_choice = "Y")
                   goto :read_bought_list
                else
                    goto :read_fig_list
                end

:read_bought_list
send "'wbuydown : reading bought port list...*"

                    setVar $count 1
                                               while ($sector <> EOF)
                                                     read $bought_file $sector $count
                                                          if ($sector = EOF)
                                                             setVar $sector ""
                                                             goto :done_read_bought
                                                          end
                                                     setVar $bought_down[$sector] 1
                                                     add $count 1
                                               end

:done_read_bought
killalltriggers
send "'wbuydown : bought port list refreshed*"
setVar $count 0
setVar $sector ""

:read_fig_list
send "'wbuydown : reading fig list...*"

                                        setVar $count 1
                                               while ($sector <> EOF)
                                                     read $fig_file $sector $count
                                                          if ($sector = EOF)
                                                             setVar $sector ""
                                                             goto :done_read_figs
                                                          end
                                                     setVar $fig_list[$sector] 1
                                                     add $count 1
                                               end
                                              # setVar $count 0

:done_read_figs
send "'wbuydown : fig list refreshed*"
setVar $count 0
setVar $sector ""

:start
echo ansi_11 "*Read Bust List? (y/n)*"
getConsoleInput $bust_choice SINGLEKEY
                if ($bust_choice = "y") OR ($bust_choice = "Y")
                   setArray $bust_list SECTORS
                   goto :read_bust_list
                else
                    goto :read_port_list
                end

:read_bust_list
setVar $bust_file GAMENAME & "-bust_list" & ".txt"
send "'wbuydown : reading bust list...*"

                                        :read_busts
                                        setVar $count 1
                                               while ($sector <> EOF)
                                                     read $bust_file $sector $count
                                                          if ($sector = EOF)
                                                             setVar $sector ""
                                                             goto :done_read_bust
                                                          end
                                                     setVar $bust_list[$sector] 1
                                                     add $count 1
                                               end

:done_read_bust
send "'wbuydown : bust list refreshed...*"
setVar $count 0

:read_port_list
setVar $count 11
       :continue_read_port_list
       send "'wbuydown : looking for next port...*"
       while ($count <= SECTORS)
             if (PORT.CLASS[$count] = 3) or (PORT.CLASS[$count] = 4) OR (PORT.CLASS[$count] = 5) or (PORT.CLASS[$count] = 7)
                if ($bust_list[$count] = 0)
                   if ($bought_down[$count] = 0)
                      if ($fig_list[$count] = 1)
                         goto :warp_buydown
                      end
                   end
                end
             end
             add $count 1
       end
       :finished
       send "'wbuydown : out of ports*"
       halt
       
:warp_buydown
setVar $target_sector $count
       send "'wbuydown : buying down in sector " $target_sector "*"
       send "p" $target_sector "*y"
       
       :upgrade_port
       add $runs 1
       send "qqo1"
            setTextTrigger get_num_units :get_max "0 to quit)"
            pause
            
            :get_max
            killalltriggers
            setVar $line CURRENTLINE
            getText $line $num_units "(" "max"
            stripText $num_units " "
                     # send "'wbuydown debug : " $num_units "*"
                     # pause
                      if ($num_units < 500)
                         #send "'not enough upgradeable slots, halting*"
                         setVar $bought_down[$target_sector] 1
                                write $bought_file $target_sector
                         send "0*l" $planetnum "*c"
                         goto :check_port

                      end
            send $num_units "*ql" $planetnum "*c"

            :check_port
            killalltriggers
            send "cr*"
            waitFor "Fuel Ore"
            setVar $line CURRENTLINE
            getWord $line $amt_avail 4
                    :debug
                    send "'wbuydown : DEBUG : amt available : " $amt_avail "*"
                    #send "'wbuydown : DEBUG : " $line "*"
                    #pause

            :calc_loops
            setVar $loops ($amt_avail / $holds)
                   :debug
                   send "'wbuydown : DEBUG : loops to run : " $loops "*"

                   #get off computer prompt
                   send "q"
                   
                        if ($loops < 5)
                           send "'wbuydown : DEBUG : insufficient ore on port, aborting*"
                           goto :continue_read_port_list
                        end

       :buydown_macro
       send "'wbuydown : beginning buydown " $runs " of " $run_choice "*"
       setVar $bought_down[$target_sector] 1
       write $bought_file $target_sector
       setVar $buydown_count 1
              send "qq"
              while ($buydown_count < $loops)
                    send "pt**l" $planetnum "*tnl1*q"
                    add $buydown_count 1
              end
              :done_buydown
              send "'wbuydown ::done*"
              
       :end_trigger
       killalltriggers
       setTextTrigger done_buydown_check :confirmed "::done"
       pause
       
:confirmed
killalltriggers
send "l7*c"
     if ($runs = $run_choice) OR ($runs > $run_choice)
        send "'wbuydown finished : " $run_choice " cycles completed*"
        halt
     end

goto :continue_read_port_list


##SUBS##
:getinfo
    send "qd"
    waitfor "Planet #"
    getword CURRENTLINE $planetnum 2
    getword CURRENTLINE $sector 5
    striptext $planetnum "#"
    striptext $sector ":"
    send "c"
    waitfor "Citadel command (?=help)"
    return
