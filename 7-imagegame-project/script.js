// import BLOCKS from "./blocks.js"


/**DOM */
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartbutton = document.querySelector("#restart");

const button_l = document.getElementById("l")
const button_r = document.getElementById("r")
const button_d = document.getElementById("d")
const button_s = document.getElementById("s")

const over_combodisplay = document.getElementById("combo_point")

const reinforce_row_button = document.getElementById("reinforce_row_button");

const reinforce_time_button = document.getElementById("reinforce_time_button");

const reinforce_special_button = document.getElementById("reinforce_special_button");

const combo_point_display = document.getElementById("combo_p");

const gameover_text_r = document.querySelector("#ge");

const bgm = document.getElementById("bgm")

const playbutton = document.getElementById("music_play")

let is_protecting = false;

let next_block_grid=[]

let time_plus = 0;

let combo_point = 1000;

let upgrade_row_plus_phase = 1
let upgrade_row_plus = 0;

let upgrade_time_plus_phase = 1 
let upgrade_time_plus = 0;

let upgrade_special_plus = 0;
let upgrade_special_plus_phase = 1







// 사용자 정의 키

let user_defined_key_L = null;
let user_defined_key_R = null;
let user_defined_key_D = null;
let user_defined_key_S = null;









//wrapper



const BLOCKS = {


    tree : [
        [[2,1], [0,1], [1,0] , [1,1]],
        [[1,2], [0,1], [1,0] , [1,1]],
        [[1,2], [0,1], [2,1] , [1,1]],
        [[2,1], [1,2], [1,0] , [1,1]],
    ],

    square : [
        [[0,0], [0,1], [1,0] , [1,1]],
        [[0,0], [0,1], [1,0] , [1,1]],
        [[0,0], [0,1], [1,0] , [1,1]],
        [[0,0], [0,1], [1,0] , [1,1]],
    ],

    bar : [
        [[0,0], [1,0], [2,0] , [3,0]],
        [[2,-1], [2,0], [2,1] , [2,2]],
        [[1,0], [2,0], [3,0] , [4,0]],
        [[2,-1], [2,0], [2,1] , [2,2]]
    ],

    zee : [
        [[0,0], [1,0], [1,1] , [2,1]],
        [[0,1], [1,0], [1,1] , [0,2]],
        [[0,1], [1,1], [1,2] , [2,2]],
        [[2,0], [2,1], [1,1] , [1,2]]
    ],

    elLeft : [
        [[2,0], [0,1], [1,1] , [2,1]],
        [[1,0], [1,1], [1,2] , [2,2]],
        [[0,1], [1,1], [2,1] , [0,2]],
        [[1,0], [0,0], [1,1] , [1,2]]],

    elRight : [
        [[1,0], [2,0], [1,1] , [1,2]],
        [[0,0], [0,1], [1,1] , [2,1]],
        [[0,2], [1,0], [1,1] , [1,2]],
        [[0,1], [1,1], [2,1] , [2,2]]
    ],
    mono : [
        [[0,0]],
        [[0,0]],
        [[0,0]],
        [[0,0]]
    ],

    domino : [
        [[0 , 0],[0, 1]],
        [[1 , 0],[0, 0]],
        [[0 , 0],[0, 1]],
        [[1 , 0],[0, 0]],

    ],

    tri_linear : [
        
        [ [0,0], [0,1], [0,2] ],
        [ [1,1], [2,1], [3,1] ],
        [ [0,0], [0,1], [0,2] ],
        [ [1,1], [2,1], [3,1] ],

    ],

    tri_curved : [

        [ [0,0], [0,1], [1,1] ],
        [ [0,0], [0,1], [0,1] ],
        [ [0,0], [-1,0], [0,1] ],
        [ [0,0], [-1,0], [-1,-1] ],


    ],
    pento_eleft : [

        [ [0,0], [1,0], [1,1], [1,2], [1,3] ],
        [ [0,0], [0,1], [1,1], [2,1], [3,1] ],
        [ [0,2], [1,2], [1,1], [1,0], [1,-1] ],
        [[0,0], [0,1], [0,2], [0,3], [1,0]]



    ]
    
    
    
}

