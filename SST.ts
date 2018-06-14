#sst routine
#wtf FUCK REV DUDE, that bitch quit

:vars
setVar $count 0
setVar $script "(sst_sub)"
setVar $ship_1 5
setVar $ship_2 6

:main
send "p r * s 3 * "
setTextTrigger 1 :success "Success!"
setTextTrigger 2 :busted "Suddenly you're Busted!"
pause

:success
killalltriggers
send " x " $ship_2 " * q "
send " p r * s 3 * "
setTextTrigger 1 :success_2 "Success!"
setTextTrigger 2 :busted "Suddenly you're Busted!"
pause

:success_2
killalltriggers
send " x " $ship_1 " * q "
send " p t * * 0 * z n 0 * z n "
send "p r * s 3 * "
setTextTrigger 1 :success_3 "Success!"
setTextTrigger 2 :busted "Suddenly you're Busted!"
pause

:success_3
killalltriggers
send " x " $ship_2 " * q "
send " p t * * 0 * z n 0 * z n "
send "p r * s 3 * "
setTextTrigger 1 :success_2 "Success!"
setTextTrigger 2 :busted "Suddenly you're Busted!"
pause

:busted
killalltriggers
send "'busted : trigger functioning ! *"
halt


