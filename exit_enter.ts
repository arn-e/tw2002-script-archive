:main
#REMEMBER TO MODIFY PASSWORD
getWord CURRENTLINE $location 1
if ($location <> "Command")
  echo ansi_9 "**Not at Command Prompt - halting...**"
    halt
else
  goto :start

:start
echo ansi_10 "**-=" ansi_11 "$playerName's battlefield exit/enter - loadAng..." ansi_10 "=-"
echo ansi_10 "*1." ansi_13 "enter --> " ansi_15 "RETREAT " ansi_13 " (off enemy fig)"
echo ansi_10 "*2." ansi_13 "enter --> " ansi_12 "KILL FIG MACRO"
echo "*"
getConsoleInput $choice SINGLEKEY
isNumber $test $choice
if ($choice = "q")
  echo ansi_10 "*halting*"
   halt
elseif ($test = 0)
   echo ansi_11 "*aint a number, resetting*"
     goto :start
 else
   goto :chknum
end

:chknum
  if ($choice < 0)
    echo ansi_11 "*too low, resetting*"
  elseif ($choice > 2)
    echo ansi_11 "*too high, resetting*"
  elseif ($choice = 1)
    goto :retreat
  elseif ($choice = 2)
    goto :killfig
  end

:retreat
send "q q q y y T** *$userPassword* * * * r z a 999* z n z n f 1* c d "
halt

:killfig
send "q q q y y T** *$userPassword* * * * z a 9999* z n z n f 1* c d "
halt