const BLOCKS_SPECIAL = {
    mono : [
        [[0,0]],
        [[0,0]],
        [[0,0]],
        [[0,0]]
    ],
    domino : [
        [[0 , 0],[0, 1]],
        [[1 , 0],[0, 0]],
        [[0 , 0],[0, 1]],
        [[1 , 0],[0, 0]],

    ],

    tri_linear : [
        
        [ [0,0], [0,1], [0,2] ],
        [ [-1,1], [0,1], [1,1] ],
        [ [0,0], [0,1], [0,2] ],
        [ [-1,1], [0,1], [1,1] ],

    ],

    tri_curved : [

        [ [0,0], [0,1], [1,1] ],
        [ [0,0], [0,1], [1,0] ],
        [ [0,0], [-1,0], [0,1] ],
        [ [0,0], [-1,0], [-1,-1] ],


    ],
    // 폭탄

    pento_eleft : [

        [ [0,0], [1,0], [1,1], [1,2], [1,3] ],
        [ [0,0], [0,1], [1,1], [2,1], [3,1] ],
        [ [0,2], [1,2], [1,1], [1,0], [1,-1] ],
        [[0,0], [0,1], [0,2], [0,3], [1,0]]



    ]




}


/**Setting */
let GAME_ROWS = 20;
const GAME_COLS = 30;


//variables

let score = 0;
let duration = 1000;
let downInterval;
let tempMovingItem;

let difficulty = 0;

let next_block = null

let stack = 0
//◆◇

let score_boost = 1

let isgameover = false


let ungivecombop = true


const movingItem = {
    type : "",
    direction : 1,
    top : 0,
    left : 0,

};



function set_rank(){
    if(score < 100){
        return 'F-';
    } else if(score < 200){
        return 'F';
    } else if(score < 400){
        return 'F+';
    } else if(score < 800){
        return 'E-';
    } else if(score < 900){
        return 'E';
    } else if(score < 1000){
        return 'E+';
    } else if(score < 1500){
        return 'D-';
    } else if(score < 1700){
        return 'D';
    } else if(score < 2000){
        return 'D+';
    } else if(score < 2500){
        return 'C-';
    } else if(score < 2700){
        return 'C';
    } else if(score < 2900){
        return 'C+';
    } else if(score < 3000){
        return 'B-';
    } else if(score < 3300){
        return 'B';
    } else if(score < 3500){
        return 'B+';
    } else if(score < 4000){
        return 'A-';
    } else if(score < 4400){
        return 'A';
    } else if(score < 4800){
        return 'A+';
    } else if(score < 7000){
        return 'S-';
    } else if(score < 8000){
        return 'S';
    } else if(score < 9000){
        return 'S+';
    } else if(score < 15000){
        return 'SS';
    } else if(score < 30000){
        return 'SSS';
    } else if(score < 50000){
        return 'Master';
    } else if(score < 70000){
        return 'GrandMaster';
    } else if(score >= 70000){
        return '측정불가';
    } 
}






//functions

init()

//showGameoverText()
// 
function init(){
    let conlist=[]
    let perlist=[]
    combo_point_display.textContent = `${combo_point}`
    for(let j=0; j<4; j++){

        

        for(let k=0; k<4; k++){
            conlist.push(document.getElementById(`${j+1}${k+1}`))

            
        }
        perlist.push(conlist)
        conlist = []

        downInterval = null;

        

        
        


        
    }

    next_block_grid = perlist;
    ungivecombop = true






    document.getElementById("goto10").style.display = "flex"

    score_boost = 1

    score = 0;
    stack = 0;

    scoreDisplay.textContent = `${score}`
    scoreDisplay.style.color = "blue"

    difficulty = 0
    duration = 900
    

    tempMovingItem = { ...movingItem};
    
    for(let i=0; i<GAME_ROWS + upgrade_row_plus; i++){     
    
        prependNewLine()
    }


    generateNewBlock('init')
}







function prependNewLine(){

    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j=0; j<10; j++){
        const matrix = document.createElement("li");
        ul.prepend(matrix);

    }
    li.prepend(ul)
    playground.prepend(li)

}


function music(playtype) {
    if(playtype){
       bgm.loop = true
        bgm.play() 
    } else{
        bgm.pause()
    }  
    
}





function renderBlocks(movetype=0){

    next_block_update()

    const {type, direction, top, left} = tempMovingItem;
    const movingblocks = document.querySelectorAll(".moving");

    movingblocks.forEach(moving => {
        moving.classList.remove(type, "moving")
    })

     

    BLOCKS[type][direction].some(block => {

        const x = block[0] + left;
        const y = block[1] + top;


        
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;

        const isavailable = checkEmpty(target)

        if(isavailable) {
            target.classList.add(type, "moving");
        } else{
            tempMovingItem = {...movingItem}
            if(movetype === 'retry'){
                renderBlocks(`retry_${1}`)
                
            }
            if(String(movetype).slice(0, 6) === "retry_" && movetype !== "retry_10"){
                retry_num = movetype[6]
                renderBlocks(`retry_${Number(retry_num) + 1}`)
                // console.log(retry_num)

                
            }
            if(movetype === "retry_10"){
                showGameoverText()
                clearInterval(downInterval)
            }

            setTimeout(() => {


                renderBlocks('retry')

                if(movetype === "top"){
                    seizeBlock()
                }

                
            },0)

            return true;
            
        }


        
        
    })

    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction
    

}
function showGameoverText(){

  

    music(false)
    gameText.style.display = "flex";

    gameover_text_r.textContent = `게임 오버! (Rank.${set_rank(score)})`


    if(score >= 8025 && ungivecombop){
        gameover_text_r.textContent = `게임 오버! Rank.${set_rank(score)}(포인트 +${Math.floor((score-8000)*0.04)})`
        combo_point += Math.floor((score-8000)*0.04)
        ungivecombop = false
    }
    


   
    over_combodisplay.textContent = `콤보 포인트 : ${combo_point}`


    // 디스플레이를 처음 업데이트하는 함수를 생성하자.





    
}

