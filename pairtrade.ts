#pair trader

:vars
setVar $count 1
setVar $script "(pairtrade)"
setVar $scriptname "$playerName's pair trade"
setVar $version "v. 0.01a"
setVar $trade_mode "Haggle"

:main
getWord CURRENTLINE $location 1
   if ($location <> "Command")
      echo "*not command prompt*"
      halt
   end

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

echo ansi_14 "--" ansi_15 " trade mode   : " ansi_9 "[" ansi_6 $trade_mode ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY

if ($choice = "1")
   if ($trade_mode = "Haggle")
      setVar $trade_mode "No Haggle")
      echo "[2J"
      goto :ansimenu
   else
      setVar $trade_mode "Haggle"
      echo "[2J"
      goto :ansimenu
   end
elseif ($choice = "c")
   goto :start
end

:start
killalltriggers
echo "*script in standby - > to activate*"
setTextOutTrigger 1 :un_pause ">"
pause

:un_pause
killalltriggers
echo "*script activated*"
getText CURRENTLINE $sector "]:[" "] (?"
send "d"
setTextTrigger 2 :update_sector "Command [TL="
pause

:update_sector
killalltriggers
getSector $sector $sector_info
if ($sector_info.port.exists = 0)
   echo "*no port in sector, returning to standby*"
   goto :start
end
setVar $port_class $sector_info.port.class

if ($port_class = 1)
    setVar $port_type "BBS"
elseif ($port_class = 2)
    setVar $port_type "BSB"
elseif ($port_class = 3)
    setVar $port_type "SBB"
elseif ($port_class = 4)
    setVar $port_type "SSB"
elseif ($port_class = 5)
    setVar $port_type "SBS"
elseif ($port_class = 6)
    setVar $port_type "BSS"
elseif ($port_class = 7)
    setVar $port_type "SSS"
elseif ($port_class = 8)
    setVar $port_type "BBB"
end

setVar $warpcount SECTOR.WARPCOUNT[$sector]
setArray $adjwarps $warpcount
setArray $adjports $warpcount
setArray $adjfigs $warpcount
setArray $adjport_class $warpcount
setArray $adjport_type $warpcount
setVar $port_track 0
while ($count <= $warpcount)
    setVar $adjwarps[$count] SECTOR.WARPS[$sector][$count]
       getSector $adjwarps[$count] $temp_sector
       if ($temp_sector.port.exists = 1)
           setVar $port_track ($port_track + 1)
           setVar $adjports[$count] 1
           setVar $adj_class $temp_sector.port.class
           setVar $adjport_class[$count] $adj_class
                  if ($adj_class = 1)
                      setVar $adjport_type[$count] "BBS"
                  elseif ($adj_class = 2)
                      setVar $adjport_type[$count] "BSB"
                  elseif ($adj_class = 3)
                      setVar $adjport_type[$count] "SBB"
                  elseif ($adj_class = 4)
                      setVar $adjport_type[$count] "SSB"
                  elseif ($adj_class = 5)
                      setVar $adjport_type[$count] "SBS"
                  elseif ($adj_class = 6)
                      setVar $adjport_type[$count] "BSS"
                  elseif ($adj_class = 7)
                      setVar $adjport_type[$count] "SSS"
                  elseif ($adj_class = 8)
                      setVar $adjport_type[$count] "BBB"
                  end
       end
       if ($temp_sector.figs.quantity > 0)
           if ($temp_sector.figs.owner = "belong to your Corp")
              setVar $adjfigs[$count] 0
           else
              setVar $adjfigs[$count] 1
           end
       end
    add $count 1
end
setVar $count 1

:chk_adjacent_exist
if ($port_track = 0)
   echo "*no adj ports*"
   goto :start
end

:user_choice_menu
killalltriggers
setVar $count 1
setVar $list_count 0
echo ansi_15 "*--[ " ansi_14 " Pair-Trade Options : " ansi_15 "]--"
echo ansi_13 "*-- CURRENTSECTOR : " $ansi_11 $sector " ("
while ($count <= $warpcount)
     if ($adjports[$count] = 1)
         if ($adjfigs[$count] = 0)
            add $list_count 1
            echo ansi_13 "*" $count "." ansi_11 " " $adjwarps[$count] " (" $adjport_type[$count] ")"
         end
     end
     add $count 1
