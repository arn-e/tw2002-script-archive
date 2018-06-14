#page-alarm script

:vars
setVar $count 1
setVar $script "(page_alarm)"
setVar $scriptname "$playerName's page alarm script"
setVar $version "v. 0.1"
setVar $last_hit 0

:get_info
send "i"
setTextLineTrigger 1 :get_name "Trader Name"
pause

     :get_name
     killalltriggers
     setVar $line CURRENTLINE
     stripText $line "Trader Name"
     stripText $line ":"
     goSub :striptext
     stripText $line " "
     setvar $trader_name $line

:on_line
send "'" $script " active*"



:msg
killalltriggers
send "'" $script " to page user type : 'page_" $trader_name "'*"

:triggers
killalltriggers
setTextTrigger 0 :limpet "Limpet mine in "
setTextTrigger 1 :alarm "Report Sector "
setTextTrigger 2 :page "page_" & $trader_name
setDelayTrigger 3 :msg 350000
pause

:limpet
killalltriggers
               if ($count = 1) OR ($count = 10) OR ($count = 20) OR ($count = 30) OR ($count = 40) OR ($count = 50) OR ($count = 100)
                   sound life_ending.wav
                   add $count 1
               else
                    sound anvil.wav
                    add $count 1
               end

                   goto :triggers

:alarm
killalltriggers
setVar $line CURRENTLINE
getWord $line $test 1
        if ($test <> "Deployed")
           goto :triggers
        end
           getWord $line $target 6
           if ($target = "Ferrengi") OR ($target = "Green") OR ($target = "Spammers")
              goto :triggers
           end
           getWord $line $sector_hit 5
           stripText $sector_hit ":"
                     if ($sector_hit = $last_hit)
                        goto :triggers
                     end
                     setVar $last_hit $sector_hit
           :sound
           if ($count = 1)
              sound life_ending.wav
              add $count 1
           else
              sound anvil.wav
           end

        goto :triggers

:page
killalltriggers
setVar $line CURRENTLINE
       getWord $line $test 1
       if ($test <> "R")
          goto :triggers
       end
sound mrlif.wav
send "'" $script " " $trader_name " has been paged*"
goto :triggers

#SUGROUTINES#

:striptext
striptext $line "Civilian "
striptext $line "Private 1st Class "
striptext $line "Private "
striptext $line "Lance Corporal "
striptext $line "Corporal "
striptext $line "Staff Sergeant "
striptext $line "Gunnery Sergeant "
striptext $line "1st Sergeant "
striptext $line "Sergeant Major "
striptext $line "Sergeant "
striptext $line "Chief Warrant Officer "
striptext $line "Warrant Officer "
striptext $line "Ensign "
striptext $line "Lieutenant J.G. "
striptext $line "Lieutenant Commander "
striptext $line "Lieutenant "
striptext $line "Commander "
striptext $line "Captain "
striptext $line "Commodore "
striptext $line "Rear Admiral "
striptext $line "Vice Admiral "
striptext $line "Admiral "
striptext $line "Fleet Admiral "
striptext $line "Annoyance "
striptext $line "Nuisance 1st Class "
striptext $line "Nuisance 2nd Class "
striptext $line "Nuisance 3rd Class "
striptext $line "Menace 1st Class "
striptext $line "Menace 2nd Class "
striptext $line "Menace 3rd Class "
striptext $line "Smuggler 1st Class "
striptext $line "Smuggler 2nd Class "
striptext $line "Smuggler 3rd Class "
striptext $line "Smuggler Savant "
striptext $line "Robber "
striptext $line "Terrorist "
striptext $line "Infamous Pirate "
striptext $line "Notorious Pirate "
striptext $line "Dread Pirate "
striptext $line "Pirate "
striptext $line "Galactic Scourge "
striptext $line "Enemy of the State "
striptext $line "Enemy of the People "
striptext $line "Enemy of Humankind "
striptext $line "Heinous Overlord "
return