function Gameover_textdisplay_update(){
    document.getElementById("code_1_00").textContent = '속도 완화 I('+cont_txt + ')';

    document.getElementById("code_1_01").textContent = `속도 완화(+${4*(upgrade_time_plus)}ms --> +${4*(upgrade_time_plus+1)}ms)`

    document.getElementById("code_1_02").textContent = `강화 성공률 : ${reinforce_percent_time_p1[upgrade_time_plus+1]}%`

    document.getElementById("code_1_03").textContent = `비용 : ${reinforce_cost_time_p1[upgrade_time_plus+1]}`

    if(upgrade_time_plus === 5){
        
        document.getElementById("code_1_00").textContent = '속도 완화 I(Master)'
        document.getElementById("code_1_01").textContent = '속도 완화(+20ms)';
        document.getElementById("code_1_02").style.display = 'none';
        document.getElementById("code_1_03").style.display = 'none';
        reinforce_time_button.style.display = 'none';
    }
}







function over_textupdate(){

}



function next_block_update(){
    if(!next_block){
        return;
    }

    next_block_coor = BLOCKS[next_block][0]
   


    for(i = 0; i<4; i++){

        for(j=0; j<4; j++){
            next_block_grid[i][j].classList.remove("nextblock_true")
        }
        
    }


    
    

    for(let i = 0; i<5; i++){
        try{
           next_block_d_coor= next_block_coor[i]

            next_block_grid[next_block_d_coor[0]][next_block_d_coor[1]].classList.add("nextblock_true")
 
        } catch(error){

        }
        


    }
    
    
    



}








function score_check(){
    if(score >= 50 && difficulty === 0){
        difficulty = 1;
        duration = 500;
        scoreDisplay.style.color = "blue"
        scoreDisplay.textContent = "난이도 상승(Tutorial -> Very Easy)"

        stack = 3
        

    } else if(score >= 150 && difficulty === 1){
        difficulty = 2;
        duration = 450
        scoreDisplay.style.color = "green"
        scoreDisplay.textContent = "난이도 상승(Very Easy -> Easy)"
        stack = 3
        score_boost += 0.1
    } else if(score >= 2000 && difficulty === 2){
        difficulty = 3;
        duration = 400
        scoreDisplay.style.color = "yellowgreen"
        scoreDisplay.textContent = "난이도 상승(Easy -> Normal)";stack = 3
        score_boost += 0.1
    } else if(score >= 3000 && difficulty === 3){
        difficulty = 4;
        duration = 350
        scoreDisplay.style.color = "yellow"
        scoreDisplay.textContent = "난이도 상승(Normal -> Hard)";stack = 3
        score_boost += 0.1
    } else if(score >= 5000 && difficulty === 4){
        difficulty = 5;
        duration = 300
        scoreDisplay.style.color = "orange";stack = 3
        scoreDisplay.textContent = "난이도 상승(Hard -> Harder)"
        score_boost += 0.1
    } else if(score >= 9000 && difficulty === 5){
        scoreDisplay.textContent = "난이도 상승(Harder -> Insane)"
        difficulty = 6;stack = 3
        duration = 250
        scoreDisplay.style.color = "lightpurple"
        score_boost += 0.1
    } else if(score >= 10000 && difficulty === 6){
        scoreDisplay.textContent = "난이도 상승(Insane -> Severe)"
        difficulty = 7;stack = 3
        duration = 225
        scoreDisplay.style.color = "plum"
        score_boost += 0.1
    } else if(score >= 20000 && difficulty === 7){
        scoreDisplay.textContent = "난이도 상승(Severe -> Extreme)"
        difficulty = 8;stack = 3
        duration = 200
        scoreDisplay.style.color = "red"
        score_boost += 0.1
    } else if(score >= 45000 && difficulty === 8){
        scoreDisplay.textContent = "난이도 상승(Extreme -> Demon)"
        difficulty = 9;stack = 3
        duration = 150
        scoreDisplay.style.color = "darkred"
        score_boost += 0.1

    } else if(score >= 50000 && difficulty === 9 ){
        scoreDisplay.textContent = "데스 매치! 점수 10배!(Extreme Demon)"
        score_boost = 10;
        difficulty = 10;stack = 8
        duration = 90
    } 
}





