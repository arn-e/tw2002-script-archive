#cumulative lost grid parser

:vars
setVar $count 1
setvar $script "(cumulative_lost_sectors)"
setVar $version "v. 0.1"
setArray $prev_lost SECTORS
setArray $new_lost SECTORS
setArray $total_lost SECTORS

:check_text_fils
setVar $cumulative_lost_file GAMENAME & "-cumulative_lost_grid" & ".txt"
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $lost_file GAMENAME & "-lost_grid" & ".txt"

:chk_exists
setVar $count 1
fileExists $exists $cumulative_lost_file

if ($exists)
   setvar $file_exists "Yes"
   goto :read_txt
else
    setVar $file_exists "No"
    goto :check_lost_exist
end

:check_lost_exist
setvar $count 1
fileExists $exists $lost_file

           if ($exists)
              goto :create_cumulative
           else
               echo ansi_12 "*ERROR : " $lost_file " not found*"
               halt
           end

              :create_cumulative
              setVar $count 1
                     while ($sector <> "EOF")
                           read $lost_file $sector $count
                           write $cumulative_lost_file $sector
                           add $count 1
                     end
                     echo ansi_11 "*FILE WRITTEN - RUN AGAIN AFTER NEXT USE OF TYMAP*"
                     halt

:read_txt
setVar $count 1

while ($sector <> "EOF")
      read $cumulative_lost_file $sector $count
           if ($sector = "EOF")
              setVar $sector 0
              goto :delete_old_file
           end
      setVar $prev_lost[$sector] 1
      setVar $total_lost[$sector] 1
      add $count 1
end

:delete_old_file
delete $cumulative_lost_file
goto :read_new_lost

:read_new_lost
setVar $count 1

while ($sector <> "EOF")
      read $lost_file $sector $count
           if ($sector = "EOF")
              #setVar $sector 0
              goto :compare_lists
           end
      setVar $new_lost[$sector] 1
      setVar $total_lost[$sector] 1
      #echo "*SOMETHING*"
      add $count 1
end

:compare_lists
setVar $count 1
setVar $lost_track 0

       while ($count <= SECTORS)
             if ($total_lost[$count] <> 0)
                write $cumulative_lost_file $count
             end
             if ($new_lost[$count] > $prev_lost[$count])
                setVar $lost_track ($lost_track + 1)
             #   write $cumulative_lost_file $count
             end
             add $count 1
       end

:finito
echo "* DONE : " ansi_11 $lost_track " new lost sectors noted*"
send "'" $script " updated : " $lost_track " new sectors noted*"
halt



