:vars                       
setVar $count 0
setVar $total 0
setVar $title "(ph00n_defender)"
lowerCase $title
setVar $version "v. 2.00b"
lowerCase $version
setVar $corpload "OFF"
setVar $IGprot "OFF"

:main
getWord CURRENTLINE $location 1
if ($location <> "Command")
   echo ansi_12 "**not at command prompt**"
      halt
end
getText CURRENTLINE $sector "]:[" "] (?=H"
echo ansi_15 "** refill after how many figs lost?*"
getConsoleInput $figs
echo ansi_15 "** which planet to refill from?*"
getConsoleInput $planet
echo ansi_15 "** IG protection on/off? - (1 = ON / 2 = OFF)*"
getConsoleInput $IGinput
  if ($IGinput = 1)
    setVar $IGprot "ON"
  end
echo ansi_15 "** Corpie reloader on/off (1 = ON / 2 = OFF) " ansi_12 " Warning : " ansi_15 " may not beat a concentrated attack*"
getconsoleInput $corpinput
if ($corpinput = 1)
  setVar $corpload "ON"
    echo ansi_10 "*corpie name?*"
      getConsoleInput $corpiename 
      stripText $corpiename " "
    echo ansi_10 "*total fig count on corpie's ship?*"
      getConsoleInput $corpiefigs
    echo ansi_10 "*after how many figs to reload corpie?*"
      getConsoleInput $cfiglvl
end

:getinfo
send "i"
setTextLineTrigger figchk :getfigs "Fighters"
pause

:getfigs
killalltriggers
getWord CURRENTLINE $figsavail 3
stripText $figsavail ","

:msg
echo ansi_12 "** loaded...**"
send "'*" $title " " $version " : loCked-n-loaded with  : " $figsavail " figs"
send " *                            reloading from planet : " $planet
send " *                            IG auto-reset         : " $IGprot
send " *                            corpie reloader       : " $corpload "**"

:triggers
killalltriggers
getWord CURRENTLINE $test 1
        if ($test = "Computer")
           send "q"
        elseif ($test = "Which")
           send "qq"
        end
setTextLineTrigger 0 :photon "launched a P-Missile"
setTextLineTrigger 1 :attck "Shipboard Computers"
setTextLineTrigger 2 :corpload "launches a wave of fighters"
setDelayTrigger msgdelay :short_msg 500000
pause

:short_msg
killalltriggers
send "'" $title " : reload_planet [" $planet "] IG_reset [" $igprot "] corp_reload [" $corpload "]*"
goto :triggers

:attck
killalltriggers
setVar $line CURRENTLINE
getWord $line $check 1
if ($check <> "Shipboard")
   echo ansi_11 "**fake trigger - resetting**"
     goto :triggers
end
getText $line $damage "destroyed " " fighters"
isNumber $test $damage
if ($test = 0)
    goto :triggers
end
add $total $damage
if ($total > $figs)
    goto :refill
else
   goto :triggers
end

:refill
send "l" $planet "  * m n t * q z n"
setVar $total 0
goto :triggers

:photon
killalltriggers
if ($IGprot = "OFF")
  goto :triggers
end
send "b"
setTextLineTrigger 3 :onoff "Interdictor generator is"
setTextLinetrigger 4 :notavail "is not equipped with"
pause

:onoff
killalltriggers
getWord CURRENTLINE $onoff 6
if ($onoff = "OFF")
     send "y"
     send "'" $title " i ate a photon : IG reset*"
     goto :triggers
elseif ($onoff = "ON")
     send "n"
     goto :triggers
end

:notavail
killalltriggers
echo ansi_11 "*no IC, resetting*"
  goto :triggers

:corpload
killalltriggers
if ($corpload = "OFF")
  goto :triggers
end
getWordPos CURRENTLINE $atpos "at"
cutText CURRENTLINE $namechk ($atpos + 3) 25
stripText $namechk " "

if ($namechk <> $corpiename)
  goto :triggers
end

send "tf"
:chkcorploop
waitfor "Exchange with"
setVar $line CURRENTLINE
getText $line $chkcorpie "Exchange with " " (Y/N)"
stripText $chkcorpie " "
if ($chkcorpie = $corpiename)
  send "yt"
   waitFor "You have"
    getWordPos CURRENTLINE $haspos "has"
     cutText CURRENTLINE $cfig1 ($haspos + 4) 8
     stripText $cfig1 " "
     stripText $cfig1 "."
else
  send "n"
    goto :chkcorploop
end
setVar $diff ($corpiefigs - $cfig1)
if ($diff < $cfiglvl)
 send "0*q"
  goto :triggers
end
send $diff "*"
send "q"
goto :refill