function seizeBlock(){

    score += Math.floor(3 * score_boost)

    if(stack === 0){
        scoreDisplay.textContent = `${score}`;
    } else{stack--;}
    //scoreDisplay.textContent = `점수 : ${score}점`;
    score_check()


    

    const movingblocks = document.querySelectorAll(".moving");

    movingblocks.forEach(moving => {
        moving.classList.remove("moving")
        moving.classList.add('seized');
    })

    checkmatch()

    generateNewBlock();


}

function checkmatch(check = 0){

    const childNodes = playground.childNodes;
    childNodes.forEach(child =>{
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains("seized")){
                matched = false;
            }
        })
        if(matched){ // 2중 if문

           

            child.remove();
            prependNewLine()
            score += Math.floor(100 * score_boost) + 100 * check

            if(check > 0){

                scoreDisplay.textContent = `${check+1} 콤보!`
                stack = 2;
                
                combo_point += (check) ** 2

                sub_display_update()
                
                

            }

            if(difficulty === 10){
                score_boost += 1;
                scoreDisplay.textContent = `배수 상승!(${score_boost}배)`
                stack = 2;
            }

            checkmatch(check + 1)
            

            if(stack === 0){
                scoreDisplay.textContent = `${score}`;
            } else if(stack !== 0 && scoreDisplay.textContent.slice(2,4) === "콤보"){
                
            }else{
                stack--;
            }
            

        }
    })

    //generateNewBlock()

}

function sub_display_update(){
    combo_point_display.textContent = `${combo_point}`
}


function generateNewBlock(generatetype=null){

    

    
    
    if(generatetype === 'init'){
        
        
        downInterval = setInterval(()=>{

            moveBlock('top', 1)
    
        }, 900)
        
    } else{
        clearInterval(downInterval);
        downInterval = setInterval(()=>{

            moveBlock('top', 1)
    
        }, duration + 4*upgrade_time_plus)
    }

    

    



 

    const blockArray = Object.entries(BLOCKS);


    if(  randint(1, 1001) <= (upgrade_special_plus) * 2 ){
        randomindex = randint(6, 10)
    }else{
        randomindex = randint(0,6)
    }
    



    //const randomindex = Math.floor(Math.random() * blockArray.length);

    if(next_block == null){
        next_block = blockArray[randomindex][0]
        next_block = blockArray[10][0]
    }

    movingItem.type = next_block;


    


    next_block = blockArray[randomindex][0]
    console.log(next_block)
    // movingItem.type = blockArray[randomindex][0]

    

    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem}
    renderBlocks()

}

function checkEmpty(target){
    if(!target || target.classList.contains("seized")){
        return false;

    }
    return true;
}

function moveBlock(movetype, amount){

    tempMovingItem[movetype] += amount;
    renderBlocks(movetype)

}

function changeDirection(){

    const direction = tempMovingItem.direction;

    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1
    renderBlocks()
}

function dropblock(){
    clearInterval(downInterval);
    downInterval = setInterval(() =>{
        moveBlock('top', 1)
    },15)
}

function randint(a, b){
    return a + Math.floor((b-a) * Math.random())
}


function use_coupon(coupon_num){

    if(coupon_num === '서문재현 바보'){
        combo_point += 8000;
        alert("콤보 포인트 8000을 받았습니다.")
        document.getElementById('combo_point').textContent=`콤보 포인트 : ${combo_point}`
    }else{alert("쿠폰번호가 틀렸습니다")}

}








const reinforce_cost_row_p1 = {
    1 : 7,
    2 : 28,
    3 : 55,
    4 : 79,
    5 : 90
}
const reinforce_percent_row_p1 = {
    1 : 100,
    2 : 80,
    3 : 60,
    4 : 40,
    5 : 30
}

const reinforce_cost_time_p1 = {
    1 : 10,
    2 : 70,
    3 : 120,
    4 : 160,
    5 : 440,
}
const reinforce_percent_time_p1 = {
    1 : 100,
    2 : 92,
    3 : 74,
    4 : 49,
    5 : 27
}

