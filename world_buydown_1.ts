#world buydown

:vars
setVar $count 0

:settxt
	mergeText "figGrid-" GAMENAME $filename
	mergeText $filename ".txt" $filename
        fileExists $exists $filename

:main
getWord CURRENTLINE $location 1
  if ($location <> "Citadel")
     echo ansi_12 "**not at cit prompt, resetting**"
       halt
   end
setArray $totalsectors SECTORS
setArray $figGrid SECTORS
goSub :getinfo

#this is where i get planet / current sector info#

:getCurrent
send "qq"
waitFor "Command"
send "g"
waitFor "====================="
setTextLineTrigger 1 :readfig "Personal"
setTextLineTrigger 2 :readfig "Corp"
setTextTrigger 3 :done "Total"
pause

:readfig
getWord CURRENTLINE $sector 1
  setVar $figGrid[$sector] 1

:Triggers
killalltriggers
setTextLineTrigger 1 :readfig "Personal"
setTextLineTrigger 2 :readfig "Corp"
setTextTrigger 3 :done "Total"
pause

:done
send "'Grid Updated*"


:chksector
setVar $count1 1
while ($count1 <= SECTORS)
   setVar $cs $count1
      if ($figGrid[$cs] = 1) 
          :chkport
             if (PORT.CLASS[$cs] = 3) OR (PORT.CLASS[$cs] = 4) OR (PORT.CLASS[$cs] = 5) OR (PORT.CLASS[$cs] = 7)
                 goto :buydown
              else
                 add $count1 1
              end
      else
          add $count1 1
end

:buydown
pause
echo ansi_12 "**gonna run buydown a port in : " $cs "**"
pause
 
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