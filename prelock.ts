#choosekill

:vars
setVar $count 1
setVar $script "(ambush'er)"
setvar $scriptname "$playerName's user-target pdrop"

:main
getWord CURRENTLINE $location 1
if ($location <> "Citadel")
   echo "*bad prompt*"
   halt
end

goSub :getinfo

:input
echo "*Enter fig wave : "
getconsoleinput $figwave
echo "*How many times to fire : "
getconsoleinput $how_many

:choice
echo ansi_15 "*Return home (" ansi_12 "y" ansi_15 "/" ansi_12 "n" ansi_15 ") : "
getconsoleinput $return_choice SINGLEKEY

if ($return_choice = "y")
   setVar $return "YES"
elseif ($return_choice = "n")
   setVar $return "NO"
else
   goto :choice
end

:standby
killalltriggers
echo "*script in standby - press > to activate*"
setTextOutTrigger activate :activate ">"
pause

:activate
killalltriggers
echo "*sector to prelock : "
getconsoleinput $target_sector

:lock
send "p" $target_sector "*"
setTextTrigger locked :locked "All Systems Ready,"
pause

:locked
killalltriggers
send "'" $script " : prelocked on sector " $target_sector "*"
setTextTrigger go :go "Report Sector " & $target_sector & ":"
pause

:go
killalltriggers
send " y "
setVar $count 1
goto :attack

:attack
killalltriggers
if ($count <= $how_many)
   send " q q a y y " $figwave " * * l " $planet " * m n t * c "
   add $count 1
   setDelayTrigger attack_wave :attack 50
   pause
end

setVar $count 1

:return
if ($return = "NO")
send "'" $script " : drop_attacked sector [" $target_sector "] - return_home [" $return "]*"
else
send "p" $sector "* y "
send "'" $script " : drop_attacked sector [" $target_sector "] - back at base - paused*"
end

##temp sound
sound mrlif.wav
goto :standby



#-----------------SUBROUTINES-----------------------#

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