const reinforce_cost_special_p1={
    1 : 1,
    2 : 1,
    3 : 2,
    4 : 3,
    5 : 5,
    6 : 5,
    7 : 5,
    8 : 11,
    9 : 14,
    10 : 15,
    11 : 19,
    12 : 24,
    13 : 27,
    14 : 37,
    15 : 37,
    16 : 42,
    17 : 43,
    18 : 45,
    19 : 50,
    20 : 60
}

const reinforce_percent_special_p1 = {
    1 : 100,
    2 : 100,
    3 : 100,
    4 : 99,
    5 : 98,
    6 : 96,
    7 : 94,
    8 : 90,
    9 : 88,
    10 : 86,
    11 : 79,
    12 : 77,
    13 : 74,
    14 : 70,
    15 : 65,
    16 : 59,
    17 : 53,
    18 : 50,
    19 : 46,
    20 : 44
}

const reinforce_cost_special_p2 ={
    21 : 1,
    22 : 2,
    23 : 3,
    24 : 4,
    25 : 5,
    26 : 6,
    27 : 7,
    28 : 10,
    29 : 17,
    30 : 18,
    31 : 19,
    32 : 28,
    33 : 39,
    34 : 40,
    35 : 60,
    36 : 100,
    37 : 140,
    38 : 180,
    39 : 199,
    40 : 7

} 

const reinforce_percent_special_p2 = {
    21 : 100,
    22 : 100,
    23 : 100,
    24 : 100,
    25 : 92,
    26 : 88,
    27 : 84,
    28 : 80,
    29 : 76,
    30 : 72,
    31 : 68,
    32 : 64,
    33 : 63,
    34 : 62,
    35 : 60,
    36 : 56,
    37 : 52,
    38 : 40,
    39 : 30,
    40 : 6 
}

const reinforce_cost_special_p3 ={

    41 : 7,
    42 : 9,
    43 : 17,
    44 : 22,
    45 : 28,
    46 : 30,
    47 : 40,
    48 : 60,
    49 : 70,
    50 : 80,
    51 : 147,
    52 : 158,
    53 : 169,
    54 : 177,
    55 : 199,
    56 : 217,
    57 : 268,
    58 : 377,
    59 : 399,
    60 : 1 

}

const reinforce_percent_special_p3={

    41 : 100,
    42 : 100,
    43 : 99,
    44 : 90,
    45 : 90,
    46 : 80,
    47 : 80,
    48 : 70,
    49 : 65,
    50 : 60,
    51 : 55,
    52 : 50,
    53 : 50,
    54 : 47,
    55 : 42,
    56 : 38,
    57 : 30,
    58 : 29,
    59 : 22,
    60 : 10
}
const reinforce_destruct_percent_p3 = {
    41 : 0,
    42 : 0.01,
    43 : 0.01,
    44 : 0.01,
    45 : 0.01,
    46 : 0.1,
    47 : 0.5,
    48 : 1,
    49 : 1,
    50 : 1.5,
    51 : 2,
    52 : 4,
    53 : 7,
    54 : 9,
    55 : 14,
    56 : 17,
    57 : 19,
    58 : 28,
    59 : 33,
    60 : 35


}






