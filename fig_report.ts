#xxb finder
#records unfigged XXB's for hunt list

:vars
setVar $count 0
setVar $script "(fig_report)"
setVar $version "v. 1.0"
setArray $fig_grid SECTORS
setArray $cim_grid SECTORS

:set_txt
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $target_figs GAMENAME & "-other_corp_figs" & ".txt"
delete $target_figs

:read_fig
echo ansi_15 "*Reading Fig list..."
setVar $count 1
       while ($sector <> "EOF")
             read $fig_file $sector $count
                  if ($sector = "EOF")
                     setVar $sector ""
                     goto :done_read_fig
                  end
             setVar $fig_grid[$sector] 1
             add $count 1
       end

:done_read_fig
:get_cim_info
send "^"
send "r"
setVar $count 1
setVar $colon_count 0

:cim_triggers
killalltriggers
setTextLineTrigger get_cim :get_cim
pause

     :get_cim
     killalltriggers
     setVar $line CURRENTLINE
     getWord $line $cim_sect 1
     if ($cim_sect = "r") OR ($cim_sect = "R")
        goto :cim_triggers
     end
             if ($cim_sect = ":")
                setVar $colon_count ($colon_count + 1)
                       if ($colon_count > 1)
                          goto :get_fig_info
                       end
                goto :cim_triggers
             end
             if ($cim_sect = 0)
                goto :get_fig_info
             end
     setVar $cim_grid[$cim_sect] 1
     add $count 1
     goto :cim_triggers

#goto :get_fig_info

:get_fig_info
send "q"
echo ansi_15 "*" $count " CIM sectors noted..."
echo ansi_15 "*Grabbing fig info..."
setVar $count 1
setvar $enemy_count 0
       while ($count <= SECTORS)
             getSector $count $sect
                   if ($fig_grid[$count] = 0)
                      if ($cim_grid[$count] = 0)
                         if ($sect.figs.owner = "belong to Corp#1, Phoenix Rising")
                            write $target_figs $count
                            add $enemy_count 1
                         end
                      end
                   end
             add $count 1
       end

:done
echo ansi_15 "*Done! " $enemy_count " enemy sectors found!"
echo ansi_15 "*Results saved in " $target_figs "*"
halt
