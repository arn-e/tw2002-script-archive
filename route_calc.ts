#calculates most efficient route
# oh fuckin my

:vars
setVar $count 1
setVar $script "(route_calc)"
setvar $scriptname "$playerName's best-route calculator"
setVar $version "0.01a"
setVar $target_count 0
setVar $source_file "-none entered-"

:create_txt
setVar $filename GAMENAME & "-route_calc" & ".txt"
fileExists $exists $filename
if ($exists)
   delete $filename
end

:ansimenu
killalltriggers
echo "[2J"

echo ANSI_6 "**-" ansi_2 "=" ansi_9 "(" 
setVar $text $scriptname
goSub :addspc
setVar $scriptdisplay $text
echo ansi_15 $scriptdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-*"

echo ANSI_6 "-" ansi_2 "=" ansi_9 "(" 
setVar $text $version
goSub :addspc
setvar $verdisplay $text
echo ansi_15 $verdisplay ansi_9 ")" ansi_2 "=" ansi_6 "-**"

echo ansi_14 "1." ansi_15 " target(s)    : " ansi_9 "[" ansi_6 $target_count ansi_9 "]*"
echo ansi_14 "2." ansi_15 " source file  : " ansi_9 "[" ansi_6 $source_file ansi_9 "]*"
echo ansi_14 "--" ansi_15 " output file  : " ansi_9 "[" ansi_6 $filename ansi_9 "]*"
echo ansi_14 "C." ansi_15 " run script **"

getConsoleInput $choice SINGLEKEY

if ($choice = "1")
    if ($source_file = "-none entered-")
      echo "[2J"
      goto :ansimenu
    else
      echo "*how many targets to calc (3-5 recommended) :  "
      getConsoleInput $target_count
      echo "[2J"
      goto :ansimenu
    end
elseif ($choice = "2")
   echo "*enter source file : "
   getConsoleInput $source_file
      setVar $count 1
      goSub :read_source_file
      setVar $count 1
      echo "[2J"
      goto :ansimenu
elseif ($choice = "c")
   if ($source_file = "-none entered-")
      echo "[2J"
      goto :ansimenu
   elseif ($target_count = 0)
      echo "[2J"
      goto :ansimenu
   else
      goto :chk_length
   end
else
      echo "[2J"
      goto :ansimenu
end

:chk_length
if ($target_count > 20)
   echo ansi_12 "*HIGH NUMBER DETECTED : " ansi_14 " may max CPU - proceed? " ansi_10 "(y/n) : "
   getConsoleInput $choice SINGLEKEY
        if ($choice = "y")
             goto :start_plot
        elseif ($choice = "n")
             goto :ansimenu
        else
             goto :chk_length
        end
end

:start_plot
setVar $count 1
setVar $list_count 1
setVar $origin $target_list[1]
setVar $list_count ($list_count + 1)
setVar $prev_list_count $list_count
setArray $distances $target_count
setArray $ordered_list $target_count
setArray $checked $target_count
setVar $checked[1] 1
setVar $ordered_list[1] $target_list[1]

:get_distance
if ($count <= $target_count)
 # if ($checked[$count] = 1)
 #   add $count 1
  #  goto :get_distance
 # end
 if ($checked[$count] <> 0
    getDistance $dist $origin $target_list[$count]
 else
    add $count 1
    goto :get_distance
 end
   # if ($checked[$list_count] = 1)
   #    setVar $dist 50
   # end
    if ($dist = 0)
       setVar $dist 50
    end

    setVar $distances[$count] $dist
    add $count 1
    goto :get_distance
end
setVar $count 1
setVar $list_count $prev_list_count

:get_shortest
#gets shortest of the first two numbered variables
   # if ($distances[$list_count] < $distances[($list_count + 1)]
  # if ($count > $target_count)
  #      pause
  # end
#   if ($checked[$count] <> 1)
        setVar $lowest $distances[$count]
        setVar $lowest_count $count
        goto :next_shortest
  # end
   add $count 1
   goto :get_shortest
   # elseif ($distances[($list_count + 1)] < $distances[$list_count])
   #     setVar $lowest $distances[($list_count + 1)]
   #     setVar $lowest_count $list_count
  #  else
   #     setVar $lowest $distances[$list_count]
   #     setVar $lowest_count $list_count
   # end
:next_shortest
setVar $list_count $prev_list_count
setVar $count 1

:compare_loop
if ($count <= $target_count)
   if ($lowest > $distances[$count])
      setVar $lowest $distances[$count]
      setVar $lowest_count $count
      setVar $count ($count + 1)
      goto :compare_loop
   end
   setVar $count ($count + 1)
   goto :compare_loop
end

setVar $count 1
setVar $list_count $prev_list_count
setVar $ordered_list[$list_count] $target_list[$lowest_count]
setVar $origin $ordered_list[$list_count]
setVar $checked[$lowest_count] 1
if ($list_count < $target_count)
   goto :continue_plot
end

pause

:continue_plot
setVar $list_count ($list_count + 1)
setVar $prev_list_count $list_count
setVar $count 1
goto :get_distance

#---------------------------SUBROUTINES---------------------------#

:addspc
getLength $text $len
if ($len < $max)
	setVar $spaces ($max - $len)
	if ($spaces = 1)
		setVar $text " " & $text
	else
		setVar $spaces ($spaces / 2)
		setVar $cnt 0
		:addfront
		if ($cnt < $spaces)
			add $cnt 1
			setVar $text " " & $text
			goto :addfront
		end
		setVar $cnt 0
		:addback
		if ($cnt < $spaces)
			add $cnt 1
			setVar $text $text & " "
			goto :addback
		end
		getLength $text $len
		if ($len < $max)
			setVar $text " " & $text
		end
	end
end
return

:checkMax
if ($len > $max)
	setVar $max $len
end
return

:read_source_file
read $source_file $sector $count
if ($sector = "EOF")
   goto :done_read
end
add $count 1
goto :read_source_file

     :done_read
     setVar $target_count ($count - 1)
     setVar $count 1
     setArray $target_list $target_count

     :get_array
     read $source_file $sector $count
        if ($sector = "EOF")
           goto :done_read_sub
        end
     setVar $target_list[$count] $sector
     add $count 1
     goto :get_array

:done_read_sub
setVar $count 1
return
