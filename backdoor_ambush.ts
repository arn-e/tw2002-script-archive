#figged sectors w/ figged backdoors

setVar $filename GAMENAME & "-fig_grid" & ".txt"
setVar $print GAMENAME & "-figged_backdoors" & ".txt"

:vars
setVar $count 1
setVar $script "(figged backdoors)"
setArray $fig_grid SECTORS

:read_txt
echo ansi_15 "*Reading Fig list..."
setVar $count 1
       while ($sector <> "EOF")
             read $filename $sector $count
                  if ($sector = "EOF")
                     setVar $sector ""
                     goto :done_read
                  end
                  setVar $fig_grid[$sector] 1
                  add $count 1
       end

:done_read
setVar $count 1
echo ansi_15 "*Checking backdoors..."
while ($count <= SECTORS)
      if ($fig_grid[$count] = 1)
         if (SECTOR.BACKDOORCOUNT[$count] <> 0)
            setVar $backdoor SECTOR.BACKDOORS[$count][1]
            if ($fig_grid[$backdoor] = 1)                       
               write $print $count & "  backdoor : " & $backdoor
            end
          end
      end
      add $count 1
end

:done
echo ansi_15 "*DONE!*"
halt

