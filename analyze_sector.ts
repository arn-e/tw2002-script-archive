#get Sector parsing script

:vars
setVar $count 1
setvar $script "(un_checked sectors)"
setVar $scriptname "$playerName's sector analyzer"
setVar $version "v. 0.1"
setVar $target_track 0
setVar $unseen_track 0
setArray $sectors SECTORS
setArray $fig_grid SECTORS
#setArray $lost_sectors SECTORS

:set_txt_files
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $all_lost GAMENAME & "-cumulative_lost_grid" & ".txt"
setVar $seen_file GAMENAME & "-viewed_sectors" & ".txt"
setVar $unseen_file GAMENAME & "-unseen_sectors" & ".txt"
setvar $targets_file GAMENAME & "-target_sectors" & ".txt"

:chk_exists
setvar $count 1
fileExists $exists $fig_file
if ($exists)
   setVar $grid_exists "Yes"
else
    echo ansi_12 "*ERROR : " $fig_file " could not be found*"
    halt
end

   fileExists $exists $all_lost
   if ($exists)
      setVar $all_exists "Yes"
   else
       echo ansi_12 "*ERROR : " $all_lost " could not be found*"
       halt
   end
echo "*READING : FIG FILE*"

:read_fig_file
setVar $count 1
while ($sector <> "EOF")
      read $fig_file $sector $count
           if ($sector = "EOF")
              setVar $sector 0
              goto :read_1
           end
      setVar $fig_grid[$count] 1
      echo "*FIG GRID : " $sector
      add $count 1
end

setVar $sector 0
:read_1
ECHO "*READING : LOST SECTORS*"

:read_lost_sectors
setVar $count 1
while ($sector <> "EOF")
      read $all_lost $sector $count
           if ($sector = "EOF")
              setvar $sector 0
              goto :read_2
           end
      #purposely setting unfigged sectors as part of fig grid array
      #for convenience
      setVar $fig_grid[$count] 1
      echo "*LOST GRID : " $sector
      add $count 1
end

setVar $sector 0

:read_2
ECHO "*READING : VIEWED SECTORS*"

:read_viewed_sectors
setVar $count 1
while ($sector <> "EOF")
      read $seen_file $sector $count
           if ($sector = "EOF")
              setVar $sector 0
              goto :read_3
           end
      #purposely setting viewed sectors as part of the fig grid
      #for convenience
      echo "*VIEWED GRID : " $sector
      setVar $fig_grid[$count] 1
      add $count 1
end

:read_3
echo ansi_14 "*NOW AT :CHECK RESULTS*"

setVar $sector 0

:check_results
setvar $count 1
       while ($count <= SECTORS)
             if ($fig_grid[$count] = 0)
                write $unseen_file $count
                setVar $unseen_track ($unseen_track + 1)
                      if (SECTOR.WARPCOUNT[$count] = 2) OR (SECTOR.WARPCOUNT[$count] = 1)
                         write $targets_file $count
                         setVar $target_track ($target_track + 1)
                         echo "*" $count
                      end
             end
             add $count 1
      end
     # setvar $count 1

:done
echo "**" $script " : total [" $unseen_track "] low_warp [" $target_track "]*"
halt






