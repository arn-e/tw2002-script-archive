#listcruncher

:vars
setVar $count 0
setVar $script "(list_cruncher)"
setVar $version "v. 0.1"
setArray $sectors SECTORS


:main
setVar $target_file GAMENAME & "-not_viewed_sectors" & ".txt"
setVar $low_warp GAMENAME & "-low_unviewed" & ".txt"
setVar $high_warp GAMENAME & "-high_unviewed" & ".txt"
delete $low_warp
delete $high_warp

:read_txt
while ($sector <> "EOF")
      add $count 1
      read $target_file $sector $count
           if ($sector = "EOF")
              setVar $sector 0
              goto :done_read
           end        
           setVar $warpcount SECTOR.WARPCOUNT[$sector]
           #echo "*" $warpcount
              if ($warpcount < 2)
                 write $low_warp $sector
              else
                 write $high_warp $sector
              end
end

:done_read
echo "*done"

:done
killalltriggers
echo "*DONE PROCESSING - new list saved in : " $low_warp "*"
halt


