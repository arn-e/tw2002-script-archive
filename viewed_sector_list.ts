#generate viewed sector list

:vars
setVar $count 1
setVar $script "(viewed_sectors)"
setVar $version "v. 0.1"
setVar $total_track 0
setVar $not_track 0
setVar $new_track 0
setVar $old_track 0
setArray $sectors SECTORS
setArray $prev_seen SECTORS
setArray $new_seen SECTORS

:main
setVar $seen_file GAMENAME & "-viewed_sectors" & ".txt"
setVar $unseen_file GAMENAME & "-not_viewed_sectors" & ".txt"

:chk_exists
fileExists $exists $seen_file
if ($exists)
   setVar $seen_exists "Yes"
else
    setVar $seen_exists "No"
end

   if ($seen_exists = "Yes")
      goto :read_list
   end

:create_list
setVar $count 1
while ($count <= SECTORS)
      getSector $count $sector_var
                if ($sector_var.explored = "YES") OR ($sector_var.explored = "DENSITY")
                   setVar $total_track ($total_track + 1)
                   setVar $new_seen[$count] 1
                   write $seen_file $count
                end
                add $count 1
end
echo ansi_14 "*LIST CREATED*"
send "'" $script " : total [" $total_track "]*"
halt

      :read_list
      setVar $count 1
             while ($sector <> "EOF")
                   read $seen_file $sector $count
                   setVar $prev_seen[$count] 1
                   setVar $old_track ($old_track + 1)
                   add $count 1
             end
             setVar $count 1
             delete $seen_file
             delete $unseen_file

                    while ($count <= SECTORS)
                          getSector $count $sector_var
                                    if ($sector_var.explored = "YES") OR ($sector_var.explored = "DENSITY")
                                       setVar $total_track ($total_track + 1)
                                       setVar $new_seen[$count] 1
                                             # if ($new_seen[$count] > $prev_seen[$count])
                                              setVar $new_track ($new_track + 1)
                                             # end
                                              write $seen_file $count
                                    else
                                        setVar $not_track ($not_track + 1)
                                        write $unseen_file $count
                                    end
                                    add $count 1
                    end
      setVar $count 1
      :done
      setVar $newly_explored ($new_track - $old_track)
      send "'" $script " total [" $total_track "] newly_explored [" $newly_explored "] un_seen [" $not_track "]*"
      halt