end
if ($list_count = 0)
   echo ansi_12 "*NO UNFIGGED PORTS ADJACENT - " ansi_11 "resetting*"
   goto :start
end

echo "*"
setVar $count 1

getConsoleInput $choice SINGLEKEY
   if ($adjfigs[$choice] = 1)
       echo "*invalid choice*"
       goto :user_choice_menu
   end
   if ($adjports[$choice] = 0)
       echo "*invalid choice*"
       goto :user_choice_menu
   end
   if ($choice > $list_count)
       echo "*invalid choice*"
       goto :user_choice_menu
   end

setVar $trade_sector_1 $sector
setvar $trade_sector_2 $adjwarps[$choice]
setVar $port_1_class $port_class
setVar $port_2_class $adjport_class[$choice]
setVar $port_1_type $port_type
setvar $port_2_type $adjport_type[$choice]
getDistance $dist $trade_sector_2 $sector
   if ($dist > 1)
      echo "*" $trade_sector_2 " is a one-way - resetting...*"
      goto :user_choice_menu
   end

:chk_combination
if ($port_1_class = 7) OR ($port_1_class = 8)
    echo "*incompatible pairs*"
    goto :start
end
if ($port_2_class = 7) OR ($port_2_class = 8)
    echo "*incompatible pairs*"
    goto :start
end

:cut_txt
cutText $port_1_type $ore_1 1 1
cutText $port_1_type $org_1 2 1
cutText $port_1_type $equ_1 3 1
cutText $port_2_type $ore_2 1 1
cutText $port_2_type $org_2 2 1
cutText $port_2_type $equ_2 3 1

:compare_ports
:ore
if ($ore_1 = "S") AND ($ore_2 = "B")
   setVar $ore_trade "OUT"
elseif ($ore_1 = "B") AND ($ore_2 = "S")
   setVar $ore_trade "IN"
else
   setvar $ore_trade "NONE"
end

:org
if ($org_1 = "S") AND ($org_2 = "B")
   setVar $org_trade "OUT"
elseif ($org_1 = "B") AND ($org_2 = "S")
   setVar $org_trade "IN"
else
   setvar $org_trade "NONE"
end

:equ
if ($equ_1 = "S") AND ($equ_2 = "B")
   setVar $equ_trade "OUT"
elseif ($equ_1 = "B") AND ($equ_2 = "S")
   setVar $equ_trade "IN"
else
   setvar $equ_trade "NONE"
end

:find_best
setVar $trade_mode "none"
:equ_org

if ($equ_trade = "NONE") AND ($org_trade = "NONE") AND ($ore_trade = "NONE")
   echo "*invalid match*"
   goto :start
end
if ($equ_trade = "NONE")
   goto :org_ore
end

if ($equ_trade = "OUT") AND ($org_trade = "IN")
    setVar $trade_mode "equ_org"
elseif ($equ_trade = "IN") AND ($org_trade = "OUT")
    setVar $trade_mode "org_equ"
elseif ($equ_trade = "OUT") AND ($ore_trade = "IN")
    setVar $trade_mode "equ_ore"
elseif ($equ_trade = "IN") AND ($ore_trade = "OUT")
    setVar $trade_mode "ore_equ"
end

:org_ore

if ($org_trade = "OUT") AND ($ore_trade = "IN")
    setVar $trade_mode "org_ore"
elseif ($org_trade = "IN") AND ($ore_trade = "OUT")
    setVar $trade_mode "ore_org"
end

:first_trade
if ($trade_mode = "none")
   echo "*invalid match*"
   goto :start
end

send " j y "

:build_macro
if ($trade_mode = "equ_org") OR ($trade_mode = "org_equ")
    goto :build_trade_route
end

:build_trade_route
if ($equ_trade = "OUT") 
   send "pt"
   

#----------------------SUBROUTINES-----------------------------#

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
