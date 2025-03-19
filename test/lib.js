function bubbleParam(bubble) {
    return bubble.percentage <= 10 ? 0.01 :
        bubble.percentage > 10 && bubble.percentage <= 20 ? 0.1 :
            bubble.percentage > 20 ? 0.3 : 0
}



let per = bubbleParam({ percentage: 5 })
console.log(per)