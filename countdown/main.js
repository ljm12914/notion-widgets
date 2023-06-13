(()=>{
//#region 定义自定义元素
    class Countdown extends HTMLElement{
        constructor(){
            super();
            let shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("countdown").content.cloneNode(true));
        }
    }
    customElements.define("count-down", Countdown);
    class Noargs extends HTMLElement{
        constructor(){
            super();
            let shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("noargs").content.cloneNode(true));
        }
    }
    customElements.define("no-args", Noargs);
    class Reached extends HTMLElement{
        constructor(){
            super();
            let shadow = this.attachShadow({mode: "closed"});
            shadow.appendChild(document.getElementById("reached").content.cloneNode(true));
        }
    }
    customElements.define("reach-ed", Reached);
//#endregion
//#region 获得输入参数
    const
        arg = (()=>{
            let s = location.search;
            s = s.substring(1, s.length);
            s = s.split("&");
            for(let i = 0; i < s.length; i++){
                let sis = s[i].split("=");
                if(sis[0] === "d") return sis[1];
            }
            return null;
        })(),
//#endregion
        root = document.getElementById("root");
//#region 将输入参数转换为Date对象
    if(arg === null){
        root.appendChild(document.createElement("no-args"));
        return;
    }
    const [date, time] = arg.split("_"), finalDate = new Date(`${date} ${time}`);
    if(isNaN(finalDate.getTime())){
        root.appendChild(document.createElement("no-args"));
        return;
    }
//#endregion
//#region 计算并显示倒计时
    updateCountdown();
    var id = setInterval(updateCountdown, 999);
    function updateCountdown(){
        root.innerHTML = "";
        console.log(finalDate.getTime() - new Date().getTime());
        if(finalDate.getTime() - new Date().getTime() <= 1000){
            if(id) clearInterval(id);
            const reachedEl = document.createElement("reach-ed");
            reachedEl.appendChild(createSlot("date",
                `${finalDate.getFullYear()}.${finalDate.getMonth() + 1}.${finalDate.getDate()} ${(finalDate.getHours()+"").padStart(2, "0")}:${(finalDate.getMinutes()+"").padStart(2, "0")}:${(finalDate.getSeconds()+"").padStart(2, "0")}:${(finalDate.getMilliseconds()+"").padStart(3, "0")}`
            ));
            root.appendChild(reachedEl);
        }
        else{
            const
            deltaDate = new Date(finalDate.getTime() - new Date().getTime()),
            countDownArray = [ //0=>1970.1.1 08:00:00，做出相应调整
                [deltaDate.getFullYear() - 1970, "年"],
                [deltaDate.getMonth(), "月"], //+1-1
                [deltaDate.getDate() - 1, "天"],
                [deltaDate.getHours() - 8, "小时"],
                [deltaDate.getMinutes(), "分钟"],
                [deltaDate.getSeconds(), "秒"]
            ];
        for(let i = 0; i < countDownArray.length; i++) if(countDownArray[i][0] > 0) showCountdown(countDownArray[i][0], countDownArray[i][1]);
        }
    }
    /**@type {(data :number, unit :string)=>void}*/
    function showCountdown(data, unit){
        const dataEl = createSlot("data", data), unitEl = createSlot("unit", unit), countDownEl = document.createElement("count-down");
        countDownEl.appendChild(dataEl);
        countDownEl.appendChild(unitEl);
        root.appendChild(countDownEl);
    }
//#endregion
    /**方便构建 `slot`。
     * @type {(name :string, value :string)=>HTMLSpanElement}
    */
    function createSlot(name, value){
        const slot = document.createElement("span");
        slot.setAttribute("slot", name);
        slot.textContent = value;
        return slot;
    }
})();