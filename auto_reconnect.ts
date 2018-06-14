#connect and dock

:vars
setVar $count 1

:main
killalltriggers
connect
setTextTrigger 1 :connected "(ENTER for none)"
setDelayTrigger 2 :check 25000
pause

:check
killalltriggers
if (CONNECTED = 0)
   goto :main
end

:connected
killalltriggers
send "j*"
setDelayTrigger game :select_game 6000
pause

:select_game
killalltriggers
send "a"
waitfor "[Pause]"
send "*"
waitfor "Enter your choice:"
send "T * * * $userPassword* * * * z n z n z n"
setDelayTrigger chk_location :chk_loc2 5000
pause

     :chk_loc2
     killalltriggers
     getWord CURRENTLINE $location 1
             if ($location = "Command")
                send "l31*c"
                halt
             else
                goto :send_ss
             end
             
                :send_ss
                killalltriggers
                send "l31*c"
               # setDelayTrigger resend :send_ss 60000
                pause

halt






