#saveme

:vars
setVar $count 0

:main
getWord CURRENTLINE $location 1
  if ($location <> "Command")
    echo ansi_12 "**get to command prompt**"
      halt
   end
setVar $line CURRENTLINE
getText $line $sector "]:[" "] (?"
send "f"
setTextTrigger enemyfigs :enemyfig "fighters are not under"
setTextTrigger nofigs :nofigs "fighters available."
pause

:enemyfig
killalltriggers
send "'(ph00n-saveme) : can't lay fig in " $sector " - crap*"
halt

:nofigs
send " 1 * c d "
getlength $sector $length
if ($length = 2)
   send "'000" $sector "=saveme*"
   send "'pickup " $sector " ::*"
   halt
elseif ($length = 3)
   send "'00" $sector "=saveme*"
   send "'pickup " $sector " ::*"
   halt
elseif ($length = 4)
   send "'0" $sector "=saveme*"
   send "'pickup " $sector " ::*"
   halt
elseif ($length = 5)
   send "'" $sector "=saveme*"
   send "'pickup " $sector " ::*"
   halt
end