/** 게임 오버 상태에서 업그래이드 함수(type = row / time) */
function reinforce(reinforcetype){
    if(reinforcetype === "row"){

        if(upgrade_row_plus_phase === 1){

            if(reinforce_cost_row_p1[upgrade_row_plus+1] <= combo_point){

                // 돈 감소
                combo_point -= reinforce_cost_row_p1[upgrade_row_plus+1];
                // 강화 확률별
                if(randint(1, 101) <= reinforce_percent_row_p1[upgrade_row_plus+1]){
                    // 강화 성공
                    //alert(`강화에 성공했습니다!(추가 줄 수 : ${upgrade_row_plus} --> ${upgrade_row_plus+1})`)
                    upgrade_row_plus += 1;
                    cont_lis = ''

                    for(let i=0; i<upgrade_row_plus; i++){
                        cont_lis += '◆'
                    }
                    for(let i=0; i<(5-upgrade_row_plus); i++){
                        cont_lis += '◇'
                    }

                    document.getElementById("code_0_01").textContent = `줄 추가 : +${upgrade_row_plus} --> +${upgrade_row_plus+1}`

                    document.getElementById("combo_point").textContent = `현재 콤보 포인트 : ${combo_point}`

                    document.getElementById("code_0_00").textContent = "줄 추가 I(" + cont_lis + ")"

                    document.getElementById("code_0_02").textContent = `강화 성공률 : ${reinforce_percent_row_p1[upgrade_row_plus+1]}%`
                    document.getElementById("code_0_03").textContent= `비용 : ${reinforce_cost_row_p1[upgrade_row_plus+1]}`
                 
                    
                    if(upgrade_row_plus === 5){
                        alert("최고 단계가 되었습니다.")
                        document.getElementById("code_0_00").textContent = '줄 추가 I(Master)'
                        document.getElementById("code_0_01").textContent = '줄 추가(+5)';
                        document.getElementById("code_0_02").style.display = 'none';
                        document.getElementById("code_0_03").style.display = 'none';
                        reinforce_row_button.style.display = 'none';
                    }



                } else{
                    alert("강화에 실패했습니다.")
                    reinforce_percent_row_p1[upgrade_row_plus+1] += 2
                    document.getElementById("code_0_02").textContent = `강화 성공률 : ${reinforce_percent_row_p1[upgrade_row_plus+1]}%`

                }



            } else{
                alert("포인트가 부족합니다.")
            }

        }

    } else if(reinforcetype === "time"){
        if(upgrade_time_plus_phase === 1){

            if(combo_point >= reinforce_cost_time_p1[upgrade_time_plus+1]){

                // 돈 감소
                combo_point -= reinforce_cost_time_p1[upgrade_time_plus+1];

                //강화 돌리기

                if(randint(1, 101) <= reinforce_percent_time_p1[upgrade_time_plus + 1]){
                    // 강화 성공
                    //alert(`강화에 성공했습니다!( +${(upgrade_time_plus)*4}ms --> +${4*(upgrade_time_plus+1)}ms )`)
                    // 능력 올리기
                    upgrade_time_plus += 1;

                    // html요소 바꾸기

                    cont_txt = ''

                    for(i=0; i<upgrade_time_plus; i++){
                        cont_txt += "◆"
                    }
                    for(i=0; i<(5-upgrade_time_plus); i++){
                        cont_txt += '◇'
                    }

                    document.getElementById("code_1_00").textContent = '속도 완화 I('+cont_txt + ')';

                    document.getElementById("code_1_01").textContent = `속도 완화(+${4*(upgrade_time_plus)}ms --> +${4*(upgrade_time_plus+1)}ms)`

                    document.getElementById("code_1_02").textContent = `강화 성공률 : ${reinforce_percent_time_p1[upgrade_time_plus+1]}%`

                    document.getElementById("code_1_03").textContent = `비용 : ${reinforce_cost_time_p1[upgrade_time_plus+1]}`

                    if(upgrade_time_plus === 5){
                        alert("최고 단계가 되었습니다.")
                        document.getElementById("code_1_00").textContent = '속도 완화 I(Master)'
                        document.getElementById("code_1_01").textContent = '속도 완화(+20ms)';
                        document.getElementById("code_1_02").style.display = 'none';
                        document.getElementById("code_1_03").style.display = 'none';
                        reinforce_time_button.style.display = 'none';
                    }




                } else{
                    alert("강화에 실패했습니다.")
                }



            } else{
                alert("포인트가 부족합니다.")
            }


        }
    } else if(reinforcetype === "special"){


        if(upgrade_special_plus_phase === 1){

            if(combo_point >= reinforce_cost_special_p1[upgrade_special_plus + 1]){
                // 돈이 있다면
                combo_point -= reinforce_cost_special_p1[upgrade_special_plus + 1]; //돈차감
                // 강화
                if(randint(1, 101) <= reinforce_percent_special_p1[upgrade_special_plus+1]){
                    // 성공
                    //alert(`강화에 성공했습니다!(특별한 블록 :  ${(upgrade_special_plus * 0.2).toFixed(1)}% --> ${((upgrade_special_plus + 1) * 0.2).toFixed(1)}% )`)
                    
                    // 효과 적용

                    upgrade_special_plus++;

                    document.getElementById("code_2_00").textContent= `특별한 블록 생성 I(+${upgrade_special_plus})`
                    document.getElementById("code_2_01").textContent= `특별한 블록 생성(${(upgrade_special_plus*0.2).toFixed(1)}% --> ${(upgrade_special_plus*0.2+0.2).toFixed(1)}%)`
                    document.getElementById("code_2_02").textContent= `강화 성공률 : ${reinforce_percent_special_p1[upgrade_special_plus+1]}%`
                    document.getElementById("code_2_03").textContent= `비용 : ${reinforce_cost_special_p1[upgrade_special_plus+1]}`

                    if(upgrade_special_plus === 20){
                        upgrade_special_plus_phase = 2
                        
                        alert('I단계 최고 강화 레벨에 도달하였습니다.')
                        document.getElementById("code_2_02").textContent= '강화 성공률 : 100%'
                        document.getElementById("code_2_03").textContent = "비용 : 1";
                        document.getElementById("code_2_00").textContent= "특별한 블록 생성 II(+0)"
                        document.getElementById("code_2_01").textContent= "특별한 블록 생성(4% --> 4.2%)"
                        reinforce_special_button.style.color = 'purple'
                        
                    }



                } else{
                    alert("강화에 실패하였습니다.")
                }


            } else{
                alert("포인트가 부족합니다.")
            }



        } else if(upgrade_special_plus_phase === 2){

            if(combo_point >= reinforce_cost_special_p2[upgrade_special_plus + 1]){

                combo_point -= reinforce_cost_special_p2[upgrade_special_plus + 1]

                if(randint(1,101) <= reinforce_percent_special_p2[upgrade_special_plus+1]){
                    //강화 성공 
                    upgrade_special_plus++;
                    //alert("강화에 성공했습니다.")

                    over_combodisplay.textContent = `콤보 포인트 : ${combo_point}`


                    document.getElementById("code_2_00").textContent= `특별한 블록 생성 II(+${upgrade_special_plus-20})`
                    document.getElementById("code_2_01").textContent= `특별한 블록 생성(${(upgrade_special_plus*0.2).toFixed(1)}% --> ${(upgrade_special_plus*0.2+0.2).toFixed(1)}%)`
                    document.getElementById("code_2_02").textContent= `강화 성공률 : ${reinforce_percent_special_p2[upgrade_special_plus+1]}%`
                    document.getElementById("code_2_03").textContent= `비용 : ${reinforce_cost_special_p2[upgrade_special_plus+1]}`


                    if(upgrade_special_plus === 40){
                        upgrade_special_plus_phase = 3;
                        document.getElementById("code_2_00").textContent= `특별한 블록 생성 III(+0)`
                        document.getElementById("code_2_01").textContent= `특별한 블록 생성(${(upgrade_special_plus*0.2).toFixed(1)}% --> ${(upgrade_special_plus*0.2+0.2).toFixed(1)}%)`
                        document.getElementById("code_2_02").textContent= `강화 성공률 : 100%`
                        document.getElementById("code_2_03").textContent= `비용 : 1`
                        reinforce_special_button.style.backgroundColor = 'red';
                        alert("II단계 최고 레벨에 도달하였습니다.")
                        document.getElementById('code_2_04').style.display = 'flex';
                        document.getElementById('usingprot').style.display = 'flex';
    
                    }






                } else{
                    alert('강화에 실패하였습니다.')
                    reinforce_percent_special_p2[upgrade_special_plus + 1]++;
                    document.getElementById("code_2_02").textContent= `강화 성공률 : ${reinforce_percent_special_p2[upgrade_special_plus+1]}%`
                        

                }



            }else{
                alert('포인트가 부족합니다.')
            }


        } else if(upgrade_special_plus_phase === 3){
            // 여기부터 파괴확률 존재함.

            if(is_protecting){
                contemcost_p3 = reinforce_cost_special_p3[upgrade_special_plus + 1] + 10*upgrade_special_plus
            } else{
                contemcost_p3 = reinforce_cost_special_p3[upgrade_special_plus + 1]
            }

            if(combo_point >= contemcost_p3){

                

                
                combo_point -= contemcost_p3;
                over_combodisplay.textContent = `콤보 포인트 : ${combo_point}`
                
                if(randint(1, 101) <= reinforce_percent_special_p3[upgrade_special_plus + 1]){

                    upgrade_special_plus++;
                    // 성공

                    document.getElementById("code_2_00").textContent= `특별한 블록 생성 III(+${upgrade_special_plus-40})`
                    document.getElementById("code_2_01").textContent= `특별한 블록 생성(${(upgrade_special_plus*0.2).toFixed(1)}% --> ${(upgrade_special_plus*0.2+0.2).toFixed(1)}%)`
                    document.getElementById("code_2_02").textContent= `강화 성공률 : ${reinforce_percent_special_p3[upgrade_special_plus+1]}%`
                    document.getElementById("code_2_03").textContent= `비용 : ${reinforce_cost_special_p3[upgrade_special_plus+1]}`
                    document.getElementById('code_2_04').textContent = `실패시 파괴율 : ${reinforce_destruct_percent_p3[upgrade_special_plus+1]}%`

                    alert(`강화에 성공하였습니다.`)
                    is_protecting = false;
                    document.getElementById('reinforce_protection_checkbox').value = false;
            



                } else{
                    if(randint(1, 10001) <= reinforce_destruct_percent_p3[upgrade_special_plus + 1] * 100 && !is_protecting){



                        // 파괴
                        alert('강화에 실패하여, 단계가 파괴되었습니다.');
                        alert(`강화 단계가 내려갑니다.(III + ${upgrade_special_plus} --> III + 0)`)
                        upgrade_special_plus = 40;

                        document.getElementById("code_2_00").textContent= `특별한 블록 생성 III(+${upgrade_special_plus-40})`
                        document.getElementById("code_2_01").textContent= `특별한 블록 생성(${(upgrade_special_plus*0.2).toFixed(1)}% --> ${(upgrade_special_plus*0.2+0.2).toFixed(1)}%)`
                        document.getElementById("code_2_02").textContent= `강화 성공률 : ${reinforce_percent_special_p3[upgrade_special_plus+1]}%`
                        document.getElementById("code_2_03").textContent= `비용 : ${reinforce_cost_special_p3[upgrade_special_plus+1]}`
                        document.getElementById('code_2_04').textContent = `실패시 파괴율 : ${reinforce_destruct_percent_p3[upgrade_special_plus+1]}%`
                        
                        




                    } else{
                        // 실패
                        alert(`강화에 실패하였습니다.`)
                        
                    }
                }






            } else{
                alert('포인트가 부족합니다.')
            }




        }



    }
}






