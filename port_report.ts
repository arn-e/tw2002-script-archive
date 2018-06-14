#xxb finder
#records unfigged XXB's for hunt list

:vars
setVar $count 0
setVar $script "(port_report)"
setVar $version "v. 1.0"
setArray $fig_grid SECTORS

:set_txt
setVar $fig_file GAMENAME & "-fig_grid" & ".txt"
setVar $buyers GAMENAME & "-unfigd_quip_buyers" & ".txt"
setVar $target_buyers GAMENAME & "-other_corp_buyers" & ".txt"
setVar $sellers GAMENAME & "-unfigd_quip_sellers" & ".txt"
delete $buyers
delete $sellers

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

goto :get_port_info

:get_port_info
echo ansi_15 "*Grabbing port info..."
setVar $count 1
       while ($count <= SECTORS)
             getSector $count $sect
             if ($sect.port.exists = 1)
                if ($sect.port.buy_equip = "YES")
                   if ($fig_grid[$count] = 0)
                   write $buyers $count
                      if ($sect.figs.owner = "belong to Corp#1, Phoenix Rising")
                        write $target_buyers $count 
                      end
                   end
                end
             end
             add $count 1
       end

:done
echo ansi_15 "*Done! Results saved in " $buyers "*"
halt
