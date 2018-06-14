#Simple custom trigger script
#Asks for trigger, as well as the response
#Obviously, not spoof proof :P

:vars
setVar $count 0
setVar $scriptname "$playerName's Custom Trigger"
setVar $script "(Custom_Trigger)"
setVar $version "v. 1.0"

:get_inputs
echo ansi_11 "*Enter the desired Trigger : *"
getConsoleInput $trigger 
echo ansi_11 "*Enter the desired Response : *"
getConsoleInput $response

:test_response
replaceText $response #42 "*"

:wait
killalltriggers
setTextTrigger 1 :trigger_activated $trigger
pause

:trigger_activated
killalltriggers
send $response

:script_paused
echo ansi_11 "*Custom Responder " ansi_12 "PAUSED " ansi_11 "--- press " ansi_13 " [ " ansi_11 " to resume *"
killalltriggers
setTextOutTrigger 2 :un_paused "["
pause

:un_paused
killalltriggers
echo ansi_11 "*Custom Responder " ansi_12 "ACTIVE*"
goto :wait
