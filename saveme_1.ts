#saveme
:vars
setVar $count 1
setVar $version 1.01b
lowerCase $version

:main
getWord CURRENTLINE $location 1
if ($location <> "Citadel")
  echo ansi_12 "**not at the correct prompt**"
   halt
end
goSub :getinfo
send "'(ph00n-saveme) v. " $version " | running from planet " $planet "*"

:triggers
goSub :vars1
killalltriggers
setTextTrigger saveme :saveme "=saveme" 
setTextTrigger pickup :pickup "pickup"
pause

:saveme
killalltriggers
getWord CURRENTLINE $test 1
if ($test <> "R")
   echo "*false trigger*"
     goto :triggers
end
setVar $line CURRENTLINE
getWordPos $line $startpos "R"
cutText $line $theirsector ($startpos + 8) 9
replaceText $theirsector " 0" " "
replaceText $theirsector " 0" " "
replaceText $theirsector " 0" " "
stripText $theirsector "="
stripText $theirsector "s"
stripText $theirsector "a"
stripText $theirsector " "




:warpattempt
if ($count = 35)
   send "'(ph00n-saveme) v. " $version " | 35 failed attempts, halting*"
     goto :triggers
end
send "p" $theirsector " *"
setTextTrigger nofig :nofigdown "You do not have any fighters"
setTextTrigger fig :figdown "Locating beam pinpointed,"
pause

:nofigdown
killalltriggers
add $count 1
goto :warpattempt

:figdown
killalltriggers
send "y"
setTextTrigger beamlost :beamlost "Locator beam lost."
setTextTrigger success :success "TransWarp Drive Engaged!"
pause

:beamlost
killalltriggers
 send "'(ph00n-saveme) v. " $version " | locator beam lost, resetting*"
  goto :warpattempt

:success
killalltriggers
send "'Saveme script activated - Planet " $planet " to " $theirsector " on attempt " $count "*"
goto :triggers



:getinfo
    send "qd"
    waitfor "Planet #"
    getword CURRENTLINE $planet 2
    getword CURRENTLINE $sector 5
    striptext $planet "#"
    striptext $sector ":"
    send "c"
    waitfor "Citadel command (?=help)"
    return

:vars1 
setVar $count 1
return