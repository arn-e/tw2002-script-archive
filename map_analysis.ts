#$playerName's grid mapper



:vars
setVar $count 1
setVar $script "(grid_update)"
setVar $scriptname "$playerName's grid update"
setVar $version "v. 1.00b"
setVar $grid_track 0
setVar $total_de_track 0
setVar $figged_de_track 0
setVar $unfigged_de_track 0
setVar $lost_track 0
setVar $lost_de_track 0
setVar $won_track 0
setVar $won_de_track 0
setArray $old_fig_grid SECTORS
setArray $fig_grid SECTORS

:start
getWord CURRENTLINE $location 1
    if ($location <> "Command")
       echo "*bad prompt*"
       halt
    end

:create_txt
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $lost_file GAMENAME & "-lost_grid" & ".txt"
setVar $lost_de_file GAMENAME & "-lost_DE" & ".txt"
setVar $unfigged_file GAMENAME & "-unfigged_DE" & ".txt"
setVar $twx_de_file GAMENAME & "-deadends" & ".txt"

:chk_exists
setVar $count 1
fileExists $exists $fig_file
if ($exists)
   setVar $grid_exist "Yes"
else
   setVar $grid_exist "No"
end

:chk_exists_2
setVar $count 1

if ($grid_exist = "No")
   goto :get_grid
end

:read_txt
read $fig_file $sector $count

if ($sector = "EOF")
   goto :done_read_txt
end

setVar $old_fig_grid[$sector] 1
add $count 1
goto :read_txt

:done_read_txt
setVar $count 1
goto :get_grid

:get_grid
delete $fig_file
delete $lost_file
delete $lost_de_file
delete $unfigged_file
send "'" $script " : coppin the G list yo*"
send "g"
waitFor "====================="
setTextLineTrigger 1 :read_fig "Personal"
setTextLineTrigger 2 :read_fig "Corp"
setTextTrigger 3 :done "Total"
pause

:read_fig
getWord CURRENTLINE $sector 1
   setVar $fig_grid[$sector] 1
   setVar $grid_track ($grid_track + 1)
   write $fig_file $sector
       if (SECTOR.WARPCOUNT[$sector] = 1)
           setVar $figged_de_track ($figged_de_track + 1)
       end

:read_triggers
killalltriggers
setTextLineTrigger 1 :read_fig "Personal"
setTextLineTrigger 2 :read_fig "Corp"
setTextTrigger 3 :done_read "Total"
pause

:done_read
setVar $count 1
killalltriggers
goto :compare_grid

:compare_grid
killalltriggers
if ($count <= SECTORS)
    if ($old_fig_grid[$count] > $fig_grid[$count])
          setVar $lost_track ($lost_track + 1)
          write $lost_file $count
             if (SECTOR.WARPCOUNT[$count] = 1)
                  setVar $lost_de_track ($lost_de_track + 1)
                  write $lost_de_file $count
             end
    elseif ($old_fig_grid[$count] < $fig_grid[$count])
          setVar $won_track ($won_track + 1)
             if (SECTOR.WARPCOUNT[$count] = 1)
                 setVar $won_de_track ($won_de_track + 1)
             end
    end
    add $count 1
    goto :compare_grid
end

setVar $count 1

#NOW READS THE TWX MADE DEADENDS FILE(format, gamename + "-deadends.txt"), AND CHECKS THE GRID

:get_de_info
fileExists $exists $twx_de_file

if ($exists)
   setVar $count 1
   goto :read_de_file
else
   goto :report
end

:read_de_file
read $twx_de_file $sector $count

if ($sector = "EOF")
    goto :report
end

setVar $total_de_track ($total_de_track + 1)
      if ($fig_grid[$sector] = 0)
          setVar $unfigged_de_track ($unfigged_de_track + 1)
          write $unfigged_file $sector
      end
add $count 1
goto :read_de_file

#NOW SENDS THE RESULTS, WHICH ARE SAVED IN .TXT FILES

:report
killalltriggers
setVar $sector_count SECTORS
setVar $grid_percent ($grid_track * 100)
setVar $grid_percent ($grid_percent / $sector_count)
if ($total_de_Track <> 0)
setVar $de_percent ($figged_de_track * 100)
setVar $de_percent ($de_percent / $total_de_track)
end
echo "*" $script " : TOTAL_FIGGED " $grid_track " = " $grid_percent "%"
echo "*            : SECTORS_WON " $won_track " SECTORS_LOST " $lost_track
send "'*" $script " : sect_figged [" $grid_track "] = " $grid_percent "% / " $sector_count
send "*                sect_won [" $won_track "] - sect_lost [" $lost_track "]"
if ($total_de_track <> 0)
  echo "*            : DE_LOST " $lost_de_track " DE_WON " $won_de_track
  echo "*            : FIGGED_DE " $figged_de_track " = " $de_percent "% of TOTAL_DE " $total_de_track
  echo "*            : UNFIGGED_DE " $unfigged_de_track
  echo "*"
  send "*              : de_figged [" $figged_de_Track "] = " $de_percent "% / " $total_de_track
  send "*                de_won [" $won_de_track "] - de_lost [" $lost_de_track "]*"
end
send "**"
halt