// event handling

document.addEventListener("keydown", e=>{
    switch(e.keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left", -1)
            break;
        
        case 40:
            moveBlock("top", 1);
         
            break;
        
        case 38:
            changeDirection();
            break;
        
        case 32:
            dropblock();
            break;
        
        case 86:
            scoreDisplay.textContent = "데스 매치! 점수 (10->2)배!(Demon -> Extreme Demon)"
            score_boost = 4;
            difficulty = 10;stack = 4
            duration = 90
            // alert("스피드가 대폭 상승합니다")
            // alert("50000점을 넘겨야 시작되는 난이도입니다.")
            // alert("원래는 배수가 10배지만, 인위적인 조정으로 인해 2배로 감소되었습니다.")
            document.getElementById("goto10").style.display = "none"
            scoreDisplay.style.color = "red"
            break;
        
            

        


        default:
            break;
        
    }   
   
})











restartbutton.addEventListener("click", ()=>{
    playground.innerHTML = "";
    gameText.style.display = 'none';
    init()
})


button_l.addEventListener('click', () =>{
    moveBlock("left", -1);
})
button_r.addEventListener('click', () =>{
    moveBlock("left", 1);
})
button_d.addEventListener('click', () =>{
    dropblock()
})
button_s.addEventListener('click', () =>{
    changeDirection()
})

