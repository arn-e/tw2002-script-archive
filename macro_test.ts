#macro looper

:vars
setVar $count 0
setVar $script "(macro)"
setVar $scriptname "$playerName's custom macro"
setVar $version "v. 1.0"
#setVar $cn9 "OFF"
#setVar $delay 200
#setVar $macro ""
#setVar $loops 1
#setVar $oldmac ""
#setVar $ty_mac_cn9 "OFF"

        :load_save_vars
        loadVar $TyMacroSaved
                if ($TyMacroSaved)
                   loadVar $ty_mac_cn9
                   loadVar $ty_mac_delay
                   loadVar $ty_mac_macro
                   loadVar $ty_mac_loops
                   loadVar $ty_mac_oldmac
                else
                   setVar $ty_mac_cn9 "OFF"
                   setVar $ty_mac_delay 200
                   setVar $ty_mac_macro ""
                   setVar $ty_mac_loops 1
                   setVar $ty_mac_oldmac ""
                   
                   saveVar $ty_mac_cn9
                   saveVar $ty_mac_delay
                   saveVar $ty_mac_macro
                   saveVar $ty_mac_loops
                   saveVar $ty_mac_oldmac
                   
                   setVar $TyMacroSaved 1
                   saveVar $TyMacroSaved
                end

:main
getWord CURRENTLINE $location 1
   if ($location = "Command")
   elseif ($location = "Citadel")
   elseif ($location = "Planet")
   elseif ($location = "Computer")
   else
      setVar $location "Unknown"
   end

getLength $scriptname $max
getLength $version $len
goSub :checkmax

:ansimenu
killalltriggers
echo "[2J"

echo ANSI_6 "**-" ansi_2 "=" ansi_9 "(" 
setVar $text $scriptname
goSub :addspc
setVar $scriptdisplay $text
echo ansi_15 $scriptdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-*"

echo ANSI_6 "-" ansi_2 "=" ansi_9 "(" 
setVar $text $version
goSub :addspc
setvar $verdisplay $text
echo ansi_15 $verdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-**"

echo ansi_14 "1." ansi_15 " Macro String  : " ansi_9 "[" ansi_6 $ty_mac_macro ansi_9 "]*"
echo ansi_14 "2." ansi_15 " Loops         : " ansi_9 "[" ansi_6 $ty_mac_loops ansi_9 "]*"
echo ansi_14 "3." ansi_15 " CN9 emulation : " ansi_9 "[" ansi_6 $ty_mac_cn9 ansi_9 "]*"
echo ansi_14 "4." ansi_15 " MS Delay      : " ansi_9 "[" ansi_6 $ty_mac_delay ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY

if ($choice = "1")
   echo "*Macro :  "
     getConsoleInput $ty_mac_macro
     echo "[2J"
     goto :ansimenu

elseif ($choice = "2")
   echo "*Loops :  "
     getConsoleInput $ty_mac_loops
     echo "[2J"
     goto :ansimenu

elseif ($choice = "3")
   if ($ty_mac_cn9 = "OFF")
     setVar $ty_mac_cn9 "ON"
     goSub :emuCN9
   elseif ($ty_mac_cn9 = "ON")
     setVar $ty_mac_cn9 "OFF"
     setVar $ty_mac_macro $ty_mac_oldmac
   end

   echo "[2J"
   goto :ansimenu

elseif ($choice = "4")
   echo "*Delay :  "
   getConsoleInput $ty_mac_delay
   echo "[2J"
   goto :ansimenu

elseif ($choice = "c")
    goto :test_macro

else
   echo "[2J"
   goto :ansimenu

end

:test_macro
                   saveVar $ty_mac_cn9
                   saveVar $ty_mac_delay
                   saveVar $ty_mac_macro
                   saveVar $ty_mac_loops
                   saveVar $ty_mac_oldmac
                   
                   setVar $TyMacroSaved 1
                   saveVar $TyMacroSaved

replaceText $ty_mac_macro #42 "*"
killalltriggers
send $ty_mac_macro
setDelayTrigger complete :loop_macro 2000
pause

:loop_macro
if ($ty_mac_cn9 = "Off")
  getLength $ty_mac_macro $maclen
elseif ($cn9 = "On")
  getLength $ty_mac_oldmac $maclen
end

echo "*Begin Loop ? (y/n)*"
getConsoleInput $yesno SINGLEKEY

   if ($yesno = "y")
      goto :begin_loop
   elseif ($yesno = "n")
      goto :ansimenu
   else
     goto :loop_macro
   end

:begin_loop
send "'" $script " : beginning loop...*"
setVar $count 1

       :fire_macro
       if ($count >= $ty_mac_loops)
         goto :done
       end
       send $ty_mac_macro
       add $count 1
       setDelayTrigger 2 :fire_macro $ty_mac_delay
       pause

:done
send "'" $script " : " $ty_mac_loops " loops completed*"
halt


#------------------------------#####SUBROUTINES#####------------------------------------#

:addspc
getLength $text $len
if ($len < $max)
	setVar $spaces ($max - $len)
	if ($spaces = 1)
		setVar $text " " & $text
	else
		setVar $spaces ($spaces / 2)
		setVar $cnt 0
		:addfront
		if ($cnt < $spaces)
			add $cnt 1
			setVar $text " " & $text
			goto :addfront
		end
		setVar $cnt 0
		:addback
		if ($cnt < $spaces)
			add $cnt 1
			setVar $text $text & " " 
			goto :addback
		end
		getLength $text $len
		if ($len < $max)
			setVar $text " " & $text
		end
	end
end
return

:checkMax
if ($len > $max)
	setVar $max $len
end
return

:emuCN9
killalltriggers

if ($ty_mac_macro = $newmac)
   setVar $ty_mac_macro $ty_mac_oldmac
end

getLength $ty_mac_macro $len
setVar $count 1
setVar $ty_mac_oldmac $ty_mac_macro
setVar $newmac ""

  while ($count <= $len)
     cutText $ty_mac_macro $char $count 1
     setVar $newmac $newmac & " " & $char
     add $count 1
  end

setVar $newmac $newmac & " "
setVar $ty_mac_macro $newmac
return 