document.getElementById("goto10").addEventListener('click', ()=>{
    alert("좌우 화살표 : 이동")
    alert("위 화살표 : 돌리기")
    alert("SPACE : 내리기")
    alert("V : 데스매치 바로시작")
})

reinforce_row_button.addEventListener("click", ()=>{

    reinforce('row')


})

reinforce_time_button.addEventListener("click", ()=>{
    reinforce('time')
})


document.getElementById("ld").addEventListener('click', ()=>{
    moveBlock('top', 1)
})


document.getElementById('set_rbutton').addEventListener('click', () =>{
    confirm("개발중인 기능입니다.")
    confirm('다음 업데이트를 기다리세요!')
})

document.getElementById('set_lbutton').addEventListener('click', () =>{
    confirm("개발중인 기능입니다.")
    confirm('다음 업데이트를 기다리세요!')

})

document.getElementById('coupon_use').addEventListener("click", ()=>{

    codecoupon = prompt("쿠폰코드를 입력해주세요.")
    use_coupon(codecoupon)
    
})

reinforce_special_button.addEventListener('click', () =>{
    
    reinforce("special")

})


//음악 재생
playbutton.addEventListener('click', ()=>{
    if(playbutton.textContent === "음악 재생"){
      music(true)
        playbutton.textContent = "음악 정지"  
    } else{
        music(false)
        playbutton.textContent = "음악 재생"
    }
    
})

// 보호제
document.getElementById('reinforce_protection_checkbox').addEventListener('change', () =>{
    if(!is_protecting){
        is_protecting = true;
        
        if(upgrade_special_plus_phase === 3){
            document.getElementById("code_2_03").textContent= `비용 : ${reinforce_cost_special_p3[upgrade_special_plus+1] + upgrade_special_plus * 10 }(+${upgrade_special_plus*10})`
            document.getElementById('code_2_04').textContent = `실패시 파괴율 : ${reinforce_destruct_percent_p3[upgrade_special_plus+1]} --> 0%`
 
        }

       
    } else{

        if(upgrade_special_plus_phase === 3){
            document.getElementById("code_2_03").textContent= `비용 : ${reinforce_cost_special_p3[upgrade_special_plus+1]}`
            document.getElementById('code_2_04').textContent = `실패시 파괴율 : ${reinforce_destruct_percent_p3[upgrade_special_plus+1]}%`
            is_protecting = false;
        }
        

    }
})